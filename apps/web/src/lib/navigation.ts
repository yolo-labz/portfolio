export interface NavItem {
	href: string;
	label: string;
	external?: boolean;
}

export const navItems: readonly NavItem[] = [
	{ href: "#projects", label: "Projects" },
	{ href: "#services", label: "Services" },
	{ href: "/thesis", label: "Thesis" },
	{ href: "/about", label: "About" },
	{ href: "https://blog.home301server.com.br", label: "Blog", external: true },
	{ href: "#contact", label: "Contact" },
] as const;
