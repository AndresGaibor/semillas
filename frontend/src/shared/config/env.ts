type EntornoProceso = { env?: Record<string, string | undefined> };

const entornoProceso = (globalThis as typeof globalThis & { process?: EntornoProceso }).process?.env;

function requerida(nombre: string, valor: string | undefined): string {
  const normalizado = valor?.trim();
  if (!normalizado) {
    throw new Error(`[semillas] Falta la variable de entorno ${nombre}`);
  }
  return normalizado;
}

function variablePublica(nombre: string, valorVite: string | undefined): string {
  return requerida(nombre, valorVite ?? entornoProceso?.[nombre]);
}

export const env = {
  apiUrl: variablePublica("VITE_API_URL", import.meta.env.VITE_API_URL).replace(/\/$/, ""),
  supabaseUrl: variablePublica("VITE_SUPABASE_URL", import.meta.env.VITE_SUPABASE_URL).replace(/\/$/, ""),
  supabaseAnonKey: variablePublica("VITE_SUPABASE_ANON_KEY", import.meta.env.VITE_SUPABASE_ANON_KEY),
};
