import { Hono } from "hono";
import type { AppBindings } from "../../config/env";
import { authMiddleware } from "../../shared/middleware/auth.middleware";
import { requireRole } from "../../shared/middleware/role.middleware";
import { NotFoundError } from "../../shared/errors/http-error";
import { responderError, responderExito } from "../../shared/http/respuesta";
import { crearRecursoSchema } from "./media.schemas";

export const mediaRoutes = new Hono<AppBindings>();

const STORAGE_BUCKET = "media";

const REGLAS_ARCHIVO = {
  imagen: {
    maxBytes: 5 * 1024 * 1024,
    mimes: ["image/jpeg", "image/png", "image/webp"],
    extensiones: [".jpg", ".jpeg", ".png", ".webp"],
  },
  audio: {
    maxBytes: 20 * 1024 * 1024,
    mimes: ["audio/mpeg", "audio/mp3", "audio/aac", "audio/ogg", "audio/webm"],
    extensiones: [".mp3", ".aac", ".ogg", ".webm"],
  },
  video: {
    maxBytes: 50 * 1024 * 1024,
    mimes: ["video/mp4", "video/webm"],
    extensiones: [".mp4", ".webm"],
  },
  documento: {
    maxBytes: 10 * 1024 * 1024,
    mimes: ["application/pdf"],
    extensiones: [".pdf"],
  },
};

type TipoRecurso = keyof typeof REGLAS_ARCHIVO;

const EXTENSION_POR_MIME: Record<string, string> = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
  "audio/mpeg": ".mp3",
  "audio/mp3": ".mp3",
  "audio/aac": ".aac",
  "audio/ogg": ".ogg",
  "audio/webm": ".webm",
  "video/mp4": ".mp4",
  "video/webm": ".webm",
  "application/pdf": ".pdf",
};

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const SIGNED_URL_EXPIRES_IN_SECONDS = 300;

function obtenerNombreArchivo(archivo: File) {
  const fallback = `archivo${EXTENSION_POR_MIME[archivo.type] ?? ""}`;
  const nombre = typeof archivo.name === "string" && archivo.name.trim() ? archivo.name : fallback;
  return nombre.replace(/[^a-zA-Z0-9._-]/g, "_");
}

function obtenerExtension(nombreArchivo: string) {
  const match = nombreArchivo.toLowerCase().match(/\.[^.]+$/);
  return match?.[0] ?? "";
}

function empiezaCon(bytes: Uint8Array, firma: number[]) {
  return firma.every((valor, index) => bytes[index] === valor);
}

async function tieneFirmaValida(archivo: File) {
  const bytes = new Uint8Array(await archivo.slice(0, 16).arrayBuffer());

  if (archivo.type === "image/png") {
    return empiezaCon(bytes, [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
  }

  if (archivo.type === "image/jpeg") {
    return empiezaCon(bytes, [0xff, 0xd8, 0xff]);
  }

  if (archivo.type === "image/webp") {
    const riff = empiezaCon(bytes, [0x52, 0x49, 0x46, 0x46]);
    const webp = bytes[8] === 0x57 && bytes[9] === 0x45 && bytes[10] === 0x42 && bytes[11] === 0x50;
    return riff && webp;
  }

  if (archivo.type === "application/pdf") {
    return empiezaCon(bytes, [0x25, 0x50, 0x44, 0x46, 0x2d]);
  }

  return true;
}

function validarUuid(id: string) {
  return UUID_REGEX.test(id);
}

mediaRoutes.post("/subir", authMiddleware, requireRole("administrador"), async (c) => {
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
  const reglas = REGLAS_ARCHIVO[tipo as TipoRecurso];
  const cleanName = obtenerNombreArchivo(archivo);
  const extension = obtenerExtension(cleanName);

  if (archivo.size > reglas.maxBytes) {
    const maxMb = Math.floor(reglas.maxBytes / 1024 / 1024);
    return responderError(`El archivo excede el tamaño máximo de ${maxMb} MB`, "FILE_TOO_LARGE", 400);
  }

  if (!reglas.mimes.includes(archivo.type)) {
    return responderError(
      `El tipo MIME '${archivo.type}' no corresponde al tipo '${tipo}'`,
      "INVALID_MIME_TYPE",
      400,
    );
  }

  if (!reglas.extensiones.includes(extension)) {
    return responderError(
      `La extensión '${extension || "sin extensión"}' no corresponde al tipo '${tipo}'`,
      "INVALID_FILE_EXTENSION",
      400,
    );
  }

  if (!(await tieneFirmaValida(archivo))) {
    return responderError("La firma binaria del archivo no corresponde al tipo declarado", "INVALID_FILE_SIGNATURE", 400);
  }

  const fileId = crypto.randomUUID();
  const storagePath = `${tipo}/${user.id}/${fileId}-${cleanName}`;

  const { error: uploadError } = await db.storage.from(STORAGE_BUCKET).upload(storagePath, archivo, {
    contentType: archivo.type,
    upsert: false,
  });

  if (uploadError) {
    console.error("Error al subir a Supabase Storage:", uploadError);
    return responderError("Error al subir el archivo al almacenamiento", "STORAGE_ERROR", 500);
  }

  const {
    data: { publicUrl },
  } = db.storage.from(STORAGE_BUCKET).getPublicUrl(storagePath);

  const { data: recurso, error: recursoError } = await db
    .from("recurso_multimedia")
    .insert({
      tipo,
      bucket_almacenamiento: STORAGE_BUCKET,
      clave_almacenamiento: storagePath,
      url_publica: publicUrl,
      texto_alternativo: textoAlternativo ?? null,
      titulo: cleanName,
      tipo_mime: archivo.type,
      tamano_bytes: archivo.size,
      creado_por: user.id,
      activo: true,
    } as never)
    .select("*")
    .single();

  if (recursoError) {
    console.error("Error al crear registro en recurso_multimedia:", recursoError);
    await db.storage.from(STORAGE_BUCKET).remove([storagePath]);
    return responderError("Error al registrar el recurso multimedia", "DB_ERROR", 500);
  }

  return responderExito(recurso, 201);
});

mediaRoutes.get("/:id/url", authMiddleware, requireRole("administrador"), async (c) => {
  const db = c.get("db");
  const id = c.req.param("id");

  if (!validarUuid(id)) {
    return responderError("El ID del recurso multimedia debe ser un UUID válido", "VALIDATION_ERROR", 400);
  }

  const { data: recurso, error } = await db
    .from("recurso_multimedia")
    .select("id, bucket_almacenamiento, clave_almacenamiento")
    .eq("id", id)
    .eq("activo", true)
    .maybeSingle();

  if (error) {
    throw error;
  }

  if (!recurso?.clave_almacenamiento) {
    throw new NotFoundError("Recurso multimedia no encontrado");
  }

  const bucket = recurso.bucket_almacenamiento ?? STORAGE_BUCKET;
  const { data, error: signedUrlError } = await db.storage
    .from(bucket)
    .createSignedUrl(recurso.clave_almacenamiento, SIGNED_URL_EXPIRES_IN_SECONDS);

  if (signedUrlError || !data?.signedUrl) {
    console.error("Error al crear URL firmada de Supabase Storage:", signedUrlError);
    return responderError("Error al crear URL firmada del recurso", "STORAGE_ERROR", 500);
  }

  return responderExito({ url: data.signedUrl, expira_en_segundos: SIGNED_URL_EXPIRES_IN_SECONDS });
});

mediaRoutes.get("/:id", async (c) => {
  const db = c.get("db");
  const id = c.req.param("id");

  if (!validarUuid(id)) {
    return responderError("El ID del recurso multimedia debe ser un UUID válido", "VALIDATION_ERROR", 400);
  }

  const { data: recurso, error } = await db
    .from("recurso_multimedia")
    .select("*")
    .eq("id", id)
    .eq("activo", true)
    .maybeSingle();

  if (error) {
    throw error;
  }

  if (!recurso) {
    throw new NotFoundError("Recurso multimedia no encontrado");
  }

  return responderExito(recurso);
});

mediaRoutes.delete("/:id", authMiddleware, requireRole("administrador"), async (c) => {
  const db = c.get("db");
  const id = c.req.param("id");

  if (!validarUuid(id)) {
    return responderError("El ID del recurso multimedia debe ser un UUID válido", "VALIDATION_ERROR", 400);
  }

  const { data: existing, error: findError } = await db
    .from("recurso_multimedia")
    .select("id, bucket_almacenamiento, clave_almacenamiento")
    .eq("id", id)
    .eq("activo", true)
    .maybeSingle();

  if (findError) {
    throw findError;
  }

  if (!existing) {
    throw new NotFoundError("Recurso multimedia no encontrado");
  }

  if (existing.clave_almacenamiento) {
    const bucket = existing.bucket_almacenamiento ?? STORAGE_BUCKET;
    const { error: storageError } = await db.storage.from(bucket).remove([existing.clave_almacenamiento]);

    if (storageError) {
      console.error("Error al eliminar archivo de Supabase Storage:", storageError);
      return responderError("Error al eliminar el archivo del almacenamiento", "STORAGE_ERROR", 500);
    }
  }

  const { error: updateError } = await db
    .from("recurso_multimedia")
    .update({ activo: false, actualizado_en: new Date().toISOString() } as never)
    .eq("id", id);

  if (updateError) {
    console.error("Error al eliminar recurso:", updateError);
    return responderError("Error al eliminar el recurso", "DB_ERROR", 500);
  }

  return responderExito({ deleted: true });
});