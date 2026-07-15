import type { BookingStatus } from '@/lib/supabase/types'

const DOT_COLOR: Record<BookingStatus, string> = {
  pending:   '#F59E0B',
  approved:  '#10B981',
  declined:  '#EF4444',
  cancelled: '#6B7280',
  completed: '#8B5CF6',
}

export default function StatusBadge({ status }: { status: BookingStatus }) {
  return (
    <span className={`badge badge-${status}`}>
      <span style={{ width: 6, height: 6, borderRadius: '50%', background: DOT_COLOR[status], flexShrink: 0 }} />
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  )
}
