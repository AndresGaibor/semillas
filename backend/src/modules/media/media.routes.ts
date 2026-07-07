import { Hono } from "hono";
import type { AppBindings } from "../../config/env";
import { authMiddleware } from "../../shared/middleware/auth.middleware";
import { NotFoundError } from "../../shared/errors/http-error";
import { responderExito, responderError } from "../../shared/http/respuesta";
import { crearRecursoSchema } from "./media.schemas";

export const mediaRoutes = new Hono<AppBindings>();

const MIME_PREFIXES: Record<string, string[]> = {
  imagen: ["image/"],
  audio: ["audio/"],
  video: ["video/"],
  documento: ["application/"],
};

const MAX_FILE_SIZE = 50 * 1024 * 1024;

mediaRoutes.post("/subir", authMiddleware, async (c) => {
  const db = c.get("db");
  const user = c.get("user");

  const formData = await c.req.formData();
  const archivo = formData.get("archivo");
  const tipoRaw = formData.get("tipo");
  const textoAlternativo = (formData.get("texto_alternativo") as string | null) || undefined;

  if (!archivo || !(archivo instanceof File)) {
    return responderError("El campo 'archivo' es requerido y debe ser un archivo", "VALIDATION_ERROR", 400);
  }

  const parsed = crearRecursoSchema.safeParse({ tipo: tipoRaw, textoAlternativo });
  if (!parsed.success) {
    return responderError(
      `Datos inválidos: ${parsed.error.issues.map((i) => i.message).join(", ")}`,
      "VALIDATION_ERROR",
      400,
    );
  }

  const { tipo } = parsed.data;

  if (archivo.size > MAX_FILE_SIZE) {
    return responderError("El archivo excede el tamaño máximo de 50 MB", "FILE_TOO_LARGE", 400);
  }

  const allowedPrefixes = MIME_PREFIXES[tipo];
  if (!allowedPrefixes.some((prefix) => archivo.type.startsWith(prefix))) {
    return responderError(
      `El tipo MIME '${archivo.type}' no corresponde al tipo '${tipo}'`,
      "INVALID_MIME_TYPE",
      400,
    );
  }

  const fileId = crypto.randomUUID();
  const cleanName = archivo.name.replace(/[^a-zA-Z0-9._-]/g, "_");
  const storagePath = `${tipo}/${user.id}/${fileId}-${cleanName}`;

  const { error: uploadError } = await db.storage.from("media").upload(storagePath, archivo, {
    contentType: archivo.type,
    upsert: false,
  });

  if (uploadError) {
    console.error("Error al subir a Supabase Storage:", uploadError);
    return responderError("Error al subir el archivo al almacenamiento", "STORAGE_ERROR", 500);
  }

  const {
    data: { publicUrl },
  } = db.storage.from("media").getPublicUrl(storagePath);

  const { data: recurso, error: recursoError } = await db
    .from("recurso_multimedia")
    .insert({
      tipo,
      url_publica: publicUrl,
      texto_alternativo: textoAlternativo ?? null,
      titulo: archivo.name,
      tipo_mime: archivo.type,
      tamano_bytes: archivo.size,
      creado_por: user.id,
    } as never)
    .select("*")
    .single();

  if (recursoError) {
    console.error("Error al crear registro en recurso_multimedia:", recursoError);
    await db.storage.from("media").remove([storagePath]);
    return responderError("Error al registrar el recurso multimedia", "DB_ERROR", 500);
  }

  return responderExito(recurso, 201);
});

mediaRoutes.get("/:id", async (c) => {
  const db = c.get("db");
  const id = c.req.param("id");

  const { data: recurso, error } = await db
    .from("recurso_multimedia")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    throw error;
  }

  if (!recurso) {
    throw new NotFoundError("Recurso multimedia no encontrado");
  }

  return responderExito(recurso);
});

mediaRoutes.delete("/:id", authMiddleware, async (c) => {
  const db = c.get("db");
  const id = c.req.param("id");

  const { data: existing, error: findError } = await db
    .from("recurso_multimedia")
    .select("id")
    .eq("id", id)
    .maybeSingle();

  if (findError) {
    throw findError;
  }

  if (!existing) {
    throw new NotFoundError("Recurso multimedia no encontrado");
  }

  const { error: updateError } = await db
    .from("recurso_multimedia")
    .update({ activo: false } as never)
    .eq("id", id);

  if (updateError) {
    console.error("Error al eliminar recurso:", updateError);
    return responderError("Error al eliminar el recurso", "DB_ERROR", 500);
  }

  return responderExito({ deleted: true });
});
