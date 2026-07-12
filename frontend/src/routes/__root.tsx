import { Outlet, createRootRoute } from "@tanstack/react-router";
import { PantallaNoEncontrado } from "@/componentes/estados/pantalla-no-encontrado";

export const Route = createRootRoute({
  component: RootLayout,
  notFoundComponent: PantallaNoEncontrado,
});

function RootLayout() {
  return <Outlet />;
}
