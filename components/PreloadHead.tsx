import type { SiteContent } from '@/lib/content'
import { collectHomePreloadUrls } from '@/lib/preload-assets'

const VIDEO_EXT = /\.(mp4|webm|mov)(\?|$)/i

/** Server-rendered hints so the browser starts fetching before React hydrates */
export default function PreloadHead({ content }: { content: SiteContent }) {
  const urls = collectHomePreloadUrls(content)

  return (
    <>
      {urls.map((url) =>
        VIDEO_EXT.test(url) ? (
          <link key={url} rel="preload" href={url} as="video" type="video/mp4" />
        ) : (
          <link key={url} rel="preload" href={url} as="image" />
        ),
      )}
    </>
  )
}
