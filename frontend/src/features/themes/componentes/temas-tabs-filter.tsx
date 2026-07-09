import * as React from "react";
import { TabsOpciones } from "@/componentes/ui/navegacion-tabs";

export type FiltroTab = "todos" | "completados" | "progreso" | "favoritos";

export interface TemasTabsFilterProps {
  activo: FiltroTab;
  onChange: (tab: FiltroTab) => void;
}

export const TemasTabsFilter: React.FC<TemasTabsFilterProps> = ({ activo, onChange }) => {
  return (
    <TabsOpciones
      activo={activo}
      onCambiar={(tab) => onChange(tab as FiltroTab)}
      opciones={[
        { id: "todos", label: "Todos los temas" },
        { id: "completados", label: "Completados" },
        { id: "progreso", label: "En progreso" },
        { id: "favoritos", label: "Favoritos" },
      ]}
      clase="mb-6"
    />
  );
};
