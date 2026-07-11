import { Link2, Mail } from "lucide-react";
import { ActionButton } from "@/features/perfil/componentes/ActionButton";

interface SeccionCuentaProps {
  esInvitado: boolean;
  onVincularGoogle: () => void;
  onVincularCorreo: () => void;
}

export function SeccionCuenta({
  esInvitado,
  onVincularGoogle,
  onVincularCorreo,
}: SeccionCuentaProps) {
  return (
    <section className="rounded-3xl border border-slate-100 bg-white p-5 shadow-sm">
      <p className="text-xs font-black uppercase tracking-[0.14em] text-slate-400">Cuenta</p>
      <h2 className="mt-1 text-xl font-black text-slate-800">Acceso</h2>

      <div className="mt-4 rounded-2xl border border-slate-100 bg-slate-50 p-4">
        <p className="text-sm font-black text-slate-800">{esInvitado ? "Cuenta invitada" : "Cuenta vinculada"}</p>
        <p className="mt-2 text-sm leading-6 text-slate-500">
          {esInvitado
            ? "Conecta Google o correo para guardar tu avance."
            : "Puedes agregar otro método de acceso sin perder tu progreso."}
        </p>
      </div>

      <div className="mt-4 grid gap-3">
        {esInvitado ? (
          <>
            <ActionButton icon={Link2} label="Vincular con Google" onClick={onVincularGoogle} />
            <ActionButton icon={Mail} label="Vincular con correo" onClick={onVincularCorreo} />
          </>
        ) : (
          <ActionButton icon={Link2} label="Vincular Google" onClick={onVincularGoogle} />
        )}
      </div>
    </section>
  );
}
