interface AdminTemasNewHeaderProps {
  onBack: () => void;
}

export function AdminTemasNewHeader({ onBack }: AdminTemasNewHeaderProps) {
  return (
    <button
      onClick={onBack}
      className="flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-slate-600 transition-colors bg-white border border-slate-100 px-3 py-1.5 rounded-full w-max select-none cursor-pointer"
    >
      <i className="fa-solid fa-arrow-left text-[10px]" />
      Volver a temas
    </button>
  );
}
