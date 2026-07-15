import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import type { BookingStatus } from '@/lib/supabase/types'

const ALLOWED_STATUSES: BookingStatus[] = ['approved', 'declined', 'cancelled', 'completed']

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await request.json()
  const { status, internal_notes } = body

  if (status && !ALLOWED_STATUSES.includes(status)) {
    return NextResponse.json({ error: 'Invalid status.' }, { status: 400 })
  }

  const update: Record<string, unknown> = {}
  if (status) update.status = status
  if (internal_notes !== undefined) update.internal_notes = internal_notes

  const { data, error } = await supabase
    .from('bookings')
    .update(update)
    .eq('id', params.id)
    .select('*')
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  // Log status changes
  if (status) {
    const eventMap: Record<string, string> = {
      approved:  'booking_approved',
      declined:  'booking_declined',
      cancelled: 'booking_cancelled',
    }
    const eventType = eventMap[status]
    if (eventType) {
      await supabase.from('activity_log').insert({
        event_type: eventType as never,
        booking_id: params.id,
        metadata:   { status },
      })
    }

    // Forward to main site API for email notifications
    const mainApiUrl = process.env.MAIN_SITE_URL
    if (mainApiUrl && (status === 'approved' || status === 'declined')) {
      try {
        await fetch(`${mainApiUrl}/api/bookings/${params.id}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'x-admin-secret': process.env.ADMIN_SECRET ?? '',
          },
          body: JSON.stringify({ status }),
        })
      } catch (e) {
        console.error('[admin/bookings/patch] Email notification failed:', e)
      }
    }
  }

  return NextResponse.json({ success: true, booking: data })
}
