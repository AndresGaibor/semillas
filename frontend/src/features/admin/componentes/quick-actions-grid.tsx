import { BloqueIconoTexto } from "@/componentes/ui/bloque-icono-texto";

type ActionItem = {
  title: string;
  description: string;
  icon: string;
  iconColor: string;
  iconBg: string;
  cardBg: string;
  onClick: () => void;
};

type QuickActionsGridProps = {
  onCrearTema: () => void;
  onAgregarActividad: () => void;
  onSubirRecurso: () => void;
  onRevisarContenido: () => void;
};

export function QuickActionsGrid({
  onCrearTema,
  onAgregarActividad,
  onSubirRecurso,
  onRevisarContenido,
}: QuickActionsGridProps) {
  const actions: ActionItem[] = [
    {
      title: "Crear tema",
      description: "Desarrolla un nuevo tema para tus sendas.",
      icon: "fa-circle-plus",
      iconColor: "text-[#2E9E5B]",
      iconBg: "bg-[#2E9E5B]/10",
      cardBg: "hover:border-[#2E9E5B]/30 hover:bg-[#2E9E5B]/5",
      onClick: onCrearTema,
    },
    {
      title: "Agregar actividad",
      description: "Crea actividades interactivas.",
      icon: "fa-pen-clip",
      iconColor: "text-[#E9A23B]",
      iconBg: "bg-[#E9A23B]/10",
      cardBg: "hover:border-[#E9A23B]/30 hover:bg-[#E9A23B]/5",
      onClick: onAgregarActividad,
    },
    {
      title: "Subir recurso",
      description: "Añade videos, audios o documentos.",
      icon: "fa-cloud-arrow-up",
      iconColor: "text-[#3d8bd4]",
      iconBg: "bg-[#3d8bd4]/10",
      cardBg: "hover:border-[#3d8bd4]/30 hover:bg-[#3d8bd4]/5",
      onClick: onSubirRecurso,
    },
    {
      title: "Revisar contenido",
      description: "Revisa y aprueba contenido pendiente.",
      icon: "fa-shield-halved",
      iconColor: "text-[#8b5cf6]",
      iconBg: "bg-[#8b5cf6]/10",
      cardBg: "hover:border-[#8b5cf6]/30 hover:bg-[#8b5cf6]/5",
      onClick: onRevisarContenido,
    },
  ];

  return (
    <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm flex flex-col text-left">
      <div className="mb-5">
        <h3 className="text-[17px] font-black text-neutro-oscuro-max">Acciones rápidas</h3>
        <p className="text-xs text-neutro mt-0.5">Crea, administra y revisa contenido fácilmente.</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {actions.map((act) => (
          <button
            key={act.title}
            onClick={act.onClick}
            className={`rounded-2xl border border-slate-100 bg-white p-4 transition-all duration-200 text-left outline-none ${act.cardBg}`}
          >
            <BloqueIconoTexto
              icono={<i className={`fa-solid ${act.icon} ${act.iconColor}`} />}
              titulo={act.title}
              descripcion={act.description}
              className="w-full"
              iconoCajaClassName={act.iconBg}
              tituloClassName="text-neutro-oscuro-max"
              descripcionClassName="text-neutro"
            />
          </button>
        ))}
      </div>
    </div>
  );
}
