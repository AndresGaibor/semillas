import { existsSync, readFileSync, readdirSync, statSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const sourceRoot = path.join(root, "frontend", "src");
const write = process.argv.includes("--write");
const categories = ["00 · Guía", "01 · Fundamentos", "02 · UI", "03 · Patrones", "04 · Features", "05 · Pantallas", "06 · Flujos", "07 · QA visual", "98 · Laboratorio", "99 · Deprecated"];

function walk(directory) {
  if (!existsSync(directory)) return [];
  return readdirSync(directory).flatMap((entry) => {
    const filePath = path.join(directory, entry);
    return statSync(filePath).isDirectory() ? walk(filePath) : filePath;
  });
}

function categoryFor(relativePath, title) {
  if (relativePath.startsWith("storybook/uiux-coverage.")) return categories[7];
  if (relativePath.startsWith("storybook/routes/")) return categories[5];
  if (relativePath.startsWith("storybook/")) return categories[6];
  if (relativePath.startsWith("componentes/ui/")) return title.startsWith("Design Tokens/") ? categories[1] : categories[2];
  if (relativePath.startsWith("componentes/actividades/")) return categories[4];
  if (relativePath === "storybook/ui-complementarios.stories.tsx") return categories[2];
  if (relativePath.startsWith("features/")) return categories[4];
  if (relativePath.startsWith("shared/")) return categories[3];
  if (relativePath.startsWith("paginas/")) return categories[5];
  return null;
}

const changes = [];
for (const filePath of walk(sourceRoot).filter((filePath) => filePath.endsWith(".stories.tsx"))) {
  const relativePath = path.relative(sourceRoot, filePath).replaceAll(path.sep, "/");
  const source = readFileSync(filePath, "utf8");
  const match = source.match(/^(\s*title:\s*")([^"\n]+)(",?\s*)$/m);
  if (!match) continue;
  const [, prefix, title, suffix] = match;
  if (/^\d{2} · /.test(title)) continue;
  const category = categoryFor(relativePath, title);
  if (!category) continue;
  const nextTitle = `${category}/${title.replace(/^(?:Componentes|Features|Admin|Shared|Páginas|Pantallas|UI|Actividades|Design Tokens)\//, "")}`;
  if (nextTitle === title) continue;
  const nextSource = source.replace(match[0], `${prefix}${nextTitle}${suffix}`);
  changes.push({ filePath, relativePath, from: title, to: nextTitle });
  if (write) writeFileSync(filePath, nextSource);
}

for (const change of changes) console.log(`${write ? "updated" : "would update"} ${change.relativePath}: ${change.from} -> ${change.to}`);
console.log(`${write ? "Actualizadas" : "Detectadas"}: ${changes.length} stories.`);
if (!write && changes.length > 0) process.exitCode = 1;
