import { Link2, BadgeCheck, BookOpen, Coins, GraduationCap, Mail, Trophy } from "lucide-react";
import type { ComponentType } from "react";
import type { Perfil, Usuario } from "../../shared/api/api";
import type { GamificacionMiRespuesta, ProgresoMiRespuesta } from "./profile.api";

type PerfilDashboardProps = {
  usuario: Usuario | undefined;
  perfil: Perfil | null | undefined;
  gamificacion: GamificacionMiRespuesta | undefined;
  progreso: ProgresoMiRespuesta | undefined;
  onVincularGoogle: () => void;
  onVincularCorreo: () => void;
};

function formatearProveedor(proveedor: string) {
  if (proveedor === "invitado") return "Invitado";
  if (proveedor === "google") return "Google";
  return "Correo";
}

function contarCompletados(progreso: ProgresoMiRespuesta | undefined) {
  return {
    temas: progreso?.progresos_tema.filter((tema) => tema.estado === "completado" || tema.estado === "completado_total").length ?? 0,
    actividades: progreso?.progresos_actividad.filter((actividad) => actividad.completado).length ?? 0,
  };
}

export function ProfileDashboard({
  usuario,
  perfil,
  gamificacion,
  progreso,
  onVincularGoogle,
  onVincularCorreo,
}: PerfilDashboardProps) {
  const nivel = gamificacion?.nivel;
  const logros = gamificacion?.logros ?? [];
  const completados = contarCompletados(progreso);
  const esInvitado = usuario?.proveedor === "invitado";
  const proveedorLabel = formatearProveedor(usuario?.proveedor ?? "invitado");

  return (
    <div className="space-y-6">
      <section className="rounded-[28px] border border-[#2E9E5B]/10 bg-gradient-to-br from-white via-[#F7F4EC] to-[#E8F7EE] p-5 shadow-[0_18px_50px_rgba(18,59,44,0.08)]">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="mb-2 inline-flex items-center gap-2 rounded-full bg-[#123B2C] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-white">
              <BadgeCheck className="h-3.5 w-3.5" />
              Mi perfil
            </p>
            <h1 className="text-3xl font-black tracking-tight text-[#123B2C]">{perfil?.apodo ?? usuario?.nombre_visible ?? "Semillero"}</h1>
            <p className="mt-2 max-w-xl text-sm text-[#123B2C]/70">
              {esInvitado
                ? "Tu progreso está guardado localmente. Vincula una cuenta para conservarlo en todos tus dispositivos."
                : "Tu cuenta ya está guardada y sincronizada. Aquí ves tu avance, tus logros y tus ajustes."}
            </p>
          </div>
          <div className="rounded-2xl bg-white/80 px-4 py-3 text-right shadow-sm ring-1 ring-[#2E9E5B]/10">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#123B2C]/45">Cuenta</p>
            <p className="text-sm font-bold text-[#123B2C]">{proveedorLabel}</p>
          </div>
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <MetricCard icon={Coins} label="XP total" value={nivel?.xp_total ?? 0} accent="text-[#2E9E5B]" />
          <MetricCard icon={GraduationCap} label="Nivel" value={nivel ? `${nivel.numero_nivel} · ${nivel.nombre_nivel}` : "Sin nivel"} accent="text-[#F4B740]" />
          <MetricCard icon={Trophy} label="Logros" value={logros.length} accent="text-[#EE6C4D]" />
          <MetricCard icon={BookOpen} label="Temas completados" value={completados.temas} accent="text-[#17A398]" />
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-[1.3fr_0.9fr]">
        <section className="rounded-[28px] bg-white p-5 shadow-sm ring-1 ring-black/5">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#123B2C]/45">Logros recientes</p>
              <h2 className="mt-1 text-xl font-black text-[#123B2C]">Insignias y progreso</h2>
            </div>
            <span className="rounded-full bg-[#2E9E5B]/10 px-3 py-1 text-xs font-semibold text-[#2E9E5B]">
              {completados.actividades} actividades completadas
            </span>
          </div>

          <div className="mt-5 grid gap-3 md:grid-cols-2">
            {logros.length > 0 ? (
              logros.slice(0, 4).map((item) => (
                <article key={item.logro_id} className="rounded-2xl border border-[#2E9E5B]/10 bg-[#F7F4EC] p-4">
                  <div className="flex items-start gap-3">
                    <div className="rounded-2xl bg-[#2E9E5B]/10 p-2 text-[#2E9E5B]">
                      <Trophy className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-[#123B2C]">{item.logro?.nombre ?? "Logro desbloqueado"}</h3>
                      <p className="mt-1 text-sm text-[#123B2C]/70">{item.logro?.descripcion ?? "Continúa avanzando para desbloquear nuevas insignias."}</p>
                    </div>
                  </div>
                </article>
              ))
            ) : (
              <div className="rounded-2xl border border-dashed border-[#2E9E5B]/25 bg-[#F7F4EC] p-5 text-sm text-[#123B2C]/70">
                Aún no tienes logros visibles. Completa temas y actividades para desbloquear tus primeras insignias.
              </div>
            )}
          </div>
        </section>

        <section className="space-y-4 rounded-[28px] bg-white p-5 shadow-sm ring-1 ring-black/5">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#123B2C]/45">Cuenta y acceso</p>
            <h2 className="mt-1 text-xl font-black text-[#123B2C]">Vinculación</h2>
          </div>

          <div className="rounded-2xl bg-[#123B2C] p-4 text-white">
            <p className="text-sm font-semibold">{esInvitado ? "Cuenta invitada" : "Cuenta vinculada"}</p>
            <p className="mt-2 text-sm text-white/80">
              {esInvitado
                ? "Puedes conectar Google o correo para conservar tu avance y acceder desde otro dispositivo."
                : "Si agregas Google, podrás entrar con otro método sin perder tu progreso."}
            </p>
          </div>

          <div className="grid gap-3">
            {esInvitado ? (
              <>
                <ActionButton icon={Link2} label="Vincular con Google" onClick={onVincularGoogle} />
                <ActionButton icon={Mail} label="Vincular con correo" onClick={onVincularCorreo} />
              </>
            ) : (
              <ActionButton icon={Link2} label="Añadir Google a esta cuenta" onClick={onVincularGoogle} />
            )}
          </div>

          <div className="rounded-2xl border border-[#2E9E5B]/10 bg-[#F7F4EC] p-4 text-sm text-[#123B2C]/75">
            <p className="font-semibold text-[#123B2C]">Tus ajustes</p>
            <dl className="mt-3 grid grid-cols-2 gap-3 text-sm">
              <Item label="Franja" value={perfil?.grupo_edad_id ?? "Sin definir"} />
              <Item label="Audio" value={perfil?.prefiere_audio ? "Sí" : "No"} />
              <Item label="Texto" value={perfil?.tamano_texto_preferido ?? "medium"} />
              <Item label="Correo" value={usuario?.correo ?? "No vinculado"} />
            </dl>
          </div>
        </section>
      </div>
    </div>
  );
}

function MetricCard({
  icon: Icon,
  label,
  value,
  accent,
}: {
  icon: ComponentType<{ className?: string }>;
  label: string;
  value: string | number;
  accent: string;
}) {
  return (
    <article className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-black/5">
      <div className={`mb-3 inline-flex rounded-2xl bg-black/5 p-2 ${accent}`}>
        <Icon className="h-5 w-5" />
      </div>
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#123B2C]/45">{label}</p>
      <p className="mt-2 text-2xl font-black text-[#123B2C]">{value}</p>
    </article>
  );
}

function ActionButton({
  icon: Icon,
  label,
  onClick,
}: {
  icon: ComponentType<{ className?: string }>;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex items-center justify-center gap-2 rounded-2xl border border-[#2E9E5B]/15 bg-white px-4 py-3 text-sm font-semibold text-[#123B2C] transition hover:-translate-y-0.5 hover:border-[#2E9E5B]/30 hover:shadow-sm"
    >
      <Icon className="h-4 w-4 text-[#2E9E5B]" />
      {label}
    </button>
  );
}

function Item({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-white px-3 py-2">
      <dt className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#123B2C]/40">{label}</dt>
      <dd className="mt-1 font-medium text-[#123B2C]">{value}</dd>
    </div>
  );
}
