import type { SiteContent } from '@/lib/content'
import { PHOTOS, PROMISE_VIDEO } from '@/lib/site-assets'
import { resolvePhoto } from '@/lib/resolve-photo'

const ESTATE_FALLBACKS = [
  PHOTOS.estate1, PHOTOS.estate2, PHOTOS.estate3, PHOTOS.estate4,
  PHOTOS.estate5, PHOTOS.estate6, PHOTOS.estate7,
] as const

const WINE_IMAGE_KEYS = ['wine_1_image', 'wine_2_image', 'wine_3_image'] as const
const WINE_FALLBACKS = [PHOTOS.wine1, PHOTOS.wine2, PHOTOS.wine3] as const

const SEASON_KEYS = ['seasons_image_spring', 'seasons_image_summer', 'seasons_image_late'] as const
const SEASON_FALLBACKS = [PHOTOS.seasonSpring, PHOTOS.seasonSummer, PHOTOS.seasonLate] as const

const VIDEO_EXT = /\.(mp4|webm|mov)(\?|$)/i

/** All image/video URLs used on the live homepage */
export function collectHomePreloadUrls(content: SiteContent): string[] {
  const urls = new Set<string>()

  const add = (url?: string | null) => {
    const v = url?.trim()
    if (v) urls.add(v)
  }

  add(content.hero_video_url || '/hero-video-web.mp4')
  add(content.hero_fallback_image_url || '/hero-image.jpg')
  add(PROMISE_VIDEO)
  add(resolvePhoto(content.land_background_image, '/estate far.jpg'))

  for (let i = 0; i < 7; i++) {
    const key = `estate_card_image_${i + 1}` as keyof SiteContent
    add(resolvePhoto(content[key] as string, ESTATE_FALLBACKS[i]))
  }

  for (let i = 0; i < 3; i++) {
    add(resolvePhoto(content[WINE_IMAGE_KEYS[i]] as string, WINE_FALLBACKS[i]))
  }
  add(PHOTOS.wineHero)

  for (let i = 0; i < 3; i++) {
    add(resolvePhoto(content[SEASON_KEYS[i]] as string, SEASON_FALLBACKS[i]))
  }

  return [...urls]
}

function isHeroVideo(url: string) {
  return VIDEO_EXT.test(url) && /hero/i.test(url)
}

function isPromiseVideo(url: string) {
  return VIDEO_EXT.test(url) && /promise|music/i.test(url)
}

function preloadImage(url: string): Promise<void> {
  return new Promise((resolve) => {
    const img = new Image()
    img.onload = () => resolve()
    img.onerror = () => resolve()
    img.src = url
  })
}

function preloadVideo(url: string, mode: 'full' | 'light', timeoutMs = 60000): Promise<void> {
  return new Promise((resolve) => {
    const video = document.createElement('video')
    const done = () => {
      video.removeAttribute('src')
      video.load()
      resolve()
    }
    const timer = setTimeout(done, timeoutMs)
    video.preload = mode === 'full' ? 'auto' : 'metadata'
    video.muted = true
    video.playsInline = true

    const onReady = () => {
      clearTimeout(timer)
      done()
    }

    if (mode === 'full') {
      video.oncanplaythrough = onReady
    } else {
      video.onloadeddata = onReady
    }

    video.onerror = onReady
    video.src = url
    video.load()
  })
}

async function preloadOne(url: string): Promise<void> {
  if (!VIDEO_EXT.test(url)) return preloadImage(url)
  if (isPromiseVideo(url)) return preloadVideo(url, 'light', 15000)
  return preloadVideo(url, 'full')
}

/** Preload homepage media; never rejects — loader should not hang on one failure */
export async function preloadSiteAssets(urls: string[]): Promise<void> {
  const hero = urls.find(isHeroVideo)
  const images = urls.filter((u) => !VIDEO_EXT.test(u))
  const promise = urls.find(isPromiseVideo)

  const CONCURRENCY = 4

  if (hero) await preloadOne(hero)

  for (let i = 0; i < images.length; i += CONCURRENCY) {
    await Promise.all(images.slice(i, i + CONCURRENCY).map(preloadOne))
  }

  if (promise) await preloadOne(promise)
}
