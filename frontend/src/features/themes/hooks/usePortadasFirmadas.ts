import { useQueries } from "@tanstack/react-query";
import { obtenerUrlPortadaTema } from "../themes.api";
import type { Tema } from "@/shared/api/api";

export function debeSolicitarPortada(tema: Tema & { portada?: { id: string } | null }) {
  return Boolean(tema.portada_recurso_id || tema.portada_recurso?.id || tema.portada?.id);
}

export function usePortadasFirmadas(temas: Tema[]) {
  return useQueries({
    queries: temas.map((t) => ({
      queryKey: ["tema-portada", t.id],
      queryFn: () => obtenerUrlPortadaTema(t.id),
      enabled: debeSolicitarPortada(t),
      staleTime: 3 * 60 * 1000,
      gcTime: 4 * 60 * 1000,
      retry: 1,
      refetchOnWindowFocus: true,
    })),
    combine: (results) => {
      const mapa = new Map<string, string | null>();
      temas.forEach((t, i) => {
        const url = results[i]?.data?.url ?? null;
        mapa.set(t.id, url);
      });
      return mapa;
    },
  });
}
