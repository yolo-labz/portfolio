"use client";

import { useTranslations } from "next-intl";
import { useEffect } from "react";
import { Link } from "@/i18n/navigation";

export default function ErrorPage({
	error,
	reset,
}: {
	error: Error & { digest?: string };
	reset: () => void;
}) {
	const t = useTranslations("ErrorPage");

	useEffect(() => {
		console.error(error);
	}, [error]);

	return (
		<section className="px-6 pt-24 pb-20 sm:pt-28">
			<div className="mx-auto max-w-3xl">
				<p className="font-mono text-sm text-warn">{t("label")}</p>
				<h1 className="mt-3 text-step-5 leading-[1.1] font-semibold tracking-[-0.025em] text-balance">
					{t("title")}
				</h1>
				<p className="mt-5 max-w-[60ch] text-step-1 leading-relaxed text-text-muted">{t("body")}</p>
				<div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2">
					<button
						type="button"
						onClick={reset}
						className="inline-flex min-h-11 items-center rounded-sm bg-accent px-4 font-medium text-bg transition-colors hover:bg-accent-hover"
					>
						{t("retry")}
					</button>
					<Link
						href="/"
						className="inline-flex min-h-11 items-center text-text-muted underline decoration-border underline-offset-4 hover:text-text"
					>
						{t("home")}
					</Link>
				</div>
			</div>
		</section>
	);
}
