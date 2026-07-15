import ContentManager from './ContentManager'
import { createServiceClient } from '@/lib/supabase/server'
import { getMainSiteUrl } from '@/lib/site-url'
import {
  mergeContentBlocks,
  groupBlocks,
  SECTION_LABELS,
  CONTENT_SCHEMA,
  type ContentBlock,
} from '@/lib/content-schema'

export const revalidate = 30

async function getContent(): Promise<{ blocks: ContentBlock[]; error: string | null; dbConnected: boolean }> {
  try {
    const supabase = createServiceClient()
    const { data, error } = await supabase
      .from('site_content')
      .select('key, value, type, label, section')
      .order('section')

    if (error) {
      return { blocks: mergeContentBlocks([]), error: error.message, dbConnected: false }
    }

    return {
      blocks: mergeContentBlocks(data ?? []),
      error: null,
      dbConnected: true,
    }
  } catch (e) {
    return {
      blocks: mergeContentBlocks([]),
      error: e instanceof Error ? e.message : 'Unknown error',
      dbConnected: false,
    }
  }
}

export default async function ContentPage() {
  const { blocks, error, dbConnected } = await getContent()
  const grouped = groupBlocks(blocks)
  const siteUrl = getMainSiteUrl()

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-4xl w-full mx-auto">
      {/* Header */}
      <div className="mb-6 sm:mb-8 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold tracking-tight" style={{ color: 'var(--text-1)' }}>
            Website Content
          </h1>
          <p style={{ fontSize: 13, color: 'var(--text-3)', marginTop: 4 }}>
            Edit every image, video, and text on{' '}
            <a href={siteUrl} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent)' }}>
              {siteUrl.replace(/^https?:\/\//, '')}
            </a>
            {' '}— changes go live within a minute.
          </p>
        </div>
        <a
          href={siteUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-ghost btn-sm shrink-0 self-start"
          style={{ fontSize: 12 }}
        >
          Preview site ↗
        </a>
      </div>

      {/* Status banners */}
      {error && (
        <div className="p-4 sm:p-5 rounded-2xl mb-6"
             style={{ background: 'var(--warning-bg)', border: '1px solid var(--warning-border)' }}>
          <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--warning-text)', marginBottom: 4 }}>
            Database offline — showing defaults
          </p>
          <p style={{ fontSize: 12, color: 'var(--warning-text)', opacity: 0.75 }}>
            You can still browse all {CONTENT_SCHEMA.length} content fields below. Saves will work once Supabase is restored.
          </p>
          <p style={{ fontSize: 11, color: 'var(--warning-text)', opacity: 0.6, marginTop: 6, fontFamily: 'monospace', wordBreak: 'break-all' }}>
            {error}
          </p>
        </div>
      )}

      {dbConnected && (
        <div className="p-3 rounded-xl mb-6 flex items-center gap-2"
             style={{ background: 'var(--success-bg)', border: '1px solid var(--success-border)' }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--success-text)', flexShrink: 0 }} />
          <p style={{ fontSize: 12, color: 'var(--success-text)' }}>
            Connected — {blocks.length} editable fields loaded
          </p>
        </div>
      )}

      <ContentManager grouped={grouped} sectionLabels={SECTION_LABELS} siteUrl={siteUrl} />
    </div>
  )
}
