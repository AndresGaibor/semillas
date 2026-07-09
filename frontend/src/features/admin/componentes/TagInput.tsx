import { useState } from "react";

type TagInputProps = {
  tags: string[];
  onChange: (tags: string[]) => void;
};

export function TagInput({ tags, onChange }: TagInputProps) {
  const [input, setInput] = useState("");

  const handleAdd = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && input.trim()) {
      e.preventDefault();
      if (!tags.includes(input.trim())) {
        onChange([...tags, input.trim()]);
      }
      setInput("");
    }
  };

  const removeTag = (idx: number) => {
    onChange(tags.filter((_, i) => i !== idx));
  };

  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-bold text-slate-700">Etiquetas</label>
      <div className="flex flex-col gap-2">
        <div className="flex flex-wrap gap-1.5 p-1 rounded-xl border border-slate-200 bg-white items-center min-h-[42px] px-3 focus-within:border-[#2e9e5b] focus-within:ring-2 focus-within:ring-[#2e9e5b]/10 transition-all">
          {tags.map((tag, idx) => (
            <span key={idx} className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-slate-100 bg-[#6c3aed]/5 text-[11px] font-extrabold text-[#6c3aed]">
              {tag}
              <button type="button" onClick={() => removeTag(idx)} className="hover:text-red-500">
                <i className="fa-solid fa-xmark text-[9px]" />
              </button>
            </span>
          ))}
          <input
            type="text"
            placeholder="Agregar etiqueta..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleAdd}
            className="flex-1 min-w-[100px] border-none bg-transparent outline-none py-1 text-[13px] font-semibold text-slate-800"
          />
        </div>
        <span className="text-[10px] text-slate-400 font-bold">Añade etiquetas para facilitar la búsqueda.</span>
      </div>
    </div>
  );
}
