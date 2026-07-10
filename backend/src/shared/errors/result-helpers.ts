export interface ResultadoConError {
  error: { mensaje: string; codigo: string; estado: number };
}

export function esResultadoConError(resultado: unknown): resultado is ResultadoConError {
  return typeof resultado === "object" && resultado !== null && "error" in resultado;
}
