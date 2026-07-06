import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMutation } from "@tanstack/react-query";
import { createGuestSession } from "../features/auth/auth.api";
import { sessionStorageApi } from "../shared/api/session";

export const Route = createFileRoute("/login")({
  component: LoginPage
});

function LoginPage() {
  const navigate = useNavigate();

  const guestMutation = useMutation({
    mutationFn: createGuestSession,
    onSuccess(data) {
      sessionStorageApi.setGuestUserId(data.auth.headerValue);
      navigate({ to: "/onboarding" });
    }
  });

  return (
    <main style={{ padding: 32 }}>
      <h1>Bienvenido a Semillas</h1>

      <button
        onClick={() =>
          guestMutation.mutate({
            nickname: "Invitado"
          })
        }
      >
        Continuar como invitado
      </button>

      {guestMutation.isPending && <p>Creando invitado...</p>}
      {guestMutation.isError && <p>No se pudo crear el invitado.</p>}
    </main>
  );
}
