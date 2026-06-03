"use client";

import { Button } from "@portfolio/ui";
import { useEffect } from "react";

export default function ErrorPage({
	error,
	reset,
}: {
	error: Error & { digest?: string };
	reset: () => void;
}) {
	useEffect(() => {
		console.error(error);
	}, [error]);

	return (
		<div className="flex min-h-[70vh] flex-col items-center justify-center px-6 text-center">
			<p className="font-mono text-sm text-accent">Error</p>
			<h1 className="mt-2 text-3xl font-bold tracking-tight">Something went wrong</h1>
			<p className="mt-3 text-text-muted">
				An unexpected error occurred. You can try again or go back to the homepage.
			</p>
			<div className="mt-8 flex gap-4">
				<Button variant="primary" size="md" onClick={reset}>
					Try Again
				</Button>
				<Button as="a" href="/" variant="secondary" size="md">
					Go Home
				</Button>
			</div>
		</div>
	);
}
