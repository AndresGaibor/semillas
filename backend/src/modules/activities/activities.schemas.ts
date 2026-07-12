import { z } from "zod";

export const responderActividadSchema = z.object({
  evento_id_cliente: z.string().uuid(),
  opcion_id_seleccionada: z.string().uuid().optional(),
  texto_respuesta: z.string().trim().min(1).max(2000).optional(),
  respuesta: z.unknown().optional(),
  confirmacion: z.boolean().optional(),
  ocurrido_en_cliente: z.string().datetime().optional(),
  dispositivo_id: z.string().trim().max(255).optional()
}).superRefine((entrada, contexto) => {
  const respuestas =
    Number(Boolean(entrada.opcion_id_seleccionada)) +
    Number(Boolean(entrada.texto_respuesta)) +
    Number(entrada.respuesta !== undefined) +
    Number(entrada.confirmacion !== undefined);
  if (respuestas !== 1) {
    contexto.addIssue({
      code: "custom",
      path: ["opcion_id_seleccionada"],
      message: "Envía exactamente una respuesta"
    });
  }
});
