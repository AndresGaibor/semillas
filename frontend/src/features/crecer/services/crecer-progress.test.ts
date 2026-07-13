import { expect, mock, test } from "bun:test";
import { ErrorApi } from "@/shared/api/error-api";

const enviarEventosMock = mock(() => Promise.resolve(undefined));
const encolarEventoMock = mock(() => Promise.resolve(undefined));

mock.module("@/features/progress/progress.api", () => ({
  enviarEventosProgreso: enviarEventosMock,
}));

mock.module("@/lib/offline", () => ({
  db: {
    temas: { where: () => ({ equals: () => ({ first: () => Promise.resolve({ localId: "tema-local" }) }) }) },
    pasos: { where: () => ({ equals: () => ({ first: () => Promise.resolve({ localId: "paso-local" }) }) }) },
    actividades: { where: () => ({ equals: () => ({ first: () => Promise.resolve({ localId: "actividad-local" }) }) }) },
  },
  queueEventoProgreso: encolarEventoMock,
}));

Object.defineProperty(globalThis, "navigator", {
  value: { onLine: true },
  configurable: true,
});

const { registrarEventosCrecer } = await import("./crecer-progress");

test("propaga un rechazo de validación sin encolarlo para sincronización", async () => {
  const error = new ErrorApi("Completa los pasos CRECER antes de finalizar el tema", 400);
  enviarEventosMock.mockRejectedValueOnce(error);

  await expect(
    registrarEventosCrecer([
      {
        evento_id_cliente: "550e8400-e29b-41d4-a716-446655440000",
        tipo_evento: "tema_completado",
        tema_id: "550e8400-e29b-41d4-a716-446655440001",
      },
    ]),
  ).rejects.toBe(error);

  expect(encolarEventoMock).not.toHaveBeenCalled();
});
