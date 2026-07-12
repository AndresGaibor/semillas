import type { ReactNode } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Award,
  Flame,
  Gauge,
  LoaderCircle,
  Plus,
  Save,
  Settings2,
  Shield,
  Sparkles,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import {
  actualizarLogroAdmin,
  actualizarNivelAdmin,
  crearLogroAdmin,
  crearNivelAdmin,
  guardarAjusteAdmin,
  obtenerAjustesAdmin,
  obtenerConfiguracionGamificacionAdmin,
  type AjustePlataformaAdmin,
  type LogroAdmin,
  type NivelAdmin,
} from "@/features/admin/admin.api";

export const Route = createFileRoute("/admin/ajustes")({ component: AdminAjustesPage });

type Tab = "plataforma" | "niveles" | "logros";

function AdminAjustesPage() {
  const queryClient = useQueryClient();
  const [tab, setTab] = useState<Tab>("plataforma");
  const ajustesQuery = useQuery({ queryKey: ["admin", "ajustes"], queryFn: obtenerAjustesAdmin });
  const gameQuery = useQuery({ queryKey: ["admin", "gamificacion"], queryFn: obtenerConfiguracionGamificacionAdmin });

  return (
    <section className="admin-extra-page">
      <header className="admin-extra-hero">
        <div className="admin-extra-hero__icon"><Settings2 aria-hidden="true" /></div>
        <div className="min-w-0 flex-1">
          <p className="admin-extra-eyebrow">Gobernanza de plataforma</p>
          <h1>Ajustes y gamificación</h1>
          <p>Administra reglas desde el backend. El cliente solo muestra resultados y nunca decide XP, niveles o logros.</p>
        </div>
      </header>

      <nav className="admin-extra-panel admin-extra-toolbar" aria-label="Secciones de ajustes">
        <TabButton active={tab === "plataforma"} onClick={() => setTab("plataforma")} icon={<Shield size={18} />} label="Plataforma" />
        <TabButton active={tab === "niveles"} onClick={() => setTab("niveles")} icon={<Gauge size={18} />} label="Niveles" />
        <TabButton active={tab === "logros"} onClick={() => setTab("logros")} icon={<Award size={18} />} label="Logros" />
        <div className="ml-auto text-sm font-semibold text-slate-500">
          {gameQuery.data ? `${gameQuery.data.estadisticas.xpOtorgada.toLocaleString("es-EC")} XP registrados` : ""}
        </div>
      </nav>

      {(ajustesQuery.isLoading || gameQuery.isLoading) ? <div className="admin-extra-panel"><Loading label="Cargando configuración..." /></div> : null}
      {(ajustesQuery.isError || gameQuery.isError) ? <div className="admin-extra-panel"><ErrorState onRetry={() => { void ajustesQuery.refetch(); void gameQuery.refetch(); }} /></div> : null}

      {tab === "plataforma" && ajustesQuery.data ? (
        <AjustesPlataforma
          ajustes={ajustesQuery.data}
          onSaved={() => queryClient.invalidateQueries({ queryKey: ["admin", "ajustes"] })}
        />
      ) : null}
      {tab === "niveles" && gameQuery.data ? (
        <EditorNiveles
          niveles={gameQuery.data.niveles}
          onSaved={() => queryClient.invalidateQueries({ queryKey: ["admin", "gamificacion"] })}
        />
      ) : null}
      {tab === "logros" && gameQuery.data ? (
        <EditorLogros
          logros={gameQuery.data.logros}
          onSaved={() => queryClient.invalidateQueries({ queryKey: ["admin", "gamificacion"] })}
        />
      ) : null}
    </section>
  );
}

function AjustesPlataforma({ ajustes, onSaved }: { ajustes: AjustePlataformaAdmin[]; onSaved: () => void }) {
  const categorias = useMemo(() => {
    const mapa = new Map<string, AjustePlataformaAdmin[]>();
    for (const ajuste of ajustes) mapa.set(ajuste.categoria, [...(mapa.get(ajuste.categoria) ?? []), ajuste]);
    return [...mapa.entries()];
  }, [ajustes]);

  return (
    <div className="admin-settings-grid">
      <div className="admin-settings-section">
        {categorias.map(([categoria, items]) => (
          <article key={categoria} className="admin-extra-panel">
            <div className="admin-extra-panel__header"><div><h2>{nombreCategoria(categoria)}</h2><p>{descripcionCategoria(categoria)}</p></div></div>
            <div>{items.map((ajuste) => <AjusteRow key={ajuste.clave} ajuste={ajuste} onSaved={onSaved} />)}</div>
          </article>
        ))}
      </div>
      <aside className="admin-extra-panel">
        <div className="admin-extra-panel__header"><div><h2>Reglas importantes</h2><p>Principios aplicados por esta configuración.</p></div></div>
        <div className="admin-detail-list px-6 pb-5">
          <div><span>XP</span><strong>Solo backend</strong></div>
          <div><span>Recompensas</span><strong>Idempotentes</strong></div>
          <div><span>Contenido</span><strong>Validado antes de publicar</strong></div>
          <div><span>Archivos</span><strong>Límites administrables</strong></div>
          <div><span>Mantenimiento</span><strong>Control centralizado</strong></div>
        </div>
      </aside>
    </div>
  );
}

function AjusteRow({ ajuste, onSaved }: { ajuste: AjustePlataformaAdmin; onSaved: () => void }) {
  const [valor, setValor] = useState(() => formatoEntrada(ajuste.valor));
  useEffect(() => setValor(formatoEntrada(ajuste.valor)), [ajuste.valor]);
  const mutation = useMutation({
    mutationFn: () => guardarAjusteAdmin(ajuste.clave, interpretarValor(valor, ajuste.valor), ajuste.descripcion),
    onSuccess: async () => { toast.success("Ajuste guardado"); await onSaved(); },
    onError: (error) => toast.error(error instanceof Error ? error.message : "No se pudo guardar el ajuste"),
  });
  const esBooleano = typeof ajuste.valor === "boolean";

  return (
    <div className="admin-setting-row">
      <div><h3>{ajuste.clave}</h3><p>{ajuste.descripcion || "Sin descripción"}</p></div>
      {esBooleano ? (
        <select value={valor} onChange={(event) => setValor(event.target.value)} aria-label={`Valor de ${ajuste.clave}`}>
          <option value="true">Activado</option><option value="false">Desactivado</option>
        </select>
      ) : (
        <input value={valor} onChange={(event) => setValor(event.target.value)} aria-label={`Valor de ${ajuste.clave}`} />
      )}
      <button type="button" className="admin-icon-button" onClick={() => mutation.mutate()} disabled={mutation.isPending} aria-label={`Guardar ${ajuste.clave}`}>
        {mutation.isPending ? <LoaderCircle className="animate-spin" size={18} /> : <Save size={18} />}
      </button>
    </div>
  );
}

function EditorNiveles({ niveles, onSaved }: { niveles: NivelAdmin[]; onSaved: () => void }) {
  const [nuevo, setNuevo] = useState({ nombre: "", numero_nivel: (niveles.at(-1)?.numero_nivel ?? 0) + 1, xp_minima: (niveles.at(-1)?.xp_minima ?? 0) + 500, color_insignia: "#7c3aed" });
  const crearMutation = useMutation({
    mutationFn: () => crearNivelAdmin(nuevo),
    onSuccess: async () => { toast.success("Nivel creado"); setNuevo((actual) => ({ ...actual, nombre: "", numero_nivel: actual.numero_nivel + 1, xp_minima: actual.xp_minima + 500 })); await onSaved(); },
    onError: (error) => toast.error(error instanceof Error ? error.message : "No se pudo crear el nivel"),
  });
  return (
    <div className="admin-settings-grid">
      <article className="admin-extra-panel">
        <div className="admin-extra-panel__header"><div><h2>Escala de niveles</h2><p>El nivel se calcula en el servidor a partir del libro mayor de XP.</p></div></div>
        <div>{niveles.map((nivel) => <NivelRow key={nivel.id} nivel={nivel} onSaved={onSaved} />)}</div>
      </article>
      <aside className="admin-extra-panel">
        <div className="admin-extra-panel__header"><div><h2>Nuevo nivel</h2><p>La XP mínima debe ser mayor que la del nivel anterior.</p></div></div>
        <form className="admin-form-grid" onSubmit={(event) => { event.preventDefault(); crearMutation.mutate(); }}>
          <label className="admin-form-field admin-form-field--full"><span>Nombre</span><input required value={nuevo.nombre} onChange={(event) => setNuevo((actual) => ({ ...actual, nombre: event.target.value }))} /></label>
          <label className="admin-form-field"><span>Número</span><input type="number" min={1} value={nuevo.numero_nivel} onChange={(event) => setNuevo((actual) => ({ ...actual, numero_nivel: Number(event.target.value) }))} /></label>
          <label className="admin-form-field"><span>XP mínima</span><input type="number" min={0} value={nuevo.xp_minima} onChange={(event) => setNuevo((actual) => ({ ...actual, xp_minima: Number(event.target.value) }))} /></label>
          <label className="admin-form-field admin-form-field--full"><span>Color</span><div className="admin-color-input"><input type="color" value={nuevo.color_insignia} onChange={(event) => setNuevo((actual) => ({ ...actual, color_insignia: event.target.value }))} /><input value={nuevo.color_insignia} onChange={(event) => setNuevo((actual) => ({ ...actual, color_insignia: event.target.value }))} /></div></label>
          <button type="submit" className="admin-extra-primary admin-form-field--full" disabled={crearMutation.isPending}><Plus size={18} /> Crear nivel</button>
        </form>
      </aside>
    </div>
  );
}

function NivelRow({ nivel, onSaved }: { nivel: NivelAdmin; onSaved: () => void }) {
  const [form, setForm] = useState(nivel);
  useEffect(() => setForm(nivel), [nivel]);
  const mutation = useMutation({ mutationFn: () => actualizarNivelAdmin(nivel.id, form), onSuccess: async () => { toast.success("Nivel actualizado"); await onSaved(); }, onError: (error) => toast.error(error instanceof Error ? error.message : "No se pudo actualizar") });
  return (
    <div className="admin-level-row">
      <span className="admin-level-row__number" style={{ color: form.color_insignia ?? undefined }}>{form.numero_nivel}</span>
      <input className="rounded-xl border border-slate-200 px-3 py-2" value={form.nombre} onChange={(event) => setForm((actual) => ({ ...actual, nombre: event.target.value }))} aria-label={`Nombre del nivel ${nivel.numero_nivel}`} />
      <input className="rounded-xl border border-slate-200 px-3 py-2" type="number" min={0} value={form.xp_minima} onChange={(event) => setForm((actual) => ({ ...actual, xp_minima: Number(event.target.value) }))} aria-label={`XP mínima del nivel ${nivel.numero_nivel}`} />
      <button type="button" className="admin-icon-button" onClick={() => mutation.mutate()} disabled={mutation.isPending}><Save size={17} /></button>
    </div>
  );
}

function EditorLogros({ logros, onSaved }: { logros: LogroAdmin[]; onSaved: () => void }) {
  const [nuevo, setNuevo] = useState<Omit<LogroAdmin, "id" | "creado_en">>({ nombre: "", codigo: "", descripcion: "", url_icono: null, bono_xp: 0, codigo_criterio: "actividades_completadas", valor_criterio: 1, activo: true });
  const crearMutation = useMutation({ mutationFn: () => crearLogroAdmin(nuevo), onSuccess: async () => { toast.success("Logro creado"); setNuevo((actual) => ({ ...actual, nombre: "", codigo: "", descripcion: "" })); await onSaved(); }, onError: (error) => toast.error(error instanceof Error ? error.message : "No se pudo crear el logro") });
  return (
    <div className="admin-settings-grid">
      <article className="admin-extra-panel">
        <div className="admin-extra-panel__header"><div><h2>Catálogo de logros</h2><p>Cada criterio se evalúa automáticamente después de un evento de aprendizaje válido.</p></div></div>
        <div>{logros.map((logro) => <LogroRow key={logro.id} logro={logro} onSaved={onSaved} />)}</div>
      </article>
      <aside className="admin-extra-panel">
        <div className="admin-extra-panel__header"><div><h2>Nuevo logro</h2><p>Define el criterio y la recompensa, no la lógica del cliente.</p></div></div>
        <form className="admin-form-grid" onSubmit={(event) => { event.preventDefault(); crearMutation.mutate(); }}>
          <label className="admin-form-field admin-form-field--full"><span>Nombre</span><input required value={nuevo.nombre} onChange={(event) => setNuevo((actual) => ({ ...actual, nombre: event.target.value }))} /></label>
          <label className="admin-form-field admin-form-field--full"><span>Código</span><input required value={nuevo.codigo} onChange={(event) => setNuevo((actual) => ({ ...actual, codigo: event.target.value.toLowerCase().replace(/[^a-z0-9_]/g, "_") }))} /></label>
          <label className="admin-form-field admin-form-field--full"><span>Descripción</span><textarea rows={3} value={nuevo.descripcion ?? ""} onChange={(event) => setNuevo((actual) => ({ ...actual, descripcion: event.target.value }))} /></label>
          <label className="admin-form-field admin-form-field--full"><span>Criterio</span><select value={nuevo.codigo_criterio} onChange={(event) => setNuevo((actual) => ({ ...actual, codigo_criterio: event.target.value }))}>{criteriosLogro.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}</select></label>
          <label className="admin-form-field"><span>Meta</span><input type="number" min={1} value={nuevo.valor_criterio ?? 1} onChange={(event) => setNuevo((actual) => ({ ...actual, valor_criterio: Number(event.target.value) }))} /></label>
          <label className="admin-form-field"><span>Bono XP</span><input type="number" min={0} value={nuevo.bono_xp} onChange={(event) => setNuevo((actual) => ({ ...actual, bono_xp: Number(event.target.value) }))} /></label>
          <button type="submit" className="admin-extra-primary admin-form-field--full" disabled={crearMutation.isPending}><Sparkles size={18} /> Crear logro</button>
        </form>
      </aside>
    </div>
  );
}

function LogroRow({ logro, onSaved }: { logro: LogroAdmin; onSaved: () => void }) {
  const [form, setForm] = useState(logro);
  useEffect(() => setForm(logro), [logro]);
  const mutation = useMutation({ mutationFn: () => actualizarLogroAdmin(logro.id, form), onSuccess: async () => { toast.success("Logro actualizado"); await onSaved(); }, onError: (error) => toast.error(error instanceof Error ? error.message : "No se pudo actualizar") });
  return (
    <div className="admin-achievement-row">
      <div><strong>{form.nombre}</strong><p className="m-0 text-sm text-slate-500">{form.codigo} · {form.codigo_criterio}</p></div>
      <input className="rounded-xl border border-slate-200 px-3 py-2" type="number" min={1} value={form.valor_criterio ?? 1} onChange={(event) => setForm((actual) => ({ ...actual, valor_criterio: Number(event.target.value) }))} aria-label={`Meta de ${logro.nombre}`} />
      <input className="rounded-xl border border-slate-200 px-3 py-2" type="number" min={0} value={form.bono_xp} onChange={(event) => setForm((actual) => ({ ...actual, bono_xp: Number(event.target.value) }))} aria-label={`Bono XP de ${logro.nombre}`} />
      <div className="flex items-center gap-2"><label className="text-sm font-semibold"><input type="checkbox" className="mr-1" checked={form.activo} onChange={(event) => setForm((actual) => ({ ...actual, activo: event.target.checked }))} />Activo</label><button type="button" className="admin-icon-button" onClick={() => mutation.mutate()} disabled={mutation.isPending}><Save size={17} /></button></div>
    </div>
  );
}

const criteriosLogro = [
  { value: "temas_completados", label: "Temas completados" },
  { value: "actividades_completadas", label: "Actividades completadas" },
  { value: "dias_racha", label: "Días de racha" },
  { value: "xp_total", label: "XP total" },
];

function TabButton({ active, onClick, icon, label }: { active: boolean; onClick: () => void; icon: ReactNode; label: string }) {
  return <button type="button" className={active ? "admin-extra-primary" : "admin-extra-secondary"} onClick={onClick}>{icon}{label}</button>;
}
function Loading({ label }: { label: string }) { return <div className="admin-extra-loading"><LoaderCircle className="animate-spin" /><span>{label}</span></div>; }
function ErrorState({ onRetry }: { onRetry: () => void }) { return <div className="admin-extra-empty"><h3>No se pudo cargar la configuración</h3><button className="admin-extra-primary" type="button" onClick={onRetry}>Reintentar</button></div>; }
function formatoEntrada(valor: unknown) { return typeof valor === "string" ? valor : typeof valor === "number" || typeof valor === "boolean" ? String(valor) : JSON.stringify(valor); }
function interpretarValor(valor: string, original: unknown): unknown { if (typeof original === "boolean") return valor === "true"; if (typeof original === "number") return Number(valor); if (typeof original === "object") { try { return JSON.parse(valor); } catch { return valor; } } return valor; }
function nombreCategoria(categoria: string) { return ({ general: "Plataforma", plataforma: "Plataforma", gamificacion: "Gamificación", media: "Archivos y medios", contenido: "Contenido" } as Record<string, string>)[categoria] ?? categoria; }
function descripcionCategoria(categoria: string) { return ({ general: "Identidad y comportamiento global.", plataforma: "Disponibilidad y operación general.", gamificacion: "Reglas que condicionan la entrega de recompensas.", media: "Límites de carga y almacenamiento.", contenido: "Configuración del catálogo editorial." } as Record<string, string>)[categoria] ?? "Configuración administrable."; }
