#!/usr/bin/env node
// Drift gate for the org design tokens (yolo-labz/.github design/).
//
//   offline  the vendored copy in apps/web/src/design/ matches the sha256 recorded in design-source.json
//            (nobody edited the generated file by hand)
//   online   the same files at the recorded `rev` in yolo-labz/.github hash to that sha256
//            (nobody forged the record). On when CI or DESIGN_ONLINE=1 is set.
//   literals CSS outside src/design/ holds no raw hex/oklch/rgb colour, and a hex colour in .ts/.tsx is
//            one the palette defines (a manifest colour one digit off is a drift too).
//   --vendor <rev>   re-vendor: fetch dist/*.css at <rev> from the source repo and rewrite design-source.json
//
//   --vendor <rev>  re-vendor: fetch the files at <rev> and rewrite design-source.json
//
// A line with `design-allow:` is skipped. Exit 0 clean, 1 drift, 2 could not check.
import { createHash } from "node:crypto";
import { readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const sha = (buf) => createHash("sha256").update(buf).digest("hex");

function walk(dir, out = []) {
	for (const name of readdirSync(dir)) {
		if (name === "node_modules" || name === ".next") continue;
		const full = join(dir, name);
		if (statSync(full).isDirectory()) walk(full, out);
		else out.push(full);
	}
	return out;
}

export async function check(root, { online = false, fetchText = defaultFetch } = {}) {
	const src = join(root, "apps/web/src");
	const dir = join(src, "design");
	const problems = [];
	const record = JSON.parse(readFileSync(join(dir, "design-source.json"), "utf8"));

	for (const [file, want] of Object.entries(record.files)) {
		const have = sha(readFileSync(join(dir, file)));
		if (have !== want)
			problems.push(
				`${file}: copy is ${have.slice(0, 12)}, record says ${want.slice(0, 12)}; re-vendor, never edit`,
			);
		if (online) {
			const url = `https://raw.githubusercontent.com/${record.repo}/${record.rev}/${record.path}/${file}`;
			const upstream = sha(await fetchText(url));
			if (upstream !== want)
				problems.push(
					`${file}: ${record.repo}@${record.rev.slice(0, 7)} hashes to ${upstream.slice(0, 12)}, record says ${want.slice(0, 12)}`,
				);
		}
	}

	const palette = new Set(
		[...readFileSync(join(dir, "tokens.css"), "utf8").matchAll(/#[0-9a-f]{6}\b/g)].map((m) => m[0]),
	);
	for (const file of walk(src)) {
		if (file.startsWith(dir)) continue;
		const isCss = file.endsWith(".css");
		if (!isCss && !/\.tsx?$/.test(file)) continue;
		readFileSync(file, "utf8")
			.split("\n")
			.forEach((line, i) => {
				if (line.includes("design-allow:")) return;
				const where = `${relative(root, file)}:${i + 1}`;
				if (isCss && /#[0-9a-fA-F]{3,8}\b|oklch\(|rgba?\(|hsla?\(/.test(line))
					problems.push(`${where}: raw colour in CSS, use var(--color-*) or var(--yl-*)`);
				if (!isCss)
					for (const [hex] of line.matchAll(/#[0-9a-fA-F]{6}\b/g))
						if (!palette.has(hex.toLowerCase()))
							problems.push(`${where}: ${hex} is not in the palette`);
			});
	}
	return problems;
}

async function defaultFetch(url) {
	const res = await fetch(url, { signal: AbortSignal.timeout(20000) });
	if (!res.ok) throw new Error(`${url} -> HTTP ${res.status}`);
	return Buffer.from(await res.arrayBuffer());
}

async function vendor(root, rev) {
	const dir = join(root, "apps/web/src/design");
	const record = JSON.parse(readFileSync(join(dir, "design-source.json"), "utf8"));
	for (const file of Object.keys(record.files)) {
		const body = await defaultFetch(
			`https://raw.githubusercontent.com/${record.repo}/${rev}/${record.path}/${file}`,
		);
		writeFileSync(join(dir, file), body);
		record.files[file] = sha(body);
	}
	record.rev = rev;
	writeFileSync(join(dir, "design-source.json"), `${JSON.stringify(record, null, "\t")}\n`);
	console.log(`design tokens: vendored ${rev}`);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
	const root = join(dirname(fileURLToPath(import.meta.url)), "..");
	if (process.argv[2] === "--vendor") {
		await vendor(root, process.argv[3]);
		process.exit(0);
	}
	const online = Boolean(process.env.CI || process.env.DESIGN_ONLINE);
	try {
		const problems = await check(root, { online });
		for (const p of problems) console.error(`design drift: ${p}`);
		if (problems.length) process.exit(1);
		console.log(`design tokens: clean (${online ? "offline + upstream" : "offline"})`);
	} catch (err) {
		console.error(`design tokens: could not check: ${err.message}`);
		process.exit(2);
	}
}
