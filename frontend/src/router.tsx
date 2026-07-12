import { createRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";
import { PantallaErrorRuta } from "@/componentes/estados/pantalla-error-ruta";

export const router = createRouter({
  routeTree,
  defaultErrorComponent: PantallaErrorRuta,
});

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}
