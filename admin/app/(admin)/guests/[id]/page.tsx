import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import StatusBadge from '@/components/StatusBadge'
import GuestNotesEditor from './GuestNotesEditor'
import type { Guest, BookingWithGuest } from '@/lib/supabase/types'

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
}
function formatShort(iso: string) {
  return new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
}

function initials(name: string) {
  return name.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase()
}

export default async function GuestDetailPage({ params }: { params: { id: string } }) {
  const supabase = createClient()

  const [{ data: guest }, { data: bookings }] = await Promise.all([
    supabase.from('guests').select('*').eq('id', params.id).single(),
    supabase
      .from('bookings_with_guests').select('*')
      .eq('guest_id', params.id)
      .order('check_in', { ascending: false }),
  ])

  if (!guest) notFound()

  const g  = guest as Guest
  const bs = (bookings ?? []) as BookingWithGuest[]

  const totalNights = bs
    .filter(b => ['approved', 'completed'].includes(b.status))
    .reduce((acc, b) => acc + b.nights, 0)

  return (
    <div className="p-8 max-w-[900px]">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-white/25 mb-7">
        <Link href="/guests" className="hover:text-gold transition-colors">Guests</Link>
        <span>/</span>
        <span className="text-white/60">{g.name}</span>
      </div>

      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <div className="w-14 h-14 rounded-full bg-gold/10 border border-gold/20 flex items-center justify-center text-gold font-semibold text-lg">
          {initials(g.name)}
        </div>
        <div>
          <h1 className="text-2xl font-serif font-light text-white/90">{g.name}</h1>
          <a href={`mailto:${g.email}`} className="text-sm text-gold hover:underline">{g.email}</a>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_260px] gap-5">
        {/* Left */}
        <div className="space-y-5">
          {/* Booking history */}
          <div className="card p-6">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-white/30 mb-5">
              Booking history
            </p>
            {!bs.length ? (
              <p className="text-sm text-white/25 text-center py-4">No bookings yet</p>
            ) : (
              <div className="space-y-2">
                {bs.map(b => (
                  <Link
                    key={b.id}
                    href={`/bookings/${b.id}`}
                    className="flex items-center justify-between p-3 rounded-xl hover:bg-white/[0.03] transition-colors group"
                  >
                    <div>
                      <p className="text-sm text-white/70 group-hover:text-gold transition-colors">
                        {formatDate(b.check_in)} → {formatDate(b.check_out)}
                      </p>
                      <p className="text-xs text-white/30 mt-0.5">{b.nights} nights · {b.guests_count} guests</p>
                    </div>
                    <StatusBadge status={b.status} />
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Notes */}
          <GuestNotesEditor guestId={g.id} initialNotes={g.notes ?? ''} />
        </div>

        {/* Right — stats + contact */}
        <div className="space-y-4">
          <div className="card p-5">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-white/30 mb-2">Total bookings</p>
            <p className="text-3xl font-light font-mono text-white/90">{bs.length}</p>
          </div>
          <div className="card p-5">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-white/30 mb-2">Confirmed nights</p>
            <p className="text-3xl font-light font-mono text-white/90">{totalNights}</p>
          </div>

          <div className="card p-6">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-white/30 mb-4">Contact</p>
            <div className="space-y-3">
              {g.phone && (
                <div>
                  <p className="text-[10px] text-white/25 uppercase tracking-wider">Phone</p>
                  <p className="text-sm text-white/70 mt-0.5">{g.phone}</p>
                </div>
              )}
              {g.nationality && (
                <div>
                  <p className="text-[10px] text-white/25 uppercase tracking-wider">Nationality</p>
                  <p className="text-sm text-white/70 mt-0.5">{g.nationality}</p>
                </div>
              )}
              <div>
                <p className="text-[10px] text-white/25 uppercase tracking-wider">First contact</p>
                <p className="text-sm text-white/70 mt-0.5">{formatShort(g.created_at)}</p>
              </div>
            </div>

            <Link
              href={`/payments?email=${encodeURIComponent(g.email)}&name=${encodeURIComponent(g.name)}`}
              className="mt-5 btn btn-ghost btn-sm border border-white/10 w-full justify-center"
            >
              Create payment link →
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
