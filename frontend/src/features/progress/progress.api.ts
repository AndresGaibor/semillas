import { peticion, RUTAS_API } from "../../shared/api/api";
import type { EventoProgreso } from "../../shared/api/api";
import { db, queueEventoProgreso } from "@/lib/offline";
import type { ProgresoUsuarioLocal } from "@/lib/offline/db";

export type ProgresoResumen = {
  progresos_tema: Array<{
    tema_id: string;
    estado: "en_progreso" | "completado";
    porcentaje: number;
    iniciado_en: string | null;
    completado_en: string | null;
    ultimo_paso_id: string | null;
  }>;
  progresos_actividad: Array<{
    actividad_id: string;
    intentos: number;
    mejor_puntaje: number;
    completado: boolean;
  }>;
};

export async function enviarEventosProgreso(eventos: EventoProgreso[]) {
  if (!navigator.onLine) {
    await guardarEventosLocalmente(eventos);
    return { procesados: 0, pendientes: eventos.length, offline: true };
  }

  try {
    return await peticion<{
      procesados: number;
      omitidos: number;
      procesados_ids: string[];
      omitidos_ids: string[];
      errores: Array<{ evento_id_cliente: string; error: string }>;
    }>(RUTAS_API.SYNC.PUSH, {
      metodo: "POST",
      cuerpo: {
        eventos: eventos.map((evento) => ({
          evento_id_cliente: evento.evento_id_cliente,
          tipo_evento: evento.tipo_evento,
          tema_id: evento.tema_id,
          paso_id: evento.paso_id,
          actividad_id: evento.actividad_id,
          datos: {
            ...(evento.datos ?? {}),
            ...(evento.correcta !== undefined ? { correcta_cliente: evento.correcta } : {}),
            ...(evento.puntaje !== undefined ? { puntaje_cliente: evento.puntaje } : {}),
          },
          creado_en_cliente: evento.ocurrido_en_cliente,
          dispositivo_id: evento.dispositivo_id,
        })),
      },
    });
  } catch (error) {
    if (!navigator.onLine || esErrorDeRed(error)) {
      await guardarEventosLocalmente(eventos);
      return { procesados: 0, pendientes: eventos.length, offline: true };
    }
    throw error;
  }
}

export async function obtenerMiProgreso() {
  if (!navigator.onLine) return obtenerProgresoLocalComoApi();

  try {
    return await peticion<ProgresoResumen>(RUTAS_API.PROGRESO.MI);
  } catch (error) {
    const local = await obtenerProgresoLocalComoApi();
    if (local.progresos_tema.length > 0 || local.progresos_actividad.length > 0) return local;
    throw error;
  }
}

async function guardarEventosLocalmente(eventos: EventoProgreso[]) {
  for (const evento of eventos) {
    const tema = evento.tema_id
      ? await db.temas.where("serverId").equals(evento.tema_id).first()
      : undefined;
    const paso = evento.paso_id
      ? await db.pasos.where("serverId").equals(evento.paso_id).first()
      : undefined;
    const actividad = evento.actividad_id
      ? await db.actividades.where("serverId").equals(evento.actividad_id).first()
      : undefined;

    await queueEventoProgreso(evento.tipo_evento, {
      temaLocalId: tema?.localId,
      pasoLocalId: paso?.localId,
      actividadLocalId: actividad?.localId,
      correcta: evento.correcta,
      puntaje: evento.puntaje,
      xpOtorgada: evento.xp_otorgada,
      datos: evento.datos,
    });

    await proyectarEventoLocal(evento.tipo_evento, tema?.localId, paso?.localId, actividad?.localId, evento);
  }
}

async function proyectarEventoLocal(
  tipo: EventoProgreso["tipo_evento"],
  temaLocalId: string | undefined,
  pasoLocalId: string | undefined,
  actividadLocalId: string | undefined,
  evento: EventoProgreso,
) {
  if (!temaLocalId) return;
  const ahora = new Date().toISOString();

  if (tipo === "actividad_respondida" && actividadLocalId) {
    const actividad = await db.actividades.get(actividadLocalId);
    const opcionId = typeof evento.datos?.opcion_id_seleccionada === "string"
      ? evento.datos.opcion_id_seleccionada
      : null;
    const opcion = actividad?.opciones.find((item) => item.id === opcionId);
    const existente = await db.progresoUsuario
      .where("actividadLocalId")
      .equals(actividadLocalId)
      .first();

    await db.progresoUsuario.put({
      localId: existente?.localId ?? crypto.randomUUID(),
      serverId: existente?.serverId,
      temaLocalId,
      pasoLocalId: actividad?.pasoLocalId ?? pasoLocalId ?? null,
      actividadLocalId,
      estado: opcion?.correcta ? "completado" : "en_progreso",
      porcentaje: opcion?.correcta ? 100 : 0,
      iniciadoEn: existente?.iniciadoEn ?? ahora,
      completadoEn: opcion?.correcta ? ahora : existente?.completadoEn ?? null,
      mejorPuntaje: Math.max(existente?.mejorPuntaje ?? 0, opcion?.correcta ? 100 : 0),
      intentos: (existente?.intentos ?? 0) + 1,
      createdAt: existente?.createdAt ?? ahora,
      updatedAt: ahora,
      syncStatus: "pending",
    });
  }

  const existenteTema = await db.progresoUsuario
    .where("temaLocalId")
    .equals(temaLocalId)
    .filter((item) => item.actividadLocalId === null)
    .first();

  let porcentaje = existenteTema?.porcentaje ?? 0;
  let estado: ProgresoUsuarioLocal["estado"] = existenteTema?.estado ?? "en_progreso";
  let completadoEn = existenteTema?.completadoEn ?? null;

  if (tipo === "bloque_iniciado" || tipo === "bloque_completado") {
    const pasos = await db.pasos.where("temaLocalId").equals(temaLocalId).sortBy("orden");
    const indice = Math.max(0, pasos.findIndex((item) => item.localId === pasoLocalId));
    porcentaje = Math.min(95, Math.round(((indice + 1) / Math.max(1, pasos.length)) * 100));
  }

  if (tipo === "tema_completado") {
    porcentaje = 100;
    estado = "completado";
    completadoEn = ahora;
  }

  if (["tema_iniciado", "bloque_iniciado", "bloque_completado", "tema_completado"].includes(tipo)) {
    await db.progresoUsuario.put({
      localId: existenteTema?.localId ?? crypto.randomUUID(),
      serverId: existenteTema?.serverId,
      temaLocalId,
      pasoLocalId: pasoLocalId ?? existenteTema?.pasoLocalId ?? null,
      actividadLocalId: null,
      estado,
      porcentaje,
      iniciadoEn: existenteTema?.iniciadoEn ?? ahora,
      completadoEn,
      mejorPuntaje: existenteTema?.mejorPuntaje ?? null,
      intentos: existenteTema?.intentos ?? 0,
      createdAt: existenteTema?.createdAt ?? ahora,
      updatedAt: ahora,
      syncStatus: "pending",
    });
  }
}

async function obtenerProgresoLocalComoApi(): Promise<ProgresoResumen> {
  const progresos = await db.progresoUsuario.toArray();
  const temas = await db.temas.toArray();
  const [actividades, pasos] = await Promise.all([
    db.actividades.toArray(),
    db.pasos.toArray(),
  ]);
  const temaPorLocal = new Map(temas.map((tema) => [tema.localId, tema.serverId]));
  const actividadPorLocal = new Map(actividades.map((actividad) => [actividad.localId, actividad.serverId]));
  const pasoPorLocal = new Map(pasos.map((paso) => [paso.localId, paso.serverId]));

  return {
    progresos_tema: progresos
      .filter((item) => item.actividadLocalId === null)
      .flatMap((item) => {
        const temaId = temaPorLocal.get(item.temaLocalId);
        if (!temaId) return [];
        const pasoId = item.pasoLocalId ? pasoPorLocal.get(item.pasoLocalId) ?? null : null;
        return [{
          tema_id: temaId,
          estado: item.estado,
          porcentaje: item.porcentaje,
          iniciado_en: item.iniciadoEn,
          completado_en: item.completadoEn,
          ultimo_paso_id: pasoId,
        }];
      }),
    progresos_actividad: progresos
      .filter((item) => Boolean(item.actividadLocalId))
      .flatMap((item) => {
        const actividadId = item.actividadLocalId ? actividadPorLocal.get(item.actividadLocalId) : undefined;
        if (!actividadId) return [];
        return [{
          actividad_id: actividadId,
          intentos: item.intentos,
          mejor_puntaje: item.mejorPuntaje ?? 0,
          completado: item.estado === "completado",
        }];
      }),
  };
}

function esErrorDeRed(error: unknown) {
  const mensaje = error instanceof Error ? error.message.toLowerCase() : "";
  return mensaje.includes("fetch") || mensaje.includes("conexión") || mensaje.includes("network");
}
