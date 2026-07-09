import * as React from "react";
import { TabsOpciones } from "@/componentes/ui/navegacion-tabs";

export type CategoriaLogro = "todas" | "padre" | "hijo" | "especial";

export interface LogrosTabsFilterProps {
  activo: CategoriaLogro;
  onChange: (tab: CategoriaLogro) => void;
}

export const LogrosTabsFilter: React.FC<LogrosTabsFilterProps> = ({ activo, onChange }) => {
  return (
    <TabsOpciones
      activo={activo}
      onCambiar={(tab) => onChange(tab as CategoriaLogro)}
      opciones={[
        { id: "todas", label: "Todas" },
        { id: "padre", label: "Senda del padre" },
        { id: "hijo", label: "Senda del hijo" },
        { id: "especial", label: "Especiales" },
      ]}
      clase="mb-6"
      variante="pildora"
    />
  );
};
