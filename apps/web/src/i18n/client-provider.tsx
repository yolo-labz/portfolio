"use client";

import { type AbstractIntlMessages, NextIntlClientProvider } from "next-intl";
import type { ReactNode } from "react";
import type { AppLocale } from "@/i18n/routing";

/**
 * Client-side provider for the trimmed catalogue (see `client-messages.ts`).
 *
 * It exists so the missing-message policy can be a function: `onError` and
 * `getMessageFallback` cannot be passed from a Server Component to a client
 * boundary. A key that is missing on the client renders a visible marker and
 * logs, never a silent blank.
 */
export function ClientIntlProvider({
	locale,
	messages,
	children,
}: {
	locale: AppLocale;
	messages: AbstractIntlMessages;
	children: ReactNode;
}) {
	return (
		<NextIntlClientProvider
			locale={locale}
			messages={messages}
			onError={(error) => {
				// Visible in the browser console and in any client-side error reporter.
				console.error("[next-intl] missing client message:", error.message);
			}}
			getMessageFallback={({ namespace, key }) => `[missing: ${namespace}.${key}]`}
		>
			{children}
		</NextIntlClientProvider>
	);
}
