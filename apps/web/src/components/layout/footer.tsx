import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { CONTACT_EMAIL } from "@/lib/constants";

export function Footer() {
	const t = useTranslations("Footer");
	const link =
		"inline-flex min-h-11 items-center text-text-muted underline decoration-border underline-offset-4 transition-colors hover:text-text";

	return (
		<footer className="border-t border-border px-6 py-8">
			<div className="mx-auto flex max-w-6xl flex-col gap-4 text-sm sm:flex-row sm:items-center sm:justify-between">
				<span className="font-mono text-text-muted">pedro.balbino</span>
				<ul className="flex flex-wrap gap-x-6">
					<li>
						<Link href="/about" className={link}>
							{t("claimMap")}
						</Link>
					</li>
					<li>
						<a href={`mailto:${CONTACT_EMAIL}`} className={link}>
							{CONTACT_EMAIL}
						</a>
					</li>
					<li>
						<a href="https://github.com/phsb5321" className={link}>
							GitHub
						</a>
					</li>
					<li>
						<a href="https://linkedin.com/in/balbinopedro" className={link}>
							LinkedIn
						</a>
					</li>
				</ul>
			</div>
		</footer>
	);
}
