import { Hono } from "hono";
import type { Context } from "hono";
import type { AppBindings } from "../../config/env";
import { authMiddleware } from "../../shared/middleware/auth.middleware";
import { responderExito } from "../../shared/http/respuesta";
import { crearGamificationRepository } from "./gamification.repository";
import { crearCasoObtenerMiGamificacion } from "./casos-uso/obtener-mi";

export const gamificationRoutes = new Hono<AppBindings>();
gamificationRoutes.use("*", authMiddleware);

function obtenerRepositorio(c: Context<AppBindings>) {
  const cliente = c.get("drizzle");
  if (!cliente) throw new Error("Cliente Drizzle no disponible");
  return crearGamificationRepository(cliente);
}

gamificationRoutes.get("/mi", async (c) => {
  const repositorio = obtenerRepositorio(c);
  return responderExito(await crearCasoObtenerMiGamificacion(repositorio)(c.get("user").id));
});

gamificationRoutes.get("/catalogo", async (c) => {
  const repositorio = obtenerRepositorio(c);
  const [niveles, logros] = await Promise.all([
    repositorio.listarNiveles(),
    repositorio.listarCatalogoLogros(c.get("user").id),
  ]);
  return responderExito({
    niveles: niveles.map((nivel) => ({
      id: nivel.id,
      nombre: nivel.nombre,
      numero_nivel: nivel.numeroNivel,
      xp_minima: nivel.xpMinima,
      color_insignia: nivel.colorInsignia,
    })),
    logros: logros.map((logro) => ({
      id: logro.id,
      codigo: logro.codigo,
      nombre: logro.nombre,
      descripcion: logro.descripcion,
      url_icono: logro.urlIcono,
      bono_xp: logro.bonoXp,
      codigo_criterio: logro.codigoCriterio,
      valor_criterio: logro.valorCriterio,
      obtenido: logro.obtenido,
      ganado_en: logro.ganadoEn?.toISOString() ?? null,
      progreso_actual: logro.progresoActual,
      progreso_objetivo: logro.progresoObjetivo,
      porcentaje: logro.porcentaje,
    })),
  });
});

gamificationRoutes.get("/historial-xp", async (c) => {
  const repositorio = obtenerRepositorio(c);
  const limit = Math.min(Math.max(Number(c.req.query("limit") ?? "30"), 1), 100);
  const offset = Math.max(Number(c.req.query("offset") ?? "0"), 0);
  const resultado = await repositorio.listarHistorial(c.get("user").id, limit, offset);
  return responderExito({
    ...resultado,
    movimientos: resultado.movimientos.map((item) => ({
      id: item.id,
      origen: item.origen,
      origen_id: item.origenId,
      cantidad: item.cantidad,
      metadatos: item.metadatos,
      creado_en: item.creadoEn.toISOString(),
    })),
  });
});
