import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState, useMemo } from "react";
import { obtenerTemaAdmin, actualizarTema } from "../features/admin/admin.api";
import { Loader } from "lucide-react";

import imgBoySheep from "@/assets/images/Ilustraciones/in2.png";
import imgSprout from "@/assets/images/Ilustraciones/Semilla.png";

export const Route = createFileRoute("/admin/temas/$themeId/edit")({
  component: EditThemePage
});

type TabType = "general" | "portada" | "config" | "publicacion";

function EditThemePage() {
  const { themeId } = Route.useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Active Tab
  const [activeTab, setActiveTab] = useState<TabType>("general");

  // Form Fields State
  const [title, setTitle] = useState("");
  const [targetAudience, setTargetAudience] = useState("Niños de 6 a 10 años");
  const [shortDesc, setShortDesc] = useState("");
  const [category, setCategory] = useState("Confianza en Dios");
  const [keyVerse, setKeyVerse] = useState("");
  const [duration, setDuration] = useState(45);
  const [mainMessage, setMainMessage] = useState("");
  const [tagInput, setTagInput] = useState("");
  const [tagsList, setTagsList] = useState<string[]>(["cuidado", "amor de Dios", "confianza"]);

  // Fetch Theme
  const themeQuery = useQuery({
    queryKey: ["admin", "theme", themeId],
    queryFn: () => obtenerTemaAdmin(themeId)
  });

  const theme = themeQuery.data;

  useEffect(() => {
    if (theme) {
      setTitle(theme.titulo);
      setShortDesc(theme.resumen ?? "");
      setDuration(theme.minutos_estimados);
      setKeyVerse(theme.versiculo_clave?.texto ?? "Salmo 23:1");
      setMainMessage(theme.objetivo ?? "");
    }
  }, [theme]);

  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && tagInput.trim()) {
      e.preventDefault();
      if (!tagsList.includes(tagInput.trim())) {
        setTagsList([...tagsList, tagInput.trim()]);
      }
      setTagInput("");
    }
  };

  const removeTag = (idx: number) => {
    setTagsList(tagsList.filter((_, i) => i !== idx));
  };

  const updateMutation = useMutation({
    mutationFn: () =>
      actualizarTema(themeId, {
        titulo: title,
        objetivo: mainMessage,
        resumen: shortDesc,
        xp_recompensa: theme?.xp_recompensa ?? 100,
        minutos_estimados: Number(duration)
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "theme", themeId] });
      navigate({ to: "/admin/temas" });
    }
  });

  return (
    <div className="flex flex-col gap-6 text-left select-none">
      
      {/* Breadcrumbs */}
      <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-400 select-none">
        <span className="hover:text-slate-650 cursor-pointer" onClick={() => navigate({ to: "/admin" })}>Inicio</span>
        <i className="fa-solid fa-chevron-right text-[8px]" />
        <span className="hover:text-slate-650 cursor-pointer" onClick={() => navigate({ to: "/admin/temas" })}>Temas</span>
        <i className="fa-solid fa-chevron-right text-[8px]" />
        <span className="text-slate-600 truncate max-w-[120px]">{title || "Dios me cuida"}</span>
        <i className="fa-solid fa-chevron-right text-[8px]" />
        <span className="text-[#2e9e5b]">Editar</span>
      </div>

      {/* Header section with avatar */}
      <div className="flex items-center gap-4 bg-white rounded-3xl border border-slate-100 p-6 shadow-sm">
        <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-slate-100 shrink-0">
          <img src={imgBoySheep} alt="Boy with sheep avatar" className="w-full h-full object-cover" />
        </div>
        <div>
          <h2 className="text-2xl font-black text-slate-800">Editar tema</h2>
          <p className="text-[13px] text-slate-500 mt-1">Actualiza la información y el contenido de tu tema.</p>
        </div>
      </div>

      {themeQuery.isLoading && (
        <div className="flex justify-center py-12"><Loader className="animate-spin text-[#2e9e5b]" size={24} /></div>
      )}

      {/* Main Grid: Form left (3/4), Sidebar Right (1/4) */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
        
        {/* Left block (3/4 width) */}
        <div className="flex flex-col gap-6 lg:col-span-3 min-w-0">
          
          {/* Inner Navigation Tabs */}
          <div className="flex items-center gap-6 border-b border-slate-100 px-2 select-none">
            <button
              onClick={() => setActiveTab("general")}
              className={`pb-3 text-xs font-black border-b-2 transition-all cursor-pointer ${
                activeTab === "general"
                  ? "border-[#2e9e5b] text-[#2e9e5b]"
                  : "border-transparent text-slate-400 hover:text-slate-600"
              }`}
            >
              <i className="fa-solid fa-file-invoice mr-2 text-[10px]" />
              Información general
            </button>
            <button
              onClick={() => setActiveTab("portada")}
              className={`pb-3 text-xs font-black border-b-2 transition-all cursor-pointer ${
                activeTab === "portada"
                  ? "border-[#2e9e5b] text-[#2e9e5b]"
                  : "border-transparent text-slate-400 hover:text-slate-600"
              }`}
            >
              <i className="fa-regular fa-image mr-2 text-[10px]" />
              Portada
            </button>
            <button
              onClick={() => setActiveTab("config")}
              className={`pb-3 text-xs font-black border-b-2 transition-all cursor-pointer ${
                activeTab === "config"
                  ? "border-[#2e9e5b] text-[#2e9e5b]"
                  : "border-transparent text-slate-400 hover:text-slate-600"
              }`}
            >
              <i className="fa-solid fa-sliders mr-2 text-[10px]" />
              Configuración
            </button>
            <button
              onClick={() => setActiveTab("publicacion")}
              className={`pb-3 text-xs font-black border-b-2 transition-all cursor-pointer ${
                activeTab === "publicacion"
                  ? "border-[#2e9e5b] text-[#2e9e5b]"
                  : "border-transparent text-slate-400 hover:text-slate-600"
              }`}
            >
              <i className="fa-solid fa-paper-plane mr-2 text-[10px]" />
              Publicación
            </button>
          </div>

          {/* Form Fields Card */}
          <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm flex flex-col gap-5 text-left">
            {/* Título & Público Objetivo */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-700">Título del tema <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-[13px] font-semibold text-slate-800 placeholder-slate-400 focus:border-[#2e9e5b] focus:outline-hidden focus:ring-2 focus:ring-[#2e9e5b]/10 transition-all"
                />
                <span className="text-[10px] text-slate-400 font-bold">El título es como se mostrará en la plataforma.</span>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-700">Público objetivo <span className="text-red-500">*</span></label>
                <div className="relative">
                  <select
                    value={targetAudience}
                    onChange={(e) => setTargetAudience(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-[13px] font-semibold text-slate-700 appearance-none focus:border-[#2e9e5b] focus:outline-hidden cursor-pointer"
                  >
                    <option value="Niños de 6 a 10 años">Niños de 6 a 10 años</option>
                    <option value="Adolescentes de 11 a 15 años">Adolescentes de 11 a 15 años</option>
                  </select>
                  <i className="fa-solid fa-chevron-down absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 text-[10px] pointer-events-none" />
                </div>
                <span className="text-[10px] text-slate-400 font-bold">Selecciona el grupo de edad principal.</span>
              </div>
            </div>

            {/* Descripción corta & Categoría */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-700">Descripción corta <span className="text-red-500">*</span></label>
                <textarea
                  value={shortDesc}
                  onChange={(e) => setShortDesc(e.target.value)}
                  maxLength={120}
                  rows={3}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-[13px] font-semibold text-slate-800 focus:border-[#2e9e5b] focus:outline-hidden transition-all resize-none"
                />
                <span className="text-[10px] text-slate-400 font-bold">Máximo 120 caracteres.</span>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-700">Categoría <span className="text-red-500">*</span></label>
                <div className="relative">
                  <select
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-[13px] font-semibold text-slate-700 appearance-none focus:border-[#2e9e5b] focus:outline-hidden cursor-pointer"
                  >
                    <option value="confianza">Confianza en Dios</option>
                  </select>
                  <i className="fa-solid fa-chevron-down absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 text-[10px] pointer-events-none" />
                  
                  {/* Category tag pill showing below */}
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-[#6c3aed]/10 bg-[#6c3aed]/5 text-[11px] font-extrabold text-[#6c3aed]">
                      {category}
                      <button type="button" onClick={() => setCategory("")} className="hover:text-red-500">
                        <i className="fa-solid fa-xmark text-[9px]" />
                      </button>
                    </span>
                  </div>
                </div>
                <span className="text-[10px] text-slate-400 font-bold mt-1">Selecciona la categoría principal del tema.</span>
              </div>
            </div>

            {/* Versículo clave & Duración */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-700">Versículo clave <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  value={keyVerse}
                  onChange={(e) => setKeyVerse(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-[13px] font-semibold text-slate-800 focus:border-[#2e9e5b] focus:outline-hidden transition-all"
                />
                <span className="text-[10px] text-slate-400 font-bold">Versículo principal que memorizarán los niños.</span>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-700">Duración estimada <span className="text-red-500">*</span></label>
                <div className="relative flex items-center">
                  <input
                    type="number"
                    value={duration}
                    onChange={(e) => setDuration(Number(e.target.value))}
                    className="w-full pl-4 pr-16 py-2.5 rounded-xl border border-slate-200 bg-white text-[13px] font-semibold text-slate-800 focus:border-[#2e9e5b] focus:outline-hidden transition-all"
                  />
                  <span className="absolute right-4 text-[11px] text-slate-400 font-bold">minutos</span>
                </div>
                <span className="text-[10px] text-slate-400 font-bold">Tiempo aproximado para completar el tema.</span>
              </div>
            </div>

            {/* Mensaje central */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-700">Mensaje central <span className="text-red-500">*</span></label>
              <textarea
                value={mainMessage}
                onChange={(e) => setMainMessage(e.target.value)}
                rows={3}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-[13px] font-semibold text-slate-800 focus:border-[#2e9e5b] focus:outline-hidden transition-all resize-none"
              />
              <span className="text-[10px] text-slate-400 font-bold">El mensaje principal que los niños deben recordar.</span>
            </div>

            {/* Etiquetas */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-700">Etiquetas</label>
              <div className="flex flex-col gap-2">
                <div className="flex flex-wrap gap-1.5 p-1 rounded-xl border border-slate-200 bg-white items-center min-h-[42px] px-3 focus-within:border-[#2e9e5b] focus-within:ring-2 focus-within:ring-[#2e9e5b]/10 transition-all">
                  {tagsList.map((tag, idx) => (
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
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={handleAddTag}
                    className="flex-1 min-w-[100px] border-none bg-transparent outline-none py-1 text-[13px] font-semibold text-slate-800"
                  />
                </div>
                <span className="text-[10px] text-slate-400 font-bold">Añade etiquetas para facilitar la búsqueda.</span>
              </div>
            </div>

          </div>

          {/* Vista previa rápida */}
          <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm flex flex-col gap-4 text-left">
            <div className="flex justify-between items-center select-none">
              <div>
                <h3 className="font-extrabold text-slate-800 text-[15px]">Vista previa rápida</h3>
                <p className="text-[12px] text-slate-400 mt-1 font-medium">Así se verá tu tema para los niños.</p>
              </div>
              
              <button
                type="button"
                className="px-4 py-2 bg-slate-50 border border-slate-100 hover:bg-slate-100 transition-colors text-slate-700 font-bold text-xs rounded-full flex items-center gap-2 cursor-pointer"
              >
                <i className="fa-solid fa-eye text-[11px]" />
                Ver vista previa
              </button>
            </div>

            {/* Quick Preview Child Card */}
            <div className="rounded-2xl border border-slate-100/70 p-4 bg-[#eefcf4]/50 flex flex-col sm:flex-row items-center gap-5">
              <div className="w-44 h-28 rounded-xl overflow-hidden shrink-0 border border-slate-100 bg-slate-100 relative shadow-xs">
                <img src={imgBoySheep} alt="Dios me cuida preview" className="w-full h-full object-cover" />
              </div>
              <div className="flex flex-col gap-2 min-w-0 text-left">
                <h4 className="font-black text-slate-800 text-[16px] leading-tight truncate">{title || "Dios me cuida"}</h4>
                <p className="text-[11.5px] font-semibold text-slate-500 leading-relaxed line-clamp-2">
                  {shortDesc || "Descubrimos cómo Dios cuida de nosotros cada día con amor y detalle."}
                </p>
                <div className="flex items-center gap-3.5 mt-1 text-[10.5px] text-slate-400 font-bold">
                  <div className="flex items-center gap-1">
                    <i className="fa-solid fa-bookmark text-[#6c3aed]" />
                    <span className="text-[#6c3aed]">{keyVerse}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <i className="fa-solid fa-user-group" />
                    <span>{targetAudience}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <i className="fa-solid fa-clock" />
                    <span>{duration} minutos</span>
                  </div>
                </div>
              </div>
            </div>

          </div>

        </div>

        {/* Right side block (1/4 width) - Actions, Status & Completeness Progress */}
        <div className="flex flex-col gap-6">
          
          {/* Actions card */}
          <div className="bg-white rounded-3xl border border-slate-100 p-5 shadow-sm flex flex-col gap-3 text-left">
            <h3 className="font-extrabold text-slate-800 text-sm mb-2 border-b border-slate-50 pb-2.5 select-none">Acciones</h3>
            
            <button
              onClick={() => updateMutation.mutate()}
              disabled={updateMutation.isPending}
              className="w-full !bg-verde-brote hover:opacity-95 text-white font-bold text-xs py-3.5 px-4 rounded-xl flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              {updateMutation.isPending ? <Loader className="animate-spin text-white" size={12} /> : <i className="fa-solid fa-circle-check text-[10px]" />}
              <span>Guardar cambios</span>
            </button>
            
            <button
              type="button"
              className="w-full bg-white hover:bg-slate-50 border border-slate-200 text-[#6c3aed] font-bold text-xs py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <i className="fa-regular fa-clone text-[10px]" />
              Duplicar tema
            </button>

            <button
              type="button"
              className="w-full bg-white hover:bg-red-50/50 border border-red-200 text-red-650 font-bold text-xs py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <i className="fa-solid fa-box-archive text-[10px]" />
              Archivar tema
            </button>
          </div>

          {/* Theme status card */}
          <div className="bg-white rounded-3xl border border-slate-100 p-5 shadow-sm flex flex-col text-left">
            <h3 className="font-extrabold text-slate-800 text-sm mb-4 select-none">Estado del tema</h3>
            
            <div className="flex items-center gap-4">
              <div className="flex flex-col gap-2 flex-1">
                <div>
                  <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-emerald-100 text-emerald-700 text-[10px] font-bold">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    Publicado
                  </span>
                </div>
                <p className="text-[10.5px] text-slate-400 font-semibold leading-relaxed">
                  Este tema está visible y disponible para todos los usuarios.
                </p>
              </div>
              
              <div className="w-14 h-14 overflow-hidden shrink-0 border border-slate-100 bg-slate-50/50 rounded-2xl flex items-center justify-center">
                <img src={imgSprout} alt="Sprouting plant" className="w-10 h-10 object-contain" />
              </div>
            </div>
          </div>

          {/* Last edited card */}
          <div className="bg-white rounded-3xl border border-slate-100 p-5 shadow-sm flex flex-col gap-2.5 text-[11px] font-bold text-slate-600 text-left select-none">
            <h3 className="font-extrabold text-slate-800 text-sm mb-1.5">Última edición</h3>
            
            <div className="flex justify-between items-center">
              <span className="text-slate-400 font-bold">Por:</span>
              <span className="text-slate-700 font-extrabold">Administrador</span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-slate-400 font-bold">Fecha:</span>
              <span className="text-slate-700 font-extrabold">15 may, 2024 12:45</span>
            </div>
          </div>

          {/* Completeness progress card */}
          <div className="bg-white rounded-3xl border border-slate-100 p-5 shadow-sm flex flex-col text-left">
            <h3 className="font-extrabold text-slate-800 text-sm select-none">Progreso de completitud</h3>
            
            <div className="flex items-center justify-between mt-3 mb-2 font-bold text-xs select-none">
              <div className="w-full bg-slate-150 h-2 rounded-full overflow-hidden mr-3">
                <div className="bg-[#2e9e5b] h-full rounded-full" style={{ width: "85%" }} />
              </div>
              <span className="text-slate-700 font-black">85%</span>
            </div>
            
            <p className="text-[10.5px] text-slate-400 font-semibold leading-relaxed mb-4 select-none">
              Excelente trabajo. Solo faltan algunos detalles para completar tu tema.
            </p>

            {/* Checklist */}
            <div className="flex flex-col gap-3 text-xs font-bold text-slate-650">
              <div className="flex items-center gap-2.5">
                <div className="w-5 h-5 rounded-full bg-[#eefcf4] text-[#2e9e5b] flex items-center justify-center shrink-0 border border-white text-[8px] shadow-xs">
                  <i className="fa-solid fa-check" />
                </div>
                <span>Información general</span>
              </div>

              <div className="flex items-center gap-2.5">
                <div className="w-5 h-5 rounded-full bg-[#eefcf4] text-[#2e9e5b] flex items-center justify-center shrink-0 border border-white text-[8px] shadow-xs">
                  <i className="fa-solid fa-check" />
                </div>
                <span>Portada</span>
              </div>

              <div className="flex items-center gap-2.5">
                <div className="w-5 h-5 rounded-full bg-[#eefcf4] text-[#2e9e5b] flex items-center justify-center shrink-0 border border-white text-[8px] shadow-xs">
                  <i className="fa-solid fa-check" />
                </div>
                <span>Configuración</span>
              </div>

              <div className="flex items-center gap-2.5 text-slate-400">
                <div className="w-5 h-5 rounded-full bg-slate-50 text-slate-300 flex items-center justify-center shrink-0 border border-slate-100 text-[8px] shadow-xs">
                  <i className="fa-solid fa-circle" />
                </div>
                <span>Publicación</span>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
