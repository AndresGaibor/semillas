import { Button } from "@/componentes/ui/button";
import { TarjetaMetricaCompacta } from "@/componentes/ui/card-metrica";
import { PanelSeccionAdmin } from "@/componentes/ui/panel-seccion-admin";

type ContentStatusGridProps = {
  borradores: number;
  enRevision: number;
  publicados: number;
  archivados: number;
  onVerTodo?: () => void;
};

export function ContentStatusGrid({
  borradores,
  enRevision,
  publicados,
  archivados,
  onVerTodo,
}: ContentStatusGridProps) {
  const total = borradores + enRevision + publicados + archivados;

  const statusItems = [
    {
      label: "Borradores",
      value: borradores,
      subtexto: total === 0 ? "0% del total" : `${Math.round((borradores / total) * 100)}% del total`,
      icon: <i className="fa-solid fa-file-lines text-sm text-[#E9A23B]" />,
      tone: { fondoIcono: "#E9A23B1A", colorSubtexto: "text-[#E9A23B]" },
    },
    {
      label: "En revisión",
      value: enRevision,
      subtexto: total === 0 ? "0% del total" : `${Math.round((enRevision / total) * 100)}% del total`,
      icon: <i className="fa-solid fa-clock text-sm text-[#3d8bd4]" />,
      tone: { fondoIcono: "#3d8bd41A", colorSubtexto: "text-[#3d8bd4]" },
    },
    {
      label: "Publicados",
      value: publicados,
      subtexto: total === 0 ? "0% del total" : `${Math.round((publicados / total) * 100)}% del total`,
      icon: <i className="fa-solid fa-circle-check text-sm text-[#2E9E5B]" />,
      tone: { fondoIcono: "#2E9E5B1A", colorSubtexto: "text-[#2E9E5B]" },
    },
    {
      label: "Archivados",
      value: archivados,
      subtexto: total === 0 ? "0% del total" : `${Math.round((archivados / total) * 100)}% del total`,
      icon: <i className="fa-solid fa-box-archive text-sm text-[#718096]" />,
      tone: { fondoIcono: "#7180961A", colorSubtexto: "text-[#718096]" },
    },
  ];

  return (
    <PanelSeccionAdmin
      titulo="Estado del contenido"
      descripcion="Resumen general del estado de todo el contenido."
      accion={
        <Button
          variant="outline"
          size="sm"
          onClick={onVerTodo}
          className="h-9 rounded-xl border-slate-200 px-4 text-xs font-bold text-slate-600"
        >
          Ver todo
        </Button>
      }
    >
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
        {statusItems.map((item) => (
          <TarjetaMetricaCompacta
            key={item.label}
            titulo={item.label}
            valor={item.value}
            subtexto={item.subtexto}
            icono={item.icon}
            tono={item.tone}
          />
        ))}
      </div>
    </PanelSeccionAdmin>
  );
}
