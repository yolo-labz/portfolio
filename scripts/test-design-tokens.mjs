// Plants each kind of drift in a throwaway copy of the tree and asserts the gate catches it.
import assert from "node:assert/strict";
import { cpSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { check } from "./check-design-tokens.mjs";

const repo = join(dirname(fileURLToPath(import.meta.url)), "..");
const fresh = () => {
	const root = mkdtempSync(join(tmpdir(), "design-"));
	cpSync(join(repo, "apps/web/src"), join(root, "apps/web/src"), { recursive: true });
	return root;
};
const d = (root, f) => join(root, "apps/web/src/design", f);
const run = async (plant, opts) => {
	const root = fresh();
	try {
		await plant(root);
		return await check(root, opts);
	} finally {
		rmSync(root, { recursive: true, force: true });
	}
};

assert.deepEqual(await run(() => {}), [], "the committed tree is clean");

let p = await run((r) =>
	writeFileSync(
		d(r, "tokens.css"),
		readFileSync(d(r, "tokens.css"), "utf8").replace("#00c77a", "#00c77b"),
	),
);
assert.ok(
	p.some((m) => m.startsWith("tokens.css: copy is")),
	"hand edit of the vendored file",
);

p = await run((r) => writeFileSync(join(r, "apps/web/src/app/x.css"), "a { color: #ff0000; }\n"));
assert.ok(
	p.some((m) => m.includes("raw colour in CSS")),
	"raw hex in CSS",
);

p = await run((r) =>
	writeFileSync(join(r, "apps/web/src/app/x.ts"), 'export const c = "#1a1a2e";\n'),
);
assert.ok(
	p.some((m) => m.includes("#1a1a2e is not in the palette")),
	"off-palette hex in TS",
);

p = await run(() => {}, { online: true, fetchText: async () => Buffer.from("something else") });
assert.ok(
	p.some((m) => m.includes("hashes to")),
	"record that does not match upstream",
);

console.log("design drift gate: 5 cases pass");
