import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  createMemoryHistory,
  RouterProvider,
  createRouter,
  createRootRoute,
  createRoute,
} from "@tanstack/react-router";
import { AdminSidebar } from "./admin-sidebar";

const crearRouter = (activePage: string) => {
  const rootRoute = createRootRoute();

  const rutaAdmin = createRoute({
    getParentRoute: () => rootRoute,
    path: "/admin",
    component: () => (
      <AdminSidebar
        activePage={activePage}
        isOpen={true}
        onClose={() => {}}
        onLogout={() => {}}
      />
    ),
  });

  const rutaTemas = createRoute({
    getParentRoute: () => rootRoute,
    path: "/admin/temas",
    component: () => (
      <AdminSidebar
        activePage={activePage}
        isOpen={true}
        onClose={() => {}}
        onLogout={() => {}}
      />
    ),
  });

  const routeTree = rootRoute.addChildren([rutaAdmin, rutaTemas]);

  return createRouter({
    routeTree,
    defaultNotFoundComponent: () => null,
    history: createMemoryHistory({ initialEntries: [activePage] }),
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
  args: {
    activePage: "/admin",
    isOpen: true,
    onClose: () => {},
    onLogout: () => {},
  },
  render: () => <RouterProvider router={crearRouter("/admin")} />,
};

export const TemasActivo: Story = {
  args: {
    activePage: "/admin/temas",
    isOpen: true,
    onClose: () => {},
    onLogout: () => {},
  },
  render: () => <RouterProvider router={crearRouter("/admin/temas")} />,
};

export const NuevoTemaActivo: Story = {
  args: {
    activePage: "/admin/temas/new",
    isOpen: true,
    onClose: () => {},
    onLogout: () => {},
  },
  render: () => <RouterProvider router={crearRouter("/admin/temas/new")} />,
};
