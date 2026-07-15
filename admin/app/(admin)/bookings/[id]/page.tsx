import { notFound } from 'next/navigation'
import Link from 'next/link'
import StatusBadge from '@/components/StatusBadge'
import BookingActions from './BookingActions'
import type { BookingWithGuest } from '@/lib/supabase/types'
import { createClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
}
function fmtShort(iso: string) {
  return new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
}

export default async function BookingDetailPage({ params }: { params: { id: string } }) {
  let b: BookingWithGuest | null = null
  let history: { id: string; check_in: string; check_out: string; nights: number; status: string }[] = []

  try {
    const supabase = createClient()

    const { data: booking } = await supabase
      .from('bookings_with_guests').select('*').eq('id', params.id).single()

    if (!booking) return notFound()
    b = booking as BookingWithGuest

    const { data: hist } = await supabase
      .from('bookings_with_guests')
      .select('id, check_in, check_out, nights, status')
      .eq('guest_id', b.guest_id).neq('id', b.id)
      .order('created_at', { ascending: false }).limit(4)
    history = hist ?? []
  } catch { return notFound() }

  if (!b) return notFound()

  return (
    <div className="p-8 max-w-[960px]">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 mb-7" style={{ fontSize: 13, color: 'var(--text-3)' }}>
        <Link href="/bookings" style={{ color: 'var(--text-3)' }} className="hover:text-gold transition-colors">Bookings</Link>
        <span>/</span>
        <span style={{ color: 'var(--text-2)' }}>{b.guest_name}</span>
      </div>

      {/* Page header */}
      <div className="flex items-start justify-between mb-8 gap-4 flex-wrap">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-2xl font-semibold tracking-tight" style={{ color: 'var(--text-1)' }}>{b.guest_name}</h1>
            <StatusBadge status={b.status} />
          </div>
          <p style={{ fontSize: 13, color: 'var(--text-3)' }}>
            {fmtDate(b.check_in)} → {fmtDate(b.check_out)} · {b.nights} nights · {b.guests_count} guests
          </p>
        </div>
        <Link
          href={`/payments?email=${encodeURIComponent(b.guest_email)}&nights=${b.nights}&name=${encodeURIComponent(b.guest_name)}`}
          className="btn btn-ghost btn-sm"
        >
          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}><rect x="2" y="5" width="20" height="14" rx="2"/><path d="M2 10h20"/></svg>
          Create payment link
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-5">
        {/* Left */}
        <div className="space-y-4">
          <div className="card p-6">
            <p className="label mb-5">Booking details</p>
            <div className="grid grid-cols-2 gap-y-5">
              <Field label="Check-in"  value={fmtDate(b.check_in)} />
              <Field label="Check-out" value={fmtDate(b.check_out)} />
              <Field label="Nights"    value={String(b.nights)} mono />
              <Field label="Guests"    value={String(b.guests_count)} mono />
              <Field label="Reference" value={b.id.slice(0, 8).toUpperCase()} mono />
              <Field label="Received"  value={fmtShort(b.created_at)} />
            </div>
          </div>

          {b.message && (
            <div className="card p-6">
              <p className="label mb-4">Message from guest</p>
              <p style={{ fontSize: 13, color: 'var(--text-2)', lineHeight: 1.7, whiteSpace: 'pre-wrap' }}>{b.message}</p>
            </div>
          )}

          <BookingActions booking={b} />
        </div>

        {/* Right */}
        <div className="space-y-4">
          <div className="card p-6">
            <p className="label mb-5">Guest</p>
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 text-xs font-bold"
                   style={{ background: 'var(--accent-dim)', border: '1px solid rgba(184,151,90,0.2)', color: 'var(--accent)' }}>
                {b.guest_name.split(' ').map((w: string) => w[0]).slice(0,2).join('').toUpperCase()}
              </div>
              <div>
                <p style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-1)' }}>{b.guest_name}</p>
                <a href={`mailto:${b.guest_email}`} style={{ fontSize: 11, color: 'var(--accent)' }}>{b.guest_email}</a>
              </div>
            </div>
            <div className="space-y-3 pt-4" style={{ borderTop: '1px solid var(--border)' }}>
              {b.guest_phone      && <Field label="Phone" value={b.guest_phone} />}
              {b.guest_nationality && <Field label="From" value={b.guest_nationality} />}
            </div>
            <Link href={`/guests/${b.guest_id}`}
                  className="mt-4 flex items-center gap-1 text-xs hover:underline"
                  style={{ color: 'var(--accent)', opacity: 0.75 }}>
              View full profile
              <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="m9 18 6-6-6-6"/></svg>
            </Link>
          </div>

          {history.length > 0 && (
            <div className="card p-6">
              <p className="label mb-4">Past bookings</p>
              <div className="space-y-2.5">
                {history.map(h => (
                  <Link key={h.id} href={`/bookings/${h.id}`}
                        className="flex items-center justify-between text-xs hover:opacity-80 transition-opacity">
                    <span style={{ color: 'var(--text-3)' }}>{fmtShort(h.check_in)} · {h.nights}n</span>
                    <StatusBadge status={h.status as 'pending' | 'approved' | 'declined' | 'cancelled' | 'completed'} />
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function Field({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div>
      <p className="label" style={{ marginBottom: 2 }}>{label}</p>
      <p style={{ fontSize: 13, color: 'var(--text-2)', fontFamily: mono ? 'monospace' : 'inherit' }}>{value}</p>
    </div>
  )
}
