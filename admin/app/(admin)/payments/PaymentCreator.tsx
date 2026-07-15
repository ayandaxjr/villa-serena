'use client'

import { useState } from 'react'

interface Props { prefillEmail?: string; prefillNights?: string; prefillName?: string }
interface GeneratedLink { url: string; amount: number; currency: string; description: string; guestEmail: string }

export default function PaymentCreator({ prefillEmail, prefillNights, prefillName }: Props) {
  const [form, setForm] = useState({
    guestName:   prefillName   ?? '',
    guestEmail:  prefillEmail  ?? '',
    amount:      prefillNights ? String(Number(prefillNights) * 250) : '',
    currency:    'EUR',
    description: prefillName && prefillNights ? `Villa Serena — ${prefillNights}-night stay` : 'Villa Serena — Booking',
    sendEmail:   true,
  })
  const [loading, setLoading] = useState(false)
  const [result, setResult]   = useState<GeneratedLink | null>(null)
  const [error, setError]     = useState<string | null>(null)
  const [copied, setCopied]   = useState(false)

  function set(key: string, value: string | boolean) { setForm(f => ({ ...f, [key]: value })) }

  async function generate() {
    if (!form.guestEmail || !form.amount || !form.description) { setError('Please fill in email, amount and description.'); return }
    const amt = parseFloat(form.amount)
    if (isNaN(amt) || amt <= 0) { setError('Please enter a valid amount.'); return }
    setLoading(true); setError(null); setResult(null)
    try {
      const res = await fetch('/api/payments/create-link', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ guestName: form.guestName, guestEmail: form.guestEmail, amount: Math.round(amt * 100), currency: form.currency.toLowerCase(), description: form.description, sendEmail: form.sendEmail }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'Failed to create link')
      setResult({ url: data.url, amount: amt, currency: form.currency, description: form.description, guestEmail: form.guestEmail })
    } catch (e) { setError(e instanceof Error ? e.message : 'Something went wrong.') }
    finally { setLoading(false) }
  }

  async function copy() {
    if (!result) return
    await navigator.clipboard.writeText(result.url)
    setCopied(true); setTimeout(() => setCopied(false), 2000)
  }

  if (result) {
    return (
      <div className="space-y-4 animate-slide-up">
        <div className="p-6 rounded-2xl" style={{ background: 'var(--success-bg)', border: '1px solid var(--success-border)' }}>
          <div className="flex items-center gap-3 mb-5">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: 'rgba(16,185,129,0.15)' }}>
              <svg className="w-4 h-4" style={{ color: 'var(--success-text)' }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M20 6 9 17l-5-5"/></svg>
            </div>
            <div>
              <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--success-text)' }}>Payment link created</p>
              <p style={{ fontSize: 11, color: 'var(--text-3)' }}>{result.currency} {result.amount.toLocaleString()} · {result.description}</p>
            </div>
          </div>

          <div className="flex items-center gap-2 p-3 rounded-xl" style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)' }}>
            <svg style={{ width: 14, height: 14, color: 'var(--accent)', flexShrink: 0 }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
            <p style={{ fontSize: 11, fontFamily: 'monospace', color: 'var(--text-2)', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{result.url}</p>
            <button onClick={copy} className="btn btn-ghost btn-sm">
              {copied ? <span style={{ color: 'var(--success-text)', fontSize: 11 }}>Copied!</span> : <span style={{ fontSize: 11 }}>Copy</span>}
            </button>
          </div>

          <div className="flex gap-3 mt-4 flex-wrap">
            <a href={result.url} target="_blank" rel="noopener noreferrer" className="btn btn-ghost btn-sm">
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
              Preview link
            </a>
            <a href={`mailto:${result.guestEmail}?subject=Villa Serena — Payment Link&body=Dear ${form.guestName},%0A%0APlease use the following secure link to complete your payment:%0A%0A${result.url}%0A%0ABest regards,%0AVilla Serena`}
               className="btn btn-gold btn-sm">
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
              Email to guest
            </a>
            <a href={`https://wa.me/?text=${encodeURIComponent(`Hi ${form.guestName},\n\nHere is your secure payment link for Villa Serena:\n${result.url}\n\nPlease complete your payment to confirm your booking.\n\nKind regards,\nVilla Serena`)}`}
               target="_blank" rel="noopener noreferrer"
               className="btn btn-ghost btn-sm" style={{ color: '#25D366' }}>
              WhatsApp
            </a>
            <button onClick={() => setResult(null)} className="btn btn-ghost btn-sm" style={{ marginLeft: 'auto' }}>
              Create another
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="card p-7 space-y-5">
      <p className="label">New payment link</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="label">Guest name</label>
          <input type="text" className="input" placeholder="Jan van der Berg" value={form.guestName} onChange={e => set('guestName', e.target.value)} />
        </div>
        <div>
          <label className="label">Guest email <span style={{ color: 'var(--accent)' }}>*</span></label>
          <input type="email" className="input" placeholder="guest@example.com" value={form.guestEmail} onChange={e => set('guestEmail', e.target.value)} required />
        </div>
      </div>

      <div>
        <label className="label">Description <span style={{ color: 'var(--accent)' }}>*</span></label>
        <input type="text" className="input" placeholder="Villa Serena — 7-night stay, July 2026" value={form.description} onChange={e => set('description', e.target.value)} />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="label">Amount <span style={{ color: 'var(--accent)' }}>*</span></label>
          <div className="relative">
            <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', fontSize: 14, color: 'var(--text-3)' }}>
              {form.currency === 'EUR' ? '€' : form.currency === 'GBP' ? '£' : '$'}
            </span>
            <input type="number" className="input" style={{ paddingLeft: 30 }} placeholder="2500.00" value={form.amount} onChange={e => set('amount', e.target.value)} min="1" step="0.01" />
          </div>
        </div>
        <div>
          <label className="label">Currency</label>
          <select className="input" value={form.currency} onChange={e => set('currency', e.target.value)}>
            <option value="EUR">EUR — Euro</option>
            <option value="GBP">GBP — British Pound</option>
            <option value="USD">USD — US Dollar</option>
          </select>
        </div>
      </div>

      {error && (
        <div className="px-4 py-3 rounded-xl flex items-center gap-2" style={{ background: 'var(--error-bg)', border: '1px solid var(--error-border)', color: 'var(--error-text)', fontSize: 13 }}>
          <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><circle cx="12" cy="12" r="9"/><path d="M12 8v4M12 16h.01"/></svg>
          {error}
        </div>
      )}

      <div className="pt-2 flex items-center justify-between flex-wrap gap-4">
        <p style={{ fontSize: 11, color: 'var(--text-4)' }}>
          A secure Stripe checkout link will be generated instantly.
        </p>
        <button onClick={generate} disabled={loading} className="btn btn-gold">
          {loading ? (
            <span className="flex items-center gap-2">
              <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
              Generating…
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
              Generate payment link
            </span>
          )}
        </button>
      </div>
    </div>
  )
}
