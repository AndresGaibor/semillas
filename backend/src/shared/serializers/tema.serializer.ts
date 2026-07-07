export type FilaTema = {
  id: string;
  senda_id: string;
  titulo: string;
  slug: string;
  objetivo: string;
  resumen: string | null;
  portada_recurso_id: string | null;
  estado: string;
  version_biblica_id: string | null;
  xp_recompensa: number;
  minutos_estimados: number;
  version_contenido: number;
  publicado_en: string | null;
};

export function serializarTema(fila: FilaTema) {
  return {
    id: fila.id,
    senda_id: fila.senda_id,
    titulo: fila.titulo,
    slug: fila.slug,
    objetivo: fila.objetivo,
    resumen: fila.resumen,
    portada_recurso_id: fila.portada_recurso_id,
    estado: fila.estado,
    version_biblica_id: fila.version_biblica_id,
    xp_recompensa: fila.xp_recompensa,
    minutos_estimados: fila.minutos_estimados,
    version_contenido: fila.version_contenido,
    publicado_en: fila.publicado_en
  };
}
