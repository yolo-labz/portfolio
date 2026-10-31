import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { ReactNode } from "react";

export async function generateMetadata({
	params,
}: {
	params: Promise<{ locale: string }>;
}): Promise<Metadata> {
	const { locale } = await params;
	setRequestLocale(locale);
	const t = await getTranslations("Thesis");

	return {
		title: t("metaTitle"),
		description: t("metaDescription"),
	};
}

export default async function ThesisPage({ params }: { params: Promise<{ locale: string }> }) {
	const { locale } = await params;
	setRequestLocale(locale);
	const t = await getTranslations("Thesis");
	const strong = (chunks: ReactNode) => <strong>{chunks}</strong>;

	return (
		<article className="mx-auto w-full max-w-3xl px-6 pt-24 pb-24 sm:pt-28">
			<h1 className="text-step-5 leading-[1.1] font-semibold tracking-[-0.025em] text-balance">
				{t("title")}
			</h1>
			<p className="mt-5 text-step-1 leading-relaxed text-text-muted">{t("subtitle")}</p>

			<div className="mt-12 space-y-6 text-base leading-relaxed text-text-muted [&_strong]:font-semibold [&_strong]:text-text">
				<p>{t.rich("p1", { strong })}</p>
				<p>{t.rich("p2", { strong })}</p>
				<p>{t.rich("p3", { strong })}</p>
				<p>{t.rich("p4", { strong })}</p>
				<p>{t.rich("p5", { strong })}</p>
				<p>{t.rich("p6", { strong })}</p>
			</div>

			<div className="mt-12 border-t border-border/60 pt-6">
				<a
					href="https://blog.home301server.com.br"
					target="_blank"
					rel="noopener noreferrer"
					className="font-mono text-sm text-accent hover:underline"
				>
					{t("writeupsLink")}
				</a>
			</div>
		</article>
	);
}
