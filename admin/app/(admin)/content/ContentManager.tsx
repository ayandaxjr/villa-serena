'use client'

import { useState, useRef } from 'react'
import { SECTION_ORDER } from '@/lib/content-schema'
import { resolveMediaUrl } from '@/lib/media-url'

type Block = { key: string; value: string | null; type: string; label: string; section: string }

type Props = {
  grouped: Record<string, Block[]>
  sectionLabels: Record<string, string>
  siteUrl: string
}

export default function ContentManager({ grouped, sectionLabels, siteUrl }: Props) {
  const sections = SECTION_ORDER.filter(s => grouped[s]?.length)
  const [active, setActive] = useState<string | null>(null)

  const activeBlocks = active ? grouped[active] ?? [] : []
  const activeLabel = active ? (sectionLabels[active] ?? active) : ''

  /* ── Section picker (home view) ── */
  if (!active) {
    return (
      <div>
        <p style={{ fontSize: 13, color: 'var(--text-3)', marginBottom: 16 }}>
          Choose a section to edit. Changes appear on the live website within a minute.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {sections.map(section => {
            const blocks = grouped[section]
            const mediaCount = blocks.filter(b => b.type === 'image' || b.type === 'video').length
            const textCount = blocks.length - mediaCount
            return (
              <button
                key={section}
                onClick={() => setActive(section)}
                className="card p-4 text-left transition-all hover:scale-[1.01] active:scale-[0.99]"
                style={{ border: '1px solid var(--border)' }}
              >
                <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-1)', marginBottom: 6 }}>
                  {sectionLabels[section] ?? section}
                </p>
                <p style={{ fontSize: 12, color: 'var(--text-3)' }}>
                  {mediaCount > 0 && `${mediaCount} photo${mediaCount !== 1 ? 's' : ''}/video${mediaCount !== 1 ? 's' : ''}`}
                  {mediaCount > 0 && textCount > 0 && ' · '}
                  {textCount > 0 && `${textCount} text field${textCount !== 1 ? 's' : ''}`}
                </p>
                <span style={{ fontSize: 11, color: 'var(--accent)', marginTop: 10, display: 'inline-block' }}>
                  Edit →
                </span>
              </button>
            )
          })}
        </div>
      </div>
    )
  }

  /* ── Single section editor ── */
  return (
    <div>
      {/* Back + header */}
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => setActive(null)}
          className="btn btn-ghost btn-sm shrink-0"
          style={{ fontSize: 12, padding: '8px 12px' }}
        >
          ← Sections
        </button>
        <div className="flex-1 min-w-0">
          <h2 style={{ fontSize: 16, fontWeight: 600, color: 'var(--text-1)' }} className="truncate">
            {activeLabel}
          </h2>
          <p style={{ fontSize: 11, color: 'var(--text-3)' }}>{activeBlocks.length} editable fields</p>
        </div>
      </div>

      {/* Section tabs on desktop for quick switch without going back */}
      <div className="hidden sm:flex flex-wrap gap-1.5 mb-6 pb-4" style={{ borderBottom: '1px solid var(--border)' }}>
        {sections.map(section => (
          <button
            key={section}
            onClick={() => setActive(section)}
            className="px-3 py-1.5 rounded-lg transition-colors"
            style={{
              fontSize: 11,
              fontWeight: section === active ? 600 : 400,
              color: section === active ? 'var(--accent)' : 'var(--text-3)',
              background: section === active ? 'var(--accent-dim)' : 'transparent',
              border: section === active ? '1px solid rgba(184,151,90,0.25)' : '1px solid transparent',
            }}
          >
            {(sectionLabels[section] ?? section).replace(/^\d+\s—\s/, '')}
          </button>
        ))}
      </div>

      <ContentSection blocks={activeBlocks} siteUrl={siteUrl} />
    </div>
  )
}

function ContentSection({ blocks, siteUrl }: { blocks: Block[]; siteUrl: string }) {
  const media = blocks.filter(b => b.type === 'image' || b.type === 'video')
  const texts = blocks.filter(b => b.type !== 'image' && b.type !== 'video')

  return (
    <div className="space-y-6">
      {media.length > 0 && (
        <div>
          <p className="label mb-3">Photos & videos</p>
          <div className="grid grid-cols-1 gap-4">
            {media.map(block => <MediaBlock key={block.key} block={block} siteUrl={siteUrl} />)}
          </div>
        </div>
      )}

      {texts.length > 0 && (
        <div>
          {media.length > 0 && <p className="label mb-3">Text</p>}
          <div className="space-y-3">
            {texts.map(block => <TextField key={block.key} block={block} />)}
          </div>
        </div>
      )}
    </div>
  )
}

/* ─── Image / Video block ────────────────────────────────── */
function MediaBlock({ block, siteUrl }: { block: Block; siteUrl: string }) {
  const [liveValue, setLiveValue] = useState(block.value ?? '')
  const [url, setUrl] = useState(block.value ?? '')
  const [previewOverride, setPreviewOverride] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  const isVideo = block.type === 'video'
  const liveSrc = resolveMediaUrl(liveValue, siteUrl)
  const previewSrc = previewOverride ?? resolveMediaUrl(url, siteUrl)
  const hasPendingChange = url !== liveValue

  async function publish(newUrl: string) {
    setSaving(true); setError(null)
    try {
      const res = await fetch('/api/content', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key: block.key, value: newUrl }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setLiveValue(newUrl)
      setUrl(newUrl)
      setPreviewOverride(null)
      setSaved(true); setTimeout(() => setSaved(false), 3000)
    } catch (e) { setError(e instanceof Error ? e.message : 'Save failed') }
    finally { setSaving(false) }
  }

  async function uploadFile(file: File) {
    setUploading(true); setError(null)
    try {
      const fd = new FormData()
      fd.append('file', file)
      fd.append('key', block.key)
      const res = await fetch('/api/content/upload', { method: 'POST', body: fd })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setLiveValue(data.url)
      setUrl(data.url)
      setPreviewOverride(data.url)
      setSaved(true); setTimeout(() => setSaved(false), 3000)
    } catch (e) { setError(e instanceof Error ? e.message : 'Upload failed') }
    finally { setUploading(false) }
  }

  return (
    <div className="card p-4">
      <div className="flex items-start justify-between gap-2 mb-3">
        <p className="label" style={{ marginBottom: 0 }}>{block.label}</p>
        {saved && <span style={{ fontSize: 11, color: 'var(--success-text)', flexShrink: 0 }}>Live ✓</span>}
      </div>

      {/* Live vs new preview */}
      <div className={`grid gap-3 ${hasPendingChange && liveSrc ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-1'}`}>
        {/* Currently live on website */}
        {liveSrc && (
          <div>
            <p style={{ fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--success-text)', marginBottom: 6 }}>
              Live on website
            </p>
            <div
              className="rounded-xl overflow-hidden"
              style={{ aspectRatio: '16/9', background: 'var(--bg-elevated)', border: '1px solid var(--success-border)' }}
            >
              {isVideo ? (
                <video src={liveSrc} muted loop playsInline style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={liveSrc} alt={`Live: ${block.label}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              )}
            </div>
          </div>
        )}

        {/* New / pending preview — only when user has picked something different */}
        {(hasPendingChange || !liveSrc) && (
          <div>
            {hasPendingChange && liveSrc && (
              <p style={{ fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--accent)', marginBottom: 6 }}>
                New preview (unsaved)
              </p>
            )}
            {!liveSrc && (
              <p style={{ fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-3)', marginBottom: 6 }}>
                {previewSrc ? 'Preview' : 'No image yet'}
              </p>
            )}
            <div
              className="rounded-xl overflow-hidden cursor-pointer"
              style={{
                aspectRatio: '16/9',
                background: 'var(--bg-elevated)',
                border: `1px solid ${hasPendingChange ? 'rgba(184,151,90,0.4)' : 'var(--border)'}`,
              }}
              onClick={() => fileRef.current?.click()}
            >
              {previewSrc ? (
                isVideo ? (
                  <video src={previewSrc} muted loop playsInline style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={previewSrc} alt={block.label} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                )
              ) : (
                <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                  <svg style={{ width: 28, height: 28, color: 'var(--text-4)' }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
                    <path d="M12 16v-8m0 0-3 3m3-3 3 3M4 16.5V18a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <rect x="3" y="4" width="18" height="14" rx="2"/>
                  </svg>
                  <span style={{ fontSize: 12, color: 'var(--text-3)' }}>Tap to upload new {isVideo ? 'video' : 'photo'}</span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <input
        type="text"
        className="input mt-3 mb-2"
        style={{ fontSize: 11 }}
        placeholder="Or paste a direct URL"
        value={url}
        onChange={e => { setUrl(e.target.value); setPreviewOverride(e.target.value) }}
      />

      {error && <p style={{ fontSize: 11, color: 'var(--error-text)', marginBottom: 6 }}>{error}</p>}

      <div className="flex flex-col xs:flex-row gap-2">
        <button type="button" className="btn btn-ghost btn-sm flex-1" onClick={() => fileRef.current?.click()} disabled={uploading}>
          {uploading ? 'Uploading…' : `Replace ${isVideo ? 'video' : 'photo'}`}
        </button>
        {hasPendingChange && (
          <button type="button" className="btn btn-gold btn-sm flex-1" onClick={() => publish(url)} disabled={saving}>
            {saving ? 'Publishing…' : 'Publish to website'}
          </button>
        )}
      </div>

      <input
        ref={fileRef}
        type="file"
        accept={isVideo ? 'video/mp4,video/webm,video/quicktime' : 'image/*'}
        style={{ display: 'none' }}
        onChange={e => { const f = e.target.files?.[0]; if (f) uploadFile(f) }}
      />
    </div>
  )
}

/* ─── Text / Textarea block ──────────────────────────────── */
function TextField({ block }: { block: Block }) {
  const [liveValue, setLiveValue] = useState(block.value ?? '')
  const [value, setValue] = useState(block.value ?? '')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function save() {
    setSaving(true); setError(null)
    try {
      const res = await fetch('/api/content', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key: block.key, value }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setLiveValue(value)
      setSaved(true); setTimeout(() => setSaved(false), 3000)
    } catch (e) { setError(e instanceof Error ? e.message : 'Save failed') }
    finally { setSaving(false) }
  }

  const changed = value !== liveValue

  return (
    <div className="card p-4">
      <div className="flex items-center justify-between mb-2 gap-2">
        <label className="label" style={{ marginBottom: 0 }}>{block.label}</label>
        {saved && <span style={{ fontSize: 11, color: 'var(--success-text)', flexShrink: 0 }}>Live ✓</span>}
      </div>

      {liveValue && changed && (
        <p style={{ fontSize: 11, color: 'var(--text-3)', marginBottom: 8, padding: '8px 10px', borderRadius: 8, background: 'var(--bg-elevated)' }}>
          <span style={{ color: 'var(--text-4)' }}>Currently live: </span>
          {liveValue.length > 120 ? `${liveValue.slice(0, 120)}…` : liveValue}
        </p>
      )}

      {block.type === 'textarea' ? (
        <textarea className="input w-full" rows={4} value={value} onChange={e => setValue(e.target.value)} style={{ marginBottom: 8 }} />
      ) : (
        <input type="text" className="input w-full" value={value} onChange={e => setValue(e.target.value)} style={{ marginBottom: 8 }} />
      )}

      {error && <p style={{ fontSize: 11, color: 'var(--error-text)', marginBottom: 6 }}>{error}</p>}

      {changed && (
        <div className="flex justify-end">
          <button type="button" className="btn btn-gold btn-sm w-full sm:w-auto" onClick={save} disabled={saving}>
            {saving ? 'Publishing…' : 'Publish to website'}
          </button>
        </div>
      )}
    </div>
  )
}
