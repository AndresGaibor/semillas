import { createClient } from "@supabase/supabase-js";
import { env } from "../config/env";
import {
  cerrarSesionAutenticadaConCliente,
  escucharCambiosAutenticacionConCliente,
  iniciarSesionConCorreoConCliente,
  iniciarSesionGoogleConCliente,
  registrarConCorreoConCliente,
  vincularGoogleConCliente,
  sincronizarSesionAutenticadaConCliente,
} from "./supabase.helpers";

const supabaseUrl = env.supabaseUrl;
const supabaseAnonKey = env.supabaseAnonKey;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("[semillas] Faltan variables de entorno: VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});

export async function sincronizarSesionAutenticada() {
  return sincronizarSesionAutenticadaConCliente(supabase);
}

export function escucharCambiosAutenticacion(onCambio?: Parameters<typeof escucharCambiosAutenticacionConCliente>[1]) {
  return escucharCambiosAutenticacionConCliente(supabase, onCambio);
}

export async function iniciarSesionGoogle(redirectTo: string) {
  return iniciarSesionGoogleConCliente(supabase, redirectTo);
}

export async function vincularGoogle() {
  return vincularGoogleConCliente(supabase);
}

export async function cerrarSesionAutenticada() {
  return cerrarSesionAutenticadaConCliente(supabase);
}

export async function registrarConCorreo(email: string, password: string) {
  return registrarConCorreoConCliente(supabase, email, password);
}

export async function iniciarSesionConCorreo(email: string, password: string) {
  return iniciarSesionConCorreoConCliente(supabase, email, password);
}
