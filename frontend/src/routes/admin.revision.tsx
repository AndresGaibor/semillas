import { createFileRoute, Link } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { CheckCircle2, Clock3, Eye, Loader2, MessageSquareWarning, RefreshCw, ShieldCheck, XCircle } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { obtenerResumenAdminDetallado, resolverRevisionTema } from "../features/admin/admin.api";

export const Route = createFileRoute("/admin/revision")({ component: AdminRevisionPage });

function AdminRevisionPage() {
  const queryClient = useQueryClient();
  const [notes, setNotes] = useState<Record<string, string>>({});
  const query = useQuery({ queryKey: ["admin", "dashboard", "detallado"], queryFn: obtenerResumenAdminDetallado });
  const mutation = useMutation({
    mutationFn: ({ themeId, status }: { themeId: string; status: "aprobado" | "cambios_solicitados" | "rechazado" }) => resolverRevisionTema(themeId, status, notes[themeId]),
    onSuccess: async () => { await queryClient.invalidateQueries({ queryKey: ["admin"] }); toast.success("Revisión actualizada"); },
    onError: (error) => toast.error(error instanceof Error ? error.message : "No se pudo resolver la revisión"),
  });

  return (
    <div className="admin-theme-library">
      <section className="admin-theme-library__hero"><div><span className="admin-eyebrow">Control editorial</span><h2>Revisión de contenido</h2><p>Aprueba, solicita cambios o rechaza temas completos antes de publicarlos.</p></div><button type="button" className="admin-secondary-button" onClick={() => query.refetch()}><RefreshCw size={17} /> Actualizar</button></section>

      {query.isLoading ? <div className="admin-dashboard-state"><span><Loader2 className="animate-spin" /></span><h2>Cargando revisiones</h2><p>Consultando la cola editorial.</p></div> : query.isError ? <div className="admin-dashboard-state"><span><ShieldCheck /></span><h2>No se pudo cargar la cola</h2><p>{query.error instanceof Error ? query.error.message : "Vuelve a intentarlo."}</p></div> : !query.data?.revisiones.length ? <div className="admin-dashboard-state"><span><CheckCircle2 /></span><h2>Todo está al día</h2><p>No hay temas pendientes de revisión.</p></div> : (
        <div className="grid gap-4">
          {query.data.revisiones.map((revision) => (
            <article key={revision.id} className="admin-editor-section">
              <div className="grid grid-cols-[minmax(0,1fr)_340px] gap-6">
                <div>
                  <div className="flex items-center gap-3"><span className="grid h-11 w-11 place-items-center rounded-2xl bg-violet-50 text-violet-600"><Clock3 size={19} /></span><div><span className="admin-eyebrow">{revision.senda}</span><h2 className="mt-1 text-xl font-black text-emerald-50">{revision.titulo}</h2></div></div>
                  <p className="mt-4 text-sm leading-7 text-emerald-200/70">Enviado por <strong>{revision.enviado_por}</strong>. {revision.notas || "El autor no agregó notas."}</p>
                  <div className="mt-5 flex gap-2"><Link to="/admin/temas/$themeId/preview" params={{ themeId: revision.tema_id }} className="admin-secondary-button"><Eye size={16} /> Vista previa</Link><Link to="/admin/temas/$themeId/detalle" params={{ themeId: revision.tema_id }} className="admin-secondary-button"><ShieldCheck size={16} /> Abrir estudio</Link></div>
                </div>
                <div className="rounded-3xl bg-[#0d1f17] p-4"><label className="admin-field"><span>Notas de revisión</span><textarea rows={4} value={notes[revision.tema_id] ?? ""} onChange={(event) => setNotes((current) => ({ ...current, [revision.tema_id]: event.target.value }))} placeholder="Explica los cambios solicitados o la razón de la decisión..." /></label><div className="mt-3 grid grid-cols-3 gap-2"><button type="button" disabled={mutation.isPending} className="inline-flex items-center justify-center gap-1 rounded-xl bg-emerald-600 px-3 py-2 text-xs font-bold text-white" onClick={() => mutation.mutate({ themeId: revision.tema_id, status: "aprobado" })}><CheckCircle2 size={15} /> Aprobar</button><button type="button" disabled={mutation.isPending} className="inline-flex items-center justify-center gap-1 rounded-xl bg-amber-500 px-3 py-2 text-xs font-bold text-white" onClick={() => mutation.mutate({ themeId: revision.tema_id, status: "cambios_solicitados" })}><MessageSquareWarning size={15} /> Cambios</button><button type="button" disabled={mutation.isPending} className="inline-flex items-center justify-center gap-1 rounded-xl bg-red-600 px-3 py-2 text-xs font-bold text-white" onClick={() => mutation.mutate({ themeId: revision.tema_id, status: "rechazado" })}><XCircle size={15} /> Rechazar</button></div></div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
