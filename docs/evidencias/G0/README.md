# Evidencias del Gate G0

Este directorio contiene evidencia verificable del Gate G0 de cierre.

## Baseline actual

- Documento: [`../../trazabilidad/baseline-dev2.md`](../../trazabilidad/baseline-dev2.md)
- Rama: `dev2`
- SHA: `01ab28ebf4f017b1d07b84a4fe932f5767e8ec98`
- Fecha: 2026-07-13

## Estado

El baseline no está verde. Fallan el typecheck y pruebas backend, E2E y build backend por cambios concurrentes de `dev2` descritos en el documento de baseline. Las pruebas frontend y de contrato, además del typecheck frontend, sí pasan.

No se incluyen secretos, variables de entorno ni credenciales en las evidencias.
