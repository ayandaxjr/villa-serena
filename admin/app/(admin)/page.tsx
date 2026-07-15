import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

type Booking = { id: string; guests?: { name: string } | null; check_in: string; check_out: string; status: string }
type Activity = { event_type: string; metadata: Record<string, string>; created_at: string }

async function getDashboardData() {
  try {
    const supabase = createClient()

    const [
      { count: pendingCount },
      { count: approvedCount },
      { count: totalGuests },
      { count: inquiryCount },
      { data: upcoming },
      { data: recentActivity },
    ] = await Promise.all([
      supabase.from('bookings').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
      supabase.from('bookings').select('*', { count: 'exact', head: true }).eq('status', 'approved'),
      supabase.from('guests').select('*', { count: 'exact', head: true }),
      supabase.from('inquiries').select('*', { count: 'exact', head: true }),
      supabase.from('bookings_with_guests').select('id,guest_name,check_in,check_out,status')
        .in('status', ['approved', 'pending']).order('check_in').limit(5),
      supabase.from('activity_log').select('event_type,metadata,created_at').order('created_at', { ascending: false }).limit(8),
    ])

    const { data: approvedBookings } = await supabase
      .from('bookings').select('check_in,check_out').eq('status', 'approved')

    let bookedNights = 0
    const now = new Date()
    const year = now.getFullYear()
    approvedBookings?.forEach(b => {
      const start = new Date(b.check_in)
      const end   = new Date(b.check_out)
      if (start.getFullYear() === year || end.getFullYear() === year) {
        bookedNights += Math.max(0, (end.getTime() - start.getTime()) / 86400000)
      }
    })
    const occupancy = Math.min(100, Math.round((bookedNights / 365) * 100))

    return {
      pendingCount:   pendingCount ?? 0,
      approvedCount:  approvedCount ?? 0,
      totalGuests:    totalGuests ?? 0,
      inquiryCount:   inquiryCount ?? 0,
      upcoming:       (upcoming as unknown as Booking[]) ?? [],
      recentActivity: (recentActivity as Activity[]) ?? [],
      bookedNights:   Math.round(bookedNights),
      occupancy,
    }
  } catch {
    return { pendingCount: 0, approvedCount: 0, totalGuests: 0, inquiryCount: 0, upcoming: [], recentActivity: [], bookedNights: 0, occupancy: 0 }
  }
}

export default async function DashboardPage() {
  const { pendingCount, approvedCount, totalGuests, inquiryCount, upcoming, recentActivity, bookedNights, occupancy } = await getDashboardData()

  const stats = [
    { label: 'Pending requests',    value: pendingCount,  sub: 'awaiting response',   accent: pendingCount > 0, href: '/bookings?status=pending' },
    { label: 'Contact inquiries',   value: inquiryCount,  sub: 'The Invitation form', accent: inquiryCount > 0, href: '/inquiries' },
    { label: 'Confirmed bookings',  value: approvedCount, sub: 'this year',            accent: false, href: '/bookings?status=approved' },
    { label: 'Total guests',        value: totalGuests,   sub: 'all time',             accent: false, href: '/guests' },
  ]

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto w-full">

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-semibold tracking-tight" style={{ color: 'var(--text-1)' }}>Overview</h1>
        <p style={{ color: 'var(--text-3)', fontSize: 13, marginTop: 4 }}>
          {new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map(s => (
          <Link key={s.label} href={s.href} className="stat-card block transition-opacity hover:opacity-90">
            <p className="label">{s.label}</p>
            <p style={{
              fontSize: 36,
              fontWeight: 300,
              lineHeight: 1,
              color: s.accent && s.value > 0 ? 'var(--accent)' : 'var(--text-1)',
            }}>
              {s.value}
            </p>
            <p style={{ fontSize: 12, color: 'var(--text-3)' }}>{s.sub}</p>
          </Link>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Upcoming bookings */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-1)' }}>Upcoming stays</h2>
            <Link href="/bookings" style={{ fontSize: 12, color: 'var(--accent)' }}>View all</Link>
          </div>
          {upcoming.length === 0 ? (
            <p style={{ fontSize: 13, color: 'var(--text-3)' }}>No upcoming bookings yet.</p>
          ) : (
            <div className="space-y-3">
              {upcoming.map((b: Booking) => (
                <Link key={b.id} href={`/bookings/${b.id}`}
                      className="flex items-center justify-between p-3 rounded-xl transition-colors"
                      style={{ background: 'var(--bg-elevated)' }}>
                  <div>
                    <p style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-1)' }}>
                      {(b.guests as { name: string } | null)?.name ?? 'Guest'}
                    </p>
                    <p style={{ fontSize: 11, color: 'var(--text-3)', marginTop: 2 }}>
                      {fmt(b.check_in)} → {fmt(b.check_out)}
                    </p>
                  </div>
                  <span className={`badge badge-${b.status}`}>{b.status}</span>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Recent activity */}
        <div className="card p-6">
          <h2 style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-1)', marginBottom: 20 }}>Recent activity</h2>
          {recentActivity.length === 0 ? (
            <p style={{ fontSize: 13, color: 'var(--text-3)' }}>No activity logged yet.</p>
          ) : (
            <div className="space-y-4">
              {recentActivity.map((a: Activity, i: number) => {
                const meta = a.metadata ?? {}
                const label = activityLabel(a.event_type, meta)
                return (
                <div key={i} className="flex gap-3">
                  <div className="mt-1 w-1.5 h-1.5 rounded-full shrink-0" style={{ background: 'var(--accent)' }} />
                  <div>
                    <p style={{ fontSize: 12, color: 'var(--text-1)' }}>{label}</p>
                    <p style={{ fontSize: 11, color: 'var(--text-3)', marginTop: 2 }}>
                      {timeAgo(a.created_at)}
                    </p>
                  </div>
                </div>
              )})}
            </div>
          )}
        </div>
      </div>

      {/* Quick actions */}
      {pendingCount > 0 && (
        <div className="mt-6 p-5 rounded-2xl flex items-center justify-between"
             style={{ background: 'var(--warning-bg)', border: '1px solid var(--warning-border)' }}>
          <div>
            <p style={{ fontWeight: 600, color: 'var(--warning-text)', fontSize: 14 }}>
              {pendingCount} booking {pendingCount === 1 ? 'request' : 'requests'} awaiting your response
            </p>
            <p style={{ fontSize: 12, color: 'var(--warning-text)', opacity: 0.7, marginTop: 2 }}>
              Pending bookings block those dates on the public calendar.
            </p>
          </div>
          <Link href="/bookings?status=pending" className="btn btn-gold btn-sm">
            Review now
          </Link>
        </div>
      )}
    </div>
  )
}

function fmt(d: string) {
  return new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
}
function activityLabel(type: string, meta: Record<string, string>) {
  if (type === 'contact_inquiry') return `Inquiry from ${meta.name ?? 'guest'}`
  if (type === 'booking_request') return `Booking request from ${meta.name ?? 'guest'}`
  if (type === 'booking_approved') return 'Booking approved'
  if (type === 'booking_declined') return 'Booking declined'
  return type.replace(/_/g, ' ')
}
function timeAgo(ts: string) {
  const diff = Date.now() - new Date(ts).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 2) return 'just now'
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  return `${Math.floor(hrs / 24)}d ago`
}
