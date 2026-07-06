export class HttpError extends Error {
  constructor(
    public readonly status: number,
    message: string,
    public readonly code = "HTTP_ERROR"
  ) {
    super(message);
  }
}

export class UnauthorizedError extends HttpError {
  constructor(message = "No autenticado") {
    super(401, message, "UNAUTHORIZED");
  }
}

export class ForbiddenError extends HttpError {
  constructor(message = "No autorizado") {
    super(403, message, "FORBIDDEN");
  }
}

export class NotFoundError extends HttpError {
  constructor(message = "No encontrado") {
    super(404, message, "NOT_FOUND");
  }
}
