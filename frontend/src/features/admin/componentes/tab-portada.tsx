export function TabPortada() {
  return (
    <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm flex flex-col gap-5 text-left">
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-bold text-slate-700">Imagen de portada <span className="text-red-500">*</span></label>
        <div className="w-full h-40 rounded-xl border-2 border-dashed border-slate-200 bg-slate-50/50 flex items-center justify-center cursor-pointer hover:border-[#2e9e5b] transition-colors">
          <div className="flex flex-col items-center gap-2">
            <i className="fa-regular fa-image text-2xl text-slate-300" />
            <span className="text-xs font-bold text-slate-400">Haz clic para subir una imagen</span>
          </div>
        </div>
        <span className="text-[10px] text-slate-400 font-bold">Recomendado: 1200x630px, formato JPG o PNG.</span>
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-bold text-slate-700">Color de fondo</label>
        <div className="flex gap-3">
          {["#2e9e5b", "#3D8BD4", "#E9A23B", "#17A398", "#EE6C4D", "#123B2C"].map((color) => (
            <button
              key={color}
              type="button"
              className="w-8 h-8 rounded-full border-2 border-slate-100 hover:scale-110 transition-transform cursor-pointer"
              style={{ backgroundColor: color }}
            />
          ))}
        </div>
        <span className="text-[10px] text-slate-400 font-bold">Color de fondo para la tarjeta del tema.</span>
      </div>
    </div>
  );
}
