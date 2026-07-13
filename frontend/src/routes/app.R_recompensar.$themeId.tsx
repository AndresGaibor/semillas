import { createFileRoute } from "@tanstack/react-router";
import { Award, CheckCircle2, CircleAlert, Clock3, Sparkles } from "lucide-react";
import { CSSConfetti } from "@/componentes/ui/Confetti";
import { CrecerLayout } from "@/features/crecer/componentes";
import { obtenerFaseCrecer } from "@/features/crecer/crecer-fases";
import { useRecompensarPage } from "@/features/crecer/hooks/use-recompensar-page";
import { useEffect, useRef } from "react";
import { playSound } from "@/lib/audio";

export const Route = createFileRoute("/app/R_recompensar/$themeId")({
  component: RRecompensarPage,
});

const FASE = obtenerFaseCrecer("recompensar");

function RRecompensarPage() {
  const { themeId } = Route.useParams();
  const recompensa = useRecompensarPage({ themeId });

  const soundPlayedRef = useRef(false);

  useEffect(() => {
    if (recompensa.progresoConfirmado && !soundPlayedRef.current) {
      soundPlayedRef.current = true;
      void playSound("insignia");
    }
  }, [recompensa.progresoConfirmado]);

  useEffect(() => {
    if (!recompensa.isLoading && !recompensa.isError && !recompensa.progresoConfirmado && recompensa.tema) {
      void recompensa.completarTema();
    }
  }, [recompensa.isLoading, recompensa.isError, recompensa.progresoConfirmado, recompensa.tema]);

  return (
    <>
      <CSSConfetti />
      <CrecerLayout
        fase={FASE}
        themeId={themeId}
          themeTitle={recompensa.tema?.titulo}
          paso={{
          titulo: recompensa.progresoConfirmado ? "¡Tema completado!" : "¡Ya casi terminas!",
          cuerpo:
            recompensa.contenidoPaso?.cuerpo ||
            "Celebramos tu esfuerzo. Cada paso te ayuda a conocer, vivir y compartir mejor la Palabra de Dios.",
        }}
        pasoId={recompensa.pasoActual?.id}
        isLoading={recompensa.isLoading}
        isError={recompensa.isError}
        isSavingProgress={recompensa.isSavingProgress}
        progressError={recompensa.progressError}
        onCompleteStep={recompensa.completarTema}
        botonesAccion={{
          siguiente: { to: "/app/temas", label: "Volver a mis temas" },
          regresar: { to: "/app/E_experimentar/$themeId", themeId, label: "Anterior" },
        }}
      >
        <div className="crecer-reward">
          <div className="crecer-reward__medal">
            {recompensa.portadaQuery.data?.url ? (
              <img src={recompensa.portadaQuery.data.url} alt="" aria-hidden="true" />
            ) : (
              <Award aria-hidden="true" />
            )}
          </div>
          <div className="crecer-reward__copy">
            <span><Sparkles size={16} aria-hidden="true" /> Recompensa obtenida</span>
            <h2>{recompensa.tema?.titulo || "Tu tema"}</h2>
            <p>
              Ganaste la recompensa definida por el tema. El servidor validará tu XP y tus nuevas insignias.
            </p>
          </div>
          <div className="crecer-reward__status">
            {recompensa.isSavingProgress ? (
              <>
                <Clock3 aria-hidden="true" />
                Guardando progreso…
              </>
            ) : recompensa.progressError ? (
              <>
                <CircleAlert aria-hidden="true" />
                No se guardó. Intenta nuevamente.
              </>
            ) : recompensa.progresoConfirmado ? (
              <>
                <CheckCircle2 aria-hidden="true" />
                Progreso guardado
              </>
            ) : null}
          </div>
        </div>
      </CrecerLayout>
    </>
  );
}
