import { AdminSectionHeader } from "./admin-section-header";

type AdminThemesHeaderProps = {
  onCrearTema: () => void;
};

export function AdminThemesHeader({ onCrearTema }: AdminThemesHeaderProps) {
  return (
    <AdminSectionHeader
      icono={<i className="fa-solid fa-leaf text-2xl text-[#2e9e5b]" />}
      iconoContenedorClassName="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#eefcf4]"
      titulo="Gestión de temas"
      descripcion="Crea, organiza y administra los temas que forman parte de las sendas."
      accionPrincipal="Crear tema"
      onAccionPrincipal={onCrearTema}
      accionSecundaria={<i className="fa-solid fa-chevron-down text-[10px]" />}
    />
  );
}
