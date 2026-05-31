import { NextResponse } from "next/server";

// Force per-request execution so process.env.GIT_REV is read at runtime, not
// inlined at build time. Dokku injects GIT_REV (the deployed commit SHA) into
// the container env; exposing it here lets the deploy workflow assert the live
// container is actually serving the just-pushed commit, which kills no-op
// deploys that would otherwise pass a bare /api/health 200 check.
export const dynamic = "force-dynamic";

export function GET() {
	return NextResponse.json(
		{ status: "healthy", rev: process.env.GIT_REV ?? null },
		{ status: 200 },
	);
}
