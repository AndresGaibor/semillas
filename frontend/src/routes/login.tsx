import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMutation } from "@tanstack/react-query";
import { Leaf, Shield } from "lucide-react";
import { createGuestSession, setupDevAdmin } from "../features/auth/auth.api";
import { sessionStorageApi } from "../shared/api/session";

export const Route = createFileRoute("/login")({
  component: LoginPage
});

function LoginPage() {
  const navigate = useNavigate();

  const guestMutation = useMutation({
    mutationFn: createGuestSession,
    onSuccess(data) {
      sessionStorageApi.setGuestUserId(data.autenticacion.valor);
      navigate({ to: "/onboarding" });
    }
  });

  const devAdminMutation = useMutation({
    mutationFn: setupDevAdmin,
    onSuccess(data) {
      sessionStorageApi.setGuestUserId(data.usuario.id);
      navigate({ to: "/admin" });
    }
  });

  return (
    <div className="min-h-screen bg-[#f7f4ec] flex flex-col items-center justify-center px-6">
      <div className="w-full max-w-sm bg-white rounded-3xl shadow-sm p-8 text-center">
        <div className="w-14 h-14 bg-[#2e9e5b]/10 rounded-full flex items-center justify-center mx-auto mb-5">
          <Leaf className="text-[#2e9e5b]" size={28} />
        </div>

        <h1 className="text-2xl font-bold text-[#123b2c] mb-2">Bienvenido</h1>
        <p className="text-sm text-[#123b2c]/60 mb-8">
          Comienza a explorar las sendas bíblicas
        </p>

        <button
          onClick={() => guestMutation.mutate({ apodo: "Semillero" })}
          disabled={guestMutation.isPending}
          className="w-full bg-[#2e9e5b] text-white py-3 rounded-xl font-semibold text-base hover:bg-[#267d4c] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {guestMutation.isPending ? "Entrando..." : "Entrar como invitado"}
        </button>

        <div className="relative my-6">
          <div className="border-t border-[#e5e7eb] absolute inset-x-0 top-1/2" />
          <span className="relative bg-white px-3 text-xs text-[#123b2c]/40">O</span>
        </div>

        <div className="grid gap-3">
          <button className="w-full border border-[#e5e7eb] py-3 rounded-xl font-medium text-sm hover:bg-[#f7f4ec] transition-colors flex items-center justify-center gap-2">
            <svg width="18" height="18" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
            Google
          </button>
          <button className="w-full border border-[#e5e7eb] py-3 rounded-xl font-medium text-sm hover:bg-[#f7f4ec] transition-colors flex items-center justify-center gap-2">
            <svg width="18" height="18" viewBox="0 0 24 24"><path fill="#1877F2" d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
            Facebook
          </button>
        </div>

        <div className="mt-6 pt-4 border-t border-[#e5e7eb]">
          <button
            onClick={() => devAdminMutation.mutate()}
            disabled={devAdminMutation.isPending}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-dashed border-[#2e9e5b]/30 text-xs text-[#2e9e5b] font-medium hover:bg-[#2e9e5b]/5 transition-colors disabled:opacity-50"
          >
            <Shield size={14} />
            {devAdminMutation.isPending ? "Creando admin..." : "Modo desarrollo: crear admin de prueba"}
          </button>
          {devAdminMutation.isSuccess && (
            <p className="text-[#2e9e5b] text-xs mt-2">Admin creado. Redirigiendo al panel...</p>
          )}
        </div>

        {guestMutation.isError && (
          <p className="text-[#ee6c4d] text-sm mt-4">No se pudo crear el invitado. Asegúrate de que el backend esté activo.</p>
        )}
      </div>
    </div>
  );
}
