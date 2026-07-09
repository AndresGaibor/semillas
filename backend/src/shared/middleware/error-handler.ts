import type { ErrorHandler } from "hono";
import { HttpError } from "../errors/http-error";
import { responderError } from "../http/respuesta";

export const errorHandler: ErrorHandler = (err, c) => {
  console.error(err);

  if (err instanceof HttpError) {
    return responderError(err.message, err.code, err.status as 400 | 401 | 403 | 404 | 500);
  }

  return responderError("Error interno del servidor", "INTERNAL_SERVER_ERROR", 500);
};
