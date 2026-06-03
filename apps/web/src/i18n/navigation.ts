import { createNavigation } from "next-intl/navigation";
import { routing } from "./routing";

// Locale-aware wrappers around Next's navigation APIs — these emit the correct
// locale prefix automatically, so use them instead of next/link + next/navigation
// for internal links.
export const { Link, redirect, usePathname, useRouter, getPathname } = createNavigation(routing);
