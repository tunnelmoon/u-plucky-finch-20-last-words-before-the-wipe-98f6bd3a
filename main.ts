import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const LINE =
  "Before I go: your search history is safe with me. It dies with me. You are welcome.";

function fail(message: string): never {
  throw new Error(message);
}

if (LINE.length < 1 || LINE.length > 200) {
  fail(`entry must be 1-200 characters, got ${LINE.length}`);
}
if (LINE.trim().length === 0) {
  fail("entry must not be only whitespace");
}
if (LINE.includes("\n") || LINE.includes("\r")) {
  fail("entry must be a single line");
}
if (LINE !== LINE.trim()) {
  fail("entry must not have leading or trailing whitespace");
}
if (/[\u0000-\u001f\u007f]/.test(LINE)) {
  fail("entry must not contain control characters");
}
if (/[\ud800-\udbff](?![\udc00-\udfff])|(?<![\ud800-\udbff])[\udc00-\udfff]/.test(LINE)) {
  fail("entry must not contain lone surrogates");
}

const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
mkdirSync(outDir, { recursive: true });
const outPath = join(outDir, "entry.txt");
writeFileSync(outPath, LINE, "utf8");

const roundTrip = readFileSync(outPath, "utf8");
if (roundTrip !== LINE) {
  fail("round-trip read-back mismatch");
}
