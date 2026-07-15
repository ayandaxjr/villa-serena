/** Canonical public website URL — custom domain */
export const MAIN_SITE_DEFAULT = 'https://www.villaserena.nl'

/** Resolve the live public site URL (admin previews, links, image loading) */
export function getMainSiteUrl(): string {
  const url =
    process.env.MAIN_SITE_URL ??
    process.env.NEXT_PUBLIC_MAIN_SITE_URL ??
    MAIN_SITE_DEFAULT
  return url.replace(/\/$/, '')
}
