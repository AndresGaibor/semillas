import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "../../db/database.types";

type DbClient = SupabaseClient<Database>;

type RecursoMultimediaInsert = Database["public"]["Tables"]["recurso_multimedia"]["Insert"];
type RecursoMultimediaUpdate = Database["public"]["Tables"]["recurso_multimedia"]["Update"];
type RecursoMultimediaRow = Database["public"]["Tables"]["recurso_multimedia"]["Row"];

const STORAGE_BUCKET = "media";

export type MediaRepository = ReturnType<typeof crearMediaRepository>;

export function crearMediaRepository(db: DbClient) {
  return {
    async subirArchivo(storagePath: string, archivo: File) {
      return db.storage.from(STORAGE_BUCKET).upload(storagePath, archivo, { contentType: archivo.type, upsert: false });
    },
    obtenerUrlPublica(storagePath: string) {
      return db.storage.from(STORAGE_BUCKET).getPublicUrl(storagePath);
    },
    async insertarRecurso(datos: RecursoMultimediaInsert) {
      const { data, error } = await db.from("recurso_multimedia").insert(datos).select("*").single();
      if (error || !data) throw error;
      return data as RecursoMultimediaRow;
    },
    async obtenerRecursoActivo(id: string) {
      const { data, error } = await db
        .from("recurso_multimedia")
        .select("id, tipo, bucket_almacenamiento, clave_almacenamiento, url_publica, texto_alternativo, titulo, tipo_mime, tamano_bytes, creado_por, activo, creado_en, actualizado_en")
        .eq("id", id)
        .eq("activo", true)
        .maybeSingle();

      if (error) throw error;
      return (data as RecursoMultimediaRow | null) ?? null;
    },
    async listarRecursosActivos() {
      const { data, error } = await db.from("recurso_multimedia").select("*").eq("activo", true).order("creado_en", { ascending: false });
      if (error) throw error;
      return (data as RecursoMultimediaRow[] | null) ?? [];
    },
    async desactivarRecurso(id: string) {
      const { error } = await db.from("recurso_multimedia").update({ activo: false, actualizado_en: new Date().toISOString() } satisfies RecursoMultimediaUpdate).eq("id", id);
      if (error) throw error;
    },
    async eliminarArchivo(bucket: string, clave: string) {
      return db.storage.from(bucket).remove([clave]);
    },
    async crearURLFirmada(bucket: string, clave: string, expiracionSegundos: number) {
      return db.storage.from(bucket).createSignedUrl(clave, expiracionSegundos);
    },
    bucket: STORAGE_BUCKET
  };
}
