import { createClient } from '@/lib/supabase/server'
import AvailabilityManager from './AvailabilityManager'
import type { BlockedDate } from '@/lib/supabase/types'

export default async function AvailabilityPage() {
  const supabase = createClient()

  const { data: blocked } = await supabase
    .from('blocked_dates')
    .select('*')
    .order('start_date', { ascending: true })

  const { data: approved } = await supabase
    .from('bookings_with_guests')
    .select('id, check_in, check_out, guest_name, nights')
    .in('status', ['approved', 'completed'])
    .order('check_in', { ascending: true })

  return (
    <div className="p-8 max-w-[800px]">
      <div className="mb-8">
        <h1 className="text-2xl font-serif font-light text-white/90">Availability</h1>
        <p className="text-sm text-white/30 mt-1">
          Manage blocked periods and view confirmed bookings. Changes reflect on the public calendar within 30 seconds.
        </p>
      </div>

      <AvailabilityManager
        blockedDates={(blocked ?? []) as BlockedDate[]}
        approvedBookings={(approved ?? []) as { id: string; check_in: string; check_out: string; guest_name: string; nights: number }[]}
      />
    </div>
  )
}
