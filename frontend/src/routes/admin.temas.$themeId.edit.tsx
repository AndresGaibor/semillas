import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { obtenerTemaAdmin, actualizarTema } from "../features/admin/admin.api";
import { Loader } from "lucide-react";

import { AdminTemasEditHeader } from "../features/admin/componentes/admin-temas-edit-header";
import { AdminTemasEditTabs } from "../features/admin/componentes/admin-temas-edit-tabs";
import { TabGeneral } from "../features/admin/componentes/tab-general";
import { TabPortada } from "../features/admin/componentes/tab-portada";
import { TabConfig } from "../features/admin/componentes/tab-config";
import { TabPublicacion } from "../features/admin/componentes/tab-publicacion";

import imgSprout from "@/assets/images/Ilustraciones/Semilla.png";

export const Route = createFileRoute("/admin/temas/$themeId/edit")({
  component: EditThemePage
});

type TabType = "general" | "portada" | "config" | "publicacion";

function EditThemePage() {
  const { themeId } = Route.useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [activeTab, setActiveTab] = useState<TabType>("general");
  const [title, setTitle] = useState("");
  const [targetAudience, setTargetAudience] = useState("Niños de 6 a 10 años");
  const [shortDesc, setShortDesc] = useState("");
  const [category, setCategory] = useState("Confianza en Dios");
  const [keyVerse, setKeyVerse] = useState("");
  const [duration, setDuration] = useState(45);
  const [mainMessage, setMainMessage] = useState("");
  const [tagsList, setTagsList] = useState<string[]>(["cuidado", "amor de Dios", "confianza"]);

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

  const renderTabContent = () => {
    switch (activeTab) {
      case "general":
        return (
          <TabGeneral
            title={title} onTitleChange={setTitle}
            targetAudience={targetAudience} onTargetAudienceChange={setTargetAudience}
            shortDesc={shortDesc} onShortDescChange={setShortDesc}
            category={category} onCategoryChange={setCategory}
            keyVerse={keyVerse} onKeyVerseChange={setKeyVerse}
            duration={duration} onDurationChange={setDuration}
            mainMessage={mainMessage} onMainMessageChange={setMainMessage}
            tagsList={tagsList} onTagsChange={setTagsList}
          />
        );
      case "portada":
        return <TabPortada />;
      case "config":
        return <TabConfig />;
      case "publicacion":
        return <TabPublicacion />;
    }
  };

  const completenessItems = [
    { label: "Información general", done: true },
    { label: "Portada", done: true },
    { label: "Configuración", done: true },
    { label: "Publicación", done: false },
  ];

  return (
    <div className="flex flex-col gap-6 text-left select-none">
      <AdminTemasEditHeader title={title} onNavigate={(to) => navigate({ to })} />

      {themeQuery.isLoading && (
        <div className="flex justify-center py-12"><Loader className="animate-spin text-[#2e9e5b]" size={24} /></div>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
        <div className="flex flex-col gap-6 lg:col-span-3 min-w-0">
          <AdminTemasEditTabs activeTab={activeTab} onTabChange={setActiveTab} />
          {renderTabContent()}
        </div>

        <div className="flex flex-col gap-6">
          <div className="bg-white rounded-3xl border border-slate-100 p-5 shadow-sm flex flex-col gap-3 text-left">
            <h3 className="font-extrabold text-slate-800 text-sm mb-2 border-b border-slate-50 pb-2.5 select-none">Acciones</h3>
            <button
              onClick={() => updateMutation.mutate()}
              disabled={updateMutation.isPending}
              className="w-full !bg-verde-brote hover:opacity-95 text-white font-bold text-xs py-3.5 px-4 rounded-xl flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              {updateMutation.isPending ? <Loader className="animate-spin" size={12} /> : <i className="fa-solid fa-circle-check text-[10px]" />}
              <span>Guardar cambios</span>
            </button>
            <button type="button" className="w-full bg-white hover:bg-slate-50 border border-slate-200 text-[#6c3aed] font-bold text-xs py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-colors cursor-pointer">
              <i className="fa-regular fa-clone text-[10px]" /> Duplicar tema
            </button>
            <button type="button" className="w-full bg-white hover:bg-red-50/50 border border-red-200 text-red-650 font-bold text-xs py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-colors cursor-pointer">
              <i className="fa-solid fa-box-archive text-[10px]" /> Archivar tema
            </button>
          </div>

          <div className="bg-white rounded-3xl border border-slate-100 p-5 shadow-sm flex flex-col text-left">
            <h3 className="font-extrabold text-slate-800 text-sm mb-4 select-none">Estado del tema</h3>
            <div className="flex items-center gap-4">
              <div className="flex flex-col gap-2 flex-1">
                <div>
                  <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded ${theme?.estado === "publicado" ? "bg-emerald-100 text-emerald-700" : theme?.estado === "borrador" ? "bg-amber-100 text-amber-700" : theme?.estado === "revision" ? "bg-blue-100 text-blue-700" : "bg-slate-100 text-slate-600"} text-[10px] font-bold`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${theme?.estado === "publicado" ? "bg-emerald-500" : theme?.estado === "borrador" ? "bg-amber-500" : theme?.estado === "revision" ? "bg-blue-500" : "bg-slate-500"}`} />
                    {theme?.estado === "publicado" ? "Publicado" : theme?.estado === "borrador" ? "Borrador" : theme?.estado === "revision" ? "En revisión" : theme?.estado ?? "Borrador"}
                  </span>
                </div>
                <p className="text-[10.5px] text-slate-400 font-semibold leading-relaxed">
                  {theme?.estado === "publicado" ? "Este tema está visible y disponible para todos los usuarios." : "Este tema aún no está visible para los usuarios."}
                </p>
              </div>
              <div className="w-14 h-14 overflow-hidden shrink-0 border border-slate-100 bg-slate-50/50 rounded-2xl flex items-center justify-center">
                <img src={imgSprout} alt="Sprouting plant" className="w-10 h-10 object-contain" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-slate-100 p-5 shadow-sm flex flex-col gap-2.5 text-[11px] font-bold text-slate-600 text-left select-none">
            <h3 className="font-extrabold text-slate-800 text-sm mb-1.5">Última edición</h3>
            <div className="flex justify-between items-center">
              <span className="text-slate-400 font-bold">Por:</span>
              <span className="text-slate-700 font-extrabold">{theme?.creado_por?.nombre_visible ?? "—"}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-400 font-bold">Fecha:</span>
              <span className="text-slate-700 font-extrabold">
                {theme?.actualizado_en
                  ? new Date(theme.actualizado_en).toLocaleDateString("es-EC", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })
                  : "—"}
              </span>
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-slate-100 p-5 shadow-sm flex flex-col text-left">
            <h3 className="font-extrabold text-slate-800 text-sm select-none">Progreso de completitud</h3>
            <div className="flex items-center justify-between mt-3 mb-2 font-bold text-xs select-none">
              <div className="w-full bg-slate-150 h-2 rounded-full overflow-hidden mr-3">
                <div className="bg-[#2e9e5b] h-full rounded-full" style={{ width: "85%" }} />
              </div>
              <span className="text-slate-700 font-black">85%</span>
            </div>
            <p className="text-[10.5px] text-slate-400 font-semibold leading-relaxed mb-4 select-none">Excelente trabajo. Solo faltan algunos detalles para completar tu tema.</p>
            <div className="flex flex-col gap-3 text-xs font-bold text-slate-650">
              {completenessItems.map((item) => (
                <div key={item.label} className={`flex items-center gap-2.5 ${item.done ? "" : "text-slate-400"}`}>
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 border border-white text-[8px] shadow-xs ${item.done ? "bg-[#eefcf4] text-[#2e9e5b]" : "bg-slate-50 text-slate-300"}`}>
                    <i className={`fa-solid ${item.done ? "fa-check" : "fa-circle"}`} />
                  </div>
                  <span>{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
