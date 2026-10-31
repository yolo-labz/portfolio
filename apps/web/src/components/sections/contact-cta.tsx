import { useTranslations } from "next-intl";
import { ArrowUpRight } from "@/components/shared/icons";
import { CONTACT_EMAIL } from "@/lib/constants";

// Persuade close. The action is the address itself, set large and clickable, not a
// decorative button pointing at it.
export function ContactCTA() {
	const t = useTranslations("Contact");

	return (
		<section
			id="contact"
			aria-labelledby="contact-heading"
			className="scroll-mt-14 border-t border-border px-6 py-20 sm:py-28"
		>
			<div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-12 lg:gap-12">
				<div className="lg:col-span-7">
					<h2
						id="contact-heading"
						className="text-step-6 leading-[1.05] font-semibold tracking-[-0.03em] text-balance"
					>
						{t("ctaPrimary")}
					</h2>
					<p className="mt-6 max-w-[50ch] text-step-1 leading-relaxed text-text-muted">
						{t("body")}
					</p>
				</div>
				<div className="flex flex-col justify-end gap-6 lg:col-span-5">
					<a
						href={`mailto:${CONTACT_EMAIL}`}
						className="inline-flex min-h-11 items-center self-start border-b-2 border-accent pb-1 font-mono text-step-2 text-accent break-all transition-colors hover:text-accent-hover"
					>
						{CONTACT_EMAIL}
					</a>
					<ul className="flex flex-wrap gap-x-6 text-sm">
						<li>
							<a
								href="https://github.com/phsb5321"
								className="inline-flex min-h-11 items-center gap-2 text-text-muted underline decoration-border underline-offset-4 hover:text-text"
							>
								GitHub <ArrowUpRight />
							</a>
						</li>
						<li>
							<a
								href="https://linkedin.com/in/balbinopedro"
								className="inline-flex min-h-11 items-center gap-2 text-text-muted underline decoration-border underline-offset-4 hover:text-text"
							>
								LinkedIn <ArrowUpRight />
							</a>
						</li>
					</ul>
				</div>
			</div>
		</section>
	);
}
