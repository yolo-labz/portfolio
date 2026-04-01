"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { navItems } from "@/lib/navigation";
import { cn } from "@/lib/utils";
import { MobileNav } from "./mobile-nav";

export function Header() {
	const pathname = usePathname();
	const isHome = pathname === "/";

	return (
		<header className="fixed top-0 z-50 w-full border-b border-border/50 bg-bg/80 backdrop-blur-md">
			<nav
				className="mx-auto flex h-14 max-w-6xl items-center justify-between px-6"
				aria-label="Main navigation"
			>
				<Link
					href="/"
					className="font-mono text-sm font-medium text-text hover:text-accent transition-colors"
				>
					pedro.balbino
				</Link>

				<ul className="hidden items-center gap-6 md:flex">
					{navItems.map(({ href, label }) => (
						<li key={href}>
							<Link
								href={isHome ? href : `/${href}`}
								className={cn("text-sm text-text-muted hover:text-text transition-colors")}
							>
								{label}
							</Link>
						</li>
					))}
					<li>
						<a
							href="/resume.pdf"
							className="text-sm text-accent hover:text-accent-hover transition-colors font-medium"
						>
							Resume
						</a>
					</li>
				</ul>

				<MobileNav />
			</nav>
		</header>
	);
}
