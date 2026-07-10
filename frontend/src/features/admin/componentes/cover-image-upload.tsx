export function CoverImageUpload() {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-bold text-slate-700">
        Portada del tema <span className="text-red-500">*</span>
      </label>
      <span className="text-[11px] text-slate-400 font-semibold mb-1">
        Imagen que representara el tema en la plataforma.
      </span>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2 border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center p-6 text-center bg-slate-50/50 hover:bg-slate-50 hover:border-[#2e9e5b]/40 transition-colors cursor-pointer">
          <div className="w-10 h-10 rounded-xl bg-white border border-slate-100 flex items-center justify-center text-slate-400 shadow-xs mb-3">
            <i className="fa-regular fa-image text-lg" />
          </div>
          <span className="text-xs font-extrabold text-slate-700">
            Arrastra y suelta una imagen aqui
          </span>
          <span className="text-[10px] text-slate-400 font-bold mt-1">
            o haz clic para seleccionar
          </span>
          <span className="text-[9.5px] text-slate-400 font-semibold mt-3 select-none">
            Recomendado: 16:9 (1920x1080px) - JPG o PNG - Max. 2MB
          </span>
        </div>

        <div className="bg-[#6c3aed]/5 border border-[#6c3aed]/10 rounded-2xl p-5 flex flex-col text-left">
          <div className="w-7 h-7 rounded-lg bg-[#6c3aed]/10 text-[#6c3aed] flex items-center justify-center shrink-0 mb-3">
            <i className="fa-solid fa-lightbulb text-xs" />
          </div>
          <span className="text-[11.5px] font-bold text-[#6c3aed] leading-relaxed">
            Consejo
          </span>
          <p className="text-[11.5px] font-semibold text-[#6c3aed]/70 leading-relaxed mt-1">
            Usa imagenes coloridas y significativas que conecten con el mensaje del tema.
          </p>
        </div>
      </div>
    </div>
  );
}
