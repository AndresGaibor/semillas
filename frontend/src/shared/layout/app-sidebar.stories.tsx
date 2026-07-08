import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  createMemoryHistory,
  RouterProvider,
  createRouter,
  createRootRoute,
  createRoute,
} from "@tanstack/react-router";
import { AppSidebar } from "./app-sidebar";

const crearRouter = (activePage: string) => {
  const rootRoute = createRootRoute();

  const rutaApp = createRoute({
    getParentRoute: () => rootRoute,
    path: "/app",
    component: () => (
      <AppSidebar
        activePage={activePage}
        isOffline={false}
        isOpen={true}
        onClose={() => {}}
        onLogout={() => {}}
      />
    ),
  });

  const rutaTemas = createRoute({
    getParentRoute: () => rootRoute,
    path: "/app/temas",
    component: () => (
      <AppSidebar
        activePage={activePage}
        isOffline={false}
        isOpen={true}
        onClose={() => {}}
        onLogout={() => {}}
      />
    ),
  });

  const routeTree = rootRoute.addChildren([rutaApp, rutaTemas]);

  return createRouter({
    routeTree,
    defaultNotFoundComponent: () => null,
    history: createMemoryHistory({ initialEntries: [activePage] }),
  });
};

const meta = {
  title: "Shared/Layout/App Sidebar",
  component: AppSidebar,
  parameters: { layout: "fullscreen" },
  tags: ["autodocs"],
} satisfies Meta<typeof AppSidebar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const InicioActivo: Story = {
  args: {
    activePage: "/app",
    isOffline: false,
    isOpen: true,
    onClose: () => {},
    onLogout: () => {},
  },
  render: () => <RouterProvider router={crearRouter("/app")} />,
};

export const TemasActivo: Story = {
  args: {
    activePage: "/app/temas",
    isOffline: false,
    isOpen: true,
    onClose: () => {},
    onLogout: () => {},
  },
  render: () => <RouterProvider router={crearRouter("/app/temas")} />,
};
