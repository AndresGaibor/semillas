import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const sourceRoot = path.join(root, "frontend", "src");
const required = ["storybook/docs", "storybook/fixtures", "storybook/mocks", "storybook/helpers"];
const categories = new Set(["00 · Guía", "01 · Fundamentos", "02 · UI", "03 · Patrones", "04 · Features", "05 · Pantallas", "06 · Flujos", "07 · QA visual", "98 · Laboratorio", "99 · Deprecated"]);

function walk(directory) {
  if (!existsSync(directory)) return [];
  return readdirSync(directory).flatMap((entry) => {
    const filePath = path.join(directory, entry);
    return statSync(filePath).isDirectory() ? walk(filePath) : filePath;
  });
}

const errors = [];
for (const relative of required) if (!existsSync(path.join(sourceRoot, relative))) errors.push(`Falta ${relative}`);
const stories = walk(sourceRoot).filter((filePath) => filePath.endsWith(".stories.tsx"));
for (const filePath of stories) {
  const source = readFileSync(filePath, "utf8");
  const metaSource = source.match(/(?:const|let)\s+meta[\s\S]*?(?:satisfies\s+Meta|export\s+default\s+meta)/)?.[0] ?? source;
  const titles = [...metaSource.matchAll(/title:\s*["`]([^"`]+)["`]/g)].map((match) => match[1]);
  for (const title of titles) {
    const category = title.split("/")[0];
    if (!/^\d{2} · /.test(category) || !categories.has(category)) errors.push(`${path.relative(root, filePath)} tiene raíz no canónica: ${title}`);
  }
  if (/\bas any\b/.test(source)) errors.push(`${path.relative(root, filePath)} contiene as any`);
}

if (errors.length) {
  console.error(errors.join("\n"));
  process.exitCode = 1;
} else {
  console.log(`Arquitectura Storybook: ${stories.length} stories y ${categories.size} categorías verificadas.`);
}
