import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { aplicarTemaAlDocumento, observarTemaSistema, resolverTema } from "./theme.dom";
import { guardarModoTema, leerModoTema } from "./theme.storage";
import type { ModoTema, TemaResuelto } from "./theme.types";

interface ThemeContextValue {
  modo: ModoTema;
  tema: TemaResuelto;
  esOscuro: boolean;
  establecerModo: (modo: ModoTema) => void;
  alternarTema: () => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [modo, setModo] = useState<ModoTema>(leerModoTema);
  const [tema, setTema] = useState<TemaResuelto>(() => resolverTema(leerModoTema()));

  const establecerModo = useCallback((nuevoModo: ModoTema) => {
    guardarModoTema(nuevoModo);
    setModo(nuevoModo);
    setTema(aplicarTemaAlDocumento(nuevoModo));
  }, []);

  const alternarTema = useCallback(() => {
    establecerModo(tema === "oscuro" ? "claro" : "oscuro");
  }, [establecerModo, tema]);

  useEffect(() => {
    setTema(aplicarTemaAlDocumento(modo));

    return observarTemaSistema(() => {
      if (modo === "sistema") setTema(aplicarTemaAlDocumento("sistema"));
    });
  }, [modo]);

  const value = useMemo<ThemeContextValue>(
    () => ({ modo, tema, esOscuro: tema === "oscuro", establecerModo, alternarTema }),
    [alternarTema, establecerModo, modo, tema],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("useTheme debe utilizarse dentro de ThemeProvider");
  return context;
}
