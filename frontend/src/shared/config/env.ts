type EntornoProceso = { env?: Record<string, string | undefined> };

const entornoProceso = (globalThis as typeof globalThis & { process?: EntornoProceso }).process?.env;

function requerida(nombre: string, valor: string | undefined): string {
  const normalizado = valor?.trim();
  if (!normalizado) {
    if (nombre === "VITE_API_URL") return "";
    throw new Error(`[semillas] Falta la variable de entorno ${nombre}`);
  }
  return normalizado;
}

function variablePublica(nombre: string, valorVite: string | undefined): string {
  return requerida(nombre, valorVite ?? entornoProceso?.[nombre]);
}

function obtenerApiUrl(): string {
  const valor = import.meta.env.VITE_API_URL ?? entornoProceso?.VITE_API_URL;
  if (!valor?.trim()) return "";
  return valor.replace(/\/$/, "");
}

export const env = {
  apiUrl: obtenerApiUrl(),
  supabaseUrl: variablePublica("VITE_SUPABASE_URL", import.meta.env.VITE_SUPABASE_URL).replace(/\/$/, ""),
  supabaseAnonKey: variablePublica("VITE_SUPABASE_ANON_KEY", import.meta.env.VITE_SUPABASE_ANON_KEY),
};
