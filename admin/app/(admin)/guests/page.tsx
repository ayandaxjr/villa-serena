import Link from 'next/link'
import type { Guest } from '@/lib/supabase/types'
import { createClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
}
function initials(name: string) {
  return name.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase()
}

export default async function GuestsPage() {
  let guests: Guest[] = []
  let countMap: Record<string, number> = {}

  try {
    const supabase = createClient()
    const [{ data: g }, { data: bc }] = await Promise.all([
      supabase.from('guests').select('*').order('created_at', { ascending: false }),
      supabase.from('bookings').select('guest_id'),
    ])
    guests   = (g as Guest[]) ?? []
    countMap = (bc ?? []).reduce<Record<string, number>>((acc, b) => { acc[b.guest_id] = (acc[b.guest_id] ?? 0) + 1; return acc }, {})
  } catch { /* DB not connected */ }

  return (
    <div className="p-8 max-w-[960px]">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold tracking-tight" style={{ color: 'var(--text-1)' }}>Guests</h1>
        <p style={{ fontSize: 13, color: 'var(--text-3)', marginTop: 4 }}>{guests.length} registered guests</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {!guests.length ? (
          <div className="col-span-3 card text-center py-16" style={{ fontSize: 13, color: 'var(--text-4)' }}>
            No guests yet. They will appear here after their first booking.
          </div>
        ) : (
          guests.map(g => (
            <Link key={g.id} href={`/guests/${g.id}`} className="card p-5 group" style={{ display: 'block', textDecoration: 'none' }}>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold shrink-0"
                     style={{ background: 'var(--accent-dim)', border: '1px solid rgba(184,151,90,0.2)', color: 'var(--accent)' }}>
                  {initials(g.name)}
                </div>
                <div style={{ minWidth: 0 }}>
                  <p style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-1)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {g.name}
                  </p>
                  <p style={{ fontSize: 11, color: 'var(--text-3)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{g.email}</p>
                </div>
              </div>
              <div className="flex justify-between pt-3" style={{ borderTop: '1px solid var(--border)', fontSize: 11, color: 'var(--text-3)' }}>
                <span>{countMap[g.id] ?? 0} booking{(countMap[g.id] ?? 0) !== 1 ? 's' : ''}</span>
                <span>Since {formatDate(g.created_at)}</span>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  )
}
