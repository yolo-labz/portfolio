#!/usr/bin/env node
// Smoke-test every stdio server in .pi/mcp.json: initialize → tools/list must return ≥1 tool.
// `--call <server> <tool> '<json-args>'` additionally runs one tool call (e.g. a real page load).
// Exit 0 = every server answered; 1 = a server failed or listed no tools.
import { spawn } from "node:child_process";
import { readFileSync } from "node:fs";

const { mcpServers } = JSON.parse(
	readFileSync(new URL("../.pi/mcp.json", import.meta.url), "utf8"),
);
const callIdx = process.argv.indexOf("--call");
const call = callIdx > 0 ? process.argv.slice(callIdx + 1, callIdx + 4) : null;
const TIMEOUT_MS = 100_000;

function rpc(name, cfg) {
	return new Promise((resolve, reject) => {
		const child = spawn(cfg.command, cfg.args ?? [], {
			env: { ...process.env, ...cfg.env },
			stdio: ["pipe", "pipe", "inherit"],
		});
		const pending = new Map();
		let buf = "";
		let id = 0;
		const timer = setTimeout(() => {
			child.kill();
			reject(new Error(`${name}: timed out after ${TIMEOUT_MS} ms`));
		}, TIMEOUT_MS);
		child.on("error", reject);
		child.stdout.on("data", (chunk) => {
			buf += chunk;
			for (let nl = buf.indexOf("\n"); nl >= 0; nl = buf.indexOf("\n")) {
				const line = buf.slice(0, nl).trim();
				buf = buf.slice(nl + 1);
				if (!line.startsWith("{")) continue;
				const msg = JSON.parse(line);
				pending.get(msg.id)?.(msg);
			}
		});
		const send = (method, params) =>
			new Promise((res) => {
				const i = ++id;
				pending.set(i, res);
				child.stdin.write(`${JSON.stringify({ jsonrpc: "2.0", id: i, method, params })}\n`);
			});
		(async () => {
			await send("initialize", {
				protocolVersion: "2025-06-18",
				capabilities: {},
				clientInfo: { name: "mcp-smoke", version: "1" },
			});
			child.stdin.write(
				`${JSON.stringify({ jsonrpc: "2.0", method: "notifications/initialized" })}\n`,
			);
			const list = await send("tools/list", {});
			const tools = list.result?.tools ?? [];
			let called;
			if (call && call[0] === name)
				called = await send("tools/call", {
					name: call[1],
					arguments: JSON.parse(call[2] ?? "{}"),
				});
			clearTimeout(timer);
			child.kill();
			resolve({ tools, called });
		})().catch(reject);
	});
}

let failed = false;
for (const [name, cfg] of Object.entries(mcpServers)) {
	try {
		const { tools, called } = await rpc(name, cfg);
		console.log(
			`${name}: ${tools.length} tools (${tools
				.slice(0, 6)
				.map((t) => t.name)
				.join(", ")}…)`,
		);
		if (tools.length === 0) failed = true;
		if (called) {
			const text = (called.result?.content ?? []).map((c) => c.text ?? `[${c.type}]`).join(" ");
			console.log(
				`${name} ${call[1]}: ${called.error ? `ERROR ${called.error.message}` : text.slice(0, 400)}`,
			);
			if (called.error || called.result?.isError) failed = true;
		}
	} catch (err) {
		console.error(`${name}: FAIL ${err.message}`);
		failed = true;
	}
}
process.exit(failed ? 1 : 0);
