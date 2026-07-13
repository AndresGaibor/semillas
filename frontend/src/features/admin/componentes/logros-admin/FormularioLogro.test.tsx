import { describe, expect, it, mock } from "bun:test";
import { render, fireEvent, cleanup } from "@testing-library/react";
import { FormularioLogro } from "./FormularioLogro";

afterEach(() => {
  cleanup();
});

describe("FormularioLogro", () => {
  it("muestra errores cuando el código y el nombre son inválidos", () => {
    const onGuardar = mock(() => undefined);
    const { getByText, container } = render(
      <FormularioLogro abierto modo="crear" guardando={false} onCerrar={() => undefined} onGuardar={onGuardar} />,
    );

    const formulario = container.querySelector("form");
    if (!formulario) throw new Error("Formulario no encontrado");
    fireEvent.submit(formulario);

    expect(getByText(/al menos 3 caracteres/)).toBeTruthy();
    expect(onGuardar).not.toHaveBeenCalled();
  });

  it("envía datos normalizados cuando el formulario es válido", () => {
    const onGuardar = mock(() => undefined);
    const { container, getByPlaceholderText } = render(
      <FormularioLogro abierto modo="crear" guardando={false} onCerrar={() => undefined} onGuardar={onGuardar} />,
    );

    fireEvent.change(getByPlaceholderText("primer-tema"), { target: { value: "PRIMER-TEMA" } });
    fireEvent.change(getByPlaceholderText("El Amor de Dios"), { target: { value: "Primer tema" } });
    fireEvent.change(getByPlaceholderText("Completaste tu primer tema sobre el amor de Dios."), {
      target: { value: "  Detalle  " },
    });

    const formulario = container.querySelector("form");
    if (!formulario) throw new Error("Formulario no encontrado");
    fireEvent.submit(formulario);

    expect(onGuardar).toHaveBeenCalledTimes(1);
    const llamado = onGuardar.mock.calls[0]?.[0] as Record<string, unknown> | undefined;
    expect(llamado?.codigo).toBe("primer-tema");
    expect(llamado?.nombre).toBe("Primer tema");
    expect(llamado?.descripcion).toBe("Detalle");
  });

  it("precarga los valores cuando se edita un logro existente", () => {
    const logro = {
      id: "l1",
      codigo: "racha-3",
      nombre: "Tres días",
      descripcion: "Tres días seguidos",
      url_icono: "https://cdn.example.com/x.png",
      bono_xp: 50,
      codigo_criterio: "dias_racha" as const,
      valor_criterio: 3,
      activo: true,
      creado_en: "2026-07-13T00:00:00.000Z",
      otorgados: 0,
    };

    const { getByDisplayValue, container } = render(
      <FormularioLogro abierto modo="editar" logro={logro} guardando={false} onCerrar={() => undefined} onGuardar={() => undefined} />,
    );

    expect(getByDisplayValue("racha-3")).toBeTruthy();
    expect(getByDisplayValue("Tres días")).toBeTruthy();

    const formulario = container.querySelector("form");
    if (!formulario) throw new Error("Formulario no encontrado");
    fireEvent.submit(formulario);
  });
});