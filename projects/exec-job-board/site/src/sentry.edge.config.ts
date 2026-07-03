import * as Sentry from "@sentry/nextjs";

// Edge runtime (middleware, edge routes). No-op without SENTRY_DSN.
Sentry.init({
	dsn: process.env.SENTRY_DSN,
	environment: process.env.NODE_ENV,
	tracesSampleRate: 0,
});
