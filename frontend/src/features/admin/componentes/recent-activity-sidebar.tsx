import { BloqueIconoTexto } from "@/componentes/ui/bloque-icono-texto";

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
    <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm flex flex-col text-left">
      <h3 className="text-[17px] font-black text-neutro-oscuro-max mb-4">Actividad reciente</h3>

      <div className="flex flex-col gap-4">
        {actividades.map((act) => {
          const config = getIconConfig(act.tipo);
          return (
            <BloqueIconoTexto
              key={act.id}
              icono={<i className={`fa-solid ${config.icon} text-xs ${config.color}`} />}
              titulo={act.texto}
              descripcion={act.haceCuanto}
              iconoCajaClassName={`${config.bg} h-8 w-8 rounded-xl`}
              tituloClassName="text-[12.8px] leading-snug text-neutro-oscuro-max font-semibold normal-case"
              descripcionClassName="text-[10px] text-neutro mt-1 leading-none"
              className="items-start select-none"
            />
          );
        })}
      </div>

      <button
        onClick={onVerTodaLaActividad}
        className="mt-5 text-center text-xs font-extrabold text-primario hover:text-primario-oscuro transition-colors py-1 inline-block select-none"
      >
        Ver toda la actividad
      </button>
    </div>
  );
}
