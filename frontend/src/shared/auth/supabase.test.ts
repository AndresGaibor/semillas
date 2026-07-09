import { describe, expect, it, mock, beforeEach } from "bun:test";

beforeEach(() => {
  const storage = new Map<string, string>();

  Object.defineProperty(globalThis, "localStorage", {
    value: {
      getItem: (key: string) => storage.get(key) ?? null,
      setItem: (key: string, value: string) => {
        storage.set(key, value);
      },
      removeItem: (key: string) => {
        storage.delete(key);
      },
      clear: () => storage.clear(),
    },
    configurable: true,
  });
});

describe("supabase auth helper", () => {
  it("inicia sesión con Google usando redirectTo", async () => {
    const modulo = await import("./supabase");
    const signInWithOAuthMock = mock(async () => ({
      data: { url: "https://supabase.example/auth/v1/authorize" },
      error: null,
    }));

    const cliente = {
      auth: {
        signInWithOAuth: signInWithOAuthMock,
        getSession: mock(async () => ({ data: { session: null }, error: null })),
        onAuthStateChange: mock(() => ({ data: { subscription: { unsubscribe: mock(() => undefined) } } })),
        signOut: mock(async () => ({ error: null })),
      },
    } as never;

    const url = await modulo.iniciarSesionGoogle("https://semillas.org/app", cliente);

    expect(signInWithOAuthMock).toHaveBeenCalledWith({
      provider: "google",
      options: {
        redirectTo: "https://semillas.org/app",
        queryParams: {
          access_type: "offline",
          prompt: "consent",
        },
      },
    });
    expect(url).toBe("https://supabase.example/auth/v1/authorize");
  });

  it("sincroniza el access token de la sesión al storage local", async () => {
    const modulo = await import("./supabase");
    const getSessionMock = mock(async () => ({
      data: { session: { access_token: "token-123" } },
      error: null,
    }));

    const cliente = {
      auth: {
        signInWithOAuth: mock(async () => ({ data: { url: "" }, error: null })),
        getSession: getSessionMock,
        onAuthStateChange: mock(() => ({ data: { subscription: { unsubscribe: mock(() => undefined) } } })),
        signOut: mock(async () => ({ error: null })),
      },
    } as never;

    const session = await modulo.sincronizarSesionAutenticada(cliente);

    expect(getSessionMock).toHaveBeenCalledTimes(1);
    expect(globalThis.localStorage.getItem("semillas_access_token")).toBe("token-123");
    expect(session?.access_token).toBe("token-123");
  });

  it("cierra la sesión y borra el token local", async () => {
    const modulo = await import("./supabase");
    const signOutMock = mock(async () => ({ error: null }));

    const cliente = {
      auth: {
        signInWithOAuth: mock(async () => ({ data: { url: "" }, error: null })),
        getSession: mock(async () => ({ data: { session: null }, error: null })),
        onAuthStateChange: mock(() => ({ data: { subscription: { unsubscribe: mock(() => undefined) } } })),
        signOut: signOutMock,
      },
    } as never;

    globalThis.localStorage.setItem("semillas_access_token", "token-123");

    await modulo.cerrarSesionAutenticada(cliente);

    expect(signOutMock).toHaveBeenCalledTimes(1);
    expect(globalThis.localStorage.getItem("semillas_access_token")).toBeNull();
  });
});
