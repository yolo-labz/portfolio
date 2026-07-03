import * as Sentry from "@sentry/nextjs";

// No-op without SENTRY_DSN (local/dev). DSN comes from the dokku config.
Sentry.init({
	dsn: process.env.SENTRY_DSN,
	environment: process.env.NODE_ENV,
	tracesSampleRate: 0,
});
