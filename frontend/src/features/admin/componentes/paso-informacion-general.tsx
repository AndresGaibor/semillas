import type { UseFormRegister } from "react-hook-form";
import type { CrearTemaSolicitud } from "../admin.api";
import type { Senda, GrupoEdad } from "@/shared/api/api";

interface ClubVisibilidades {
  todos: boolean;
  semillitas: boolean;
  guardianes: boolean;
  corazones: boolean;
  jovenes: boolean;
}

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
}: PasoInformacionGeneralProps) {
  return (
    <>
      {/* Informacion del tema */}
      <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm flex flex-col gap-5 text-left">
        <div>
          <h3 className="font-extrabold text-slate-800 text-sm md:text-base">Informacion del tema</h3>
          <p className="text-[12px] text-slate-400 mt-1 font-medium">Completa los datos basicos para crear el nuevo tema.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-700">Titulo del tema <span className="text-red-500">*</span></label>
            <div className="relative">
              <input
                {...register("titulo", { required: true })}
                maxLength={100}
                placeholder="Ej. Dios cuida de mi"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-[13px] font-semibold text-slate-800 placeholder-slate-400 focus:border-[#2e9e5b] focus:outline-hidden focus:ring-2 focus:ring-[#2e9e5b]/10 transition-all"
              />
              <span className="absolute right-3 bottom-2.5 text-[10px] text-slate-400 font-bold">
                {liveTitle.length === 16 ? 0 : liveTitle.length}/100
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-700">Slug (identificador) <span className="text-red-500">*</span></label>
            <input
              {...register("slug", { required: true })}
              placeholder="ej. dios-cuida-de-mi"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-[13px] font-semibold text-slate-800 placeholder-slate-400 focus:border-[#2e9e5b] focus:outline-hidden focus:ring-2 focus:ring-[#2e9e5b]/10 transition-all"
            />
            <span className="text-[10px] text-slate-450 font-bold mt-0.5 leading-relaxed">
              Se usara en la URL. Solo minusculas, numeros y guiones.
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-700">Senda <span className="text-red-500">*</span></label>
            <div className="relative">
              <select
                {...register("senda_id", { required: true })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-[13px] font-semibold text-slate-700 appearance-none focus:border-[#2e9e5b] focus:outline-hidden cursor-pointer"
              >
                <option value="">Selecciona una senda</option>
                {sendas?.map((s) => (
                  <option key={s.id} value={s.id}>{s.nombre}</option>
                ))}
              </select>
              <i className="fa-solid fa-chevron-down absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 text-[10px] pointer-events-none" />
            </div>
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
            <div className="relative">
              <select
                {...register("version_biblica_id", { required: true })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-[13px] font-semibold text-slate-700 appearance-none focus:border-[#2e9e5b] focus:outline-hidden cursor-pointer"
              >
                <option value="">Selecciona una version</option>
                {bibleVersions?.map((v) => (
                  <option key={v.id} value={v.id}>{v.codigo}</option>
                ))}
              </select>
              <i className="fa-solid fa-chevron-down absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 text-[10px] pointer-events-none" />
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-slate-700">Portada del tema <span className="text-red-500">*</span></label>
          <span className="text-[11px] text-slate-400 font-semibold mb-1">Imagen que representara el tema en la plataforma.</span>

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

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-slate-700">Etiquetas</label>
          <span className="text-[11px] text-slate-450 font-bold mb-1">Anade etiquetas que describan el contenido del tema.</span>

          <div className="flex flex-col gap-2">
            <input
              type="text"
              placeholder="Escribe una etiqueta y presiona Enter"
              value={tagsInput}
              onChange={(e) => onTagsInputChange(e.target.value)}
              onKeyDown={onAddTag}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-[13px] font-semibold text-slate-800 placeholder-slate-400 focus:border-[#2e9e5b] focus:outline-hidden transition-all"
            />

            {tagsList.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-1">
                {tagsList.map((tag, idx) => (
                  <span key={idx} className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-slate-100 bg-slate-50 text-[11px] font-extrabold text-slate-500">
                    {tag}
                    <button
                      type="button"
                      onClick={() => onRemoveTag(idx)}
                      className="hover:text-red-500 transition-colors"
                    >
                      <i className="fa-solid fa-xmark text-[9px]" />
                    </button>
                  </span>
                ))}
              </div>
            )}

            <span className="text-[10px] text-slate-400 font-semibold leading-relaxed">
              Ejemplos: amor, fe, oracion, obediencia, gratitud
            </span>
          </div>
        </div>
      </div>

      {/* Visibilidad por clubes */}
      <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm flex flex-col gap-4 text-left">
        <div>
          <h3 className="font-extrabold text-slate-800 text-sm md:text-base">Visibilidad por clubes</h3>
          <p className="text-[12px] text-slate-400 mt-1 font-medium">Selecciona en que clubes estara disponible este tema.</p>
        </div>

        <div className="flex flex-col gap-2.5">
          <label className="flex items-center justify-between p-3.5 rounded-2xl border border-slate-100 bg-slate-50/50 hover:bg-slate-50 transition-all cursor-pointer">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center shrink-0 text-slate-550">
                <i className="fa-solid fa-users text-xs" />
              </div>
              <div className="flex flex-col">
                <span className="font-extrabold text-slate-800 text-[12.5px]">Todos los clubes</span>
                <span className="text-[10px] text-slate-400 font-bold mt-0.5">Visible en todos los clubes</span>
              </div>
            </div>
            <input
              type="checkbox"
              checked={clubVisibilities.todos}
              onChange={(e) => onClubVisibilitiesChange({
                todos: e.target.checked,
                semillitas: e.target.checked,
                guardianes: e.target.checked,
                corazones: e.target.checked,
                jovenes: e.target.checked,
              })}
              className="rounded-md border-slate-300 text-[#2e9e5b] focus:ring-[#2e9e5b] w-4.5 h-4.5 cursor-pointer"
            />
          </label>

          <label className="flex items-center justify-between p-3.5 rounded-2xl border border-slate-100 bg-slate-50/50 hover:bg-slate-50 transition-all cursor-pointer">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[#eefcf4] text-[#2e9e5b] flex items-center justify-center shrink-0">
                <i className="fa-solid fa-leaf text-xs" />
              </div>
              <div className="flex flex-col">
                <span className="font-extrabold text-slate-800 text-[12.5px]">Semillitas de Luz</span>
                <span className="text-[10px] text-slate-400 font-bold mt-0.5">Club 8-10 anos</span>
              </div>
            </div>
            <input
              type="checkbox"
              checked={clubVisibilities.semillitas}
              onChange={(e) => onClubVisibilitiesChange({ ...clubVisibilities, semillitas: e.target.checked, todos: false })}
              className="rounded-md border-slate-300 text-[#2e9e5b] focus:ring-[#2e9e5b] w-4.5 h-4.5 cursor-pointer"
            />
          </label>

          <label className="flex items-center justify-between p-3.5 rounded-2xl border border-slate-100 bg-slate-50/50 hover:bg-slate-50 transition-all cursor-pointer">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[#3d8bd4]/10 text-[#3d8bd4] flex items-center justify-center shrink-0">
                <i className="fa-solid fa-feather text-xs" />
              </div>
              <div className="flex flex-col">
                <span className="font-extrabold text-slate-800 text-[12.5px]">Guardianes de Paz</span>
                <span className="text-[10px] text-slate-400 font-bold mt-0.5">Club 8-10 anos</span>
              </div>
            </div>
            <input
              type="checkbox"
              checked={clubVisibilities.guardianes}
              onChange={(e) => onClubVisibilitiesChange({ ...clubVisibilities, guardianes: e.target.checked, todos: false })}
              className="rounded-md border-slate-300 text-[#2e9e5b] focus:ring-[#2e9e5b] w-4.5 h-4.5 cursor-pointer"
            />
          </label>

          <label className="flex items-center justify-between p-3.5 rounded-2xl border border-slate-100 bg-slate-50/50 hover:bg-slate-50 transition-all cursor-pointer">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[#ee6c4d]/10 text-[#ee6c4d] flex items-center justify-center shrink-0">
                <i className="fa-solid fa-heart text-xs" />
              </div>
              <div className="flex flex-col">
                <span className="font-extrabold text-slate-800 text-[12.5px]">Corazones Valientes</span>
                <span className="text-[10px] text-slate-400 font-bold mt-0.5">Club 11-13 anos</span>
              </div>
            </div>
            <input
              type="checkbox"
              checked={clubVisibilities.corazones}
              onChange={(e) => onClubVisibilitiesChange({ ...clubVisibilities, corazones: e.target.checked, todos: false })}
              className="rounded-md border-slate-300 text-[#2e9e5b] focus:ring-[#2e9e5b] w-4.5 h-4.5 cursor-pointer"
            />
          </label>

          <label className="flex items-center justify-between p-3.5 rounded-2xl border border-slate-100 bg-slate-50/50 hover:bg-slate-50 transition-all cursor-pointer">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[#17a398]/10 text-[#17a398] flex items-center justify-center shrink-0">
                <i className="fa-solid fa-mountain text-xs" />
              </div>
              <div className="flex flex-col">
                <span className="font-extrabold text-slate-800 text-[12.5px]">Jovenes en Mision</span>
                <span className="text-[10px] text-slate-400 font-bold mt-0.5">Club 14+ anos</span>
              </div>
            </div>
            <input
              type="checkbox"
              checked={clubVisibilities.jovenes}
              onChange={(e) => onClubVisibilitiesChange({ ...clubVisibilities, jovenes: e.target.checked, todos: false })}
              className="rounded-md border-slate-300 text-[#2e9e5b] focus:ring-[#2e9e5b] w-4.5 h-4.5 cursor-pointer"
            />
          </label>
        </div>

        <div className="mt-2 bg-[#eefcf4] border border-[#eefcf4]/10 rounded-2xl p-4 flex items-center gap-3 text-[#2e9e5b]">
          <i className="fa-solid fa-leaf text-xs shrink-0" />
          <span className="text-[11px] font-bold leading-relaxed">
            Puedes cambiar la visibilidad mas tarde desde la configuracion del tema.
          </span>
        </div>
      </div>
    </>
  );
}
