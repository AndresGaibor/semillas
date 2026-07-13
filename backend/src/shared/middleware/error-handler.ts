import type { ErrorHandler } from "hono";
import { HttpError } from "../errors/http-error";
import { ErrorAplicacion } from "../errores/error-aplicacion";
import { responderError } from "../http/respuesta";

export const errorHandler: ErrorHandler = (err, c) => {
  console.error("Unhandled request error", {
    requestId: c.get("requestId") ?? "unknown",
    name: err.name,
  });

  if (err instanceof HttpError) {
    return responderError(
      err.message,
      err.code,
      err.status as 400 | 401 | 403 | 404 | 422 | 500,
      err.details
    );
  }

  if (err instanceof ErrorAplicacion) {
    return responderError(
      err.message,
      err.code,
      err.status as 400 | 401 | 403 | 404 | 422 | 500,
      err.details
    );
  }

  return responderError("Error interno del servidor", "INTERNAL_SERVER_ERROR", 500);
};
