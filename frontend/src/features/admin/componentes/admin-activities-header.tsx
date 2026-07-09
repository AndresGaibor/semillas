import { useState } from "react";
import { NuevaActividadDialog } from "./nueva-actividad-dialog";

export function AdminActivitiesHeader() {
  const [showDialog, setShowDialog] = useState(false);

  return (
    <>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white rounded-3xl border border-slate-100 p-6 shadow-sm text-left">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-100">
            <i className="fa-solid fa-pen-to-square text-2xl text-orange-500" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-slate-800">Actividades</h2>
            <p className="text-xs text-slate-500 mt-1 sm:text-sm">Crea, administra y organiza actividades para fortalecer el aprendizaje en cada tema.</p>
          </div>
        </div>
        <div className="flex items-center">
          <div className="flex rounded-xl overflow-hidden shadow-xs h-[42px]">
            <button
              onClick={() => setShowDialog(true)}
              className="!bg-verde-brote hover:opacity-90 !text-white px-5 font-bold text-sm flex items-center gap-2 transition-colors h-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2e9e5b] focus-visible:ring-offset-2 focus-visible:ring-offset-white cursor-pointer"
            >
              <i className="fa-solid fa-plus text-[10px]" />
              Nueva actividad
            </button>
          </div>
        </div>
      </div>

      {showDialog && <NuevaActividadDialog onClose={() => setShowDialog(false)} />}
    </>
  );
}
