import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { obtenerTemaAdmin, obtenerPasosAdmin } from "../features/admin/admin.api";
import { obtenerActividades } from "../features/themes/themes.api";
import { obtenerMiPerfil } from "../features/profile/profile.api";
import { ArrowLeft, Loader, Eye } from "lucide-react";

export const Route = createFileRoute("/admin/temas/$themeId/preview")({
  component: AdminThemePreviewPage
});

function AdminThemePreviewPage() {
  const { themeId } = Route.useParams();
  const navigate = useNavigate();

  const meQuery = useQuery({ queryKey: ["me"], queryFn: obtenerMiPerfil });
  const themeQuery = useQuery({ queryKey: ["admin", "theme", themeId], queryFn: () => obtenerTemaAdmin(themeId) });
  const stepsQuery = useQuery({ queryKey: ["admin", "theme", themeId, "steps"], queryFn: () => obtenerPasosAdmin(themeId) });
  const activitiesQuery = useQuery({
    queryKey: ["admin", "theme", themeId, "activities"],
    queryFn: () => obtenerActividades(themeId, meQuery.data?.perfil?.grupo_edad_id ?? undefined),
    enabled: !!meQuery.data
  });

  const theme = themeQuery.data;

  return (
    <div>
      <button onClick={() => navigate({ to: "/admin/temas" })} className="flex items-center gap-1 text-sm text-[#123b2c]/50 mb-6">
        <ArrowLeft size={16} /> Volver
      </button>

      {themeQuery.isLoading && (
        <div className="flex justify-center py-12"><Loader className="animate-spin text-[#2e9e5b]" size={24} /></div>
      )}

      <div className="bg-white rounded-2xl p-6 shadow-sm mb-6">
        <h2 className="text-xl font-bold text-[#123b2c]">{theme?.titulo ?? "Sin título"}</h2>
        <p className="text-[#123b2c]/60 mt-2">{theme?.resumen}</p>
        <p className="text-sm text-[#123b2c]/40 mt-3"><strong>Objetivo:</strong> {theme?.objetivo}</p>
        <div className="flex items-center gap-3 mt-3">
          <span className="text-xs px-2 py-1 bg-[#2e9e5b]/10 text-[#2e9e5b] rounded-md">{theme?.estado}</span>
          <span className="text-xs text-[#f4b740]">{theme?.xp_recompensa} XP</span>
        </div>
      </div>

      <h3 className="font-bold text-[#123b2c] mb-3">Recorrido CRECER</h3>
      {stepsQuery.data?.length === 0 && <p className="text-sm text-[#123b2c]/40 mb-4">Sin pasos CRECER aún.</p>}
      <div className="grid gap-3 mb-6">
        {stepsQuery.data?.map((step) => (
          <div key={step.id} className="bg-white rounded-xl p-4 shadow-sm border-l-4" style={{ borderLeftColor: step.tipo_paso?.color_hex ?? "#ccc" }}>
            <h4 className="font-semibold text-[#123b2c]" style={{ color: step.tipo_paso?.color_hex ?? "#333" }}>{step.tipo_paso?.nombre}</h4>
            {step.contenidos?.map((content) => (
              <div key={content.id} className="mt-2 text-sm text-[#123b2c]/70">
                <p className="font-medium">{content.titulo}</p>
                <p className="mt-1 whitespace-pre-wrap">{content.cuerpo}</p>
                {content.instruccion_corta && <p className="text-xs italic text-[#123b2c]/40 mt-1">{content.instruccion_corta}</p>}
              </div>
            ))}
          </div>
        ))}
      </div>

      <h3 className="font-bold text-[#123b2c] mb-3">Actividades</h3>
      {activitiesQuery.data?.length === 0 && <p className="text-sm text-[#123b2c]/40">Sin actividades aún.</p>}
      <div className="grid gap-3">
        {activitiesQuery.data?.map((activity) => (
          <div key={activity.id} className="bg-white rounded-xl p-4 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-semibold text-[#123b2c]">{activity.titulo}</h4>
              <span className="text-xs text-[#f4b740]">{activity.xp_recompensa} XP</span>
            </div>
            <p className="text-sm text-[#123b2c]/60 mb-3">{activity.consigna}</p>
            <div className="grid gap-1.5">
              {activity.opciones?.map((opt) => (
                <div key={opt.id} className={`text-sm px-3 py-2 rounded-lg ${opt.correcta ? "bg-[#2e9e5b]/10 text-[#2e9e5b]" : "bg-[#f7f4ec] text-[#123b2c]/60"}`}>
                  {opt.etiqueta}. {opt.texto} {opt.correcta && "✓"}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
