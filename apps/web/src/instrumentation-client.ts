// Browser SDK, loaded only when a DSN is baked into the build. NEXT_PUBLIC_* is
// inlined at build time, so without a DSN this branch is dead code and the SDK
// (~120 KB gzip, the largest chunk on the critical path) never ships. With a DSN
// it loads off the critical path, after first paint.
const dsn = process.env.NEXT_PUBLIC_SENTRY_DSN;

if (dsn) {
	void import("@sentry/nextjs").then((Sentry) =>
		Sentry.init({ dsn, environment: process.env.NODE_ENV, tracesSampleRate: 0 }),
	);
}
