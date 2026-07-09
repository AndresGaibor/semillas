import { PanelSeccionAdmin } from "@/componentes/ui/panel-seccion-admin";

export type ActivityLogItem = {
  id: string;
  texto: string;
  haceCuanto: string;
  tipo: "tema" | "actividad" | "club" | "recurso" | "aprobacion" | string;
};

type RecentActivitySidebarProps = {
  actividades: ActivityLogItem[];
  onVerTodaLaActividad?: () => void;
};

export function RecentActivitySidebar({
  actividades,
  onVerTodaLaActividad,
}: RecentActivitySidebarProps) {
  const getIconConfig = (tipo: string) => {
    switch (tipo) {
      case "tema":
        return {
          icon: "fa-leaf",
          color: "text-[#2E9E5B]",
          bg: "bg-[#2E9E5B]/10",
        };
      case "actividad":
        return {
          icon: "fa-pen-to-square",
          color: "text-[#E9A23B]",
          bg: "bg-[#E9A23B]/10",
        };
      case "club":
        return {
          icon: "fa-people-group",
          color: "text-[#8b5cf6]",
          bg: "bg-[#8b5cf6]/10",
        };
      case "recurso":
        return {
          icon: "fa-cloud-arrow-up",
          color: "text-[#3d8bd4]",
          bg: "bg-[#3d8bd4]/10",
        };
      case "aprobacion":
      default:
        return {
          icon: "fa-circle-check",
          color: "text-[#E9A23B]",
          bg: "bg-[#E9A23B]/10",
        };
    }
  };

  return (
    <PanelSeccionAdmin
      titulo="Actividad reciente"
      footer={
        <button
          type="button"
          onClick={onVerTodaLaActividad}
          className="inline-block select-none py-1 text-center text-xs font-extrabold text-primario transition-colors hover:text-primario-oscuro"
        >
          Ver toda la actividad
        </button>
      }
    >
      <div className="flex flex-col gap-4">
        {actividades.map((act) => {
          const config = getIconConfig(act.tipo);
          return (
            <div key={act.id} className="flex items-start gap-3 select-none">
              <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl ${config.bg}`}>
                <i className={`fa-solid ${config.icon} text-xs ${config.color}`} />
              </div>
              <div className="flex min-w-0 flex-1 flex-col">
                <p className="text-[12.8px] font-semibold leading-snug text-neutro-oscuro-max">
                  {act.texto}
                </p>
                <span className="mt-1 text-[10px] leading-none text-neutro">
                  {act.haceCuanto}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </PanelSeccionAdmin>
  );
}
