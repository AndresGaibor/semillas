import { afterEach, beforeAll, beforeEach, describe, expect, it } from "bun:test";
import { sessionStorageApi } from "../../shared/api/session";

let archivarClubAdmin: typeof import("./admin-clubes.api")["archivarClubAdmin"];
let cerrarRetoClubAdmin: typeof import("./admin-clubes.api")["cerrarRetoClubAdmin"];
let crearRetoClubAdmin: typeof import("./admin-clubes.api")["crearRetoClubAdmin"];
let expulsarMiembroClubAdmin: typeof import("./admin-clubes.api")["expulsarMiembroClubAdmin"];
let listarClubesAdmin: typeof import("./admin-clubes.api")["listarClubesAdmin"];
let obtenerClubAdmin: typeof import("./admin-clubes.api")["obtenerClubAdmin"];
let reactivarClubAdmin: typeof import("./admin-clubes.api")["reactivarClubAdmin"];
let transferirLiderazgoClubAdmin: typeof import("./admin-clubes.api")["transferirLiderazgoClubAdmin"];

const fetchOriginal = globalThis.fetch;
const navigatorOriginal = globalThis.navigator;
const getGuestUserIdOriginal = sessionStorageApi.getGuestUserId;
const getGuestTokenOriginal = sessionStorageApi.getGuestToken;
const getAccessTokenOriginal = sessionStorageApi.getAccessToken;

beforeAll(async () => {
  process.env.VITE_API_URL = "http://localhost";
  process.env.VITE_SUPABASE_URL = "http://localhost";
  process.env.VITE_SUPABASE_ANON_KEY = "clave-de-prueba";
  ({
    archivarClubAdmin,
    cerrarRetoClubAdmin,
    crearRetoClubAdmin,
    expulsarMiembroClubAdmin,
    listarClubesAdmin,
    obtenerClubAdmin,
    reactivarClubAdmin,
    transferirLiderazgoClubAdmin,
  } = await import("./admin-clubes.api"));
});

function configurarConexion(enLinea: boolean) {
  Object.defineProperty(globalThis, "navigator", {
    configurable: true,
    value: { onLine: enLinea },
  });
}

beforeEach(() => {
  globalThis.fetch = fetchOriginal;
  sessionStorageApi.getGuestUserId = () => null;
  sessionStorageApi.getGuestToken = () => null;
  sessionStorageApi.getAccessToken = () => null;
  configurarConexion(true);
});

afterEach(() => {
  globalThis.fetch = fetchOriginal;
  sessionStorageApi.getGuestUserId = getGuestUserIdOriginal;
  sessionStorageApi.getGuestToken = getGuestTokenOriginal;
  sessionStorageApi.getAccessToken = getAccessTokenOriginal;
  Object.defineProperty(globalThis, "navigator", {
    configurable: true,
    value: navigatorOriginal,
  });
});

describe("admin-clubes.api", () => {
  it("solicita clubes con filtros de estado y paginación", async () => {
    let ruta = "";
    globalThis.fetch = (async (input: RequestInfo | URL, init?: RequestInit) => {
      const solicitud = input instanceof Request ? input : new Request(String(input), init);
      ruta = `${new URL(solicitud.url).pathname}${new URL(solicitud.url).search}`;
      return new Response(JSON.stringify({ exito: true, datos: { clubes: [], meta: { total: 0, limit: 20, offset: 0 } } }), {
        headers: { "content-type": "application/json" },
      });
    }) as unknown as typeof fetch;

    const resultado = await listarClubesAdmin({ estado: "archivado", limit: 20, offset: 0 });

    expect(ruta).toBe("/administracion/clubes?estado=archivado&limit=20&offset=0");
    expect(resultado.meta.limit).toBe(20);
    expect(resultado.meta.offset).toBe(0);
  });

  it("archiva un club mediante POST administrativo", async () => {
    let metodo = "";
    let ruta = "";
    globalThis.fetch = (async (input: RequestInfo | URL, init?: RequestInit) => {
      const solicitud = input instanceof Request ? input : new Request(String(input), init);
      metodo = solicitud.method;
      ruta = new URL(solicitud.url).pathname;
      return new Response(JSON.stringify({ exito: true, datos: { archived: true } }), {
        headers: { "content-type": "application/json" },
      });
    }) as unknown as typeof fetch;

    await archivarClubAdmin("club-1");

    expect({ metodo, ruta }).toEqual({ metodo: "POST", ruta: "/administracion/clubes/club-1/archivar" });
  });

  it("propaga el error de red al consultar administración sin conexión", async () => {
    configurarConexion(false);
    let solicitudes = 0;
    globalThis.fetch = (async () => {
      solicitudes += 1;
      throw new TypeError("Failed to fetch");
    }) as unknown as typeof fetch;

    await expect(listarClubesAdmin({ estado: "todos", limit: 20, offset: 0 })).rejects.toThrow("Failed to fetch");

    expect(solicitudes).toBe(1);
  });

  it("propaga el error de red de todas las mutaciones administrativas", async () => {
    configurarConexion(false);
    let solicitudes = 0;
    globalThis.fetch = (async () => {
      solicitudes += 1;
      throw new TypeError("Failed to fetch");
    }) as unknown as typeof fetch;

    const mutaciones = [
      () => archivarClubAdmin("club-1"),
      () => reactivarClubAdmin("club-1"),
      () => expulsarMiembroClubAdmin("club-1", "usuario-1"),
      () => transferirLiderazgoClubAdmin("club-1", "usuario-1"),
      () => crearRetoClubAdmin("club-1", {
      nombre: "Reto",
      codigo_metrica: "xp_grupal",
      valor_objetivo: 10,
      fecha_inicio: "2026-07-12T00:00:00.000Z",
      fecha_fin: "2026-07-19T00:00:00.000Z",
      }),
      () => cerrarRetoClubAdmin("club-1", "reto-1", "Cierre administrativo"),
    ];

    for (const mutar of mutaciones) {
      await expect(mutar()).rejects.toThrow("Failed to fetch");
    }

    expect(solicitudes).toBe(6);
  });

  it("recupera el detalle administrativo desde el endpoint correspondiente", async () => {
    let ruta = "";
    globalThis.fetch = (async (input: RequestInfo | URL, init?: RequestInit) => {
      const solicitud = input instanceof Request ? input : new Request(String(input), init);
      ruta = new URL(solicitud.url).pathname;
      return new Response(JSON.stringify({ exito: true, datos: { club: { id: "club-1" }, miembros: [], retos: [] } }), {
        headers: { "content-type": "application/json" },
      });
    }) as typeof fetch;

    await obtenerClubAdmin("club-1");

    expect(ruta).toBe("/administracion/clubes/club-1");
  });
});
