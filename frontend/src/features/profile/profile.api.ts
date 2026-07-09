import { peticion } from "../../shared/api/api";
import type { Perfil, Usuario } from "../../shared/api/api";

export function obtenerMiPerfil() {
  return peticion<{ usuario: Usuario; perfil: Perfil }>("/perfil");
}

export function actualizarPerfil(datos: {
  apodo?: string;
  grupo_edad_id?: string | null;
  url_avatar?: string | null;
  prefiere_audio?: boolean;
  tamano_texto_preferido?: string;
}) {
  return peticion<Perfil>("/perfil/actualizar", {
    metodo: "PATCH",
    cuerpo: datos,
  });
}

export type GamificacionMiRespuesta = {
  nivel: {
    usuario_id: string;
    xp_total: number;
    numero_nivel: number;
    nombre_nivel: string;
  } | null;
  logros: Array<{
    usuario_id: string;
    logro_id: string;
    ganado_en: string;
    logro?: {
      id: string;
      codigo: string;
      nombre: string;
      descripcion: string | null;
      codigo_criterio: string;
      valor_criterio: number | null;
      bono_xp: number;
      url_icono: string | null;
      activo: boolean;
      creado_en: string;
    };
  }>;
};

export type ProgresoMiRespuesta = {
  progresos_tema: Array<{
    usuario_id: string;
    tema_id: string;
    estado: string;
    porcentaje: number;
    iniciado_en: string | null;
    completado_en: string | null;
    ultimo_paso_id: string | null;
    actualizado_en: string;
  }>;
  progresos_actividad: Array<{
    usuario_id: string;
    actividad_id: string;
    intentos: number;
    mejor_puntaje: number;
    completado: boolean;
    completado_en: string | null;
    actualizado_en: string;
  }>;
};

export function obtenerMiProgreso() {
  return peticion<ProgresoMiRespuesta>("/progreso/mi");
}

export function obtenerMiGamificacion() {
  return peticion<GamificacionMiRespuesta>("/gamificacion/mi");
}

export function reclamarCuentaInvitada() {
  return peticion<{ vinculada: boolean; usuario: Usuario }>("/perfil/vincular-cuenta", {
    metodo: "POST",
  });
}
