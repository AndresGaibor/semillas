import { useEffect, useState } from "react";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{
    outcome: "accepted" | "dismissed";
    platform: string;
  }>;
};

export function useInstalarPWA() {
  const [eventoInstalacion, setEventoInstalacion] = useState<BeforeInstallPromptEvent | null>(
    null,
  );
  const [puedeInstalar, setPuedeInstalar] = useState(false);

  useEffect(() => {
    // Verificar si ya está instalada la PWA
    const yaInstalada =
      window.matchMedia("(display-mode: standalone)").matches ||
      window.matchMedia("(display-mode: fullscreen)").matches ||
      (window.navigator as any).standalone === true;

    if (yaInstalada) {
      setPuedeInstalar(false);
      return;
    }

    // Cargar el prompt diferido inicial si ya se capturó globalmente
    const promptInicial = (window as any).deferredPrompt as BeforeInstallPromptEvent | undefined;
    if (promptInicial) {
      setEventoInstalacion(promptInicial);
      setPuedeInstalar(true);
    }

    // Escuchar el evento de prompt diferido
    const manejarPromptGlobal = () => {
      const promptEvent = (window as any).deferredPrompt as BeforeInstallPromptEvent | undefined;
      if (promptEvent) {
        setEventoInstalacion(promptEvent);
        setPuedeInstalar(true);
      }
    };

    const manejarAppInstalada = () => {
      setEventoInstalacion(null);
      setPuedeInstalar(false);
    };

    window.addEventListener("semillas-beforeinstallprompt", manejarPromptGlobal);
    window.addEventListener("semillas-appinstalled", manejarAppInstalada);

    return () => {
      window.removeEventListener("semillas-beforeinstallprompt", manejarPromptGlobal);
      window.removeEventListener("semillas-appinstalled", manejarAppInstalada);
    };
  }, []);

  const instalar = async () => {
    if (!eventoInstalacion) {
      return "dismissed";
    }

    try {
      await eventoInstalacion.prompt();
      const resultado = await eventoInstalacion.userChoice;

      // Limpiar globalmente y localmente
      (window as any).deferredPrompt = null;
      setEventoInstalacion(null);
      setPuedeInstalar(false);

      return resultado.outcome;
    } catch (error) {
      console.error("Error al disparar el prompt de instalación de PWA:", error);
      return "dismissed";
    }
  };

  return {
    puedeInstalar,
    instalar,
  };
}
