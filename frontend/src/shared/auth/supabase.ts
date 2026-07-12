import { createClient } from "@supabase/supabase-js";
import { env } from "../config/env";
import { db } from "../../lib/offline/db";
import { queryClient } from "../../app/query-client";
import {
  cerrarSesionAutenticadaConCliente,
  escucharCambiosAutenticacionConCliente,
  iniciarSesionFacebookConCliente,
  iniciarSesionConCorreoConCliente,
  iniciarSesionGoogleConCliente,
  registrarConCorreoConCliente,
  vincularGoogleConCliente,
  sincronizarSesionAutenticadaConCliente,
} from "./supabase.helpers";

export const supabase = createClient(env.supabaseUrl, env.supabaseAnonKey, {
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

export async function iniciarSesionFacebook(redirectTo: string) {
  return iniciarSesionFacebookConCliente(supabase, redirectTo);
}

export async function vincularGoogle() {
  return vincularGoogleConCliente(supabase);
}

export async function cerrarSesionAutenticada() {
  await cerrarSesionAutenticadaConCliente(supabase);
  await Promise.all([
    db.perfil.clear(),
    db.progresoUsuario.clear(),
    db.eventosOutbox.clear(),
    db.syncState.clear(),
    db.descargaJobs.clear(),
  ]);
  queryClient.clear();
}

export async function registrarConCorreo(email: string, password: string) {
  return registrarConCorreoConCliente(supabase, email, password);
}

export async function iniciarSesionConCorreo(email: string, password: string) {
  return iniciarSesionConCorreoConCliente(supabase, email, password);
}
