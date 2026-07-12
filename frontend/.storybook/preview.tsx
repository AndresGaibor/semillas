/// <reference types="vite/client" />

import type { Preview } from "@storybook/react-vite";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { initialize, mswLoader } from "msw-storybook-addon";
import { useEffect, useState, type PropsWithChildren } from "react";
import { ThemeProvider } from "../src/shared/theme";
import { StoryRouter } from "../src/storybook/story-router";
import { globalStoryHandlers } from "../src/storybook/mocks/global.handlers";
import "../src/styles.css";
import "../src/routes/app.css";

initialize({ onUnhandledRequest: "error" });

const viewports = {
  movilCompacto: { name: "Móvil compacto · 360 × 800", styles: { width: "360px", height: "800px" }, type: "mobile" },
  movilApp: { name: "Móvil app · 390 × 844", styles: { width: "390px", height: "844px" }, type: "mobile" },
  movilAndroid: { name: "Android · 412 × 915", styles: { width: "412px", height: "915px" }, type: "mobile" },
  tablet: { name: "Tablet · 768 × 1024", styles: { width: "768px", height: "1024px" }, type: "tablet" },
  escritorio: { name: "Escritorio · 1440 × 900", styles: { width: "1440px", height: "900px" }, type: "desktop" },
};

function createStoryQueryClient() {
  return new QueryClient({ defaultOptions: { queries: { retry: false, staleTime: Number.POSITIVE_INFINITY, gcTime: Number.POSITIVE_INFINITY, refetchOnMount: false, refetchOnReconnect: false, refetchOnWindowFocus: false }, mutations: { retry: false } } });
}

function StoryProviders({ children, theme, motion }: PropsWithChildren<{ theme: "light" | "dark"; motion: "full" | "reduced" }>) {
  const [queryClient] = useState(createStoryQueryClient);
  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("dark", theme === "dark");
    root.dataset.theme = theme;
    root.dataset.motion = motion;
    return () => { root.classList.remove("dark"); delete root.dataset.theme; delete root.dataset.motion; queryClient.clear(); };
  }, [motion, queryClient, theme]);
  return <ThemeProvider><QueryClientProvider client={queryClient}><StoryRouter>{children}</StoryRouter></QueryClientProvider></ThemeProvider>;
}

const preview: Preview = {
  loaders: [mswLoader],
  globalTypes: {
    theme: { description: "Tema visual", toolbar: { icon: "paintbrush", items: [{ value: "light", title: "Claro" }, { value: "dark", title: "Oscuro" }] } },
    motion: { description: "Preferencia de movimiento", toolbar: { icon: "accessibility", items: [{ value: "full", title: "Movimiento completo" }, { value: "reduced", title: "Movimiento reducido" }] } },
    locale: { description: "Longitud del contenido", toolbar: { icon: "globe", items: [{ value: "es", title: "Español" }, { value: "es-long", title: "Español extenso" }] } },
  },
  initialGlobals: { theme: "light", motion: "full", locale: "es", viewport: { value: "escritorio", isRotated: false }, backgrounds: { value: "crema", grid: false } },
  decorators: [(Story, context) => <StoryProviders theme={context.globals.theme as "light" | "dark"} motion={context.globals.motion as "full" | "reduced"}><Story /></StoryProviders>],
  parameters: {
    layout: "padded",
    controls: { expanded: true, sort: "requiredFirst", matchers: { color: /(background|color)$/i, date: /Date$/i } },
    docs: { codePanel: true },
    a11y: { test: "todo" },
    msw: { handlers: globalStoryHandlers },
    backgrounds: { options: { crema: { name: "Crema", value: "#F7F4EC" }, blanco: { name: "Blanco", value: "#ffffff" }, grisApp: { name: "Gris app", value: "#f8fafc" }, verdeProfundo: { name: "Verde profundo", value: "#123B2C" } } },
    viewport: { options: viewports },
    options: { storySort: { order: ["00 · Guía", "01 · Fundamentos", "02 · UI", "03 · Patrones", "04 · Features", "05 · Pantallas", "06 · Flujos", "07 · QA visual", "98 · Laboratorio", "99 · Deprecated"] } },
  },
};

export default preview;
