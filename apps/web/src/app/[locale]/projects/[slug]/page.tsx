import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ProjectDetail } from "@/components/project/project-detail";
import { projects } from "@/data/projects";
import { SITE_URL } from "@/lib/constants";

interface Props {
	params: Promise<{ locale: string; slug: string }>;
}

export async function generateStaticParams() {
	return projects.map((project) => ({
		slug: project.slug,
	}));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
	const { locale, slug } = await params;
	const project = projects.find((p) => p.slug === slug);
	if (!project) return {};

	// Localized prose (tagline) lives in the "Projects" namespace, keyed by slug.
	const t = await getTranslations({ locale, namespace: "Projects" });

	return {
		title: `${project.title} — Pedro Balbino`,
		description: t(`${slug}.tagline`),
	};
}

export default async function ProjectPage({ params }: Props) {
	const { locale, slug } = await params;
	setRequestLocale(locale);
	const project = projects.find((p) => p.slug === slug);

	if (!project) notFound();

	const t = await getTranslations({ locale, namespace: "Projects" });

	const projectJsonLd = {
		"@context": "https://schema.org",
		"@type": "CreativeWork",
		name: project.title,
		description: t(`${slug}.description`),
		url: `${SITE_URL}/projects/${project.slug}`,
		author: {
			"@type": "Person",
			name: "Pedro Henrique Souza Balbino",
		},
	};

	const jsonLdHtml = JSON.stringify(projectJsonLd).replace(/</g, "\\u003c");

	return (
		<>
			<script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdHtml }} />
			<ProjectDetail project={project} />
		</>
	);
}
