import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProjectDetail } from "@/components/project/project-detail";
import { projects } from "@/data/projects";
import { SITE_URL } from "@/lib/constants";

interface Props {
	params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
	return projects.map((project) => ({
		slug: project.slug,
	}));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
	const { slug } = await params;
	const project = projects.find((p) => p.slug === slug);
	if (!project) return {};

	return {
		title: `${project.title} — Pedro Balbino`,
		description: project.tagline,
	};
}

export default async function ProjectPage({ params }: Props) {
	const { slug } = await params;
	const project = projects.find((p) => p.slug === slug);

	if (!project) notFound();

	const projectJsonLd = {
		"@context": "https://schema.org",
		"@type": "CreativeWork",
		name: project.title,
		description: project.description,
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
