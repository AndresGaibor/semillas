import { Boton } from "@/componentes/ui/boton";
import { CampoBusqueda } from "@/componentes/ui/navegacion-tabs";
import { SelectFiltro } from "@/componentes/ui/select-filtro";

export type AdminUsersFiltersProps = {
  searchValue: string;
  onSearchChange: (val: string) => void;
  selectedRol: string;
  onRolChange: (val: string) => void;
  selectedFranja: string;
  onFranjaChange: (val: string) => void;
  selectedEstado: string;
  onEstadoChange: (val: string) => void;
  selectedClub: string;
  onClubChange: (val: string) => void;
  onClear: () => void;
};

const OPCIONES_ROL: { id: string; nombre: string }[] = [
  { id: "Niño", nombre: "Niño" },
  { id: "Adolescente", nombre: "Adolescente" },
  { id: "Padre/Madre", nombre: "Padre/Madre" },
  { id: "Moderador", nombre: "Moderador" },
  { id: "Administrador", nombre: "Administrador" },
];

const OPCIONES_FRANJA: { id: string; nombre: string }[] = [
  { id: "8-10 años", nombre: "8-10 años" },
  { id: "11-13 años", nombre: "11-13 años" },
  { id: "14+ años", nombre: "14+ años" },
  { id: "Todas", nombre: "Todas" },
  { id: "-", nombre: "-" },
];

const OPCIONES_ESTADO: { id: string; nombre: string }[] = [
  { id: "activo", nombre: "Activo" },
  { id: "pendiente", nombre: "Pendiente" },
  { id: "bloqueado", nombre: "Bloqueado" },
];

const OPCIONES_CLUB: { id: string; nombre: string }[] = [
  { id: "Semillitas de Luz", nombre: "Semillitas de Luz" },
  { id: "Guardianes de Paz", nombre: "Guardianes de Paz" },
  { id: "Corazones Valientes", nombre: "Corazones Valientes" },
  { id: "Jóvenes en Misión", nombre: "Jóvenes en Misión" },
  { id: "Todos los clubes", nombre: "Todos los clubes" },
];

export function AdminUsersFilters({
  searchValue,
  onSearchChange,
  selectedRol,
  onRolChange,
  selectedFranja,
  onFranjaChange,
  selectedEstado,
  onEstadoChange,
  selectedClub,
  onClubChange,
  onClear,
}: AdminUsersFiltersProps) {
  const tieneFiltros = !!(searchValue || selectedRol || selectedFranja || selectedEstado || selectedClub);

  return (
    <div className="bg-[#142e22] rounded-3xl border border-[#1a3a2a] p-5 shadow-sm text-left flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-3">
        <CampoBusqueda
          valor={searchValue}
          onChange={onSearchChange}
          placeholder="Buscar usuario por nombre o email..."
          contenedorClassName="flex-1 min-w-[220px]"
          inputClassName="rounded-full pl-10 py-2.5 text-[13px] focus:ring-2 focus:ring-[#2E9E5B]/30 focus:border-[#2E9E5B] placeholder:text-emerald-400/50 placeholder:font-normal"
        />

        <div className="w-full lg:w-48">
          <SelectFiltro
            opciones={OPCIONES_ROL}
            placeholder="Rol"
            etiquetaAria="Filtrar por rol"
            value={selectedRol}
            onChange={(e) => onRolChange(e.target.value)}
          />
        </div>

        <div className="w-full lg:w-48">
          <SelectFiltro
            opciones={OPCIONES_FRANJA}
            placeholder="Franja"
            etiquetaAria="Filtrar por franja"
            value={selectedFranja}
            onChange={(e) => onFranjaChange(e.target.value)}
          />
        </div>

        <div className="w-full lg:w-48">
          <SelectFiltro
            opciones={OPCIONES_ESTADO}
            placeholder="Estado"
            etiquetaAria="Filtrar por estado"
            value={selectedEstado}
            onChange={(e) => onEstadoChange(e.target.value)}
          />
        </div>

        <div className="w-full lg:w-48">
          <SelectFiltro
            opciones={OPCIONES_CLUB}
            placeholder="Club"
            etiquetaAria="Filtrar por club"
            value={selectedClub}
            onChange={(e) => onClubChange(e.target.value)}
          />
        </div>

        {tieneFiltros && (
          <Boton
            variante="contorno"
            tamano="pequeno"
            forma="pildora"
            onClick={onClear}
          >
            Limpiar filtros
          </Boton>
        )}
      </div>
    </div>
  );
}
