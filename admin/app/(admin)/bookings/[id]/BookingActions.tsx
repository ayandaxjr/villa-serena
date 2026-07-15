'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import type { BookingWithGuest, BookingStatus } from '@/lib/supabase/types'
import StatusBadge from '@/components/StatusBadge'

const TERMINAL: BookingStatus[] = ['declined', 'cancelled', 'completed']

export default function BookingActions({ booking }: { booking: BookingWithGuest }) {
  const router = useRouter()
  const [notes, setNotes]   = useState(booking.internal_notes ?? '')
  const [acting, setActing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [toast, setToast]   = useState<{ type: 'ok' | 'err'; msg: string } | null>(null)

  const isTerminal = TERMINAL.includes(booking.status)

  function showToast(type: 'ok' | 'err', msg: string) {
    setToast({ type, msg })
    setTimeout(() => setToast(null), 4000)
  }

  async function doStatus(status: BookingStatus) {
    setActing(true)
    try {
      const res = await fetch(`/api/bookings/${booking.id}`, {
        method: 'PATCH', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      })
      if (!res.ok) throw new Error()
      showToast('ok', `Booking ${status}. Guest notified by email.`)
      router.refresh()
    } catch { showToast('err', 'Something went wrong. Please try again.') }
    finally { setActing(false) }
  }

  async function saveNotes() {
    setSaving(true)
    try {
      const res = await fetch(`/api/bookings/${booking.id}`, {
        method: 'PATCH', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ internal_notes: notes }),
      })
      if (!res.ok) throw new Error()
      showToast('ok', 'Notes saved.')
      router.refresh()
    } catch { showToast('err', 'Failed to save notes.') }
    finally { setSaving(false) }
  }

  return (
    <div className="space-y-4">
      {/* Pending actions */}
      {!isTerminal && booking.status === 'pending' && (
        <div className="card p-6">
          <p className="label mb-5">Actions</p>
          <div className="flex gap-3 flex-wrap">
            <button onClick={() => doStatus('approved')} disabled={acting} className="btn btn-success">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M20 6 9 17l-5-5"/></svg>
              Approve booking
            </button>
            <button onClick={() => doStatus('declined')} disabled={acting} className="btn btn-danger">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M18 6 6 18M6 6l12 12"/></svg>
              Decline
            </button>
          </div>
          <p style={{ fontSize: 11, color: 'var(--text-4)', marginTop: 14 }}>
            Approving sends a confirmation email to the guest with your contact details.
          </p>
        </div>
      )}

      {/* Approved actions */}
      {!isTerminal && booking.status === 'approved' && (
        <div className="card p-6">
          <p className="label mb-5">Actions</p>
          <div className="flex gap-3">
            <button onClick={() => doStatus('completed')} disabled={acting} className="btn btn-gold">
              Mark as completed
            </button>
            <button onClick={() => doStatus('cancelled')} disabled={acting} className="btn btn-ghost">
              Cancel booking
            </button>
          </div>
        </div>
      )}

      {/* Terminal state */}
      {isTerminal && (
        <div className="card p-5 flex items-center gap-3">
          <StatusBadge status={booking.status} />
          <p style={{ fontSize: 13, color: 'var(--text-3)' }}>This booking is finalised.</p>
        </div>
      )}

      {/* Internal notes */}
      <div className="card p-6">
        <p className="label mb-1">Internal notes</p>
        <p style={{ fontSize: 11, color: 'var(--text-4)', marginBottom: 14 }}>Private. Never shared with the guest.</p>
        <textarea
          className="input"
          style={{ resize: 'none', height: 112 }}
          placeholder="Payment arranged, special requests, arrival notes..."
          value={notes}
          onChange={e => setNotes(e.target.value)}
        />
        <button onClick={saveNotes} disabled={saving || notes === (booking.internal_notes ?? '')} className="btn btn-gold btn-sm mt-3">
          {saving ? 'Saving…' : 'Save notes'}
        </button>
      </div>

      {/* Toast */}
      {toast && (
        <div className="flex items-center gap-3 px-4 py-3.5 rounded-xl border text-sm animate-slide-up"
             style={toast.type === 'ok'
               ? { background: 'var(--success-bg)', borderColor: 'var(--success-border)', color: 'var(--success-text)' }
               : { background: 'var(--error-bg)',   borderColor: 'var(--error-border)',   color: 'var(--error-text)' }}>
          {toast.type === 'ok'
            ? <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M20 6 9 17l-5-5"/></svg>
            : <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M18 6 6 18M6 6l12 12"/></svg>
          }
          {toast.msg}
        </div>
      )}
    </div>
  )
}
