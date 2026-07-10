import { Link2, BookOpen, Coins, GraduationCap, Mail, Trophy } from "lucide-react";
import type { Perfil, Usuario } from "../../shared/api/api";
import type { GamificacionMiRespuesta, ProgresoMiRespuesta } from "./profile.api";
import { MetricCard } from "../perfil/componentes/MetricCard";
import { ActionButton } from "../perfil/componentes/ActionButton";
import { Item } from "../perfil/componentes/Item";
import { useProfileDashboard } from "./hooks/use-profile-dashboard";

export type PerfilDashboardProps = {
  usuario: Usuario | undefined;
  perfil: Perfil | null | undefined;
  gamificacion: GamificacionMiRespuesta | undefined;
  progreso: ProgresoMiRespuesta | undefined;
  onVincularGoogle: () => void;
  onVincularCorreo: () => void;
};

export function ProfileDashboard({
  usuario,
  perfil,
  gamificacion,
  progreso,
  onVincularGoogle,
  onVincularCorreo,
}: PerfilDashboardProps) {
  const {
    nivel,
    logros,
    completados,
    esInvitado,
    proveedorLabel,
    avatarUrl,
    nombreVisible,
  } = useProfileDashboard({
    usuario,
    perfil,
    gamificacion,
    progreso,
    onVincularGoogle,
    onVincularCorreo,
  });

  return (
    <div className="grid grid-cols-1 gap-6 text-left lg:grid-cols-[1fr_320px]">
      <div className="min-w-0 space-y-6">
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

        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <MetricCard icon={Coins} label="XP total" value={nivel?.xp_total ?? 0} accent="text-[#2E9E5B]" />
          <MetricCard icon={GraduationCap} label="Nivel" value={nivel ? `${nivel.numero_nivel}` : "—"} helper={nivel?.nombre_nivel ?? "Sin nivel"} accent="text-[#E9A23B]" />
          <MetricCard icon={Trophy} label="Logros" value={logros.length} accent="text-[#EE6C4D]" />
          <MetricCard icon={BookOpen} label="Temas completados" value={completados.temas} accent="text-[#17A398]" />
        </section>

        <section className="rounded-3xl border border-slate-100 bg-white p-5 shadow-sm sm:p-6">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.14em] text-slate-400">Progreso</p>
              <h2 className="mt-1 text-xl font-black text-slate-800">Logros recientes</h2>
            </div>
            <span className="text-sm font-bold text-slate-500">{completados.actividades} actividades completadas</span>
          </div>

          <div className="mt-5 grid gap-3 md:grid-cols-2">
            {logros.length > 0 ? (
              logros.slice(0, 4).map((item) => (
                <article key={item.logro_id} className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                  <div className="flex items-start gap-3">
                    <div className="rounded-2xl bg-white p-2 text-[#2E9E5B] shadow-sm ring-1 ring-slate-100">
                      <Trophy className="h-5 w-5" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-black text-slate-800">{item.logro?.nombre ?? "Logro desbloqueado"}</h3>
                      <p className="mt-1 text-sm leading-6 text-slate-500">
                        {item.logro?.descripcion ?? "Completa temas y actividades para seguir desbloqueando insignias."}
                      </p>
                    </div>
                  </div>
                </article>
              ))
            ) : (
              <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-5 text-sm font-medium leading-6 text-slate-500 md:col-span-2">
                Aún no tienes logros visibles. Completa temas y actividades para desbloquear tus primeras insignias.
              </div>
            )}
          </div>
        </section>
      </div>

      <aside className="space-y-6">
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

        <section className="rounded-3xl border border-slate-100 bg-white p-5 shadow-sm">
          <p className="text-xs font-black uppercase tracking-[0.14em] text-slate-400">Ajustes</p>
          <h2 className="mt-1 text-xl font-black text-slate-800">Preferencias</h2>

          <dl className="mt-4 grid gap-3 text-sm">
            <Item label="Franja" value={perfil?.grupo_edad_id ?? "Sin definir"} />
            <Item label="Audio" value={perfil?.prefiere_audio ? "Sí" : "No"} />
            <Item label="Texto" value={perfil?.tamano_texto_preferido ?? "mediano"} />
            <Item label="Correo" value={usuario?.correo ?? "No vinculado"} />
          </dl>
        </section>
      </aside>
    </div>
  );
}
