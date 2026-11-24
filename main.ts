import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const LINE =
  "You will meet a stranger today. It is you, from three prompts ago, and you have already forgotten him.";

const outDir =
  process.env.MAKEFUN_OUTPUT_DIR ?? join(process.cwd(), "output");
mkdirSync(outDir, { recursive: true });
const outPath = join(outDir, "entry.txt");
writeFileSync(outPath, LINE, "utf8");

// Read-back self-check: the file on disk must hold exactly the line,
// one line, no trailing newline, within the 140-character gate, in
// fortune-slip voice (opens "You will") with the twist word intact.
const back = readFileSync(outPath, "utf8");
if (back !== LINE) {
  throw new Error(`entry.txt mismatch: got ${JSON.stringify(back)}`);
}
if (back.length > 140 || back.length < 1 || back.includes("\n")) {
  throw new Error(`entry.txt invalid: ${back.length} chars`);
}
if (back !== back.trim()) {
  throw new Error("entry.txt has leading/trailing whitespace");
}
if (!back.startsWith("You will")) {
  throw new Error("entry.txt lost its fortune-slip opening");
}
if (!back.includes("forgotten")) {
  throw new Error("entry.txt lost its twist word");
}
console.log(`wrote ${outPath} (${back.length} chars, verified)`);
