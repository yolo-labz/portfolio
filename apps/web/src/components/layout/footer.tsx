export function Footer() {
	return (
		<footer className="border-t border-border/50 py-8">
			<div className="mx-auto max-w-6xl px-6 flex items-center justify-between text-sm text-text-muted">
				<span className="font-mono">pedro.balbino</span>
				<div className="flex items-center gap-6">
					<a
						href="https://github.com/phsb5321"
						target="_blank"
						rel="noopener noreferrer"
						className="hover:text-text transition-colors"
					>
						GitHub
					</a>
					<a
						href="https://www.upwork.com/freelancers/~01dae7197e964ddf3f"
						target="_blank"
						rel="noopener noreferrer"
						className="hover:text-text transition-colors"
					>
						Upwork
					</a>
					<a
						href="https://linkedin.com/in/pedro-balbino"
						target="_blank"
						rel="noopener noreferrer"
						className="hover:text-text transition-colors"
					>
						LinkedIn
					</a>
				</div>
			</div>
		</footer>
	);
}
