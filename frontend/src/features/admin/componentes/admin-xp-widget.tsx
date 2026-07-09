export function AdminXpWidget() {
  return (
    <div className="bg-white rounded-3xl border border-slate-100 p-5 shadow-sm flex flex-col text-left">
      <div className="flex items-center justify-between">
        <h3 className="font-extrabold text-slate-800 text-sm">XP promedio por actividad</h3>
        <span className="inline-flex px-2 py-0.5 rounded-full text-[10px] font-black bg-[#eefcf4] text-[#2e9e5b]">
          +18 XP
        </span>
      </div>
      <p className="text-[11px] text-slate-400 mt-1">Sigue creando actividades que motiven y desafíen a los niños.</p>

      <div className="flex items-end justify-end gap-1.5 h-10 mt-4 select-none pr-2">
        <div className="w-2.5 bg-slate-100 rounded-sm h-[35%]" />
        <div className="w-2.5 bg-slate-100 rounded-sm h-[60%]" />
        <div className="w-2.5 bg-slate-200 rounded-sm h-[45%]" />
        <div className="w-2.5 bg-slate-100 rounded-sm h-[80%]" />
        <div className="w-2.5 bg-slate-300 rounded-sm h-[100%]" />
      </div>
    </div>
  );
}
