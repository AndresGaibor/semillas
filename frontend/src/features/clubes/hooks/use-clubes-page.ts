import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState, useMemo, useCallback } from "react";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { obtenerGamificacionPropia } from "../../gamification/gamification.api";
import {
  listarMisClubes,
  listarRetosClub,
  obtenerRankingClub,
  unirseAClub,
} from "../../clubs/clubs.api";

export function useClubesPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [copied, setCopied] = useState(false);
  const [joinCode, setJoinCode] = useState("");

  const clubesQuery = useQuery({
    queryKey: ["clubs", "mine"],
    queryFn: listarMisClubes,
  });
  const club = clubesQuery.data?.[0] ?? null;

  const rankingQuery = useQuery({
    queryKey: ["clubs", club?.id, "ranking"],
    queryFn: () => obtenerRankingClub(club!.id),
    enabled: Boolean(club?.id),
  });

  const retosQuery = useQuery({
    queryKey: ["clubs", club?.id, "challenges"],
    queryFn: () => listarRetosClub(club!.id),
    enabled: Boolean(club?.id),
  });

  const gamificationQuery = useQuery({
    queryKey: ["gamification", "me"],
    queryFn: obtenerGamificacionPropia,
  });

  const unirMutation = useMutation({
    mutationFn: (codigo: string) => unirseAClub({ codigo_acceso: codigo }),
    onSuccess: async (resultado) => {
      setJoinCode("");
      await queryClient.invalidateQueries({ queryKey: ["clubs"] });
      toast.success(resultado.ya_era_miembro ? "Ya pertenecías a este club" : "Te uniste al club");
    },
    onError: (error) => toast.error(error instanceof Error ? error.message : "No se pudo unir al club"),
  });

  const nivel = gamificationQuery.data?.nivel;
  const xpInfo = useMemo(() => {
    const xpTotal = nivel?.xp_total ?? 0;
    const numNivel = nivel?.numero_nivel ?? 1;
    const xpEnNivel = xpTotal % 1000;
    const xpRestantes = xpEnNivel === 0 && xpTotal > 0 ? 0 : 1000 - xpEnNivel;
    const porcentaje = Math.round((xpEnNivel / 1000) * 100);

    return {
      xpTotal,
      numNivel,
      nombreNivel: nivel?.nombre_nivel || "Semillero",
      porcentaje,
      xpRestantes,
    };
  }, [nivel]);

  const copiarTexto = useCallback(async (texto: string) => {
    await navigator.clipboard.writeText(texto);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  }, []);

  const handleCopyCode = useCallback(() => {
    if (!club) return;
    void copiarTexto(club.codigo_invitacion).then(() => toast.success("Código copiado"));
  }, [club, copiarTexto]);

  const handleShareCode = useCallback(() => {
    if (!club) return;
    const texto = `¡Únete a mi club ${club.nombre} en Semillas con el código ${club.codigo_invitacion}!`;
    if (navigator.share) {
      void navigator.share({ title: club.nombre, text: texto }).catch(() => undefined);
      return;
    }
    void copiarTexto(texto).then(() => toast.success("Invitación copiada"));
  }, [club, copiarTexto]);

  const handleJoinClub = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    const codigo = joinCode.trim().toUpperCase();
    if (!codigo || unirMutation.isPending) return;
    unirMutation.mutate(codigo);
  }, [joinCode, unirMutation]);

  return {
    copied,
    joinCode,
    setJoinCode,
    club,
    clubesQuery,
    rankingQuery,
    retosQuery,
    gamificationQuery,
    xpInfo,
    joining: unirMutation.isPending,
    handleCopyCode,
    handleShareCode,
    handleJoinClub,
    navigate,
  };
}
