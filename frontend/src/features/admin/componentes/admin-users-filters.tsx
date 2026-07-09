import { Boton } from "@/componentes/ui/boton";
import { CampoBusqueda } from "@/componentes/ui/campo-busqueda";

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

const OPCIONES_ROL: { value: string; label: string }[] = [
  { value: "Niño", label: "Niño" },
  { value: "Adolescente", label: "Adolescente" },
  { value: "Padre/Madre", label: "Padre/Madre" },
  { value: "Moderador", label: "Moderador" },
  { value: "Administrador", label: "Administrador" },
];

const OPCIONES_FRANJA: { value: string; label: string }[] = [
  { value: "8-10 años", label: "8-10 años" },
  { value: "11-13 años", label: "11-13 años" },
  { value: "14+ años", label: "14+ años" },
  { value: "Todas", label: "Todas" },
  { value: "-", label: "-" },
];

const OPCIONES_ESTADO: { value: string; label: string }[] = [
  { value: "activo", label: "Activo" },
  { value: "pendiente", label: "Pendiente" },
  { value: "bloqueado", label: "Bloqueado" },
];

const OPCIONES_CLUB: { value: string; label: string }[] = [
  { value: "Semillitas de Luz", label: "Semillitas de Luz" },
  { value: "Guardianes de Paz", label: "Guardianes de Paz" },
  { value: "Corazones Valientes", label: "Corazones Valientes" },
  { value: "Jóvenes en Misión", label: "Jóvenes en Misión" },
  { value: "Todos los clubes", label: "Todos los clubes" },
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
    <div className="bg-white rounded-3xl border border-slate-100 p-5 shadow-sm text-left flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-3">
        <CampoBusqueda
          valor={searchValue}
          onChange={onSearchChange}
          placeholder="Buscar usuario por nombre o email..."
          contenedorClassName="flex-1 min-w-[220px]"
          inputClassName="rounded-full pl-10 py-2.5 text-[13px] focus:ring-2 focus:ring-[#2E9E5B]/30 focus:border-[#2E9E5B] placeholder:text-slate-400 placeholder:font-normal"
        />

        <SelectFiltro value={selectedRol} onChange={onRolChange} placeholder="Rol" opciones={OPCIONES_ROL} />
        <SelectFiltro value={selectedFranja} onChange={onFranjaChange} placeholder="Franja" opciones={OPCIONES_FRANJA} />
        <SelectFiltro value={selectedEstado} onChange={onEstadoChange} placeholder="Estado" opciones={OPCIONES_ESTADO} />
        <SelectFiltro value={selectedClub} onChange={onClubChange} placeholder="Club" opciones={OPCIONES_CLUB} />

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

function SelectFiltro({
  value,
  onChange,
  placeholder,
  opciones,
}: {
  value: string;
  onChange: (val: string) => void;
  placeholder: string;
  opciones: { value: string; label: string }[];
}) {
  return (
    <div className="relative min-w-[120px]">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-2.5 rounded-full border border-slate-100 bg-slate-50/50 font-semibold text-[13px] text-slate-700 appearance-none focus:border-[#2e9e5b] focus:bg-white focus:outline-hidden cursor-pointer"
      >
        <option value="">{placeholder}</option>
        {opciones.map((op) => (
          <option key={op.value} value={op.value}>
            {op.label}
          </option>
        ))}
      </select>
      <i className="fa-solid fa-chevron-down absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 text-[10px] pointer-events-none" />
    </div>
  );
}
