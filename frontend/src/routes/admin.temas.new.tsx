import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useForm, useWatch } from "react-hook-form";
import { crearTema, type CrearTemaSolicitud } from "../features/admin/admin.api";
import { obtenerGruposEdad, obtenerVersionesBiblicas } from "../features/catalog/catalog.api";
import { obtenerSendas } from "../features/sendas/sendas.api";
import { useState, useMemo } from "react";
import { ArrowLeft, Loader } from "lucide-react";

import imgSemilla from "@/assets/images/Ilustraciones/Semilla.png";
import imgPlaceholder from "@/assets/images/Ilustraciones/Tema1.png";

export const Route = createFileRoute("/admin/temas/new")({
  component: NewThemePage
});

function NewThemePage() {
  const navigate = useNavigate();

  // Queries for DB catalogs
  const sendasQuery = useQuery({ queryKey: ["sendas"], queryFn: obtenerSendas });
  const ageGroupsQuery = useQuery({ queryKey: ["catalog", "age-groups"], queryFn: obtenerGruposEdad });
  const bibleVersionsQuery = useQuery({ queryKey: ["catalog", "bible-versions"], queryFn: obtenerVersionesBiblicas });

  // Form setup
  const { register, handleSubmit, control } = useForm<CrearTemaSolicitud>({
    defaultValues: {
      titulo: "",
      slug: "",
      senda_id: "",
      grupo_edad_ids: [],
      version_biblica_id: "",
      objetivo: "",
      resumen: "",
      minutos_estimados: 40,
      xp_recompensa: 100
    }
  });

  // Watch form fields for live preview
  const liveTitle = useWatch({ control, name: "titulo" }) || "Título del tema";
  const liveResumen = useWatch({ control, name: "resumen" }) || "Resumen breve del tema que ayudará a los niños a crecer en su fe.";
  const liveDuration = useWatch({ control, name: "minutos_estimados" }) || 40;
  const liveXp = useWatch({ control, name: "xp_recompensa" }) || 100;
  const liveVersionId = useWatch({ control, name: "version_biblica_id" });

  const activeVersion = useMemo(() => {
    if (!liveVersionId) return "RVR1960";
    const found = bibleVersionsQuery.data?.find(v => v.id === liveVersionId);
    return found?.codigo ?? "RVR1960";
  }, [liveVersionId, bibleVersionsQuery.data]);

  // Tags State
  const [tagsInput, setTagsInput] = useState("");
  const [tagsList, setTagsList] = useState<string[]>([]);

  // Club Checkboxes state
  const [clubVisibilities, setClubVisibilities] = useState({
    todos: false,
    semillitas: true,
    guardianes: true,
    corazones: true,
    jovenes: false
  });

  const checkedClubsCount = useMemo(() => {
    let count = 0;
    if (clubVisibilities.todos) return 4;
    if (clubVisibilities.semillitas) count++;
    if (clubVisibilities.guardianes) count++;
    if (clubVisibilities.corazones) count++;
    if (clubVisibilities.jovenes) count++;
    return count;
  }, [clubVisibilities]);

  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && tagsInput.trim()) {
      e.preventDefault();
      if (!tagsList.includes(tagsInput.trim())) {
        setTagsList([...tagsList, tagsInput.trim()]);
      }
      setTagsInput("");
    }
  };

  const removeTag = (idx: number) => {
    setTagsList(tagsList.filter((_, i) => i !== idx));
  };

  const createMutation = useMutation({
    mutationFn: crearTema,
    onSuccess: () => navigate({ to: "/admin/temas" })
  });

  const onSubmitForm = (values: CrearTemaSolicitud) => {
    createMutation.mutate({
      ...values,
      minutos_estimados: Number(values.minutos_estimados),
      xp_recompensa: Number(values.xp_recompensa)
    });
  };

  return (
    <div className="flex flex-col gap-6 text-left">
      {/* Topbar subtitle handled in admin.tsx, but breadcrumbs / navigation is here */}
      <button
        onClick={() => navigate({ to: "/admin/temas" })}
        className="flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-slate-600 transition-colors bg-white border border-slate-100 px-3 py-1.5 rounded-full w-max select-none cursor-pointer"
      >
        <i className="fa-solid fa-arrow-left text-[10px]" />
        Volver a temas
      </button>

      {/* Main Grid: Form left (3/4), Live Preview Right (1/4) */}
      <form onSubmit={handleSubmit(onSubmitForm)} className="grid grid-cols-1 gap-6 lg:grid-cols-4 select-none">
        
        {/* Left Columns (3/4 width) */}
        <div className="flex flex-col gap-6 lg:col-span-3 min-w-0">
          
          {/* Main Info Block */}
          <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm flex flex-col gap-5 text-left">
            <div>
              <h3 className="font-extrabold text-slate-800 text-[15px]">Información del tema</h3>
              <p className="text-[12px] text-slate-400 mt-1 font-medium">Completa los datos básicos para crear el nuevo tema.</p>
            </div>

            {/* Title & Slug */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-700">Título del tema <span className="text-red-500">*</span></label>
                <div className="relative">
                  <input
                    {...register("titulo", { required: true })}
                    maxLength={100}
                    placeholder="Ej. Dios cuida de mí"
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
                  Se usará en la URL. Solo minúsculas, números y guiones.
                </span>
              </div>
            </div>

            {/* Senda & Franja */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-700">Senda <span className="text-red-500">*</span></label>
                <div className="relative">
                  <select
                    {...register("senda_id", { required: true })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-[13px] font-semibold text-slate-700 appearance-none focus:border-[#2e9e5b] focus:outline-hidden cursor-pointer"
                  >
                    <option value="">Selecciona una senda</option>
                    {sendasQuery.data?.map((s) => (
                      <option key={s.id} value={s.id}>{s.nombre}</option>
                    ))}
                  </select>
                  <i className="fa-solid fa-chevron-down absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 text-[10px] pointer-events-none" />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-700">Franja de edad <span className="text-red-500">*</span></label>
                <div className="relative">
                  <select
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-[13px] font-semibold text-slate-700 appearance-none focus:border-[#2e9e5b] focus:outline-hidden cursor-pointer"
                  >
                    <option value="">Selecciona una franja de edad</option>
                    {ageGroupsQuery.data?.map((g) => (
                      <option key={g.id} value={g.id}>{g.nombre} ({g.edad_minima}-{g.edad_maxima} años)</option>
                    ))}
                  </select>
                  <i className="fa-solid fa-chevron-down absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 text-[10px] pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Objetivo & Resumen */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-700">Objetivo del tema <span className="text-red-500">*</span></label>
                <div className="relative">
                  <textarea
                    {...register("objetivo", { required: true })}
                    maxLength={200}
                    rows={3}
                    placeholder="Ej. Que los niños comprendan que Dios siempre cuida de ellos."
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
                    placeholder="Breve descripción del tema y lo que aprenderán los niños."
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-[13px] font-semibold text-slate-800 placeholder-slate-400 focus:border-[#2e9e5b] focus:outline-hidden focus:ring-2 focus:ring-[#2e9e5b]/10 transition-all resize-none"
                  />
                  <span className="absolute right-3 bottom-2.5 text-[10px] text-slate-400 font-bold">
                    0/400
                  </span>
                </div>
              </div>
            </div>

            {/* Duración, XP, Versión */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-700">Duración estimada <span className="text-red-500">*</span></label>
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
                <label className="text-xs font-bold text-slate-700">Versión bíblica <span className="text-red-500">*</span></label>
                <div className="relative">
                  <select
                    {...register("version_biblica_id", { required: true })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-[13px] font-semibold text-slate-700 appearance-none focus:border-[#2e9e5b] focus:outline-hidden cursor-pointer"
                  >
                    <option value="">Selecciona una versión</option>
                    {bibleVersionsQuery.data?.map((v) => (
                      <option key={v.id} value={v.id}>{v.codigo}</option>
                    ))}
                  </select>
                  <i className="fa-solid fa-chevron-down absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 text-[10px] pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Portada */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-700">Portada del tema <span className="text-red-500">*</span></label>
              <span className="text-[11px] text-slate-400 font-semibold mb-1">Imagen que representará el tema en la plataforma.</span>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Drag zone (2/3 width) */}
                <div className="md:col-span-2 border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center p-6 text-center bg-slate-50/50 hover:bg-slate-50 hover:border-[#2e9e5b]/40 transition-colors cursor-pointer">
                  <div className="w-10 h-10 rounded-xl bg-white border border-slate-100 flex items-center justify-center text-slate-400 shadow-xs mb-3">
                    <i className="fa-regular fa-image text-lg" />
                  </div>
                  <span className="text-xs font-extrabold text-slate-700">
                    Arrastra y suelta una imagen aquí
                  </span>
                  <span className="text-[10px] text-slate-400 font-bold mt-1">
                    o haz clic para seleccionar
                  </span>
                  <span className="text-[9.5px] text-slate-400 font-semibold mt-3 select-none">
                    Recomendado: 16:9 (1920x1080px) • JPG o PNG • Máx. 2MB
                  </span>
                </div>

                {/* Advice Card (1/3 width) */}
                <div className="bg-[#6c3aed]/5 border border-[#6c3aed]/10 rounded-2xl p-5 flex flex-col text-left">
                  <div className="w-7 h-7 rounded-lg bg-[#6c3aed]/10 text-[#6c3aed] flex items-center justify-center shrink-0 mb-3">
                    <i className="fa-solid fa-lightbulb text-xs" />
                  </div>
                  <span className="text-[11.5px] font-bold text-[#6c3aed] leading-relaxed">
                    Consejo
                  </span>
                  <p className="text-[11.5px] font-semibold text-[#6c3aed]/70 leading-relaxed mt-1">
                    Usa imágenes coloridas y significativas que conecten con el mensaje del tema.
                  </p>
                </div>
              </div>
            </div>

            {/* Tags Input */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-700">Etiquetas</label>
              <span className="text-[11px] text-slate-450 font-bold mb-1">Añade etiquetas que describan el contenido del tema.</span>
              
              <div className="flex flex-col gap-2">
                <input
                  type="text"
                  placeholder="Escribe una etiqueta y presiona Enter"
                  value={tagsInput}
                  onChange={(e) => setTagsInput(e.target.value)}
                  onKeyDown={handleAddTag}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-[13px] font-semibold text-slate-800 placeholder-slate-400 focus:border-[#2e9e5b] focus:outline-hidden transition-all"
                />
                
                {tagsList.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-1">
                    {tagsList.map((tag, idx) => (
                      <span key={idx} className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-slate-100 bg-slate-50 text-[11px] font-extrabold text-slate-500">
                        {tag}
                        <button
                          type="button"
                          onClick={() => removeTag(idx)}
                          className="hover:text-red-500 transition-colors"
                        >
                          <i className="fa-solid fa-xmark text-[9px]" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
                
                <span className="text-[10px] text-slate-400 font-semibold leading-relaxed">
                  Ejemplos: amor, fe, oración, obediencia, gratitud
                </span>
              </div>
            </div>

          </div>

          {/* Visibilidad por clubes block */}
          <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm flex flex-col gap-4 text-left">
            <div>
              <h3 className="font-extrabold text-slate-800 text-[15px]">Visibilidad por clubes</h3>
              <p className="text-[12px] text-slate-400 mt-1 font-medium">Selecciona en qué clubes estará disponible este tema.</p>
            </div>

            <div className="flex flex-col gap-2.5">
              {/* Todos los clubes */}
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
                  onChange={(e) => setClubVisibilities({
                    todos: e.target.checked,
                    semillitas: e.target.checked,
                    guardianes: e.target.checked,
                    corazones: e.target.checked,
                    jovenes: e.target.checked
                  })}
                  className="rounded-md border-slate-300 text-[#2e9e5b] focus:ring-[#2e9e5b] w-4.5 h-4.5 cursor-pointer"
                />
              </label>

              {/* Semillitas de Luz */}
              <label className="flex items-center justify-between p-3.5 rounded-2xl border border-slate-100 bg-slate-50/50 hover:bg-slate-50 transition-all cursor-pointer">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#eefcf4] text-[#2e9e5b] flex items-center justify-center shrink-0">
                    <i className="fa-solid fa-leaf text-xs" />
                  </div>
                  <div className="flex flex-col">
                    <span className="font-extrabold text-slate-800 text-[12.5px]">Semillitas de Luz</span>
                    <span className="text-[10px] text-slate-400 font-bold mt-0.5">Club 8-10 años</span>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={clubVisibilities.semillitas}
                  onChange={(e) => setClubVisibilities({ ...clubVisibilities, semillitas: e.target.checked, todos: false })}
                  className="rounded-md border-slate-300 text-[#2e9e5b] focus:ring-[#2e9e5b] w-4.5 h-4.5 cursor-pointer"
                />
              </label>

              {/* Guardianes de Paz */}
              <label className="flex items-center justify-between p-3.5 rounded-2xl border border-slate-100 bg-slate-50/50 hover:bg-slate-50 transition-all cursor-pointer">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#3d8bd4]/10 text-[#3d8bd4] flex items-center justify-center shrink-0">
                    <i className="fa-solid fa-feather text-xs" />
                  </div>
                  <div className="flex flex-col">
                    <span className="font-extrabold text-slate-800 text-[12.5px]">Guardianes de Paz</span>
                    <span className="text-[10px] text-slate-400 font-bold mt-0.5">Club 8-10 años</span>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={clubVisibilities.guardianes}
                  onChange={(e) => setClubVisibilities({ ...clubVisibilities, guardianes: e.target.checked, todos: false })}
                  className="rounded-md border-slate-300 text-[#2e9e5b] focus:ring-[#2e9e5b] w-4.5 h-4.5 cursor-pointer"
                />
              </label>

              {/* Corazones Valientes */}
              <label className="flex items-center justify-between p-3.5 rounded-2xl border border-slate-100 bg-slate-50/50 hover:bg-slate-50 transition-all cursor-pointer">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#ee6c4d]/10 text-[#ee6c4d] flex items-center justify-center shrink-0">
                    <i className="fa-solid fa-heart text-xs" />
                  </div>
                  <div className="flex flex-col">
                    <span className="font-extrabold text-slate-800 text-[12.5px]">Corazones Valientes</span>
                    <span className="text-[10px] text-slate-400 font-bold mt-0.5">Club 11-13 años</span>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={clubVisibilities.corazones}
                  onChange={(e) => setClubVisibilities({ ...clubVisibilities, corazones: e.target.checked, todos: false })}
                  className="rounded-md border-slate-300 text-[#2e9e5b] focus:ring-[#2e9e5b] w-4.5 h-4.5 cursor-pointer"
                />
              </label>

              {/* Jóvenes en Misión */}
              <label className="flex items-center justify-between p-3.5 rounded-2xl border border-slate-100 bg-slate-50/50 hover:bg-slate-50 transition-all cursor-pointer">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#17a398]/10 text-[#17a398] flex items-center justify-center shrink-0">
                    <i className="fa-solid fa-mountain text-xs" />
                  </div>
                  <div className="flex flex-col">
                    <span className="font-extrabold text-slate-800 text-[12.5px]">Jóvenes en Misión</span>
                    <span className="text-[10px] text-slate-400 font-bold mt-0.5">Club 14+ años</span>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={clubVisibilities.jovenes}
                  onChange={(e) => setClubVisibilities({ ...clubVisibilities, jovenes: e.target.checked, todos: false })}
                  className="rounded-md border-slate-300 text-[#2e9e5b] focus:ring-[#2e9e5b] w-4.5 h-4.5 cursor-pointer"
                />
              </label>
            </div>

            {/* Bottom notification */}
            <div className="mt-2 bg-[#eefcf4] border border-[#eefcf4]/10 rounded-2xl p-4 flex items-center gap-3 text-[#2e9e5b]">
              <i className="fa-solid fa-leaf text-xs shrink-0" />
              <span className="text-[11px] font-bold leading-relaxed">
                Puedes cambiar la visibilidad más tarde desde la configuración del tema.
              </span>
            </div>
          </div>
        </div>

        {/* Right column (1/4 width) - Live Preview & Actions */}
        <div className="flex flex-col gap-6">
          
          {/* Vista Previa Block */}
          <div className="bg-white rounded-3xl border border-slate-100 p-5 shadow-sm flex flex-col text-left">
            <h3 className="font-extrabold text-slate-800 text-sm mb-4">Vista previa</h3>
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider select-none mb-3">Así se verá tu tema en la plataforma</span>

            {/* Preview Card */}
            <div className="rounded-2xl border border-slate-100 overflow-hidden shadow-xs bg-slate-50/50 flex flex-col">
              <div className="w-full h-36 overflow-hidden bg-slate-100 relative shrink-0">
                <img src={imgPlaceholder} alt="Vista previa" className="w-full h-full object-cover" />
              </div>
              <div className="p-4 flex flex-col gap-2">
                <div>
                  <span className="inline-flex px-1.5 py-0.5 rounded bg-[#6c3aed]/10 text-[#6c3aed] text-[9px] font-extrabold uppercase tracking-wider">Tema</span>
                </div>
                <h4 className="font-extrabold text-slate-800 text-[14px] leading-tight truncate">{liveTitle}</h4>
                <p className="text-[11px] text-slate-400 font-semibold leading-relaxed mt-0.5 line-clamp-2 min-h-[34px]">
                  {liveResumen}
                </p>

                {/* Metadata Row */}
                <div className="flex items-center gap-3.5 mt-2.5 text-[10px] text-slate-400 font-bold border-t border-slate-100 pt-3 select-none">
                  <div className="flex items-center gap-1">
                    <i className="fa-solid fa-clock text-[9px]" />
                    <span>{liveDuration} min</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <i className="fa-solid fa-star text-[9px] text-amber-400" />
                    <span>{liveXp} XP</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <i className="fa-solid fa-book-open text-[9px]" />
                    <span>{activeVersion}</span>
                  </div>
                </div>

                {/* Club visibility icons */}
                <div className="flex items-center justify-between mt-3 text-[10px] font-bold text-slate-400 select-none">
                  <span>Visible en {checkedClubsCount} clubes</span>
                  <div className="flex items-center -space-x-1.5">
                    {clubVisibilities.semillitas && (
                      <div className="w-5 h-5 rounded-full bg-[#eefcf4] text-[#2e9e5b] border border-white flex items-center justify-center text-[8px] shadow-xs">
                        <i className="fa-solid fa-leaf" />
                      </div>
                    )}
                    {clubVisibilities.guardianes && (
                      <div className="w-5 h-5 rounded-full bg-[#3d8bd4]/10 text-[#3d8bd4] border border-white flex items-center justify-center text-[8px] shadow-xs">
                        <i className="fa-solid fa-feather" />
                      </div>
                    )}
                    {clubVisibilities.corazones && (
                      <div className="w-5 h-5 rounded-full bg-[#ee6c4d]/10 text-[#ee6c4d] border border-white flex items-center justify-center text-[8px] shadow-xs">
                        <i className="fa-solid fa-heart" />
                      </div>
                    )}
                    {clubVisibilities.jovenes && (
                      <div className="w-5 h-5 rounded-full bg-[#17a398]/10 text-[#17a398] border border-white flex items-center justify-center text-[8px] shadow-xs">
                        <i className="fa-solid fa-mountain" />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Alert Lightbulb */}
            <div className="mt-4 bg-[#fff8eb] border border-[#fff8eb]/10 rounded-2xl p-4 flex items-start gap-3 text-amber-600">
              <i className="fa-solid fa-lightbulb text-xs shrink-0 mt-0.5" />
              <span className="text-[11px] font-bold leading-relaxed">
                Puedes guardar como borrador en cualquier momento y continuar después.
              </span>
            </div>

            {/* Actions Buttons */}
            <div className="flex flex-col gap-2.5 mt-5">
              <button
                type="button"
                onClick={() => console.log("Guardar borrador clicked")}
                className="w-full bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-bold text-xs py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <i className="fa-regular fa-floppy-disk text-[10px]" />
                Guardar borrador
              </button>
              
              <button
                type="submit"
                disabled={createMutation.isPending}
                className="w-full !bg-verde-brote hover:opacity-95 text-white font-bold text-xs py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                {createMutation.isPending ? <Loader className="animate-spin text-white" size={12} /> : null}
                <span>Continuar a CRECER</span>
                <i className="fa-solid fa-arrow-right text-[10px]" />
              </button>

              <div className="flex items-center justify-center gap-1.5 text-[10px] text-slate-400 font-bold mt-2 select-none">
                <i className="fa-solid fa-lock text-[9px]" />
                <span>Tu progreso se guarda automáticamente</span>
              </div>
            </div>
          </div>
        </div>
        
      </form>
    </div>
  );
}
