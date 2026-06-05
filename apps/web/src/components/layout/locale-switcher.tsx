"use client";

import { useLocale, useTranslations } from "next-intl";
import { Fragment } from "react";
import { usePathname, useRouter } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";

// Inline locale toggle (EN · PT · ES) — matches the mono nav instead of a native
// <select>. `usePathname` from the i18n navigation returns the path WITHOUT the
// locale prefix, so router.replace(pathname, { locale }) re-renders the same
// route in the chosen language.
export function LocaleSwitcher() {
	const t = useTranslations("LocaleSwitcher");
	const active = useLocale();
	const router = useRouter();
	const pathname = usePathname();

	return (
		<nav aria-label={t("label")} className="flex items-center gap-1.5 font-mono text-xs">
			{routing.locales.map((loc, index) => (
				<Fragment key={loc}>
					{index > 0 && (
						<span aria-hidden="true" className="text-overlay">
							·
						</span>
					)}
					<button
						type="button"
						onClick={() => router.replace(pathname, { locale: loc })}
						aria-current={loc === active ? "true" : undefined}
						className={
							loc === active ? "text-accent" : "text-text-muted transition-colors hover:text-text"
						}
					>
						{loc.toUpperCase()}
					</button>
				</Fragment>
			))}
		</nav>
	);
}
