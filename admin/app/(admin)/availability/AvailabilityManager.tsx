'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import type { BlockedDate } from '@/lib/supabase/types'
import Link from 'next/link'

interface ApprovedBooking {
  id: string
  check_in: string
  check_out: string
  guest_name: string
  nights: number
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
}

export default function AvailabilityManager({
  blockedDates,
  approvedBookings,
}: {
  blockedDates: BlockedDate[]
  approvedBookings: ApprovedBooking[]
}) {
  const router = useRouter()
  const [showForm, setShowForm] = useState(false)
  const [form, setForm]         = useState({ start_date: '', end_date: '', label: 'Blocked' })
  const [saving, setSaving]     = useState(false)
  const [error, setError]       = useState<string | null>(null)
  const [deleting, setDeleting] = useState<string | null>(null)

  async function addBlock() {
    if (!form.start_date || !form.end_date) {
      setError('Please select both start and end dates.')
      return
    }
    if (form.end_date <= form.start_date) {
      setError('End date must be after start date.')
      return
    }
    setSaving(true)
    setError(null)
    const res = await fetch('/api/blocked-dates', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
    const data = await res.json()
    setSaving(false)
    if (!res.ok) { setError(data.error ?? 'Failed to add block. Please try again.'); return }
    setForm({ start_date: '', end_date: '', label: 'Blocked' })
    setShowForm(false)
    router.refresh()
  }

  async function removeBlock(id: string) {
    setDeleting(id)
    await fetch(`/api/blocked-dates?id=${id}`, { method: 'DELETE' })
    setDeleting(null)
    router.refresh()
  }

  return (
    <div className="space-y-5">
      {/* Confirmed bookings */}
      <div className="card p-6">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-white/30 mb-5">
          Confirmed bookings ({approvedBookings.length})
        </p>
        {!approvedBookings.length ? (
          <p className="text-sm text-white/25 text-center py-4">No confirmed bookings</p>
        ) : (
          <div className="space-y-2">
            {approvedBookings.map(b => (
              <div key={b.id} className="flex items-center justify-between p-3 rounded-xl bg-emerald-500/[0.07] border border-emerald-500/20">
                <div>
                  <p className="text-sm font-medium text-emerald-400">{b.guest_name}</p>
                  <p className="text-xs text-emerald-400/60 mt-0.5">
                    {formatDate(b.check_in)} → {formatDate(b.check_out)} · {b.nights} nights
                  </p>
                </div>
                <Link href={`/bookings/${b.id}`} className="text-xs text-emerald-400/70 hover:text-emerald-400 transition-colors">
                  View →
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Blocked periods */}
      <div className="card p-6">
        <div className="flex items-center justify-between mb-5">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-white/30">
            Blocked periods ({blockedDates.length})
          </p>
          <button
            onClick={() => { setShowForm(!showForm); setError(null) }}
            className="btn-gold btn-sm"
          >
            {showForm ? 'Cancel' : '+ Add block'}
          </button>
        </div>

        {showForm && (
          <div className="p-4 mb-5 bg-white/[0.03] rounded-xl border border-white/[0.07] space-y-3 animate-slide-up">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="label">Start date</label>
                <input type="date" className="input" value={form.start_date} onChange={e => setForm(f => ({ ...f, start_date: e.target.value }))} />
              </div>
              <div>
                <label className="label">End date</label>
                <input type="date" className="input" value={form.end_date} onChange={e => setForm(f => ({ ...f, end_date: e.target.value }))} />
              </div>
            </div>
            <div>
              <label className="label">Label</label>
              <input type="text" className="input" placeholder="Owner stay, Maintenance..." value={form.label} onChange={e => setForm(f => ({ ...f, label: e.target.value }))} />
            </div>
            {error && <p className="text-xs text-red-400">{error}</p>}
            <button onClick={addBlock} disabled={saving} className="btn-gold btn-sm">
              {saving ? 'Adding…' : 'Add block'}
            </button>
          </div>
        )}

        {!blockedDates.length ? (
          <p className="text-sm text-white/25 text-center py-4">No blocked periods</p>
        ) : (
          <div className="space-y-2">
            {(blockedDates as BlockedDate[]).map(b => (
              <div key={b.id} className="flex items-center justify-between p-3 rounded-xl bg-red-500/[0.07] border border-red-500/20">
                <div>
                  <p className="text-sm font-medium text-red-400">{b.label}</p>
                  <p className="text-xs text-red-400/60 mt-0.5">
                    {formatDate(b.start_date)} → {formatDate(b.end_date)}
                  </p>
                </div>
                <button
                  onClick={() => removeBlock(b.id)}
                  disabled={deleting === b.id}
                  className="text-xs text-red-400/60 hover:text-red-400 transition-colors font-medium"
                >
                  {deleting === b.id ? 'Removing…' : 'Remove'}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
