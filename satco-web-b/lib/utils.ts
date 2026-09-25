export function cn(
  ...classes: Array<string | false | null | undefined>
): string {
  return classes.filter(Boolean).join(" ");
}

/**
 * Trailing-slash-insensitive path match — trailingSlash: true means
 * usePathname() returns "/careers/" while content hrefs are "/careers".
 */
export function isActivePath(pathname: string, href?: string): boolean {
  if (!href) return false;
  const norm = (p: string) => p.replace(/\/+$/, "") || "/";
  return norm(pathname) === norm(href);
}
