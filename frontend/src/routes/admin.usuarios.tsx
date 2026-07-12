import type { ReactNode } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Activity,
  Award,
  BookOpenCheck,
  CheckCircle2,
  Download,
  Eye,
  LoaderCircle,
  LockKeyhole,
  Mail,
  Search,
  ShieldCheck,
  UserRound,
  UsersRound,
  X,
} from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import {
  ajustarXpUsuarioAdmin,
  actualizarUsuarioAdmin,
  obtenerUsuarioAdmin,
  obtenerUsuariosAdmin,
  type UsuarioAdmin,
} from "@/features/admin/admin.api";

export const Route = createFileRoute("/admin/usuarios")({ component: AdminUsuariosPage });

const POR_PAGINA = 20;
const ROLES = [
  { value: "", label: "Todos los roles" },
  { value: "usuario", label: "Usuario" },
  { value: "invitado", label: "Invitado" },
  { value: "padre", label: "Padre o tutor" },
  { value: "administrador", label: "Administrador" },
];

function AdminUsuariosPage() {
  const queryClient = useQueryClient();
  const [busqueda, setBusqueda] = useState("");
  const [rol, setRol] = useState("");
  const [estado, setEstado] = useState<"todos" | "activos" | "inactivos">("todos");
  const [pagina, setPagina] = useState(1);
  const [seleccionadoId, setSeleccionadoId] = useState<string | null>(null);

  const usuariosQuery = useQuery({
    queryKey: ["admin", "usuarios", busqueda, rol, estado, pagina],
    queryFn: () => obtenerUsuariosAdmin({
      q: busqueda.trim() || undefined,
      rol: rol || undefined,
      activo: estado === "todos" ? undefined : estado === "activos",
      limit: POR_PAGINA,
      offset: (pagina - 1) * POR_PAGINA,
    }),
    placeholderData: (anterior) => anterior,
  });

  const detalleQuery = useQuery({
    queryKey: ["admin", "usuario", seleccionadoId],
    queryFn: () => obtenerUsuarioAdmin(seleccionadoId!),
    enabled: Boolean(seleccionadoId),
  });

  const usuarios = usuariosQuery.data?.usuarios ?? [];
  const total = usuariosQuery.data?.total ?? 0;
  const paginas = Math.max(1, Math.ceil(total / POR_PAGINA));
  const resumen = useMemo(() => ({
    activos: usuarios.filter((item) => item.activo).length,
    invitados: usuarios.filter((item) => item.rol === "invitado").length,
    vinculados: usuarios.filter((item) => item.proveedor !== "anonimo" && item.rol !== "invitado").length,
    administradores: usuarios.filter((item) => item.rol === "administrador").length,
  }), [usuarios]);

  function cambiarFiltro(accion: () => void) {
    accion();
    setPagina(1);
  }

  function exportarCsv() {
    const encabezados = ["Nombre", "Correo", "Rol", "Estado", "Franja", "XP", "Nivel", "Temas", "Actividades", "Clubes"];
    const filas = usuarios.map((usuario) => [
      usuario.perfil?.apodo || usuario.nombre_visible,
      usuario.correo ?? "",
      usuario.rol,
      usuario.activo ? "Activo" : "Inactivo",
      usuario.perfil?.grupo_edad?.nombre ?? "Sin franja",
      String(usuario.perfil?.xp_acumulada ?? 0),
      usuario.perfil?.nivel_nombre ?? "Brote",
      String(usuario.perfil?.temas_completados ?? 0),
      String(usuario.perfil?.actividades_completadas ?? 0),
      usuario.clubes.map((club) => club.nombre).join(" | "),
    ]);
    const csv = [encabezados, ...filas]
      .map((fila) => fila.map((valor) => `"${String(valor).replaceAll('"', '""')}"`).join(","))
      .join("\n");
    const url = URL.createObjectURL(new Blob(["\ufeff", csv], { type: "text/csv;charset=utf-8" }));
    const enlace = document.createElement("a");
    enlace.href = url;
    enlace.download = `usuarios-semillas-${new Date().toISOString().slice(0, 10)}.csv`;
    enlace.click();
    URL.revokeObjectURL(url);
  }

  return (
    <section className="admin-extra-page">
      <header className="admin-extra-hero">
        <div className="admin-extra-hero__icon"><UsersRound aria-hidden="true" /></div>
        <div className="min-w-0 flex-1">
          <p className="admin-extra-eyebrow">Cuentas y protección</p>
          <h1>Gestión de usuarios</h1>
          <p>Consulta el progreso, administra el acceso y cambia roles sin inventar datos de franja, nivel o clubes.</p>
        </div>
        <button type="button" className="admin-extra-secondary" onClick={exportarCsv} disabled={usuarios.length === 0}>
          <Download size={18} aria-hidden="true" /> Exportar página
        </button>
      </header>

      <div className="admin-extra-metrics" aria-label="Resumen de la página actual">
        <Metric label="Resultados" value={total} icon={<UsersRound />} />
        <Metric label="Activos visibles" value={resumen.activos} icon={<CheckCircle2 />} />
        <Metric label="Invitados" value={resumen.invitados} icon={<UserRound />} />
        <Metric label="Administradores" value={resumen.administradores} icon={<ShieldCheck />} />
      </div>

      <div className="admin-extra-panel">
        <div className="admin-users-toolbar">
          <label className="admin-extra-search">
            <Search size={18} aria-hidden="true" />
            <input
              value={busqueda}
              onChange={(event) => cambiarFiltro(() => setBusqueda(event.target.value))}
              placeholder="Buscar por nombre o correo"
            />
          </label>
          <select value={rol} onChange={(event) => cambiarFiltro(() => setRol(event.target.value))} aria-label="Filtrar por rol">
            {ROLES.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}
          </select>
          <select value={estado} onChange={(event) => cambiarFiltro(() => setEstado(event.target.value as typeof estado))} aria-label="Filtrar por estado">
            <option value="todos">Todos los estados</option>
            <option value="activos">Activos</option>
            <option value="inactivos">Inactivos</option>
          </select>
        </div>

        {usuariosQuery.isLoading ? <Loading label="Cargando usuarios..." /> : null}
        {usuariosQuery.isError ? <ErrorState onRetry={() => void usuariosQuery.refetch()} /> : null}

        {!usuariosQuery.isLoading && !usuariosQuery.isError && usuarios.length === 0 ? (
          <div className="admin-extra-empty">
            <UsersRound size={34} aria-hidden="true" />
            <h3>No hay resultados</h3>
            <p>Cambia los filtros o revisa que las cuentas hayan sido creadas desde autenticación.</p>
          </div>
        ) : null}

        {usuarios.length > 0 ? (
          <div className="admin-users-table-wrap">
            <table className="admin-users-table">
              <thead><tr><th>Usuario</th><th>Rol</th><th>Franja</th><th>Progreso</th><th>Clubes</th><th>Estado</th><th aria-label="Acciones" /></tr></thead>
              <tbody>
                {usuarios.map((usuario) => (
                  <tr key={usuario.id}>
                    <td><UserIdentity usuario={usuario} /></td>
                    <td><RoleBadge rol={usuario.rol} /></td>
                    <td>
                      <strong>{usuario.perfil?.grupo_edad?.nombre ?? "Sin franja"}</strong>
                      <small>{usuario.perfil?.grupo_edad ? `${usuario.perfil.grupo_edad.edad_minima}–${usuario.perfil.grupo_edad.edad_maxima} años` : "Perfil administrativo o incompleto"}</small>
                    </td>
                    <td>
                      <strong>{usuario.perfil?.xp_acumulada ?? 0} XP · Nivel {usuario.perfil?.nivel_actual ?? 1}</strong>
                      <small>{usuario.perfil?.temas_completados ?? 0} temas · {usuario.perfil?.actividades_completadas ?? 0} actividades</small>
                    </td>
                    <td>
                      <strong>{usuario.clubes.length}</strong>
                      <small>{usuario.clubes.slice(0, 2).map((club) => club.nombre).join(", ") || "Sin club"}</small>
                    </td>
                    <td><span className={`admin-state ${usuario.activo ? "admin-state--success" : "admin-state--danger"}`}>{usuario.activo ? "Activo" : "Inactivo"}</span></td>
                    <td><button type="button" className="admin-icon-button" onClick={() => setSeleccionadoId(usuario.id)} aria-label={`Ver a ${usuario.nombre_visible}`}><Eye size={18} /></button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : null}

        {total > POR_PAGINA ? (
          <nav className="admin-extra-pagination" aria-label="Paginación de usuarios">
            <button type="button" disabled={pagina === 1} onClick={() => setPagina((actual) => Math.max(1, actual - 1))}>Anterior</button>
            <span>Página {pagina} de {paginas} · {total} usuarios</span>
            <button type="button" disabled={pagina >= paginas} onClick={() => setPagina((actual) => Math.min(paginas, actual + 1))}>Siguiente</button>
          </nav>
        ) : null}
      </div>

      {seleccionadoId ? (
        <UserDrawer
          key={seleccionadoId}
          usuario={detalleQuery.data ?? null}
          isLoading={detalleQuery.isLoading}
          onClose={() => setSeleccionadoId(null)}
          onSaved={async () => {
            await Promise.all([
              queryClient.invalidateQueries({ queryKey: ["admin", "usuarios"] }),
              queryClient.invalidateQueries({ queryKey: ["admin", "usuario", seleccionadoId] }),
            ]);
          }}
        />
      ) : null}
    </section>
  );
}

function UserDrawer({ usuario, isLoading, onClose, onSaved }: { usuario: UsuarioAdmin | null; isLoading: boolean; onClose: () => void; onSaved: () => Promise<unknown> }) {
  const [nombre, setNombre] = useState(usuario?.nombre_visible ?? "");
  const [rol, setRol] = useState<UsuarioAdmin["rol"]>(usuario?.rol ?? "usuario");
  const [xpCantidad, setXpCantidad] = useState("");
  const [xpMotivo, setXpMotivo] = useState("");

  // El detalle puede llegar después de abrir el panel; se usa key desde el padre
  // implícitamente por ID y se sincroniza al guardar mediante los valores actuales.
  const mutation = useMutation({
    mutationFn: (datos: Partial<Pick<UsuarioAdmin, "nombre_visible" | "rol" | "activo">>) => actualizarUsuarioAdmin(usuario!.id, datos),
    onSuccess: async () => {
      await onSaved();
      toast.success("Usuario actualizado");
    },
    onError: (error) => toast.error(error instanceof Error ? error.message : "No se pudo actualizar"),
  });

  const xpMutation = useMutation({
    mutationFn: () => ajustarXpUsuarioAdmin(usuario!.id, {
      cantidad: Number(xpCantidad),
      motivo: xpMotivo.trim(),
    }),
    onSuccess: async (resultado) => {
      setXpCantidad("");
      setXpMotivo("");
      await onSaved();
      toast.success(`Ajuste registrado. Nuevo total: ${resultado.xp_total} XP`);
    },
    onError: (error) => toast.error(error instanceof Error ? error.message : "No se pudo ajustar el XP"),
  });

  return (
    <div className="admin-modal-backdrop" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <aside className="admin-user-drawer" role="dialog" aria-modal="true" aria-labelledby="admin-user-title">
        <header className="admin-modal__header">
          <div><p className="admin-extra-eyebrow">Detalle y seguridad</p><h2 id="admin-user-title">Perfil del usuario</h2></div>
          <button type="button" className="admin-icon-button" onClick={onClose} aria-label="Cerrar"><X size={20} /></button>
        </header>

        {isLoading || !usuario ? <Loading label="Cargando detalle..." /> : (
          <div className="admin-user-detail">
            <UserIdentity usuario={usuario} large />
            <div className="admin-user-detail__facts">
              <Fact icon={<Mail />} label="Correo" value={usuario.correo ?? "Cuenta invitada sin correo"} />
              <Fact icon={<Activity />} label="Último acceso" value={usuario.ultimo_login_en ? new Date(usuario.ultimo_login_en).toLocaleString("es-EC") : "Sin registro"} />
              <Fact icon={<BookOpenCheck />} label="Progreso" value={`${usuario.perfil?.temas_completados ?? 0} temas y ${usuario.perfil?.actividades_completadas ?? 0} actividades`} />
              <Fact icon={<Award />} label="Gamificación" value={`${usuario.perfil?.xp_acumulada ?? 0} XP · ${usuario.perfil?.logros ?? 0} logros`} />
            </div>

            <div className="admin-form-grid admin-form-grid--one">
              <label className="admin-form-field"><span>Nombre visible</span><input value={nombre || usuario.nombre_visible} maxLength={60} onChange={(event) => setNombre(event.target.value)} /></label>
              <label className="admin-form-field"><span>Rol</span><select value={rol || usuario.rol} onChange={(event) => setRol(event.target.value as UsuarioAdmin["rol"])}>{ROLES.filter((item) => item.value).map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}</select></label>
            </div>

            <section className="admin-user-detail__section">
              <h3>Ajuste administrativo de XP</h3>
              <p className="admin-muted">Se registra en el libro mayor del backend y queda en auditoría. Usa valores negativos únicamente para correcciones justificadas.</p>
              <div className="admin-xp-adjustment">
                <label className="admin-form-field"><span>Cantidad</span><input type="number" min={-100000} max={100000} value={xpCantidad} onChange={(event) => setXpCantidad(event.target.value)} placeholder="Ej. 25 o -10" /></label>
                <label className="admin-form-field"><span>Motivo</span><input value={xpMotivo} maxLength={500} onChange={(event) => setXpMotivo(event.target.value)} placeholder="Describe la razón del ajuste" /></label>
                <button type="button" className="admin-extra-secondary" disabled={xpMutation.isPending || !Number.isInteger(Number(xpCantidad)) || Number(xpCantidad) === 0 || xpMotivo.trim().length < 5} onClick={() => xpMutation.mutate()}>
                  {xpMutation.isPending ? <LoaderCircle className="animate-spin" size={18} /> : <Award size={18} />} Registrar ajuste
                </button>
              </div>
            </section>

            <section className="admin-user-detail__section">
              <h3>Clubes</h3>
              {usuario.clubes.length ? usuario.clubes.map((club) => <div key={club.id} className="admin-user-club"><UsersRound size={18} /><span><strong>{club.nombre}</strong><small>{club.rol} · {club.activo ? "Activo" : "Suspendido"}</small></span></div>) : <p className="admin-muted">No pertenece a ningún club.</p>}
            </section>

            <div className="admin-user-detail__actions">
              <button type="button" className="admin-extra-primary" disabled={mutation.isPending || !(nombre || usuario.nombre_visible).trim()} onClick={() => mutation.mutate({ nombre_visible: (nombre || usuario.nombre_visible).trim(), rol: rol || usuario.rol })}>
                {mutation.isPending ? <LoaderCircle className="animate-spin" size={18} /> : <ShieldCheck size={18} />} Guardar cambios
              </button>
              <button type="button" className={usuario.activo ? "admin-extra-danger" : "admin-extra-secondary"} disabled={mutation.isPending} onClick={() => {
                const accion = usuario.activo ? "desactivar" : "reactivar";
                if (window.confirm(`¿${accion[0]!.toUpperCase()}${accion.slice(1)} esta cuenta?`)) mutation.mutate({ activo: !usuario.activo });
              }}>
                {usuario.activo ? <LockKeyhole size={18} /> : <CheckCircle2 size={18} />} {usuario.activo ? "Desactivar cuenta" : "Reactivar cuenta"}
              </button>
            </div>
          </div>
        )}
      </aside>
    </div>
  );
}

function UserIdentity({ usuario, large = false }: { usuario: UsuarioAdmin; large?: boolean }) {
  const nombre = usuario.perfil?.apodo || usuario.nombre_visible;
  const initials = nombre.split(/\s+/).slice(0, 2).map((word) => word[0]).join("").toUpperCase();
  return <div className={`admin-user-identity ${large ? "admin-user-identity--large" : ""}`}>
    {usuario.perfil?.avatar_url ? <img src={usuario.perfil.avatar_url} alt="" /> : <span aria-hidden="true">{initials || "S"}</span>}
    <div><strong>{nombre}</strong><small>{usuario.correo ?? "Cuenta invitada"}</small></div>
  </div>;
}

function RoleBadge({ rol }: { rol: UsuarioAdmin["rol"] }) {
  const labels: Record<UsuarioAdmin["rol"], string> = { administrador: "Administrador", usuario: "Usuario", invitado: "Invitado", padre: "Padre o tutor" };
  return <span className={`admin-role admin-role--${rol}`}>{labels[rol]}</span>;
}

function Metric({ label, value, icon }: { label: string; value: number; icon: ReactNode }) {
  return <article className="admin-extra-metric"><div>{icon}</div><span>{label}</span><strong>{value}</strong></article>;
}

function Fact({ icon, label, value }: { icon: ReactNode; label: string; value: string }) {
  return <div className="admin-user-fact"><span>{icon}</span><div><small>{label}</small><strong>{value}</strong></div></div>;
}

function Loading({ label }: { label: string }) {
  return <div className="admin-extra-loading" role="status"><LoaderCircle className="animate-spin" size={22} /> {label}</div>;
}

function ErrorState({ onRetry }: { onRetry: () => void }) {
  return <div className="admin-extra-empty"><LockKeyhole size={34} /><h3>No se pudieron cargar los usuarios</h3><p>Comprueba la conexión y los permisos del administrador.</p><button type="button" className="admin-extra-secondary" onClick={onRetry}>Reintentar</button></div>;
}
