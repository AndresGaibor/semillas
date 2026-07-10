import type { AuthRepository } from "../auth.repository";

export function crearCasoConfigurarAdminDev(repositorio: AuthRepository) {
  return async function configurarAdminDev() {
    const adminEmail = "admin@correo.com";
    const adminPassword = "admin";

    const existente = await repositorio.buscarUsuarioPorCorreo(adminEmail);

    if (existente) {
      const usuario = existente.rol !== "administrador"
        ? await repositorio.actualizarRolUsuario(existente.id, "administrador")
        : existente;

      const perfil = await repositorio.buscarPerfilPorUsuarioId(usuario.id);

      return { usuario, perfil, credenciales: { correo: adminEmail, password: adminPassword }, mensaje: "Administrador de desarrollo disponible para iniciar sesión con correo." };
    }

    const authUser = await repositorio.crearUsuarioAuthAdmin({
      email: adminEmail,
      password: adminPassword,
      email_confirm: true,
      user_metadata: { full_name: "Admin Dev" },
      app_metadata: { role: "administrador" }
    });

    const usuario = await repositorio.crearUsuarioApp({
      proveedor: "correo",
      rol: "administrador",
      nombre_visible: "Admin Dev",
      correo: adminEmail,
      id_externo: authUser.id
    });

    const perfil = await repositorio.crearPerfil({ usuario_id: usuario.id, apodo: "Admin Dev" });

    return { usuario, perfil, credenciales: { correo: adminEmail, password: adminPassword }, mensaje: "Administrador creado. Usa este correo y contraseña para iniciar sesión." };
  };
}
