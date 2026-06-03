"use client";

import { AnimatePresence, motion } from "motion/react";
import { useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";
import { Link, usePathname } from "@/i18n/navigation";
import { navItems } from "@/lib/navigation";

// Tab focus-trap for the open drawer — cycles keyboard focus inside the dialog.
// Extracted from the keydown handler to keep that handler's complexity low.
function trapFocus(e: KeyboardEvent, container: HTMLElement) {
	const focusable = container.querySelectorAll<HTMLElement>(
		'a, button, [tabindex]:not([tabindex="-1"])',
	);
	const first = focusable[0];
	const last = focusable[focusable.length - 1];

	if (e.shiftKey && document.activeElement === first) {
		e.preventDefault();
		last?.focus();
	} else if (!e.shiftKey && document.activeElement === last) {
		e.preventDefault();
		first?.focus();
	}
}

export function MobileNav() {
	const t = useTranslations("Nav");
	const [open, setOpen] = useState(false);
	const pathname = usePathname();
	const isHome = pathname === "/";
	const drawerRef = useRef<HTMLElement>(null);
	const buttonRef = useRef<HTMLButtonElement>(null);

	useEffect(() => {
		if (open) {
			document.body.style.overflow = "hidden";
		} else {
			document.body.style.overflow = "";
		}
		return () => {
			document.body.style.overflow = "";
		};
	}, [open]);

	useEffect(() => {
		if (!open) return;

		function onKeyDown(e: KeyboardEvent) {
			if (e.key === "Escape") {
				setOpen(false);
				buttonRef.current?.focus();
			} else if (e.key === "Tab" && drawerRef.current) {
				trapFocus(e, drawerRef.current);
			}
		}

		document.addEventListener("keydown", onKeyDown);
		return () => document.removeEventListener("keydown", onKeyDown);
	}, [open]);

	useEffect(() => {
		if (open && drawerRef.current) {
			const firstLink = drawerRef.current.querySelector<HTMLElement>("a");
			firstLink?.focus();
		}
	}, [open]);

	return (
		<>
			<button
				type="button"
				ref={buttonRef}
				onClick={() => setOpen(!open)}
				className="relative z-50 flex h-11 w-11 items-center justify-center rounded-md md:hidden"
				aria-label={open ? "Close menu" : "Open menu"}
				aria-expanded={open}
			>
				<div className="flex w-5 flex-col gap-1">
					<span
						className={`block h-0.5 w-full bg-text transition-all duration-200 ${open ? "translate-y-1.5 rotate-45" : ""}`}
					/>
					<span
						className={`block h-0.5 w-full bg-text transition-all duration-200 ${open ? "opacity-0" : ""}`}
					/>
					<span
						className={`block h-0.5 w-full bg-text transition-all duration-200 ${open ? "-translate-y-1.5 -rotate-45" : ""}`}
					/>
				</div>
			</button>

			<AnimatePresence>
				{open && (
					<>
						<motion.div
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							exit={{ opacity: 0 }}
							transition={{ duration: 0.2 }}
							className="fixed inset-0 z-40 bg-bg/80 backdrop-blur-sm md:hidden"
							onClick={() => setOpen(false)}
							aria-hidden="true"
						/>
						<motion.nav
							ref={drawerRef}
							initial={{ x: "100%" }}
							animate={{ x: 0 }}
							exit={{ x: "100%" }}
							transition={{ type: "spring", damping: 25, stiffness: 200 }}
							className="fixed right-0 top-0 z-50 flex h-full w-72 flex-col bg-bg-elevated p-6 shadow-2xl md:hidden"
							role="dialog"
							aria-modal="true"
							aria-label="Navigation menu"
						>
							<ul className="mt-16 flex flex-col gap-1">
								{navItems.map((item) => {
									const linkClass =
										"block min-h-11 rounded-md px-4 py-3 text-lg text-text-muted transition-colors hover:bg-surface hover:text-text";
									if (item.external) {
										return (
											<li key={item.key}>
												<a
													href={item.href}
													target="_blank"
													rel="noopener noreferrer"
													onClick={() => setOpen(false)}
													className={linkClass}
												>
													{t(item.key)}
												</a>
											</li>
										);
									}
									if (item.href.startsWith("#")) {
										return (
											<li key={item.key}>
												<a
													href={isHome ? item.href : `/${item.href}`}
													onClick={() => setOpen(false)}
													className={linkClass}
												>
													{t(item.key)}
												</a>
											</li>
										);
									}
									return (
										<li key={item.key}>
											<Link href={item.href} onClick={() => setOpen(false)} className={linkClass}>
												{t(item.key)}
											</Link>
										</li>
									);
								})}
							</ul>
						</motion.nav>
					</>
				)}
			</AnimatePresence>
		</>
	);
}
