import type { UseFormRegister } from "react-hook-form";
import type { CrearTemaSolicitud } from "../admin.api";
import type { Senda, GrupoEdad } from "@/shared/api/api";
import { Input } from "@/componentes/ui/input-base";
import { SelectFiltro } from "@/componentes/ui/select-filtro";
import { TagInput } from "./TagInput";
import { ClubVisibilitySelector, type ClubVisibilidades } from "./club-visibility-selector";
import { CoverImageUpload } from "./cover-image-upload";

interface PasoInformacionGeneralProps {
  register: UseFormRegister<CrearTemaSolicitud>;
  sendas?: Senda[];
  gruposEdad?: GrupoEdad[];
  bibleVersions?: Array<{
    id: string;
    codigo: string;
    nombre: string;
    dominio_publico: boolean;
  }>;
  liveTitle: string;
  tagsInput: string;
  onTagsInputChange: (value: string) => void;
  tagsList: string[];
  onAddTag: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  onRemoveTag: (idx: number) => void;
  clubVisibilities: ClubVisibilidades;
  onClubVisibilitiesChange: React.Dispatch<React.SetStateAction<ClubVisibilidades>>;
  onSlugManualEdit?: () => void;
}

export function PasoInformacionGeneral({
  register,
  sendas,
  gruposEdad,
  bibleVersions,
  liveTitle,
  tagsInput,
  onTagsInputChange,
  tagsList,
  onAddTag,
  onRemoveTag,
  clubVisibilities,
  onClubVisibilitiesChange,
  onSlugManualEdit,
}: PasoInformacionGeneralProps) {
  return (
    <>
      <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm flex flex-col gap-5 text-left">
        <div>
          <h3 className="font-extrabold text-slate-800 text-sm md:text-base">Informacion del tema</h3>
          <p className="text-[12px] text-slate-400 mt-1 font-medium">Completa los datos basicos para crear el nuevo tema.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-700">Titulo del tema <span className="text-red-500">*</span></label>
            <div className="relative">
              <Input
                {...register("titulo", { required: true })}
                maxLength={100}
                placeholder="Ej. Dios cuida de mi"
                className="pr-12 text-[13px] font-semibold !text-slate-800 placeholder:!text-slate-400 focus:!border-[#2e9e5b] focus:!ring-[#2e9e5b]/10"
              />
              <span className="absolute right-3 bottom-2.5 text-[10px] text-slate-400 font-bold">
                {liveTitle.length === 16 ? 0 : liveTitle.length}/100
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-700">Slug (identificador) <span className="text-red-500">*</span></label>
            <Input
              {...register("slug", { required: true })}
              onFocus={() => onSlugManualEdit?.()}
              placeholder="ej. dios-cuida-de-mi"
              className="text-[13px] font-semibold !text-slate-800 placeholder:!text-slate-400 focus:!border-[#2e9e5b] focus:!ring-[#2e9e5b]/10"
            />
            <span className="text-[10px] text-slate-450 font-bold mt-0.5 leading-relaxed">
              Se usara en la URL. Solo minusculas, numeros y guiones.
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-700">Senda <span className="text-red-500">*</span></label>
            <SelectFiltro
              opciones={sendas ?? []}
              placeholder="Selecciona una senda"
              etiquetaAria="Seleccionar saura"
              variante="cuadrado"
              {...register("senda_id", { required: true })}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-700">Franja de edad <span className="text-red-500">*</span></label>
            <div className="flex flex-wrap gap-2 mt-1">
              {gruposEdad?.map((g) => (
                <label key={g.id} className="flex items-center gap-2 px-3 py-2 rounded-xl border border-slate-200 bg-white text-[13px] font-semibold text-slate-700 hover:border-[#2e9e5b]/40 transition-colors cursor-pointer has-[:checked]:border-[#2e9e5b] has-[:checked]:bg-[#eefcf4]">
                  <input
                    type="checkbox"
                    value={g.id}
                    {...register("grupo_edad_ids", { required: true })}
                    className="rounded border-slate-300 text-[#2e9e5b] focus:ring-[#2e9e5b] cursor-pointer"
                  />
                  {g.nombre} ({g.edad_minima}-{g.edad_maxima} años)
                </label>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-700">Objetivo del tema <span className="text-red-500">*</span></label>
            <div className="relative">
              <textarea
                {...register("objetivo", { required: true })}
                maxLength={200}
                rows={3}
                placeholder="Ej. Que los ninos comprendan que Dios siempre cuida de ellos."
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-[13px] font-semibold text-slate-800 placeholder-slate-400 focus:border-[#2e9e5b] focus:outline-hidden focus:ring-2 focus:ring-[#2e9e5b]/10 transition-all resize-none"
              />
              <span className="absolute right-3 bottom-2.5 text-[10px] text-slate-400 font-bold">
                0/200
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-700">Resumen <span className="text-red-500">*</span></label>
            <div className="relative">
              <textarea
                {...register("resumen", { required: true })}
                maxLength={400}
                rows={3}
                placeholder="Breve descripcion del tema y lo que aprenderan los ninos."
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-[13px] font-semibold text-slate-800 placeholder-slate-400 focus:border-[#2e9e5b] focus:outline-hidden focus:ring-2 focus:ring-[#2e9e5b]/10 transition-all resize-none"
              />
              <span className="absolute right-3 bottom-2.5 text-[10px] text-slate-400 font-bold">
                0/400
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-700">Duracion estimada <span className="text-red-500">*</span></label>
            <div className="relative flex items-center">
              <input
                type="number"
                {...register("minutos_estimados", { required: true })}
                className="w-full pl-4 pr-16 py-2.5 rounded-xl border border-slate-200 bg-white text-[13px] font-semibold text-slate-800 focus:border-[#2e9e5b] focus:outline-hidden transition-all"
              />
              <span className="absolute right-4 text-[11px] text-slate-400 font-bold">minutos</span>
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-700">XP que otorga <span className="text-red-500">*</span></label>
            <div className="relative flex items-center">
              <input
                type="number"
                {...register("xp_recompensa", { required: true })}
                className="w-full pl-4 pr-10 py-2.5 rounded-xl border border-slate-200 bg-white text-[13px] font-semibold text-slate-800 focus:border-[#2e9e5b] focus:outline-hidden transition-all"
              />
              <span className="absolute right-4 text-[11px] text-slate-400 font-bold">XP</span>
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-700">Version biblica <span className="text-red-500">*</span></label>
            <SelectFiltro
              opciones={bibleVersions ?? []}
              placeholder="Selecciona una version"
              etiquetaAria="Seleccionar version biblica"
              variante="cuadrado"
              {...register("version_biblica_id", { required: true })}
            />
          </div>
        </div>

        <CoverImageUpload />

        <TagInput
          tags={tagsList}
          onChange={() => {}}
          inputValue={tagsInput}
          onInputChange={onTagsInputChange}
          onAddTag={onAddTag}
          onRemoveTag={onRemoveTag}
          helperText="Escribe una etiqueta y presiona Enter. Ejemplos: amor, fe, oracion, obediencia, gratitud"
        />
      </div>

      <ClubVisibilitySelector
        clubVisibilities={clubVisibilities}
        onClubVisibilitiesChange={onClubVisibilitiesChange}
      />
    </>
  );
}
