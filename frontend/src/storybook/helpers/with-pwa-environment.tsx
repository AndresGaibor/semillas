import { useEffect, type PropsWithChildren } from "react";

interface PwaEnvironment { online?: boolean; standalone?: boolean; reducedMotion?: boolean }

export function WithPwaEnvironment({ children, online = true, standalone = false, reducedMotion = false }: PropsWithChildren<PwaEnvironment>) {
  useEffect(() => {
    const originalOnline = navigator.onLine;
    const originalMatchMedia = window.matchMedia;
    Object.defineProperty(navigator, "onLine", { configurable: true, value: online });
    window.matchMedia = ((query: string) => ({ matches: query.includes("prefers-reduced-motion") ? reducedMotion : query.includes("display-mode") ? standalone : false, media: query, onchange: null, addListener: () => undefined, removeListener: () => undefined, addEventListener: () => undefined, removeEventListener: () => undefined, dispatchEvent: () => false })) as typeof window.matchMedia;
    return () => { Object.defineProperty(navigator, "onLine", { configurable: true, value: originalOnline }); window.matchMedia = originalMatchMedia; };
  }, [online, reducedMotion, standalone]);
  return children;
}
