export function AdminTipsWidget() {
  return (
    <div className="bg-white rounded-3xl border border-slate-100 p-5 shadow-sm flex flex-col text-left gap-4">
      <h3 className="font-extrabold text-slate-800 text-sm">Consejos rápidos</h3>

      <div className="flex gap-3">
        <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center shrink-0 mt-0.5">
          <i className="fa-solid fa-wand-magic-sparkles text-xs" />
        </div>
        <div className="flex flex-col text-left">
          <span className="font-extrabold text-slate-700 text-[12px]">Varía los tipos de actividades</span>
          <span className="text-[11px] text-slate-400 mt-0.5 leading-snug">Combina diferentes formatos para mantener el aprendizaje dinámico y entretenido.</span>
        </div>
      </div>

      <div className="flex gap-3">
        <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
          <i className="fa-solid fa-pen-nib text-xs" />
        </div>
        <div className="flex flex-col text-left">
          <span className="font-extrabold text-slate-700 text-[12px]">Alinea con la senda</span>
          <span className="text-[11px] text-slate-400 mt-0.5 leading-snug">Asegúrate de que cada actividad refuerce el tema y objetivo de la senda.</span>
        </div>
      </div>

      <div className="flex gap-3">
        <div className="w-8 h-8 rounded-full bg-orange-100 text-orange-700 flex items-center justify-center shrink-0 mt-0.5">
          <i className="fa-solid fa-puzzle-piece text-xs" />
        </div>
        <div className="flex flex-col text-left">
          <span className="font-extrabold text-slate-700 text-[12px]">Revisa antes de publicar</span>
          <span className="text-[11px] text-slate-400 mt-0.5 leading-snug">Una buena revisión garantiza claridad, precisión y una mejor experiencia para los niños.</span>
        </div>
      </div>

      <div className="mt-2 bg-[#eefcf4] rounded-2xl p-4 border border-[#e2f7ea] flex gap-3 text-left">
        <div className="w-7 h-7 rounded-full bg-[#2e9e5b]/10 flex items-center justify-center shrink-0 text-[#2e9e5b]">
          <i className="fa-solid fa-leaf text-xs" />
        </div>
        <p className="text-[11px] font-bold text-[#123b2c] leading-snug mt-0.5">
          Cada actividad es una semilla que fortalece la fe y el corazón de nuestros niños. 💚
        </p>
      </div>
    </div>
  );
}
