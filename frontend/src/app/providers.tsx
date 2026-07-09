import { QueryClientProvider } from "@tanstack/react-query";
import { RouterProvider } from "@tanstack/react-router";
import { useEffect, useState, type ReactNode } from "react";
import { Toaster } from "sonner";
import { queryClient } from "./query-client";
import { router } from "../router";
import { escucharCambiosAutenticacion, sincronizarSesionAutenticada } from "../shared/auth/supabase";

function AuthBootstrap({ children }: { children: ReactNode }) {
  const [listo, setListo] = useState(false);

  useEffect(() => {
    const detenerEscucha = escucharCambiosAutenticacion();

    sincronizarSesionAutenticada()
      .catch(() => undefined)
      .finally(() => setListo(true));

    return () => {
      detenerEscucha();
    };
  }, []);

  if (!listo) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 text-sm font-medium text-slate-500">
        Preparando sesión...
      </div>
    );
  }

  return children;
}

export function AppProviders() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthBootstrap>
        <RouterProvider router={router} />
      </AuthBootstrap>
      <Toaster position="top-right" />
    </QueryClientProvider>
  );
}
