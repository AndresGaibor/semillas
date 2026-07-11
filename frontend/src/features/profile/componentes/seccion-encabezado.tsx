import type { Perfil, Usuario } from "@/shared/api/api";

interface SeccionEncabezadoProps {
  usuario: Usuario | undefined;
  perfil: Perfil | null | undefined;
  esInvitado: boolean;
  avatarUrl: string;
  nombreVisible: string;
  proveedorLabel: string;
}

export function SeccionEncabezado({
  usuario,
  esInvitado,
  avatarUrl,
  nombreVisible,
  proveedorLabel,
}: SeccionEncabezadoProps) {
  return (
    <section className="rounded-3xl border border-slate-100 bg-white p-5 shadow-sm sm:p-6">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-3xl border border-slate-100 bg-slate-50">
            <img src={avatarUrl} alt={`Avatar de ${nombreVisible}`} className="h-full w-full object-cover" />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-black uppercase tracking-[0.14em] text-[#2E9E5B]">Mi perfil</p>
            <h1 className="mt-1 truncate text-2xl font-black leading-tight text-slate-800 sm:text-3xl">
              {nombreVisible}
            </h1>
            <p className="mt-1 break-all text-sm font-medium text-slate-500">
              {esInvitado ? "Cuenta invitada" : usuario?.correo ?? "Cuenta registrada"}
            </p>
          </div>
        </div>

        <span className="inline-flex w-fit items-center rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-extrabold text-slate-600">
          {proveedorLabel}
        </span>
      </div>

      <div className="mt-5 rounded-2xl border border-slate-100 bg-slate-50 p-4 text-sm font-medium leading-6 text-slate-600">
        {esInvitado
          ? "Vincula tu cuenta para conservar tu avance si cambias de dispositivo."
          : "Tu progreso, logros y preferencias están sincronizados con tu cuenta."}
      </div>
    </section>
  );
}
