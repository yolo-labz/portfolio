// Invoked only by the future owner-run Playwright job, never by validator tests.
import { spawn } from "node:child_process";
import path from "node:path";
import { containedFile } from "./preflight.mjs";
import { verifyRunContext } from "./runtime-context.mjs";

const { manifest } = verifyRunContext();
const serverEntry = containedFile(manifest.build.root, manifest.build.serverEntry);
const child = spawn(process.execPath, [serverEntry], {
	cwd: path.dirname(serverEntry),
	stdio: "inherit",
	shell: false,
	env: {
		...process.env,
		NODE_ENV: "production",
		PORT: "3000",
		HOSTNAME: "127.0.0.1",
		NEXT_TELEMETRY_DISABLED: "1",
		NEXT_PUBLIC_SITE_URL: "http://localhost:3000",
	},
});
for (const signal of ["SIGINT", "SIGTERM"]) process.on(signal, () => child.kill(signal));
child.on("error", (error) => {
	console.error(error.message);
	process.exitCode = 1;
});
child.on("exit", (code, signal) => {
	process.exitCode = code ?? (signal ? 1 : 0);
});
