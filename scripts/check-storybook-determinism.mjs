import { existsSync, readFileSync, readdirSync, statSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const sourceRoot = path.join(root, "frontend", "src");
const write = process.argv.includes("--write");
const fixedTimestamp = "1783684800000";

function walk(directory) {
  if (!existsSync(directory)) return [];
  return readdirSync(directory).flatMap((entry) => {
    const filePath = path.join(directory, entry);
    return statSync(filePath).isDirectory() ? walk(filePath) : filePath;
  });
}

const stories = walk(sourceRoot).filter((filePath) => filePath.endsWith(".stories.tsx"));
const violations = [];
for (const filePath of stories) {
  const source = readFileSync(filePath, "utf8");
  const remoteImages = [...source.matchAll(/https:\/\/(?:picsum\.photos|i\.pravatar\.cc|api\.dicebear\.com)[^"'`\s)]*/g)];
  const nondeterministicDates = [...source.matchAll(/(?:Date\.now\(\)|new Date\(\)(?:\.toISOString\(\))?)/g)];
  if (write && (remoteImages.length || nondeterministicDates.length)) {
    const nextSource = source
      .replace(/https:\/\/(?:picsum\.photos)[^"'`\s)]*/g, "/storybook/fixtures/cover.svg")
      .replace(/https:\/\/(?:i\.pravatar\.cc|api\.dicebear\.com)[^"'`\s)]*/g, "/storybook/fixtures/avatar.svg")
      .replaceAll("new Date().toISOString()", '"2026-07-10T12:00:00.000Z"')
      .replaceAll("Date.now()", fixedTimestamp);
    writeFileSync(filePath, nextSource);
    continue;
  }
  for (const match of [...remoteImages, ...nondeterministicDates]) violations.push(`${path.relative(root, filePath)}:${match.index + 1}: ${match[0]}`);
}

if (violations.length) {
  console.error("Stories no deterministas detectadas:");
  for (const violation of violations) console.error(`- ${violation}`);
  process.exitCode = 1;
} else {
  console.log(`Determinismo Storybook: ${stories.length} stories verificadas.`);
}
