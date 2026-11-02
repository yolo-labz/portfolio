import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

// The share surface is one artefact: `apps/web/src/app/opengraph-image.png` is a
// byte-for-byte copy of `.github/og-card.png`, the image the share-card policy
// (yolo-labz/.github `profile/assets/brand/share-cards.json`) declares for this repo.
// Serving that same file is what stops the site card and the GitHub preview drifting:
// the bytes on the wire equal the bytes the gate checks.
export const SHARE_IMAGE = {
	url: "/opengraph-image",
	width: 1200,
	height: 630,
	alt: "The yolo-labz gremlin typing at a keyboard on the Catppuccin Mocha ground, beside the yolo-labz wordmark and the line “Small tools. Deliberate automation.”",
} as const;

export const LOCALE_ALTERNATES = { en: "/en", pt: "/pt", es: "/es" } as const;

interface PageMeta {
	locale: string;
	path: string;
	title: string;
	description: string;
	image?: { url: string; width: number; height: number; alt: string };
}

// Children override a parent's `openGraph` wholesale in Next's metadata merge, which is
// why every page family calls this instead of relying on the layout.
export function pageMeta({
	locale,
	path,
	title,
	description,
	image = SHARE_IMAGE,
}: PageMeta): Metadata {
	const url = `/${locale}${path}`;
	return {
		title,
		description,
		alternates: { canonical: url, languages: LOCALE_ALTERNATES },
		openGraph: { title, description, type: "website", url, images: [image] },
		twitter: {
			card: "summary_large_image",
			title,
			description,
			images: [{ url: image.url, width: image.width, height: image.height, alt: image.alt }],
		},
	};
}

// About and thesis are the same page shape: a translated title/description on the
// family card. One helper instead of two near-identical generateMetadata bodies.
export async function localizedPageMeta({
	locale,
	path,
	namespace,
}: {
	locale: string;
	path: string;
	namespace: "About" | "Thesis";
}): Promise<Metadata> {
	const t = await getTranslations(namespace);
	return pageMeta({ locale, path, title: t("metaTitle"), description: t("metaDescription") });
}

// The whole generateMetadata prologue for a translated page family: unwrap params,
// pin the request locale, then translate. Keeping it here is what stops about/thesis
// from being the same twenty lines twice.
export async function metadataForParams(
	params: Promise<{ locale: string }>,
	path: string,
	namespace: "About" | "Thesis",
): Promise<Metadata> {
	const { locale } = await params;
	setRequestLocale(locale);
	const t = await getTranslations(namespace);
	return pageMeta({ locale, path, title: t("metaTitle"), description: t("metaDescription") });
}
