import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import StatusBadge from '@/components/StatusBadge'
import type { BookingStatus, BookingWithGuest } from '@/lib/supabase/types'

export const dynamic = 'force-dynamic'

const TABS: { value: BookingStatus | 'all'; label: string }[] = [
  { value: 'all',       label: 'All' },
  { value: 'pending',   label: 'Pending' },
  { value: 'approved',  label: 'Approved' },
  { value: 'declined',  label: 'Declined' },
  { value: 'cancelled', label: 'Cancelled' },
  { value: 'completed', label: 'Completed' },
]

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
}

export default async function BookingsPage({
  searchParams,
}: {
  searchParams: { status?: string }
}) {
  let bookings: BookingWithGuest[] = []
  let countMap: Record<string, number> = {}

  try {
    const supabase = createClient()
    const filter   = searchParams.status as BookingStatus | 'all' | undefined

    let query = supabase
      .from('bookings_with_guests')
      .select('*')
      .order('created_at', { ascending: false })

    if (filter && filter !== 'all') query = query.eq('status', filter)
    const { data } = await query
    bookings = (data as BookingWithGuest[]) ?? []

    const { data: counts } = await supabase.from('bookings').select('status')
    countMap = ((counts ?? []) as { status: string }[]).reduce<Record<string, number>>((acc, b) => {
      acc[b.status] = (acc[b.status] ?? 0) + 1
      return acc
    }, {})
  } catch { /* Supabase not connected */ }

  const filter = searchParams.status as BookingStatus | 'all' | undefined

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-[1000px] w-full">
      {/* Header */}
      <div className="mb-7">
        <h1 className="text-2xl font-semibold tracking-tight" style={{ color: 'var(--text-1)' }}>Bookings</h1>
        <p style={{ fontSize: 13, color: 'var(--text-3)', marginTop: 4 }}>
          {bookings.length} {filter && filter !== 'all' ? filter : 'total'}
        </p>
      </div>

      {/* Tab bar */}
      <div className="flex gap-1 mb-6 p-1 rounded-2xl w-fit flex-wrap"
           style={{ background: 'var(--bg-elevated)' }}>
        {TABS.map(tab => {
          const isActive = (filter ?? 'all') === tab.value
          const cnt = tab.value === 'all'
            ? Object.values(countMap).reduce((a, b) => a + b, 0)
            : countMap[tab.value] ?? 0
          return (
            <Link
              key={tab.value}
              href={tab.value === 'all' ? '/bookings' : `/bookings?status=${tab.value}`}
              style={{
                display: 'flex', alignItems: 'center', gap: 6,
                padding: '7px 14px', borderRadius: 10,
                fontSize: 13, fontWeight: 500,
                transition: 'all 0.15s',
                background: isActive ? 'var(--bg-card)' : 'transparent',
                color: isActive ? 'var(--text-1)' : 'var(--text-3)',
                boxShadow: isActive ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
                border: isActive ? '1px solid var(--border)' : '1px solid transparent',
              }}
            >
              {tab.label}
              {cnt > 0 && (
                <span style={{
                  fontSize: 10, fontFamily: 'monospace',
                  padding: '2px 5px', borderRadius: 5,
                  background: tab.value === 'pending' && isActive ? 'var(--accent-dim)' : 'var(--bg-elevated)',
                  color: tab.value === 'pending' && isActive ? 'var(--accent)' : 'var(--text-3)',
                  border: '1px solid var(--border)',
                }}>
                  {cnt}
                </span>
              )}
            </Link>
          )
        })}
      </div>

      {/* Table */}
      <div className="card overflow-hidden overflow-x-auto">
        <table className="tbl min-w-[640px]">
          <thead>
            <tr>
              <th>Guest</th>
              <th>Dates</th>
              <th>Nights</th>
              <th>Guests</th>
              <th>Status</th>
              <th>Received</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {!bookings.length ? (
              <tr>
                <td colSpan={7} style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-4)', fontSize: 13 }}>
                  No bookings found
                </td>
              </tr>
            ) : (
              bookings.map(b => (
                <tr key={b.id}>
                  <td>
                    <p style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-1)' }}>{b.guest_name}</p>
                    <p style={{ fontSize: 11, color: 'var(--text-3)', marginTop: 2 }}>{b.guest_email}</p>
                  </td>
                  <td style={{ fontSize: 13, color: 'var(--text-2)', whiteSpace: 'nowrap' }}>
                    {fmtDate(b.check_in)} → {fmtDate(b.check_out)}
                  </td>
                  <td style={{ fontSize: 13, fontFamily: 'monospace', color: 'var(--text-2)' }}>{b.nights}</td>
                  <td style={{ fontSize: 13, fontFamily: 'monospace', color: 'var(--text-2)' }}>{b.guests_count}</td>
                  <td><StatusBadge status={b.status} /></td>
                  <td style={{ fontSize: 11, color: 'var(--text-3)', whiteSpace: 'nowrap' }}>{fmtDate(b.created_at)}</td>
                  <td style={{ textAlign: 'right' }}>
                    <Link href={`/bookings/${b.id}`}
                          style={{ display: 'inline-flex', alignItems: 'center', gap: 3, fontSize: 12, color: 'var(--accent)', fontWeight: 500 }}>
                      View
                      <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="m9 18 6-6-6-6"/></svg>
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
