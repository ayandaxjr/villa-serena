/** Prefer CMS value when it is a Supabase URL or /photos/ path; ignore legacy root-level paths. */
export function resolvePhoto(cmsValue: string | undefined | null, fallback: string): string {
  const value = cmsValue?.trim()
  if (!value) return fallback
  if (value.startsWith('http://') || value.startsWith('https://')) return value
  if (value.startsWith('/photos/')) return value
  return fallback
}
