import { BadRequestError } from "../../shared/errors/http-error";

export type ActividadEvaluable = {
  tipoCodigo: string;
  configuracion: unknown;
  retroalimentacion: string | null;
};

export type RespuestaActividad = {
  texto?: string;
  respuesta?: unknown;
  confirmacion?: boolean;
};

export type ResultadoEvaluacion = {
  correcta: boolean;
  puntaje: number;
  retroalimentacion: string | null;
};

const TIPOS_CONFIRMACION = new Set([
  "manualidad",
  "tarjetas_memoria",
  "flashcards",
  "rompecabezas",
  "cancion",
  "actividad_cancion",
  "lectura",
]);

const TIPOS_INTERACTIVOS_LEGACY = new Set([
  "actividad_audio",
  "audio",
  "actividad_video",
  "video",
  "aventura_decisiones",
  "arrastrar_soltar",
  "secuencia",
  "ordenar",
  "completar_versiculo",
  "cuestionario",
  "quiz",
  "verdadero_falso",
  "relacionar_pares",
  "sopa_letras",
]);

function objeto(valor: unknown): Record<string, unknown> {
  return valor && typeof valor === "object" && !Array.isArray(valor)
    ? (valor as Record<string, unknown>)
    : {};
}

function normalizarTexto(valor: unknown): string {
  return String(valor ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ");
}

function arraysIguales(a: unknown[], b: unknown[]): boolean {
  return a.length === b.length && a.every((value, index) => JSON.stringify(value) === JSON.stringify(b[index]));
}

function resultado(correcta: boolean, retroalimentacion: string | null, puntaje = correcta ? 100 : 0): ResultadoEvaluacion {
  return { correcta, puntaje, retroalimentacion };
}

export function evaluarActividadConfigurada(
  actividad: ActividadEvaluable,
  respuesta: RespuestaActividad,
): ResultadoEvaluacion {
  const config = objeto(actividad.configuracion);
  const codigo = actividad.tipoCodigo;

  if (TIPOS_CONFIRMACION.has(codigo)) {
    if (respuesta.confirmacion !== true) throw new BadRequestError("Confirma que completaste la actividad");
    return resultado(true, actividad.retroalimentacion);
  }

  if (codigo === "completar_versiculo") {
    const esperada = normalizarTexto(config.respuesta);
    const recibida = normalizarTexto(respuesta.texto ?? respuesta.respuesta);
    if (!esperada) throw new BadRequestError("La actividad no tiene una respuesta verificable configurada");
    return resultado(recibida === esperada, actividad.retroalimentacion);
  }

  if (codigo === "verdadero_falso") {
    const afirmaciones = Array.isArray(config.afirmaciones) ? config.afirmaciones.map(objeto) : [];
    const esperadas = afirmaciones.map((item) => Boolean(item.es_verdadero));
    const recibidas = Array.isArray(respuesta.respuesta) ? respuesta.respuesta.map(Boolean) : [];
    if (!esperadas.length) throw new BadRequestError("La actividad no tiene afirmaciones configuradas");
    const aciertos = esperadas.filter((valor, index) => valor === recibidas[index]).length;
    return resultado(aciertos === esperadas.length, actividad.retroalimentacion, Math.round((aciertos / esperadas.length) * 100));
  }

  if (codigo === "cuestionario" || codigo === "quiz") {
    const preguntas = Array.isArray(config.preguntas) ? config.preguntas.map(objeto) : [];
    const esperadas = preguntas.map((item) => Number(item.respuesta_correcta));
    const recibidas = Array.isArray(respuesta.respuesta) ? respuesta.respuesta.map(Number) : [];
    if (!esperadas.length) throw new BadRequestError("El cuestionario no tiene preguntas configuradas");
    const aciertos = esperadas.filter((valor, index) => valor === recibidas[index]).length;
    return resultado(aciertos === esperadas.length, actividad.retroalimentacion, Math.round((aciertos / esperadas.length) * 100));
  }

  if (codigo === "actividad_video" || codigo === "video" || codigo === "actividad_audio" || codigo === "audio") {
    const esperada = Number(config.respuesta_correcta);
    const recibida = Number(respuesta.respuesta);
    if (!Number.isInteger(esperada)) {
      if (respuesta.confirmacion === true && config.validacion_servidor !== true) {
        return resultado(true, actividad.retroalimentacion);
      }
      throw new BadRequestError("La actividad multimedia no tiene respuesta correcta configurada");
    }
    return resultado(recibida === esperada, actividad.retroalimentacion);
  }

  if (codigo === "arrastrar_soltar" || codigo === "secuencia" || codigo === "ordenar") {
    const items = Array.isArray(config.items) ? config.items : [];
    const ordenConfigurado = Array.isArray(config.orden_correcto)
      ? config.orden_correcto.map(Number)
      : items.map((_, index) => index);
    const recibido = Array.isArray(respuesta.respuesta) ? respuesta.respuesta.map(Number) : [];
    if (!ordenConfigurado.length) throw new BadRequestError("La actividad no tiene un orden correcto configurado");
    return resultado(arraysIguales(recibido, ordenConfigurado), actividad.retroalimentacion);
  }

  if (codigo === "relacionar_pares") {
    const pares = Array.isArray(config.pares) ? config.pares.map(objeto) : [];
    const esperado = pares
      .map((item) => `${normalizarTexto(item.izquierda)}::${normalizarTexto(item.derecha)}`)
      .sort();
    const respuestaObj = objeto(respuesta.respuesta);
    const paresRespuesta = Array.isArray(respuestaObj.pares)
      ? respuestaObj.pares.map(objeto)
      : Array.isArray(respuesta.respuesta)
        ? respuesta.respuesta.map(objeto)
        : [];
    const recibido = paresRespuesta
      .map((item) => `${normalizarTexto(item.izquierda)}::${normalizarTexto(item.derecha)}`)
      .sort();
    if (!esperado.length) throw new BadRequestError("La actividad no tiene pares configurados");
    return resultado(arraysIguales(recibido, esperado), actividad.retroalimentacion);
  }

  if (codigo === "aventura_decisiones") {
    const escenas = Array.isArray(config.escenas) ? config.escenas.map(objeto) : [];
    const esperadas = escenas.map((escena) => {
      const opciones = Array.isArray(escena.opciones) ? escena.opciones.map(objeto) : [];
      return opciones.findIndex((opcion) => opcion.correcta === true);
    });
    const recibidas = Array.isArray(respuesta.respuesta) ? respuesta.respuesta.map(Number) : [];
    if (!esperadas.length || esperadas.some((item) => item < 0)) throw new BadRequestError("La aventura no tiene decisiones correctas configuradas");
    return resultado(arraysIguales(recibidas, esperadas), actividad.retroalimentacion);
  }

  if (codigo === "sopa_letras") {
    const esperadas = (Array.isArray(config.palabras) ? config.palabras : []).map(normalizarTexto).sort();
    const recibidas = (Array.isArray(respuesta.respuesta) ? respuesta.respuesta : []).map(normalizarTexto).sort();
    if (!esperadas.length) throw new BadRequestError("La sopa de letras no tiene palabras configuradas");
    return resultado(arraysIguales(recibidas, esperadas), actividad.retroalimentacion);
  }

  // Compatibilidad con reproductores existentes: el servidor sigue gobernando la
  // recompensa, la idempotencia y la finalización. Los contenidos nuevos pueden
  // activar `validacion_servidor` para exigir una respuesta estructurada.
  if (
    TIPOS_INTERACTIVOS_LEGACY.has(codigo) &&
    respuesta.confirmacion === true &&
    config.validacion_servidor !== true
  ) {
    return resultado(true, actividad.retroalimentacion);
  }

  throw new BadRequestError(`El tipo de actividad ${codigo || "desconocido"} no tiene un evaluador de servidor`);
}
