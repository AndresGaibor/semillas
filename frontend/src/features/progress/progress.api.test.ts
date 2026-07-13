import { expect, mock, test } from "bun:test";

const peticionMock = mock(() => Promise.resolve({}));

mock.module("../../shared/api/api", () => ({
  peticion: peticionMock,
  RUTAS_API: { PROGRESO: { MI: "/progreso/mi" } },
}));

const { enviarEventosProgreso } = await import("./progress.api");

test("propaga el rechazo al registrar un evento de progreso", async () => {
  const error = new Error("Completa los pasos CRECER antes de finalizar el tema");
  peticionMock.mockRejectedValueOnce(error);

  await expect(
    enviarEventosProgreso([
      {
        evento_id_cliente: "550e8400-e29b-41d4-a716-446655440000",
        tipo_evento: "tema_completado",
        tema_id: "550e8400-e29b-41d4-a716-446655440001",
      },
    ]),
  ).rejects.toBe(error);
});
