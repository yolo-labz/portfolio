import type { AbstractIntlMessages } from "next-intl";

// The client catalogue: only these namespaces are shipped to the browser.
//
// Everything else is translated on the server (`getTranslations`), so serializing
// the full catalogue costs bytes for strings the client never reads: on 02/11 the
// `en` catalogue was 36 755 B compact JSON, and the four client components need
// 667 B of it (Nav 149 + Contact 267 + LocaleSwitcher 83 + ErrorPage 168).
//
// Keep this list honest: `scripts/check-client-namespaces.mjs` (part of
// `pnpm lint`) greps every `"use client"` module for `useTranslations("<ns>")`
// and fails when a namespace used on the client is missing here.
export const CLIENT_NAMESPACES = ["Nav", "Contact", "LocaleSwitcher", "ErrorPage"] as const;

export type ClientNamespace = (typeof CLIENT_NAMESPACES)[number];

/**
 * Narrows the full catalogue to the client subset.
 *
 * Throws when a listed namespace is absent: that means a renamed or deleted
 * message file, and every client render would fall back to the missing-key
 * marker on every page. Failing at build/render is better than shipping blank
 * navigation.
 */
export function pickClientMessages(messages: AbstractIntlMessages): AbstractIntlMessages {
	const picked: AbstractIntlMessages = {};
	for (const namespace of CLIENT_NAMESPACES) {
		const value = messages[namespace];
		if (value === undefined) {
			throw new Error(
				`Client message namespace "${namespace}" is missing from the catalogue (see src/i18n/client-messages.ts)`,
			);
		}
		picked[namespace] = value;
	}
	return picked;
}
