import { z } from "zod";

export const responderActividadSchema = z.object({
  evento_id_cliente: z.string().uuid(),
  opcion_id_seleccionada: z.string().uuid().optional(),
  texto_respuesta: z.string().optional(),
  ocurrido_en_cliente: z.string().datetime().optional(),
  dispositivo_id: z.string().optional()
});
