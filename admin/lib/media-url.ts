/** Resolve a CMS media path to a full URL on the public website */
export function resolveMediaUrl(value: string | null | undefined, siteUrl: string): string {
  if (!value || value.trim() === '') return ''
  const v = value.trim()
  if (v.startsWith('http://') || v.startsWith('https://')) return v
  const base = siteUrl.replace(/\/$/, '')
  const path = v.startsWith('/') ? v : `/${v}`
  // Encode spaces and special chars in filename segments
  const encoded = path.split('/').map((seg, i) => (i === 0 ? seg : encodeURIComponent(decodeURIComponent(seg)))).join('/')
  return `${base}${encoded}`
}
