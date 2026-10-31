"use client";

import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { CONTACT_EMAIL } from "@/lib/constants";
import { navItems } from "@/lib/navigation";
import { LocaleSwitcher } from "./locale-switcher";
import { MobileNav } from "./mobile-nav";

export function Header() {
	const t = useTranslations("Nav");
	const cta = useTranslations("Contact");
	const pathname = usePathname();
	const isHome = pathname === "/";
	const linkClass = "text-sm text-text-muted hover:text-text transition-colors";

	return (
		<header className="fixed top-0 z-50 w-full border-b border-border bg-bg">
			<nav
				className="mx-auto flex h-14 max-w-6xl items-center justify-between px-6"
				aria-label="Main navigation"
			>
				<Link
					href="/"
					className="font-mono text-sm font-medium text-text hover:text-accent transition-colors"
				>
					{t("home")}
				</Link>

				{/* Desktop: the emerald CTA replaces the #contact anchor. */}
				<ul className="hidden items-center gap-6 md:flex">
					{navItems
						.filter((item) => item.key !== "contact")
						.map((item) => {
							if (item.external) {
								return (
									<li key={item.key}>
										<a
											href={item.href}
											target="_blank"
											rel="noopener noreferrer"
											className={linkClass}
										>
											{t(item.key)}
										</a>
									</li>
								);
							}
							// In-page anchors stay on the current localized page; off-home they
							// route to the (default-locale) home with the hash.
							if (item.href.startsWith("#")) {
								return (
									<li key={item.key}>
										<a href={isHome ? item.href : `/${item.href}`} className={linkClass}>
											{t(item.key)}
										</a>
									</li>
								);
							}
							return (
								<li key={item.key}>
									<Link href={item.href} className={linkClass}>
										{t(item.key)}
									</Link>
								</li>
							);
						})}
					<li>
						<LocaleSwitcher />
					</li>
					<li>
						<a
							href={`mailto:${CONTACT_EMAIL}`}
							className="inline-flex min-h-9 items-center rounded-sm bg-accent px-3.5 text-sm font-medium text-bg transition-colors hover:bg-accent-hover"
						>
							{cta("ctaPrimary")}
						</a>
					</li>
				</ul>

				<MobileNav />
			</nav>
		</header>
	);
}
