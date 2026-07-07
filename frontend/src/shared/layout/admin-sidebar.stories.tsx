import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  RouterProvider,
  createRouter,
  createRootRoute,
  createRoute,
} from "@tanstack/react-router";
import { AdminSidebar } from "./admin-sidebar";

const crearRouter = (pathname: string) => {
  const rootRoute = createRootRoute();

  const rutaAdmin = createRoute({
    getParentRoute: () => rootRoute,
    path: "/admin",
    component: () => (
      <AdminSidebar pathname={pathname}>
        <div className="p-4 text-sm text-gray-500">Contenido del panel</div>
      </AdminSidebar>
    ),
  });

  const rutaTemas = createRoute({
    getParentRoute: () => rootRoute,
    path: "/admin/temas",
    component: () => (
      <AdminSidebar pathname={pathname}>
        <div className="p-4 text-sm text-gray-500">Lista de temas</div>
      </AdminSidebar>
    ),
  });

  const routeTree = rootRoute.addChildren([rutaAdmin, rutaTemas]);

  return createRouter({
    routeTree,
    defaultNotFoundComponent: () => <div className="p-4">Not Found</div>,
    history: {
      push: () => {},
      replace: () => {},
      back: () => {},
      forward: () => {},
      destroy: () => {},
      listen: () => () => {},
      location: { pathname, search: "", hash: "" },
    } as any,
  });
};

const meta = {
  title: "Shared/Layout/Admin Sidebar",
  component: AdminSidebar,
  parameters: { layout: "fullscreen" },
  tags: ["autodocs"],
} satisfies Meta<typeof AdminSidebar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const DashboardActivo: Story = {
  args: { pathname: "/admin", children: undefined },
  render: () => <RouterProvider router={crearRouter("/admin")} />,
};

export const TemasActivo: Story = {
  args: { pathname: "/admin/temas", children: undefined },
  render: () => <RouterProvider router={crearRouter("/admin/temas")} />,
};

export const NuevoTemaActivo: Story = {
  args: { pathname: "/admin/temas/new", children: undefined },
  render: () => <RouterProvider router={crearRouter("/admin/temas/new")} />,
};
