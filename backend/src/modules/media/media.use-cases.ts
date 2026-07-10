import { responderError } from "../../shared/http/respuesta";
import { NotFoundError } from "../../shared/errors/http-error";
import { crearMediaRepository } from "./media.repository";
import { crearRecursoSchema } from "./media.schemas";

const REGLAS_ARCHIVO = {
  imagen: { maxBytes: 5 * 1024 * 1024, mimes: ["image/jpeg", "image/png", "image/webp"], extensiones: [".jpg", ".jpeg", ".png", ".webp"] },
  audio: { maxBytes: 20 * 1024 * 1024, mimes: ["audio/mpeg", "audio/mp3", "audio/aac", "audio/ogg", "audio/webm"], extensiones: [".mp3", ".aac", ".ogg", ".webm"] },
  video: { maxBytes: 50 * 1024 * 1024, mimes: ["video/mp4", "video/webm"], extensiones: [".mp4", ".webm"] },
  documento: { maxBytes: 10 * 1024 * 1024, mimes: ["application/pdf"], extensiones: [".pdf"] }
} as const;

type TipoRecurso = keyof typeof REGLAS_ARCHIVO;

const EXTENSION_POR_MIME: Record<string, string> = {
  "image/jpeg": ".jpg", "image/png": ".png", "image/webp": ".webp", "audio/mpeg": ".mp3", "audio/mp3": ".mp3", "audio/aac": ".aac", "audio/ogg": ".ogg", "audio/webm": ".webm", "video/mp4": ".mp4", "video/webm": ".webm", "application/pdf": ".pdf"
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
  if (archivo.type === "image/png") return empiezaCon(bytes, [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
  if (archivo.type === "image/jpeg") return empiezaCon(bytes, [0xff, 0xd8, 0xff]);
  if (archivo.type === "image/webp") return empiezaCon(bytes, [0x52, 0x49, 0x46, 0x46]) && bytes[8] === 0x57 && bytes[9] === 0x45 && bytes[10] === 0x42 && bytes[11] === 0x50;
  if (archivo.type === "application/pdf") return empiezaCon(bytes, [0x25, 0x50, 0x44, 0x46, 0x2d]);
  return true;
}

export function crearCasosUsoMedia(repositorio: ReturnType<typeof crearMediaRepository>) {
  return {
    async subir({ archivo, tipoRaw, textoAlternativo, userId }: { archivo: File; tipoRaw: unknown; textoAlternativo?: string; userId: string }) {
      const parsed = crearRecursoSchema.safeParse({ tipo: tipoRaw, textoAlternativo });
      if (!parsed.success) return { error: { mensaje: `Datos inválidos: ${parsed.error.issues.map((i) => i.message).join(", ")}`, codigo: "VALIDATION_ERROR", estado: 400 } } as const;

      const tipo = parsed.data.tipo as TipoRecurso;
      const reglas = REGLAS_ARCHIVO[tipo] as unknown as { maxBytes: number; mimes: readonly string[]; extensiones: readonly string[] };
      const cleanName = obtenerNombreArchivo(archivo);
      const extension = obtenerExtension(cleanName);

      if (archivo.size > reglas.maxBytes) return { error: { mensaje: `El archivo excede el tamaño máximo de ${Math.floor(reglas.maxBytes / 1024 / 1024)} MB`, codigo: "FILE_TOO_LARGE", estado: 400 } } as const;
      if (!reglas.mimes.includes(archivo.type)) return { error: { mensaje: `El tipo MIME '${archivo.type}' no corresponde al tipo '${tipo}'`, codigo: "INVALID_MIME_TYPE", estado: 400 } } as const;
      if (!reglas.extensiones.includes(extension)) return { error: { mensaje: `La extensión '${extension || "sin extensión"}' no corresponde al tipo '${tipo}'`, codigo: "INVALID_FILE_EXTENSION", estado: 400 } } as const;
      if (!(await tieneFirmaValida(archivo))) return { error: { mensaje: "La firma binaria del archivo no corresponde al tipo declarado", codigo: "INVALID_FILE_SIGNATURE", estado: 400 } } as const;

      const storagePath = `${tipo}/${userId}/${crypto.randomUUID()}-${cleanName}`;
      const { error: uploadError } = await repositorio.subirArchivo(storagePath, archivo);
      if (uploadError) return { error: { mensaje: "Error al subir el archivo al almacenamiento", codigo: "STORAGE_ERROR", estado: 500 } } as const;

      const { data: { publicUrl } } = repositorio.obtenerUrlPublica(storagePath);
      const recurso = await repositorio.insertarRecurso({ tipo, bucket_almacenamiento: repositorio.bucket, clave_almacenamiento: storagePath, url_publica: publicUrl, texto_alternativo: textoAlternativo ?? null, titulo: cleanName, tipo_mime: archivo.type, tamano_bytes: archivo.size, creado_por: userId, activo: true });
      return { recurso } as const;
    },
    async obtenerUrl(id: string) {
      if (!UUID_REGEX.test(id)) return { error: { mensaje: "El ID del recurso multimedia debe ser un UUID válido", codigo: "VALIDATION_ERROR", estado: 400 } } as const;
      const recurso = await repositorio.obtenerRecursoActivo(id);
      if (!recurso?.clave_almacenamiento) throw new NotFoundError("Recurso multimedia no encontrado");
      const bucket = recurso.bucket_almacenamiento ?? repositorio.bucket;
      const { data, error } = await repositorio.crearURLFirmada(bucket, recurso.clave_almacenamiento, SIGNED_URL_EXPIRES_IN_SECONDS);
      if (error || !data?.signedUrl) return { error: { mensaje: "Error al crear URL firmada del recurso", codigo: "STORAGE_ERROR", estado: 500 } } as const;
      return { url: data.signedUrl, expiraEnSegundos: SIGNED_URL_EXPIRES_IN_SECONDS } as const;
    },
    async listar() {
      const recursos = await repositorio.listarRecursosActivos();
      const resourcesWithSignedUrls = await Promise.all((recursos ?? []).map(async (recurso) => {
        if (!recurso.clave_almacenamiento) return recurso;
        const bucket = recurso.bucket_almacenamiento ?? repositorio.bucket;
        const { data } = await repositorio.crearURLFirmada(bucket, recurso.clave_almacenamiento, SIGNED_URL_EXPIRES_IN_SECONDS);
        return { ...recurso, url_publica: data?.signedUrl ?? recurso.url_publica };
      }));
      return resourcesWithSignedUrls;
    },
    async obtener(id: string) {
      if (!UUID_REGEX.test(id)) return { error: { mensaje: "El ID del recurso multimedia debe ser un UUID válido", codigo: "VALIDATION_ERROR", estado: 400 } } as const;
      const recurso = await repositorio.obtenerRecursoActivo(id);
      if (!recurso) throw new NotFoundError("Recurso multimedia no encontrado");
      return recurso;
    },
    async eliminar(id: string) {
      if (!UUID_REGEX.test(id)) return { error: { mensaje: "El ID del recurso multimedia debe ser un UUID válido", codigo: "VALIDATION_ERROR", estado: 400 } } as const;
      const existente = await repositorio.obtenerRecursoActivo(id);
      if (!existente) throw new NotFoundError("Recurso multimedia no encontrado");
      if (existente.clave_almacenamiento) {
        const bucket = existente.bucket_almacenamiento ?? repositorio.bucket;
        const { error } = await repositorio.eliminarArchivo(bucket, existente.clave_almacenamiento);
        if (error) return { error: { mensaje: "Error al eliminar el archivo del almacenamiento", codigo: "STORAGE_ERROR", estado: 500 } } as const;
      }
      await repositorio.desactivarRecurso(id);
      return { deleted: true } as const;
    }
  };
}
