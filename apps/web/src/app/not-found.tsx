import { Button } from "@portfolio/ui";
import Link from "next/link";

export default function NotFound() {
	return (
		<div className="flex min-h-[70vh] flex-col items-center justify-center px-6 text-center">
			<p className="font-mono text-sm text-accent">404</p>
			<h1 className="mt-2 text-3xl font-bold tracking-tight">This page doesn&apos;t exist</h1>
			<p className="mt-3 text-text-muted">
				The URL you followed may be broken, or the page may have been removed.
			</p>
			<div className="mt-8 flex gap-4">
				<Button as={Link} href="/" variant="primary" size="md">
					Go Home
				</Button>
				<Button as={Link} href="/#projects" variant="secondary" size="md">
					View Projects
				</Button>
			</div>
		</div>
	);
}
