import { execFileSync } from "node:child_process";
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

const root = new URL("../frontend/src/", import.meta.url).pathname;
const archivos = [];

function recorrer(directorio) {
  for (const entrada of readdirSync(directorio)) {
    const ruta = join(directorio, entrada);
    if (statSync(ruta).isDirectory()) recorrer(ruta);
    else if (/\.(tsx?|css)$/.test(ruta)) archivos.push(ruta);
  }
}

recorrer(root);
const produccion = archivos.filter((archivo) => /routes|features/.test(archivo));
const contenidoProduccion = produccion.map((archivo) => readFileSync(archivo, "utf8")).join("\n");
const falsos = [...contenidoProduccion.matchAll(/href="#"|onClick=\{\(\) => \{\}\}/g)];
const arbitraryColors = [...archivos.flatMap((archivo) => [...readFileSync(archivo, "utf8").matchAll(/#[0-9A-Fa-f]{6,8}/g)].map((match) => match[0]))];
const radiosArbitrarios = [...archivos.flatMap((archivo) => [...readFileSync(archivo, "utf8").matchAll(/rounded-\[[^\]]+\]/g)].map((match) => match[0]))];

let fallos = 0;
if (falsos.length) {
  console.error(`UI-UX: ${falsos.length} acciones falsas encontradas en producción.`);
  fallos += falsos.length;
}

const unicos = new Set(arbitraryColors);
console.log(`UI-UX: ${unicos.size} colores hex detectados; ${new Set(radiosArbitrarios).size} radios arbitrary.`);
if (unicos.size > 470) {
  console.warn("UI-UX: la deuda histórica de colores supera la línea base; no se agregan colores nuevos sin token.");
}

try {
  const salida = execFileSync("rg", ["-n", "V2|New[A-Z]|Legacy|Old[A-Z]", root], { encoding: "utf8" });
  if (salida.trim()) console.warn("UI-UX: revisar nombres V2/New/Legacy detectados:\n" + salida);
} catch {
  // rg devuelve 1 cuando no encuentra coincidencias; es un resultado correcto.
}

if (fallos) process.exit(1);
console.log("UI-UX: comprobación estructural aprobada.");
