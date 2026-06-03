export interface NavItem {
	href: string;
	// Translation key under the `Nav` namespace (see messages/*.json).
	key: string;
	external?: boolean;
}

export const navItems: readonly NavItem[] = [
	{ href: "#projects", key: "projects" },
	{ href: "#services", key: "services" },
	{ href: "/thesis", key: "thesis" },
	{ href: "/about", key: "about" },
	{ href: "https://blog.home301server.com.br", key: "blog", external: true },
	{ href: "#contact", key: "contact" },
] as const;
