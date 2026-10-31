#!/usr/bin/env bash
# Reproducible Lighthouse evidence capture for the level-up slice.
#
# Runs inside the pinned Playwright Docker image (same base CI uses) so the
# Chrome binary matches CI. Builds the standalone bundle exactly as
# Dockerfile.dokku / playwright.config.ts / lighthouse.yml do, serves it on
# :3000, then runs @lhci/cli twice: desktop preset and Lighthouse's default
# (mobile) form factor. One JSON report per URL per form factor.
#
#   ./docs/evidence/level-up-2026-10/run.sh docs/evidence/level-up-2026-10/before
#
# The four URLs are the home page plus the top three secondary routes
# (/about, /thesis, and the flagship case study).
set -euo pipefail

OUT="${1:?usage: run.sh <output-dir>}"
# Lighthouse variance on mobile (4x CPU throttle) is large; median of 3 runs.
RUNS="${RUNS:-3}"
IMAGE="mcr.microsoft.com/playwright:v1.62.1-noble"
URLS="http://localhost:3000/en http://localhost:3000/en/about http://localhost:3000/en/thesis http://localhost:3000/en/projects/compliance-tax-agent"

mkdir -p "$OUT"

docker run --rm --ipc=host --network=host \
	-v "$PWD:/work" -w /work \
	--user "$(id -u):$(id -g)" \
	-e HOME=/tmp \
	-e CI=true \
	-e NEXT_TELEMETRY_DISABLED=1 \
	-e NEXT_PUBLIC_SITE_URL=http://localhost:3000 \
	-e OUT="$OUT" \
	-e "URLS=$URLS" \
	-e "RUNS=$RUNS" \
	--entrypoint bash \
	"$IMAGE" -c '
	set -euo pipefail
	# corepack enable cannot write /usr/bin as the host user; `corepack pnpm`
	# resolves the packageManager pin (pnpm 10.28.2) without a global shim.
	corepack pnpm install --frozen-lockfile
	corepack pnpm --filter @portfolio/web build
	cp -R apps/web/public apps/web/.next/standalone/apps/web/public
	cp -R apps/web/.next/static apps/web/.next/standalone/apps/web/.next/static

	PORT=3000 HOSTNAME=127.0.0.1 node apps/web/.next/standalone/apps/web/server.js &
	server_pid=$!
	trap "kill $server_pid 2>/dev/null || true" EXIT
	for _ in $(seq 1 60); do
		curl -fsS http://127.0.0.1:3000/api/health >/dev/null 2>&1 && break
		sleep 2
	done
	curl -fsS http://127.0.0.1:3000/api/health >/dev/null

	# Chromium shipped in the Playwright image; chrome-launcher honours this.
	CHROME_PATH=$(ls -d /ms-playwright/chromium-*/chrome-linux64/chrome | head -1)
	export CHROME_PATH

	url_args=()
	for u in $URLS; do url_args+=("--collect.url=$u"); done

	for form in desktop mobile; do
		if [ "$form" = desktop ]; then
			preset=(--collect.settings.preset=desktop)
		else
			preset=()
		fi
		rm -rf .lighthouseci
		# --no-sandbox: container runs as the unprivileged host uid, so the
		# setuid sandbox is unavailable and chrome aborts with SIGABRT.
		npx -y @lhci/cli@0.15.1 collect \
			--collect.numberOfRuns="$RUNS" \
			--collect.settings.chromeFlags="--no-sandbox --disable-dev-shm-usage" \
			"${url_args[@]}" "${preset[@]}"
		mkdir -p "$OUT/$form"
		for f in .lighthouseci/lhr-*.json; do
			url=$(node -e "console.log(require(\"./$f\").requestedUrl)")
			name=$(echo "$url" | sed -E "s#^https?://[^/]+/##; s#/#-#g")
			cp "$f" "$OUT/$form/${name:-home}.json"
		done
	done
'
