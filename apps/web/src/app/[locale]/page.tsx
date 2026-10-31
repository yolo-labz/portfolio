import { setRequestLocale } from "next-intl/server";
import { CaseFiles } from "@/components/home/case-files";
import { WorkIndex } from "@/components/home/work-index";
import { ContactCTA } from "@/components/sections/contact-cta";
import { OrganizationShowcase } from "@/components/sections/organization-showcase";
import { ServicesLadder } from "@/components/sections/services-ladder";

// Experience first (the index of work), Persuade after (case files, services, the
// close). The layout already provides <main>; this page is a fragment of sections.
export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
	const { locale } = await params;
	setRequestLocale(locale);

	return (
		<>
			<WorkIndex />
			<CaseFiles />
			<OrganizationShowcase />
			<ServicesLadder />
			<ContactCTA />
		</>
	);
}
