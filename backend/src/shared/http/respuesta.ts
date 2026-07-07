export function responderExito<T>(datos: T, status = 200) {
  return Response.json(
    {
      exito: true as const,
      datos
    },
    { status }
  );
}

export function responderError(error: string, codigo?: string, status = 400) {
  return Response.json(
    {
      exito: false as const,
      error,
      ...(codigo ? { codigo } : {})
    },
    { status }
  );
}
