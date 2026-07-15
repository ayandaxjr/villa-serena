'use client'

import { createContext, useContext } from 'react'
import type { SiteContent } from '@/lib/content'
import { CONTENT_DEFAULTS } from '@/lib/content'

const ContentContext = createContext<SiteContent>(CONTENT_DEFAULTS)

export function ContentProvider({ content, children }: { content: SiteContent; children: React.ReactNode }) {
  return <ContentContext.Provider value={content}>{children}</ContentContext.Provider>
}

/** Use inside any section component to get CMS-controlled content. Falls back to defaults automatically. */
export function useSiteContent(): SiteContent {
  return useContext(ContentContext)
}
