import type { ErrorHandler } from "hono";
import { HttpError } from "../errors/http-error";

export const errorHandler: ErrorHandler = (err, c) => {
  console.error(err);

  if (err instanceof HttpError) {
    return c.json(
      {
        ok: false,
        error: {
          code: err.code,
          message: err.message
        }
      },
      err.status as 400 | 401 | 403 | 404 | 500
    );
  }

  return c.json(
    {
      ok: false,
      error: {
        code: "INTERNAL_SERVER_ERROR",
        message: "Error interno del servidor"
      }
    },
    500
  );
};
