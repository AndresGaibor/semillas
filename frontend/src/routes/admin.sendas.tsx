import type { ReactNode } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  ArrowDown,
  ArrowUp,
  BookOpen,
  CheckCircle2,
  Edit3,
  LoaderCircle,
  Plus,
  Route as RouteIcon,
  Save,
  Trash2,
  X,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import {
  actualizarSendaAdmin,
  crearSendaAdmin,
  eliminarSendaAdmin,
  obtenerSendasAdmin,
  reordenarSendasAdmin,
  type GuardarSendaAdmin,
  type SendaAdmin,
} from "@/features/admin/admin.api";

export const Route = createFileRoute("/admin/sendas")({ component: AdminSendasPage });

const FORMULARIO_VACIO: GuardarSendaAdmin = {
  nombre: "",
  codigo: "",
  descripcion: "",
  color_hex: "#22c55e",
  nombre_icono: "route",
  activo: true,
};

function AdminSendasPage() {
  const queryClient = useQueryClient();
  const [seleccionada, setSeleccionada] = useState<SendaAdmin | null>(null);
  const [formulario, setFormulario] = useState<GuardarSendaAdmin>(FORMULARIO_VACIO);
  const [editorAbierto, setEditorAbierto] = useState(false);

  const sendasQuery = useQuery({ queryKey: ["admin", "sendas"], queryFn: obtenerSendasAdmin });
  const sendas = sendasQuery.data ?? [];

  useEffect(() => {
    if (!seleccionada) setFormulario(FORMULARIO_VACIO);
    else {
      setFormulario({
        nombre: seleccionada.nombre,
        codigo: seleccionada.codigo,
        descripcion: seleccionada.descripcion,
        color_hex: seleccionada.color_hex,
        nombre_icono: seleccionada.nombre_icono,
        activo: seleccionada.activo,
      });
    }
  }, [seleccionada]);

  const guardarMutation = useMutation({
    mutationFn: () =>
      seleccionada
        ? actualizarSendaAdmin(seleccionada.id, formulario)
        : crearSendaAdmin(formulario),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["admin", "sendas"] });
      toast.success(seleccionada ? "Senda actualizada" : "Senda creada");
      cerrarEditor();
    },
    onError: (error) => toast.error(error instanceof Error ? error.message : "No se pudo guardar la Senda"),
  });

  const eliminarMutation = useMutation({
    mutationFn: (id: string) => eliminarSendaAdmin(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["admin", "sendas"] });
      toast.success("Senda eliminada");
    },
    onError: (error) => toast.error(error instanceof Error ? error.message : "No se pudo eliminar la Senda"),
  });

  const reordenarMutation = useMutation({
    mutationFn: (ids: string[]) => reordenarSendasAdmin(ids),
    onSuccess: (data) => queryClient.setQueryData(["admin", "sendas"], data),
    onError: (error) => toast.error(error instanceof Error ? error.message : "No se pudo cambiar el orden"),
  });

  const resumen = useMemo(
    () => ({
      total: sendas.length,
      activas: sendas.filter((item) => item.activo).length,
      temas: sendas.reduce((total, item) => total + item.temas, 0),
      publicados: sendas.reduce((total, item) => total + item.publicados, 0),
    }),
    [sendas],
  );

  function abrirNueva() {
    setSeleccionada(null);
    setFormulario(FORMULARIO_VACIO);
    setEditorAbierto(true);
  }

  function abrirEditar(senda: SendaAdmin) {
    setSeleccionada(senda);
    setEditorAbierto(true);
  }

  function cerrarEditor() {
    setEditorAbierto(false);
    setSeleccionada(null);
    setFormulario(FORMULARIO_VACIO);
  }

  function mover(index: number, direccion: -1 | 1) {
    const destino = index + direccion;
    if (destino < 0 || destino >= sendas.length) return;
    const copia = [...sendas];
    const [item] = copia.splice(index, 1);
    if (!item) return;
    copia.splice(destino, 0, item);
    queryClient.setQueryData(["admin", "sendas"], copia);
    reordenarMutation.mutate(copia.map((senda) => senda.id));
  }

  function confirmarEliminar(senda: SendaAdmin) {
    if (senda.temas > 0) {
      toast.error("Esta Senda tiene temas asociados. Desactívala en lugar de eliminarla.");
      return;
    }
    if (window.confirm(`¿Eliminar la Senda “${senda.nombre}”? Esta acción no se puede deshacer.`)) {
      eliminarMutation.mutate(senda.id);
    }
  }

  return (
    <section className="admin-extra-page">
      <header className="admin-extra-hero">
        <div className="admin-extra-hero__icon"><RouteIcon aria-hidden="true" /></div>
        <div className="min-w-0 flex-1">
          <p className="admin-extra-eyebrow">Arquitectura del contenido</p>
          <h1>Gestión de Sendas</h1>
          <p>Organiza las rutas de aprendizaje, su identidad visual y el orden en que aparecen para los usuarios.</p>
        </div>
        <button type="button" className="admin-extra-primary" onClick={abrirNueva}>
          <Plus size={18} aria-hidden="true" /> Crear Senda
        </button>
      </header>

      <div className="admin-extra-metrics" aria-label="Resumen de Sendas">
        <Metric label="Sendas" value={resumen.total} icon={<RouteIcon />} />
        <Metric label="Activas" value={resumen.activas} icon={<CheckCircle2 />} />
        <Metric label="Temas" value={resumen.temas} icon={<BookOpen />} />
        <Metric label="Publicados" value={resumen.publicados} icon={<CheckCircle2 />} />
      </div>

      <div className="admin-extra-panel">
        <div className="admin-extra-panel__header">
          <div>
            <h2>Orden y disponibilidad</h2>
            <p>El orden se guarda inmediatamente. Una Senda con temas no puede eliminarse.</p>
          </div>
        </div>

        {sendasQuery.isLoading ? <Loading label="Cargando Sendas..." /> : null}
        {sendasQuery.isError ? (
          <ErrorState onRetry={() => void sendasQuery.refetch()} />
        ) : null}

        {!sendasQuery.isLoading && !sendasQuery.isError && sendas.length === 0 ? (
          <div className="admin-extra-empty">
            <RouteIcon size={34} aria-hidden="true" />
            <h3>No hay Sendas</h3>
            <p>Crea la primera ruta para comenzar a organizar los temas.</p>
            <button type="button" className="admin-extra-primary" onClick={abrirNueva}><Plus size={18} /> Crear Senda</button>
          </div>
        ) : null}

        <div className="admin-sendas-list">
          {sendas.map((senda, index) => (
            <article key={senda.id} className={`admin-senda-row ${!senda.activo ? "admin-senda-row--inactive" : ""}`}>
              <div className="admin-senda-row__color" style={{ backgroundColor: senda.color_hex }} aria-hidden="true" />
              <div className="admin-senda-row__order">
                <span>{index + 1}</span>
                <div>
                  <button type="button" onClick={() => mover(index, -1)} disabled={index === 0 || reordenarMutation.isPending} aria-label={`Subir ${senda.nombre}`}><ArrowUp size={16} /></button>
                  <button type="button" onClick={() => mover(index, 1)} disabled={index === sendas.length - 1 || reordenarMutation.isPending} aria-label={`Bajar ${senda.nombre}`}><ArrowDown size={16} /></button>
                </div>
              </div>
              <div className="admin-senda-row__copy">
                <div className="admin-senda-row__title-line">
                  <h3>{senda.nombre}</h3>
                  <span className={senda.activo ? "admin-state admin-state--success" : "admin-state"}>{senda.activo ? "Activa" : "Inactiva"}</span>
                </div>
                <p>{senda.descripcion || "Sin descripción"}</p>
                <div className="admin-senda-row__meta">
                  <span>{senda.temas} temas</span>
                  <span>{senda.publicados} publicados</span>
                  <code>{senda.codigo}</code>
                </div>
              </div>
              <div className="admin-senda-row__actions">
                <Link to="/admin/temas" search={{ senda_id: senda.id } as never} className="admin-extra-secondary">Ver temas</Link>
                <button type="button" className="admin-icon-button" onClick={() => abrirEditar(senda)} aria-label={`Editar ${senda.nombre}`}><Edit3 size={18} /></button>
                <button type="button" className="admin-icon-button admin-icon-button--danger" onClick={() => confirmarEliminar(senda)} aria-label={`Eliminar ${senda.nombre}`}><Trash2 size={18} /></button>
              </div>
            </article>
          ))}
        </div>
      </div>

      {editorAbierto ? (
        <div className="admin-modal-backdrop" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && cerrarEditor()}>
          <section className="admin-modal" role="dialog" aria-modal="true" aria-labelledby="senda-editor-title">
            <header className="admin-modal__header">
              <div>
                <p className="admin-extra-eyebrow">{seleccionada ? "Editar catálogo" : "Nueva ruta"}</p>
                <h2 id="senda-editor-title">{seleccionada ? `Editar ${seleccionada.nombre}` : "Crear Senda"}</h2>
              </div>
              <button type="button" className="admin-icon-button" onClick={cerrarEditor} aria-label="Cerrar"><X size={20} /></button>
            </header>

            <form
              className="admin-form-grid"
              onSubmit={(event) => {
                event.preventDefault();
                if (!formulario.nombre.trim() || !formulario.codigo.trim()) {
                  toast.error("Completa el nombre y el código");
                  return;
                }
                guardarMutation.mutate();
              }}
            >
              <label className="admin-form-field">
                <span>Nombre</span>
                <input value={formulario.nombre} maxLength={100} onChange={(event) => setFormulario((actual) => ({ ...actual, nombre: event.target.value }))} required />
              </label>
              <label className="admin-form-field">
                <span>Código estable</span>
                <input value={formulario.codigo} maxLength={50} onChange={(event) => setFormulario((actual) => ({ ...actual, codigo: event.target.value.toLowerCase().replace(/[^a-z0-9_]/g, "_") }))} required />
                <small>No lo cambies si ya es usado por integraciones o contenido offline.</small>
              </label>
              <label className="admin-form-field admin-form-field--full">
                <span>Descripción</span>
                <textarea rows={4} value={formulario.descripcion ?? ""} onChange={(event) => setFormulario((actual) => ({ ...actual, descripcion: event.target.value }))} />
              </label>
              <label className="admin-form-field">
                <span>Color</span>
                <div className="admin-color-input">
                  <input type="color" value={formulario.color_hex} onChange={(event) => setFormulario((actual) => ({ ...actual, color_hex: event.target.value }))} />
                  <input value={formulario.color_hex} pattern="#[0-9a-fA-F]{6}" onChange={(event) => setFormulario((actual) => ({ ...actual, color_hex: event.target.value }))} />
                </div>
              </label>
              <label className="admin-form-field">
                <span>Icono</span>
                <input value={formulario.nombre_icono ?? ""} maxLength={100} onChange={(event) => setFormulario((actual) => ({ ...actual, nombre_icono: event.target.value }))} placeholder="route" />
              </label>
              <label className="admin-switch-field admin-form-field--full">
                <input type="checkbox" checked={formulario.activo} onChange={(event) => setFormulario((actual) => ({ ...actual, activo: event.target.checked }))} />
                <span><strong>Senda activa</strong><small>Las Sendas inactivas no se ofrecen como ruta nueva al usuario.</small></span>
              </label>
              <footer className="admin-modal__footer admin-form-field--full">
                <button type="button" className="admin-extra-secondary" onClick={cerrarEditor}>Cancelar</button>
                <button type="submit" className="admin-extra-primary" disabled={guardarMutation.isPending}>
                  {guardarMutation.isPending ? <LoaderCircle className="animate-spin" size={18} /> : <Save size={18} />}
                  Guardar Senda
                </button>
              </footer>
            </form>
          </section>
        </div>
      ) : null}
    </section>
  );
}

function Metric({ label, value, icon }: { label: string; value: number; icon: ReactNode }) {
  return <article className="admin-extra-metric"><span>{icon}</span><div><strong>{value}</strong><p>{label}</p></div></article>;
}

function Loading({ label }: { label: string }) {
  return <div className="admin-extra-loading"><LoaderCircle className="animate-spin" aria-hidden="true" /><span>{label}</span></div>;
}

function ErrorState({ onRetry }: { onRetry: () => void }) {
  return <div className="admin-extra-empty"><h3>No se pudo cargar la información</h3><p>Comprueba la conexión con el backend.</p><button type="button" className="admin-extra-primary" onClick={onRetry}>Reintentar</button></div>;
}
