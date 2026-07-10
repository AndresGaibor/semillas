import { createFileRoute } from "@tanstack/react-router";
import { TarjetaClub } from "../features/clubes/componentes/tarjeta-club";
import { TablaRanking } from "../features/clubes/componentes/tabla-ranking";
import { ClubRetosCard } from "../features/clubes/componentes/club-retos-card";
import {
  ClubLogrosCard,
  type ClubLogro,
} from "../features/clubes/componentes/club-logros-card";
import { UnirseClubForm } from "../features/clubes/componentes/unirse-club-form";
import { ProgresoXpWidget } from "../features/gamification/componentes/progreso-xp-widget";
import { ClubRetoSemanalWidget } from "../features/clubes/componentes/club-reto-semanal-widget";
import { ClubComparteWidget } from "../features/clubes/componentes/club-comparte-widget";
import { ClubOfflineWidget } from "../features/clubes/componentes/club-offline-widget";
import cover1 from "@/assets/images/Ilustraciones/Tema1.png";
import cover2 from "@/assets/images/Ilustraciones/Tema2.png";
import cover3 from "@/assets/images/Ilustraciones/Tema3.png";
import { useClubesPage } from "../features/clubes/hooks/use-clubes-page";

export const Route = createFileRoute("/app/clubes")({
  component: ClubesPage,
});

const RANKING_MIEMBROS_EJEMPLO = [
  {
    posicion: 1,
    nombre: "Sara López",
    nivel: "Explorador • Nivel 8",
    xpSemana: 450,
    contribuciones: 16,
    avatarIndex: "1",
  },
  {
    posicion: 2,
    nombre: "Mateo Ruiz",
    nivel: "Explorador • Nivel 7",
    xpSemana: 380,
    contribuciones: 12,
    avatarIndex: "2",
  },
  {
    posicion: 3,
    nombre: "Julián Pérez",
    nivel: "Explorador • Nivel 7",
    xpSemana: 310,
    contribuciones: 10,
    avatarIndex: "3",
  },
  {
    posicion: 4,
    nombre: "María Núñez",
    nivel: "Explorador • Nivel 6",
    xpSemana: 250,
    contribuciones: 8,
    avatarIndex: "4",
  },
  {
    posicion: 5,
    fontStyle: "normal",
    nombre: "David Torres",
    nivel: "Explorador • Nivel 6",
    xpSemana: 210,
    contribuciones: 7,
    avatarIndex: "5",
  },
];

const CLUB_LOGROS_EJEMPLO: ClubLogro[] = [
  {
    id: "1",
    codigo: "raices_firmes",
    nombre: "Raíces firmes",
    descripcion: "Completa 100 actividades como club.",
    tipoIcono: "shield",
    completado: true,
  },
  {
    id: "2",
    codigo: "luz_mundo",
    nombre: "Luz del mundo",
    descripcion: "Completa 250 actividades como club.",
    tipoIcono: "flame",
    completado: false,
    progresoActual: 180,
    progresoMeta: 250,
  },
  {
    id: "3",
    codigo: "un_solo_corazon",
    nombre: "Un solo corazón",
    descripcion: "Participa juntos durante 7 días seguidos.",
    tipoIcono: "heart",
    completado: false,
    progresoActual: 5,
    progresoMeta: 7,
  },
];

function ClubesPage() {
  const {
    copied,
    joinCode,
    setJoinCode,
    xpInfo,
    handleCopyCode,
    handleShareCode,
    handleJoinClub,
    navigate,
  } = useClubesPage();

  return (
    <div className="w-full flex flex-col font-sans text-slate-800 text-left">
      <div className="flex flex-col lg:flex-row gap-8 w-full items-start">
        {/* COLUMNA IZQUIERDA */}
        <div className="flex-1 lg:flex-[3] flex flex-col gap-6 w-full">
          <TarjetaClub
            nombre="Club Riobamba"
            descripcion="Club oficial de preadolescentes de la Iglesia Alianza de Riobamba."
            codigoInvitacion="RIOB-1234"
            miembros={15}
            onCopiarCodigo={handleCopyCode}
            onCompartirCodigo={handleShareCode}
            onInvitar={() =>
              alert(
                "Función para enviar invitaciones por correo electrónico."
              )
            }
            onEditar={() => {}}
            copiado={copied}
          />

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 w-full">
            <TablaRanking
              miembros={RANKING_MIEMBROS_EJEMPLO}
              onVerCompleto={() =>
                alert("Próximamente: Ranking histórico del club.")
              }
            />
            <ClubRetosCard
              progresoPorcentaje={72}
              metaActividades={250}
              actualActividades={180}
            />
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 w-full">
            <ClubLogrosCard
              logros={CLUB_LOGROS_EJEMPLO}
              onVerTodos={() =>
                alert(
                  "Próximamente: Galería completa de insignias del club."
                )
              }
            />
            <UnirseClubForm
              joinCode={joinCode}
              onCodeChange={setJoinCode}
              onSubmit={handleJoinClub}
            />
          </div>
        </div>

        {/* COLUMNA DERECHA */}
        <aside className="w-full lg:w-[320px] flex flex-col gap-6">
          <ProgresoXpWidget
            xpTotal={xpInfo.xpTotal}
            numNivel={xpInfo.numNivel}
            nombreNivel={xpInfo.nombreNivel}
            xpRestantes={xpInfo.xpRestantes}
            porcentaje={xpInfo.porcentaje}
            onVerDetalles={() => navigate({ to: "/app/perfil" })}
          />

          <ClubRetoSemanalWidget completadas={12} meta={20} />

          <ClubComparteWidget onCompartir={handleShareCode} />

          <ClubOfflineWidget
            temasDescargadosCount={3}
            covers={[cover1, cover2, cover3]}
            onIrDescargas={() => navigate({ to: "/app/descargas" })}
          />
        </aside>
      </div>
    </div>
  );
}
