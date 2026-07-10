import { createFileRoute } from "@tanstack/react-router";
import { Shield, Trophy } from "lucide-react";
import { TarjetaClub } from "../features/clubes/componentes/tarjeta-club";
import { TablaRanking } from "../features/clubes/componentes/tabla-ranking";
import { UnirseClubForm } from "../features/clubes/componentes/unirse-club-form";
import { ProgresoXpWidget } from "../features/gamification/componentes/progreso-xp-widget";
import { ClubComparteWidget } from "../features/clubes/componentes/club-comparte-widget";
import { useClubesPage } from "../features/clubes/hooks/use-clubes-page";
import { Card } from "@/componentes/ui/card-base";

export const Route = createFileRoute("/app/clubes")({
  component: ClubesPage,
});

function ClubesPage() {
  const {
    copied,
    joinCode,
    setJoinCode,
    club,
    clubesQuery,
    rankingQuery,
    retosQuery,
    xpInfo,
    handleCopyCode,
    handleShareCode,
    handleJoinClub,
    navigate,
  } = useClubesPage();

  const ranking = (rankingQuery.data ?? []).map((miembro) => ({
    posicion: miembro.numero_ranking,
    nombre: miembro.apodo,
    nivel: `Posición ${miembro.numero_ranking} del club`,
    xpSemana: miembro.xp_total,
    avatarIndex: String(((miembro.numero_ranking - 1) % 10) + 1),
  }));

  return (
    <div className="flex w-full flex-col text-left font-sans text-slate-800">
      <div className="flex w-full flex-col items-start gap-8 lg:flex-row">
        <div className="flex w-full flex-1 flex-col gap-6 lg:flex-[3]">
          {clubesQuery.isLoading ? (
            <Card className="p-8 text-sm font-semibold text-slate-500">Cargando tus clubes…</Card>
          ) : clubesQuery.isError ? (
            <Card className="p-8 text-sm font-semibold text-red-600">No se pudieron cargar tus clubes.</Card>
          ) : club ? (
            <>
              <TarjetaClub
                nombre={club.nombre}
                descripcion={club.descripcion ?? "Club de aprendizaje colaborativo en Semillas."}
                codigoInvitacion={club.codigo_invitacion}
                miembros={club.member_count ?? 0}
                onCopiarCodigo={handleCopyCode}
                onCompartirCodigo={handleShareCode}
                onInvitar={handleShareCode}
                copiado={copied}
              />

              <div className="grid w-full grid-cols-1 gap-6 xl:grid-cols-2">
                <TablaRanking miembros={ranking} />
                <Card className="p-6">
                  <div className="mb-4 flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-50 text-amber-600">
                      <Trophy size={18} />
                    </div>
                    <div>
                      <h3 className="font-black text-slate-800">Retos del club</h3>
                      <p className="text-xs font-semibold text-slate-400">Metas configuradas por el líder.</p>
                    </div>
                  </div>
                  {retosQuery.isLoading ? (
                    <p className="text-sm text-slate-500">Cargando retos…</p>
                  ) : (retosQuery.data?.length ?? 0) === 0 ? (
                    <p className="text-sm text-slate-500">Todavía no hay retos activos.</p>
                  ) : (
                    <div className="flex flex-col gap-3">
                      {retosQuery.data?.slice(0, 3).map((reto) => (
                        <div key={reto.id} className="rounded-2xl border border-slate-100 p-4">
                          <p className="font-extrabold text-slate-800">{reto.nombre}</p>
                          <p className="mt-1 text-xs text-slate-500">{reto.descripcion ?? "Reto cooperativo"}</p>
                          <p className="mt-2 text-xs font-bold text-amber-700">Meta: {reto.valor_objetivo} · Premio: {reto.xp_reto} XP</p>
                        </div>
                      ))}
                    </div>
                  )}
                </Card>
              </div>
            </>
          ) : (
            <Card className="flex flex-col items-center gap-3 p-10 text-center">
              <Shield className="text-[#7E57C2]" size={42} />
              <h2 className="text-xl font-black text-slate-800">Todavía no perteneces a un club</h2>
              <p className="max-w-lg text-sm font-semibold text-slate-500">Ingresa un código de invitación para aprender y avanzar junto a tu grupo.</p>
            </Card>
          )}

          <UnirseClubForm
            joinCode={joinCode}
            onCodeChange={setJoinCode}
            onSubmit={handleJoinClub}
          />
        </div>

        <aside className="flex w-full flex-col gap-6 lg:w-[320px]">
          <ProgresoXpWidget
            xpTotal={xpInfo.xpTotal}
            numNivel={xpInfo.numNivel}
            nombreNivel={xpInfo.nombreNivel}
            xpRestantes={xpInfo.xpRestantes}
            porcentaje={xpInfo.porcentaje}
            onVerDetalles={() => navigate({ to: "/app/perfil" })}
          />
          {club ? <ClubComparteWidget onCompartir={handleShareCode} /> : null}
        </aside>
      </div>
    </div>
  );
}
