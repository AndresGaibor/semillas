import { AdminSectionHeader } from "./admin-section-header";

type AdminMediaHeaderProps = {
  onSubirRecurso: () => void;
};

export function AdminMediaHeader({ onSubirRecurso }: AdminMediaHeaderProps) {
  return (
    <AdminSectionHeader
      icono={<i className="fa-solid fa-photo-film text-xl" />}
      iconoContenedorClassName="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#eefcf4] text-[#2e9e5b]"
      titulo="Medios"
      descripcion="Gestiona los recursos multimedia de la plataforma."
      accionPrincipal="Subir recurso"
      onAccionPrincipal={onSubirRecurso}
      accionSecundaria={<i className="fa-solid fa-chevron-down text-[10px]" />}
      accionSecundariaDeshabilitada
    />
  );
}
