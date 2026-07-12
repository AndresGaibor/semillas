# Infraestructura de historias

La configuración global vive en `.storybook/preview.tsx` y mantiene un `QueryClient` aislado por story. Las stories no deben compartir caché, fechas aleatorias ni llamadas de red no declaradas.

## Categorías

La navegación objetivo usa estos prefijos de título:

`00 · Guía`, `01 · Fundamentos`, `02 · UI`, `03 · Patrones`, `04 · Features`, `05 · Pantallas`, `06 · Flujos`, `07 · QA visual`, `98 · Laboratorio`, `99 · Deprecated`.

Las stories individuales siguen siendo contratos técnicos. Las stories técnicas usan `autodocs` + `!dev`: permanecen disponibles para documentación y pruebas, pero no llenan la barra lateral. Los boards y las pantallas compuestas son las entradas principales para revisión visual.

## Estados y tags

Usa `MatrizEstados` para estados funcionales y `MarcoViewport` para comparaciones responsive. Los tags `!dev`, `!autodocs` y `!test` permiten retirar una story de un índice heredado sin eliminarla del catálogo técnico; `experimental` y `deprecated` quedan ocultos por defecto.

## Fixtures y red

Los builders viven en `fixtures/`, los handlers MSW en `mocks/` y las APIs no declaradas fallan por configuración (`onUnhandledRequest: "error"`). No uses imágenes remotas ni `new Date()` dentro del render de una story estable.
