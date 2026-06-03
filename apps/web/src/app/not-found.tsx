// Global 404 — renders for requests that never resolve to a valid [locale]
// segment (e.g. /unknown.txt, or an invalid locale that fails hasLocale in the
// locale layout). It renders OUTSIDE app/[locale]/layout.tsx, so it must
// provide its own <html>/<body>. The localized 404 lives at
// app/[locale]/not-found.tsx. Inline styles keep it self-contained (no reliance
// on the CSS cascade for this rare fallback). Emerald accent per VISUAL-IDENTITY.
export default function GlobalNotFound() {
	return (
		<html lang="en">
			<body
				style={{
					margin: 0,
					background: "#1e1e2e",
					color: "#cdd6f4",
					fontFamily: "system-ui, -apple-system, sans-serif",
				}}
			>
				<div
					style={{
						minHeight: "100vh",
						display: "flex",
						flexDirection: "column",
						alignItems: "center",
						justifyContent: "center",
						gap: "0.75rem",
						padding: "1.5rem",
						textAlign: "center",
					}}
				>
					<p
						style={{
							fontFamily: "ui-monospace, monospace",
							color: "#00c77a",
							fontSize: "0.875rem",
						}}
					>
						404
					</p>
					<h1 style={{ fontSize: "1.875rem", fontWeight: 700, margin: 0 }}>
						This page doesn&rsquo;t exist
					</h1>
					<a href="/" style={{ color: "#00c77a", marginTop: "1rem", textDecoration: "none" }}>
						Go home &rarr;
					</a>
				</div>
			</body>
		</html>
	);
}
