type AdminMediaHeaderProps = {
  onSubirRecurso: () => void;
};

export function AdminMediaHeader({ onSubirRecurso }: AdminMediaHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white rounded-3xl border border-slate-100 p-6 shadow-sm text-left">
      <div className="flex items-center gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#eefcf4] text-[#2e9e5b]">
          <i className="fa-solid fa-photo-film text-xl" />
        </div>
        <div>
          <h2 className="text-2xl font-black text-slate-800">Medios</h2>
          <p className="mt-1 text-xs text-slate-500 sm:text-sm">Gestiona los recursos multimedia de la plataforma.</p>
        </div>
      </div>

      <div className="flex items-center">
        <div className="flex h-[42px] overflow-hidden rounded-xl shadow-xs">
          <button
            type="button"
            onClick={onSubirRecurso}
            className="!bg-verde-brote hover:opacity-90 !text-white px-5 font-bold text-sm flex items-center gap-2 transition-colors h-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2e9e5b] focus-visible:ring-offset-2 focus-visible:ring-offset-white cursor-pointer"
          >
            <i className="fa-solid fa-plus text-[10px]" />
            Subir recurso
          </button>
        </div>
      </div>
    </div>
  );
}
