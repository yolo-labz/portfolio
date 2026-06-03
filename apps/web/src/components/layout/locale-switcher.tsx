"use client";

import { useLocale, useTranslations } from "next-intl";
import type { ChangeEvent } from "react";
import { usePathname, useRouter } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";

// Swaps the active locale while staying on the current page. `usePathname` from
// the i18n navigation returns the path WITHOUT the locale prefix, so
// router.replace(pathname, { locale }) re-renders the same route in the chosen
// language.
export function LocaleSwitcher() {
	const t = useTranslations("LocaleSwitcher");
	const locale = useLocale();
	const router = useRouter();
	const pathname = usePathname();

	function onSelect(event: ChangeEvent<HTMLSelectElement>) {
		router.replace(pathname, { locale: event.target.value });
	}

	return (
		<select
			value={locale}
			onChange={onSelect}
			aria-label={t("label")}
			className="cursor-pointer rounded-md border border-border bg-transparent py-1 pr-1 pl-2 font-mono text-xs text-text-muted transition-colors hover:text-text focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
		>
			{routing.locales.map((loc) => (
				<option key={loc} value={loc} className="bg-bg-elevated text-text">
					{t(loc)}
				</option>
			))}
		</select>
	);
}
