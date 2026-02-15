const FALLBACK_SITE_URL = "https://example.com";

export function getSiteUrl(): string {
  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL;
  if (!fromEnv) {
    return FALLBACK_SITE_URL;
  }

  try {
    const url = new URL(fromEnv);
    return url.toString().replace(/\/$/, "");
  } catch {
    return FALLBACK_SITE_URL;
  }
}

export function toAbsoluteUrl(pathname: string): string {
  const siteUrl = getSiteUrl();
  const normalizedPath = pathname.startsWith("/") ? pathname : `/${pathname}`;
  return `${siteUrl}${normalizedPath}`;
}
