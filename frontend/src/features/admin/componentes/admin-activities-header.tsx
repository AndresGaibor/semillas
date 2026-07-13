import { BookOpenCheck, Plus } from "lucide-react";
import { useState } from "react";
import { NuevaActividadDialog } from "./nueva-actividad-dialog";

export function AdminActivitiesHeader() {
  const [showDialog, setShowDialog] = useState(false);

  return (
    <>
      <div className="relative overflow-hidden rounded-3xl border border-emerald-100 bg-white p-5 text-left shadow-sm sm:p-7">
        <div className="absolute -right-12 -top-12 h-40 w-40 rounded-full bg-emerald-100/70 blur-2xl" aria-hidden="true" />
        <div className="relative flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex items-start gap-4">
            <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-emerald-950 text-emerald-100 shadow-lg shadow-emerald-950/15"><BookOpenCheck size={23} aria-hidden="true" /></div>
            <div>
              <span className="text-[11px] font-black uppercase tracking-[0.16em] text-emerald-700">Biblioteca editorial</span>
              <h2 className="mt-1 text-2xl font-black tracking-tight text-slate-900">Actividades</h2>
              <p className="mt-1 max-w-xl text-sm leading-6 text-slate-500">Diseña, revisa y conecta experiencias de aprendizaje con cada tema y franja.</p>
            </div>
          </div>
          <button type="button" onClick={() => setShowDialog(true)} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-green-brote px-5 text-sm font-bold text-white shadow-lg shadow-green-700/15 transition-colors hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-600 focus-visible:ring-offset-2">
            <Plus size={17} aria-hidden="true" /> Nueva actividad
          </button>
        </div>
      </div>

      {showDialog && <NuevaActividadDialog onClose={() => setShowDialog(false)} />}
    </>
  );
}
