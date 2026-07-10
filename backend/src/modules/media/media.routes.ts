import { Hono } from "hono";
import type { AppBindings } from "../../config/env";
import { authMiddleware } from "../../shared/middleware/auth.middleware";
import { requireRole } from "../../shared/middleware/role.middleware";
import { responderError, responderExito } from "../../shared/http/respuesta";
import { esResultadoConError } from "../../shared/errors/result-helpers";
import { crearMediaRepository } from "./media.repository";
import { crearCasosUsoMedia } from "./media.use-cases";

export const mediaRoutes = new Hono<AppBindings>();

mediaRoutes.post("/subir", authMiddleware, requireRole("administrador"), async (c) => {
  const formData = await c.req.formData();
  const archivo = formData.get("archivo");
  const tipoRaw = formData.get("tipo");
  const textoAlternativo = (formData.get("texto_alternativo") as string | null) || undefined;

  if (!archivo || !(archivo instanceof File)) {
    return responderError("El campo 'archivo' es requerido y debe ser un archivo", "VALIDATION_ERROR", 400);
  }

  const repositorio = crearMediaRepository(c.get("db"));
  const casos = crearCasosUsoMedia(repositorio);
  const resultado = await casos.subir({ archivo, tipoRaw, textoAlternativo, userId: c.get("user").id });

  if (esResultadoConError(resultado)) return responderError(resultado.error.mensaje, resultado.error.codigo, resultado.error.estado);
  return responderExito(resultado.recurso, 201);
});

mediaRoutes.get("/:id/url", authMiddleware, async (c) => {
  const repositorio = crearMediaRepository(c.get("db"));
  const casos = crearCasosUsoMedia(repositorio);
  const resultado = await casos.obtenerUrl(c.req.param("id"));
  if (esResultadoConError(resultado)) return responderError(resultado.error.mensaje, resultado.error.codigo, resultado.error.estado);
  return responderExito({ url: resultado.url, expira_en_segundos: resultado.expiraEnSegundos });
});

mediaRoutes.get("/", authMiddleware, async (c) => {
  const repositorio = crearMediaRepository(c.get("db"));
  const casos = crearCasosUsoMedia(repositorio);
  return responderExito(await casos.listar());
});

mediaRoutes.get("/:id", async (c) => {
  const repositorio = crearMediaRepository(c.get("db"));
  const casos = crearCasosUsoMedia(repositorio);
  const resultado = await casos.obtener(c.req.param("id"));
  if (esResultadoConError(resultado)) return responderError(resultado.error.mensaje, resultado.error.codigo, resultado.error.estado);
  return responderExito(resultado);
});

mediaRoutes.delete("/:id", async (c) => {
  const repositorio = crearMediaRepository(c.get("db"));
  const casos = crearCasosUsoMedia(repositorio);
  const resultado = await casos.eliminar(c.req.param("id"));
  if (esResultadoConError(resultado)) return responderError(resultado.error.mensaje, resultado.error.codigo, resultado.error.estado);
  return responderExito(resultado);
});
