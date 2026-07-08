export function TabConfig() {
  return (
    <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm flex flex-col gap-5 text-left">
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-bold text-slate-700">Visibilidad</label>
        <div className="relative">
          <select className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-[13px] font-semibold text-slate-700 appearance-none focus:border-[#2e9e5b] focus:outline-hidden cursor-pointer">
            <option value="publico">Público</option>
            <option value="privado">Privado</option>
          </select>
          <i className="fa-solid fa-chevron-down absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 text-[10px] pointer-events-none" />
        </div>
        <span className="text-[10px] text-slate-400 font-bold">Controla quién puede ver este tema.</span>
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-bold text-slate-700">Fecha de programación</label>
        <input
          type="date"
          className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-[13px] font-semibold text-slate-800 focus:border-[#2e9e5b] focus:outline-hidden transition-all"
        />
        <span className="text-[10px] text-slate-400 font-bold">Fecha en la que el tema se publicará automáticamente.</span>
      </div>
    </div>
  );
}
