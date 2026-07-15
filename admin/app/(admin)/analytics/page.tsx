import AnalyticsCharts from './AnalyticsCharts'
import type { Booking } from '@/lib/supabase/types'
import { createClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

export default async function AnalyticsPage() {
  let bookings: Booking[] = []
  let activityLog: { event_type: string; created_at: string }[] = []
  let totalGuests = 0
  let inquiryCount = 0

  try {
    const supabase = createClient()

    const [
      { data: allBookings },
      { data: log },
      { count },
      { count: inqCount },
    ] = await Promise.all([
      supabase
        .from('bookings')
        .select('id, check_in, check_out, nights, guests_count, status, created_at')
        .order('created_at', { ascending: true }),
      supabase
        .from('activity_log')
        .select('event_type, created_at')
        .order('created_at', { ascending: true }),
      supabase.from('guests').select('*', { count: 'exact', head: true }),
      supabase.from('inquiries').select('*', { count: 'exact', head: true }),
    ])

    bookings     = (allBookings ?? []) as Booking[]
    activityLog  = log ?? []
    totalGuests  = count ?? 0
    inquiryCount = inqCount ?? 0
  } catch { /* Supabase not connected */ }

  const monthlyData      = buildMonthlyData(bookings)
  const statusBreakdown  = bookings.reduce<Record<string, number>>((acc, b) => { acc[b.status] = (acc[b.status] ?? 0) + 1; return acc }, {})

  const approved       = bookings.filter(b => ['approved', 'completed'].includes(b.status))
  const totalNights    = approved.reduce((a, b) => a + (b.nights ?? 0), 0)
  const avgNights      = approved.length ? Math.round(totalNights / approved.length) : 0
  const totalGuests2   = approved.reduce((a, b) => a + (b.guests_count ?? 0), 0)
  const conversionRate = bookings.length ? Math.round((approved.length / bookings.length) * 100) : 0

  const activityBreakdown = activityLog.reduce<Record<string, number>>((acc, a) => {
    acc[a.event_type] = (acc[a.event_type] ?? 0) + 1; return acc
  }, {})

  return (
    <div className="p-8 max-w-[1000px]">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold tracking-tight" style={{ color: 'var(--text-1)' }}>Analytics</h1>
        <p style={{ fontSize: 13, color: 'var(--text-3)', marginTop: 4 }}>All-time performance overview</p>
      </div>

      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 mb-7">
        <MetricCard label="Total bookings"   value={bookings.length} />
        <MetricCard label="Contact inquiries" value={inquiryCount} sub="Invitation form" />
        <MetricCard label="Conversion rate"  value={`${conversionRate}%`} sub="requests → approved" />
        <MetricCard label="Avg. stay"        value={`${avgNights}n`} sub="nights per booking" />
      </div>

      <AnalyticsCharts
        monthlyData={monthlyData}
        statusBreakdown={statusBreakdown}
        activityBreakdown={activityBreakdown}
        totalGuests={totalGuests}
      />
    </div>
  )
}

function buildMonthlyData(bookings: Booking[]) {
  const now    = new Date()
  const result = []
  for (let i = 5; i >= 0; i--) {
    const d   = new Date(now.getFullYear(), now.getMonth() - i, 1)
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
    const label = d.toLocaleDateString('en', { month: 'short', year: '2-digit' })
    const monthBookings = bookings.filter(b => b.created_at.startsWith(key))
    result.push({
      month:    label,
      requests: monthBookings.length,
      approved: monthBookings.filter(b => ['approved', 'completed'].includes(b.status)).length,
      nights:   monthBookings.filter(b => ['approved', 'completed'].includes(b.status)).reduce((a, b) => a + (b.nights ?? 0), 0),
    })
  }
  return result
}

function MetricCard({ label, value, sub }: { label: string; value: number | string; sub?: string }) {
  return (
    <div className="stat-card">
      <p style={{ fontSize: 34, fontWeight: 300, fontFamily: 'monospace', color: 'var(--text-1)', lineHeight: 1 }}>{value}</p>
      <p style={{ fontSize: 10, fontWeight: 600, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.1em', marginTop: 8 }}>{label}</p>
      {sub && <p style={{ fontSize: 10, color: 'var(--text-4)', marginTop: 2 }}>{sub}</p>}
    </div>
  )
}
