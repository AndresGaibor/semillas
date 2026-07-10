import { Hono } from "hono";
import type { AppBindings } from "../../config/env";
import { zValidator } from "../../shared/middleware/validate.middleware";
import { createGuestSchema } from "./auth.schemas";
import { responderError, responderExito } from "../../shared/http/respuesta";
import { serializarPerfil } from "../../shared/serializers/perfil.serializer";
import { serializarUsuario } from "../../shared/serializers/usuario.serializer";
import { crearAuthRepository } from "./auth.repository";
import { crearCasoCrearInvitado } from "./casos-uso/crear-invitado";
import { crearCasoConfigurarAdminDev } from "./casos-uso/configurar-admin-dev";

export const authRoutes = new Hono<AppBindings>();

authRoutes.post("/invitado", zValidator("json", createGuestSchema), async (c) => {
  const body = c.req.valid("json");
  const repositorio = crearAuthRepository(c.get("db"));
  const crearInvitado = crearCasoCrearInvitado(repositorio);
  const { usuario, perfil } = await crearInvitado(body);

  return responderExito(
    {
      usuario: serializarUsuario(usuario),
      perfil: serializarPerfil(perfil),
      autenticacion: {
        tipo: "invitado",
        encabezado: "x-guest-user-id",
        valor: usuario.id
      }
    },
    201
  );
});

authRoutes.post("/configuracion-dev", async (c) => {
  if (c.env.APP_ENV !== "development" && c.env.APP_ENV !== "local") {
    return responderError("No disponible fuera de desarrollo", "NO_DISPONIBLE_EN_DESARROLLO", 403);
  }

  const repositorio = crearAuthRepository(c.get("db"));
  const configurarAdminDev = crearCasoConfigurarAdminDev(repositorio);
  const resultado = await configurarAdminDev();

  return responderExito({
    usuario: serializarUsuario(resultado.usuario),
    credenciales: resultado.credenciales,
    ...(resultado.perfil ? { perfil: serializarPerfil(resultado.perfil) } : {}),
    mensaje: resultado.mensaje
  });
});
