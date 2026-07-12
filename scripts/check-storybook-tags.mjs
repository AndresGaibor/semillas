import { existsSync, readFileSync, readdirSync, statSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const sourceRoot = path.join(root, "frontend", "src");
const write = process.argv.includes("--write");

function walk(directory) {
  if (!existsSync(directory)) return [];
  return readdirSync(directory).flatMap((entry) => {
    const filePath = path.join(directory, entry);
    return statSync(filePath).isDirectory() ? walk(filePath) : filePath;
  });
}

function isTechnicalStory(filePath) {
  const relative = path.relative(sourceRoot, filePath).replaceAll(path.sep, "/");
  return /^(componentes|features\/[^/]+|shared)\/.+\.stories\.tsx$/.test(relative);
}

const changes = [];
for (const filePath of walk(sourceRoot).filter((filePath) => filePath.endsWith(".stories.tsx") && isTechnicalStory(filePath))) {
  const source = readFileSync(filePath, "utf8");
  if (source.includes('tags: ["autodocs", "!dev"]')) continue;
  let nextSource = source;
  if (source.includes('tags: ["autodocs"]')) {
    nextSource = source.replace('tags: ["autodocs"]', 'tags: ["autodocs", "!dev"]');
  } else {
    const titleLine = source.match(/^(\s*title:\s*"[^"]+",?\s*)$/m);
    if (!titleLine) continue;
    nextSource = source.replace(titleLine[0], `${titleLine[0]}\n  tags: ["autodocs", "!dev"],`);
  }
  changes.push(path.relative(root, filePath));
  if (write) writeFileSync(filePath, nextSource);
}

if (!write && changes.length) {
  console.error("Stories técnicas sin política !dev:");
  for (const change of changes) console.error(`- ${change}`);
  process.exitCode = 1;
} else {
  console.log(`${write ? "Actualizadas" : "Verificadas"}: ${changes.length} stories técnicas.`);
}
