import { useQuery } from "@tanstack/react-query";
import { useState, useMemo, useCallback } from "react";
import { useNavigate } from "@tanstack/react-router";
import { obtenerMiPerfil } from "../../profile/profile.api";
import { obtenerGamificacionPropia } from "../../gamification/gamification.api";

export function useClubesPage() {
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);
  const [joinCode, setJoinCode] = useState("");

  const meQuery = useQuery({ queryKey: ["me"], queryFn: obtenerMiPerfil });
  const gamificationQuery = useQuery({
    queryKey: ["gamification", "me"],
    queryFn: obtenerGamificacionPropia,
  });

  const nivel = gamificationQuery.data?.nivel;

  const xpInfo = useMemo(() => {
    const xpTotal = nivel?.xp_total ?? 1250;
    const numNivel = nivel?.numero_nivel ?? 7;
    const xpEnNivel = xpTotal % 1000;
    const xpRestantes = 1000 - xpEnNivel;
    const porcentaje = Math.round((xpEnNivel / 1000) * 100);

    return {
      xpTotal,
      numNivel,
      nombreNivel: nivel?.nombre_nivel || "Explorador",
      porcentaje,
      xpRestantes,
    };
  }, [nivel]);

  const handleCopyCode = useCallback(() => {
    navigator.clipboard.writeText("RIOB-1234");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, []);

  const handleShareCode = useCallback(() => {
    navigator.clipboard.writeText(
      "¡Únete a mi club de Semillas con el código RIOB-1234!"
    );
    alert("¡Código de invitación copiado para compartir!");
  }, []);

  const handleJoinClub = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (!joinCode.trim()) return;
      alert(
        `¡Solicitud enviada con éxito para unirse al club "${joinCode.toUpperCase()}"!`
      );
      setJoinCode("");
    },
    [joinCode]
  );

  return {
    copied,
    joinCode,
    setJoinCode,
    meQuery,
    gamificationQuery,
    xpInfo,
    handleCopyCode,
    handleShareCode,
    handleJoinClub,
    navigate,
  };
}
