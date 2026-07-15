import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import type { ActivityLog, ActivityEventType } from '@/lib/supabase/types'

const EVENT_CONFIG: Record<ActivityEventType, { label: string; color: string; icon: string }> = {
  booking_request:   { label: 'Booking request',  color: 'bg-amber-500/10 text-amber-400 border-amber-500/20',   icon: '📋' },
  contact_inquiry:   { label: 'Contact inquiry',   color: 'bg-blue-500/10 text-blue-400 border-blue-500/20',     icon: '✉️' },
  booking_approved:  { label: 'Booking approved',  color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20', icon: '✅' },
  booking_declined:  { label: 'Booking declined',  color: 'bg-red-500/10 text-red-400 border-red-500/20',        icon: '❌' },
  booking_cancelled: { label: 'Booking cancelled', color: 'bg-white/[0.05] text-white/40 border-white/10',       icon: '🚫' },
  page_view:         { label: 'Page view',          color: 'bg-white/[0.03] text-white/30 border-white/[0.07]',   icon: '👁' },
}

function formatDateTime(iso: string) {
  return new Date(iso).toLocaleString('en-GB', {
    day: 'numeric', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })
}

export default async function ActivityPage() {
  const supabase = createClient()

  const { data: activity } = await supabase
    .from('activity_log')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(100)

  return (
    <div className="p-8 max-w-[800px]">
      <div className="mb-8">
        <h1 className="text-2xl font-serif font-light text-white/90">Activity Feed</h1>
        <p className="text-sm text-white/30 mt-1">All events logged on the website</p>
      </div>

      <div className="card divide-y divide-white/[0.04]">
        {!activity?.length ? (
          <div className="text-center py-16 text-sm text-white/20">No activity yet</div>
        ) : (
          (activity as ActivityLog[]).map(a => {
            const cfg  = EVENT_CONFIG[a.event_type] ?? EVENT_CONFIG.page_view
            const meta = (a.metadata ?? {}) as Record<string, string>

            return (
              <div key={a.id} className="px-6 py-4 flex items-start gap-4 hover:bg-white/[0.02] transition-colors">
                <div className="text-base mt-0.5 shrink-0">{cfg.icon}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-lg border ${cfg.color}`}>
                      {cfg.label}
                    </span>
                    {meta.name && (
                      <span className="text-sm font-medium text-white/70">{meta.name}</span>
                    )}
                  </div>
                  {meta.email && (
                    <p className="text-xs text-white/30 mt-1">{meta.email}</p>
                  )}
                  {meta.preferredDate && (
                    <p className="text-xs text-white/25 mt-0.5">{meta.preferredDate}</p>
                  )}
                  {meta.guests && (
                    <p className="text-xs text-white/25 mt-0.5">{meta.guests} guests</p>
                  )}
                  {meta.message && (
                    <p className="text-xs text-white/25 mt-0.5 line-clamp-2">{meta.message}</p>
                  )}
                  {meta.checkIn && meta.checkOut && (
                    <p className="text-xs text-white/25 mt-0.5">
                      {meta.checkIn} → {meta.checkOut}
                      {meta.nights ? ` · ${meta.nights} nights` : ''}
                    </p>
                  )}
                  {meta.inquiry_id && (
                    <Link href="/inquiries" className="text-xs text-gold/60 hover:text-gold transition-colors mt-1 block">
                      View in inquiries →
                    </Link>
                  )}
                  {a.booking_id && (
                    <Link
                      href={`/bookings/${a.booking_id}`}
                      className="text-xs text-gold/60 hover:text-gold transition-colors mt-1 block"
                    >
                      View booking →
                    </Link>
                  )}
                </div>
                <div className="text-xs text-white/25 shrink-0 text-right">
                  <p>{formatDateTime(a.created_at)}</p>
                  {a.ip_country && <p className="mt-0.5">{a.ip_country}</p>}
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
