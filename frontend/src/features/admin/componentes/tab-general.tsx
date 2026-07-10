import { TagInput } from "./TagInput";
import { Boton } from "@/componentes/ui/boton";
import { Card } from "@/componentes/ui/card-base";
import { Field } from "./Field";
import { ThemePreviewCard } from "./ThemePreviewCard";

type TabGeneralProps = {
  title: string;
  onTitleChange: (v: string) => void;
  targetAudience: string;
  onTargetAudienceChange: (v: string) => void;
  shortDesc: string;
  onShortDescChange: (v: string) => void;
  category: string;
  onCategoryChange: (v: string) => void;
  keyVerse: string;
  onKeyVerseChange: (v: string) => void;
  duration: number;
  onDurationChange: (v: number) => void;
  mainMessage: string;
  onMainMessageChange: (v: string) => void;
  tagsList: string[];
  onTagsChange: (v: string[]) => void;
  previewImageUrl?: string | null;
};

export function TabGeneral({
  title,
  onTitleChange,
  targetAudience,
  onTargetAudienceChange,
  shortDesc,
  onShortDescChange,
  category,
  onCategoryChange,
  keyVerse,
  onKeyVerseChange,
  duration,
  onDurationChange,
  mainMessage,
  onMainMessageChange,
  tagsList,
  onTagsChange,
  previewImageUrl,
}: TabGeneralProps) {
  return (
    <>
      <Card sombra="sm" className="p-6 flex flex-col gap-5 text-left">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field
            label="Título del tema"
            required
            help="El título es como se mostrará en la plataforma."
          >
            <div className="relative">
              <input
                type="text"
                value={title}
                onChange={(e) => onTitleChange(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-[13px] font-semibold text-slate-800 placeholder-slate-400 focus:border-green-600 focus:outline-hidden focus:ring-2 focus:ring-green-600/10 transition-all"
              />
            </div>
          </Field>

          <Field
            label="Público objetivo"
            required
            help="Selecciona el grupo de edad principal."
          >
            <div className="relative">
              <select
                value={targetAudience}
                onChange={(e) => onTargetAudienceChange(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-[13px] font-semibold text-slate-700 appearance-none focus:border-green-600 focus:outline-hidden cursor-pointer"
              >
                <option value="Niños de 6 a 10 años">Niños de 6 a 10 años</option>
                <option value="Adolescentes de 11 a 15 años">Adolescentes de 11 a 15 años</option>
              </select>
              <i className="fa-solid fa-chevron-down absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 text-[10px] pointer-events-none" />
            </div>
          </Field>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="Descripción corta" required help="Máximo 120 caracteres.">
            <textarea
              value={shortDesc}
              onChange={(e) => onShortDescChange(e.target.value)}
              maxLength={120}
              rows={3}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-[13px] font-semibold text-slate-800 focus:border-green-600 focus:outline-hidden transition-all resize-none"
            />
          </Field>

          <Field label="Categoría" required help="Selecciona la categoría principal del tema.">
            <div className="relative">
              <select className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-[13px] font-semibold text-slate-700 appearance-none focus:border-green-600 focus:outline-hidden cursor-pointer">
                <option value="confianza">Confianza en Dios</option>
              </select>
              <i className="fa-solid fa-chevron-down absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 text-[10px] pointer-events-none" />

              <div className="flex flex-wrap gap-1.5 mt-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-violet-200 bg-violet-50 text-[11px] font-extrabold text-violet-600">
                  {category}
                  <Boton
                    variante="texto"
                    tamano="iconoPequeno"
                    onClick={() => onCategoryChange("")}
                    clase="hover:text-red-500"
                  >
                    <i className="fa-solid fa-xmark text-[9px]" />
                  </Boton>
                </span>
              </div>
            </div>
          </Field>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="Versículo clave" required help="Versículo principal que memorizarán los niños.">
            <input
              type="text"
              value={keyVerse}
              onChange={(e) => onKeyVerseChange(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-[13px] font-semibold text-slate-800 focus:border-green-600 focus:outline-hidden transition-all"
            />
          </Field>

          <Field label="Duración estimada" required help="Tiempo aproximado para completar el tema.">
            <div className="relative flex items-center">
              <input
                type="number"
                value={duration}
                onChange={(e) => onDurationChange(Number(e.target.value))}
                className="w-full pl-4 pr-16 py-2.5 rounded-xl border border-slate-200 bg-white text-[13px] font-semibold text-slate-800 focus:border-green-600 focus:outline-hidden transition-all"
              />
              <span className="absolute right-4 text-[11px] text-slate-400 font-bold">minutos</span>
            </div>
          </Field>
        </div>

        <Field label="Mensaje central" required help="El mensaje principal que los niños deben recordar.">
          <textarea
            value={mainMessage}
            onChange={(e) => onMainMessageChange(e.target.value)}
            rows={3}
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-[13px] font-semibold text-slate-800 focus:border-green-600 focus:outline-hidden transition-all resize-none"
          />
        </Field>

        <TagInput tags={tagsList} onChange={onTagsChange} />
      </Card>

      <Card sombra="sm" className="p-6 flex flex-col gap-4 text-left">
        <div className="flex justify-between items-center select-none">
          <div>
            <h3 className="font-extrabold text-slate-800 text-sm md:text-base">Vista previa rápida</h3>
            <p className="text-[12px] text-slate-400 mt-1 font-medium">Así se verá tu tema para los niños.</p>
          </div>

          <Boton variante="texto" tamano="pequeno" forma="pildora" iconoIzquierdo={<i className="fa-solid fa-eye text-[11px]" />}>
            Ver vista previa
          </Boton>
        </div>

        <ThemePreviewCard
          title={title}
          category={category}
          targetAudience={targetAudience}
          shortDesc={shortDesc}
          mainMessage={mainMessage}
          keyVerse={keyVerse}
          duration={duration}
          previewImageUrl={previewImageUrl}
        />
      </Card>
    </>
  );
}
