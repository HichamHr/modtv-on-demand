const FALLBACK_SITE_URL = "http://localhost:3000";

function normalizeUrl(value: string) {
  return value.replace(/\/+$/, "");
}

export function getSiteUrl(): string {
  const envUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (!envUrl) {
    return FALLBACK_SITE_URL;
  }
  return normalizeUrl(envUrl);
}
