"use client";

import { AnimatePresence, motion } from "motion/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { navItems } from "@/lib/navigation";

export function MobileNav() {
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
				return;
			}

			if (e.key === "Tab" && drawerRef.current) {
				const focusable = drawerRef.current.querySelectorAll<HTMLElement>(
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
								{navItems.map(({ href, label }) => (
									<li key={href}>
										<Link
											href={isHome ? href : `/${href}`}
											onClick={() => setOpen(false)}
											className="block min-h-11 rounded-md px-4 py-3 text-lg text-text-muted transition-colors hover:bg-surface hover:text-text"
										>
											{label}
										</Link>
									</li>
								))}
								<li>
									<a
										href="/resume.pdf"
										onClick={() => setOpen(false)}
										className="block min-h-11 rounded-md px-4 py-3 text-lg font-medium text-accent transition-colors hover:bg-surface hover:text-accent-hover"
									>
										Resume
									</a>
								</li>
							</ul>
						</motion.nav>
					</>
				)}
			</AnimatePresence>
		</>
	);
}
