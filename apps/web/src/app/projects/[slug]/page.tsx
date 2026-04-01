import { notFound } from "next/navigation";
import { projects } from "@/data/projects";
import { ProjectDetail } from "@/components/project/project-detail";
import type { Metadata } from "next";

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

	return <ProjectDetail project={project} />;
}
