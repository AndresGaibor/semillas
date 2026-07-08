export function TabPublicacion() {
  return (
    <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm flex flex-col gap-5 text-left">
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-bold text-slate-700">Estado de publicación</label>
        <div className="flex items-center gap-3 p-3 rounded-xl bg-emerald-50 border border-emerald-100">
          <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
          <div>
            <p className="text-xs font-bold text-emerald-700">Publicado</p>
            <p className="text-[10px] text-emerald-600">Visible para todos los usuarios.</p>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-bold text-slate-700">Notas de revisión</label>
        <textarea
          rows={3}
          placeholder="Agrega notas para el revisor..."
          className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-[13px] font-semibold text-slate-800 placeholder-slate-400 focus:border-[#2e9e5b] focus:outline-hidden transition-all resize-none"
        />
        <span className="text-[10px] text-slate-400 font-bold">Notas internas para el equipo de revisión.</span>
      </div>
    </div>
  );
}
