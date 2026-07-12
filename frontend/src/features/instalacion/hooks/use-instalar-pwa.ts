import { useCallback, useEffect, useState } from "react";
import {
  type EventoAntesDeInstalar,
  type ResultadoInstalacion,
  estaInstaladaComoPWA,
} from "../lib/plataforma";

export type EstadoInstalarPWA = {
  disponible: boolean;
  instalando: boolean;
  instalar: () => Promise<ResultadoInstalacion>;
};

export function useInstalarPWA(): EstadoInstalarPWA {
  const [evento, setEvento] = useState<EventoAntesDeInstalar | null>(null);
  const [instalando, setInstalando] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (estaInstaladaComoPWA()) return;

    const manejarPrompt = (e: Event) => {
      e.preventDefault();
      setEvento(e as EventoAntesDeInstalar);
    };

    const manejarInstalada = () => {
      setEvento(null);
    };

    window.addEventListener("beforeinstallprompt", manejarPrompt);
    window.addEventListener("appinstalled", manejarInstalada);

    return () => {
      window.removeEventListener("beforeinstallprompt", manejarPrompt);
      window.removeEventListener("appinstalled", manejarInstalada);
    };
  }, []);

  const instalar = useCallback(async (): Promise<ResultadoInstalacion> => {
    if (!evento) return "no_disponible";
    setInstalando(true);
    try {
      await evento.prompt();
      const eleccion = await evento.userChoice;
      setEvento(null);
      return eleccion.outcome === "accepted" ? "aceptada" : "rechazada";
    } finally {
      setInstalando(false);
    }
  }, [evento]);

  return {
    disponible: evento !== null,
    instalando,
    instalar,
  };
}