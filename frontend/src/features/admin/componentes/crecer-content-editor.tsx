import type { ReactNode } from "react";
import { Save, Loader, Check } from "lucide-react";

interface CrecerStepInfo {
  id: string;
  codigo: string;
  nombre: string;
}

interface AgeGroupInfo {
  id: string;
  nombre?: string | null;
}

interface ActiveStepContent {
  titulo?: string | null;
  cuerpo?: string | null;
  instruccion_corta?: string | null;
}

interface CrecerContentEditorProps {
  activeStep: CrecerStepInfo | undefined;
  selectedAgeGroup: AgeGroupInfo | null;
  title: string;
  body: string;
  shortInstruction: string;
  onTitleChange: (v: string) => void;
  onBodyChange: (v: string) => void;
  onShortInstructionChange: (v: string) => void;
  onSave: () => void;
  isPending: boolean;
  isSuccess: boolean;
}

export function CrecerContentEditor({
  activeStep,
  selectedAgeGroup,
  title,
  body,
  shortInstruction,
  onTitleChange,
  onBodyChange,
  onShortInstructionChange,
  onSave,
  isPending,
  isSuccess,
}: CrecerContentEditorProps) {
  return (
    <section className="rounded-[1.75rem] border border-slate-100 bg-white p-5 shadow-sm sm:p-6">
      <div className="flex items-start gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#eefcf4] text-[#2e9e5b]">
          <Save size={18} />
        </div>
        <div className="min-w-0 flex-1">
          <h2 className="text-lg font-black text-slate-800">Editor de contenido</h2>
          <p className="mt-1 text-sm leading-6 text-slate-500">
            {activeStep?.nombre ?? "Paso CRECER"} · {selectedAgeGroup?.nombre ?? "Franja"}
          </p>
        </div>
      </div>

      <div className="mt-5 grid gap-4">
        <Field label="Título" help="Nombre visible del contenido para esta franja.">
          <input
            value={title}
            onChange={(e) => onTitleChange(e.target.value)}
            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-800 outline-none transition-colors focus:border-[#2e9e5b]"
            placeholder={activeStep?.nombre ?? "Título del bloque"}
          />
        </Field>

        <Field label="Contenido" help="Usa Markdown simple y párrafos cortos para que sea fácil de leer en móvil.">
          <textarea
            value={body}
            onChange={(e) => onBodyChange(e.target.value)}
            rows={10}
            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm leading-7 text-slate-700 outline-none transition-colors focus:border-[#2e9e5b]"
            placeholder="Escribe el contenido aquí..."
          />
        </Field>

        <Field label="Instrucción corta" help="Una frase breve para guiar la actividad o reflexión.">
          <input
            value={shortInstruction}
            onChange={(e) => onShortInstructionChange(e.target.value)}
            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-800 outline-none transition-colors focus:border-[#2e9e5b]"
            placeholder="Breve instrucción para el niño"
          />
        </Field>

        <div className="flex flex-wrap items-center gap-3 pt-2">
          <button
            type="button"
            onClick={onSave}
            disabled={isPending}
            className="inline-flex items-center gap-2 rounded-2xl bg-[#2e9e5b] px-5 py-3 text-sm font-bold text-white transition-colors hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isPending ? <Loader className="animate-spin" size={18} /> : <Save size={18} />}
            {isPending ? "Guardando..." : `Guardar ${activeStep?.nombre ?? "paso"}`}
          </button>

          {isSuccess ? (
            <span className="inline-flex items-center gap-2 rounded-full bg-[#eefcf4] px-3 py-2 text-sm font-semibold text-[#2e9e5b]">
              <Check size={16} />
              Guardado
            </span>
          ) : null}
        </div>
      </div>
    </section>
  );
}

function Field({ label, help, children }: { label: string; help: string; children: ReactNode }) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">{label}</span>
      {children}
      <span className="text-[10px] font-semibold leading-5 text-slate-400">{help}</span>
    </label>
  );
}
