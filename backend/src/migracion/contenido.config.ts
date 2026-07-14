/**
 * contenido.config.ts
 * Carga y valida las variables de entorno requeridas para la migración.
 * Las claves nunca se imprimen ni se incluyen en mensajes de error.
 */

export interface ConfiguracionMigracion {
  origen: {
    url: string;
    secretKey: string;
    databaseUrl: string;
  };
  destino: {
    url: string;
    secretKey: string;
    databaseUrl: string;
  };
  /** UUID del usuario Auth en el proyecto destino. Opcional: si no se provee se omite el upsert del admin. */
  destinoAdminAuthUserId: string | undefined;
}

const REQUERIDAS = [
  "ORIGEN_SUPABASE_URL",
  "ORIGEN_SUPABASE_SECRET_KEY",
  "ORIGEN_SUPABASE_DATABASE_URL",
  "DESTINO_SUPABASE_URL",
  "DESTINO_SUPABASE_SECRET_KEY",
] as const;

/**
 * Carga la configuración desde el entorno dado.
 * Falla antes de conectar si falta alguna variable obligatoria.
 * NUNCA incluye valores de credenciales en los mensajes de error.
 *
 * @param entorno - Mapa de variables de entorno (por defecto process.env)
 */
export function cargarConfiguracionMigracion(
  entorno: Record<string, string | undefined> = process.env
): ConfiguracionMigracion {
  // Validar variables obligatorias sin exponer sus valores
  const faltantes = REQUERIDAS.filter((k) => !entorno[k]);
  if (faltantes.length > 0) {
    throw new Error(
      `Variables de entorno faltantes: ${faltantes.join(", ")}. ` +
        "Verifica tu archivo .dev.vars local y asegúrate de no compartirlo."
    );
  }

  // DESTINO_SUPABASE_DATABASE_URL puede usar SUPABASE_DATABASE_URL como fallback
  // ya que en .dev.vars apuntan al mismo proyecto (ghqvkixasxtmbhcsaeam)
  const destinoDatabaseUrl =
    entorno["DESTINO_SUPABASE_DATABASE_URL"] ?? entorno["SUPABASE_DATABASE_URL"];

  if (!destinoDatabaseUrl) {
    throw new Error(
      "Falta DESTINO_SUPABASE_DATABASE_URL (o SUPABASE_DATABASE_URL como fallback). " +
        "Añade la variable a tu .dev.vars local."
    );
  }

  return {
    origen: {
      url: entorno["ORIGEN_SUPABASE_URL"]!,
      secretKey: entorno["ORIGEN_SUPABASE_SECRET_KEY"]!,
      databaseUrl: entorno["ORIGEN_SUPABASE_DATABASE_URL"]!,
    },
    destino: {
      url: entorno["DESTINO_SUPABASE_URL"]!,
      secretKey: entorno["DESTINO_SUPABASE_SECRET_KEY"]!,
      databaseUrl: destinoDatabaseUrl,
    },
    destinoAdminAuthUserId: entorno["DESTINO_ADMIN_AUTH_USER_ID"],
  };
}
