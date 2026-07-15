import { NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'
import { Resend } from 'resend'
import type { BookingStatus } from '@/lib/supabase/types'

function getResend() {
  const key = process.env.RESEND_API_KEY
  if (!key) throw new Error('RESEND_API_KEY is not set')
  return new Resend(key)
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
}

const ALLOWED_STATUSES: BookingStatus[] = ['approved', 'declined', 'cancelled', 'completed']

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  // Only allow calls from the admin panel via shared secret
  const adminSecret = process.env.ADMIN_SECRET
  if (adminSecret) {
    const incomingSecret = request.headers.get('x-admin-secret')
    if (incomingSecret !== adminSecret) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
  }

  try {
    const body = await request.json()
    const { status, internal_notes }: { status?: BookingStatus; internal_notes?: string } = body

    if (status && !ALLOWED_STATUSES.includes(status)) {
      return NextResponse.json({ error: 'Invalid status.' }, { status: 400 })
    }

    const supabase = createServiceClient()

    const updateData: Record<string, unknown> = {}
    if (status) updateData.status = status
    if (internal_notes !== undefined) updateData.internal_notes = internal_notes

    const { data: booking, error } = await supabase
      .from('bookings')
      .update(updateData)
      .eq('id', params.id)
      .select(`
        id, check_in, check_out, nights, guests_count, status, message, internal_notes,
        guests ( name, email, phone )
      `)
      .single()

    if (error || !booking) {
      return NextResponse.json({ error: 'Booking not found.' }, { status: 404 })
    }

    // Log status change
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
          booking_id: booking.id,
          metadata:   { status, previousStatus: booking.status },
        })
      }
    }

    // Send email notification to guest when approved or declined
    if (status === 'approved' || status === 'declined') {
      const guest = Array.isArray(booking.guests) ? booking.guests[0] : booking.guests
      if (guest?.email) {
        const fromEmail    = process.env.FROM_EMAIL    || 'Villa Serena <info@villa-serena.nl>'
        const contactPhone = process.env.CONTACT_PHONE || ''
        const contactEmail = process.env.CONTACT_EMAIL || 'info@villa-serena.nl'
        const n            = booking.nights
        const statusText   = status === 'approved' ? 'Confirmed' : 'Declined'

        const html = `
          <div style="font-family:'Georgia',serif;max-width:600px;margin:0 auto;background:#FAF8F5;padding:40px;">
            <div style="text-align:center;margin-bottom:40px;">
              <h1 style="font-size:28px;font-weight:300;color:#2C2824;margin:0;">Villa Serena</h1>
              <div style="width:40px;height:1px;background:#B8975A;margin:16px auto;"></div>
              <p style="font-size:11px;letter-spacing:3px;text-transform:uppercase;color:#B8975A;margin:0;">Booking ${statusText}</p>
            </div>
            <div style="background:white;padding:32px;border:1px solid rgba(44,40,36,0.08);">
              <p style="font-size:17px;font-weight:300;color:#2C2824;line-height:1.7;margin:0 0 20px;">Dear ${guest.name},</p>
              ${status === 'approved' ? `
              <p style="font-size:15px;color:#5a5450;font-weight:300;line-height:1.8;margin:0 0 20px;">
                We are delighted to confirm that your booking request for Villa Serena has been <strong style="color:#2D6A4F;">accepted</strong>.
              </p>
              <div style="background:#F5F0EB;border-radius:8px;padding:20px 24px;margin:0 0 24px;">
                <p style="margin:0 0 6px;font-size:13px;letter-spacing:2px;text-transform:uppercase;color:#B8975A;font-weight:400;">Your Stay</p>
                <p style="margin:0;font-size:16px;font-weight:300;color:#2C2824;">
                  ${formatDate(booking.check_in)} &rarr; ${formatDate(booking.check_out)}
                  &nbsp;&middot;&nbsp; ${n} night${n !== 1 ? 's' : ''}
                </p>
              </div>
              <p style="font-size:15px;color:#5a5450;font-weight:300;line-height:1.8;margin:0 0 20px;">
                To <strong style="color:#2C2824;">finalise your reservation and arrange payment</strong>, please contact us directly:
              </p>
              <div style="background:#F5F0EB;border-radius:8px;padding:20px 24px;margin:0 0 24px;">
                ${contactPhone ? `<p style="margin:0 0 8px;font-size:15px;color:#2C2824;">📞 <a href="tel:${contactPhone}" style="color:#B8975A;text-decoration:none;">${contactPhone}</a></p>` : ''}
                <p style="margin:0;font-size:15px;color:#2C2824;">✉️ <a href="mailto:${contactEmail}" style="color:#B8975A;text-decoration:none;">${contactEmail}</a></p>
              </div>
              <p style="font-size:14px;color:#8C8279;font-weight:300;line-height:1.7;margin:0;">
                Our team will guide you through the payment process and provide all arrival details. We look forward to welcoming you to Villa Serena.
              </p>
              ` : `
              <p style="font-size:15px;color:#5a5450;font-weight:300;line-height:1.8;margin:0 0 20px;">
                Unfortunately, we are unable to accommodate your booking request for
                <strong style="color:#2C2824;">${formatDate(booking.check_in)}</strong> to
                <strong style="color:#2C2824;">${formatDate(booking.check_out)}</strong>.
              </p>
              <p style="font-size:15px;color:#5a5450;font-weight:300;line-height:1.8;margin:0 0 20px;">
                We sincerely apologise for any inconvenience. We would love to find alternative dates for you — please don't hesitate to reach out:
              </p>
              <p style="font-size:15px;color:#2C2824;margin:0;">
                ✉️ <a href="mailto:${contactEmail}" style="color:#B8975A;">${contactEmail}</a>
              </p>
              `}
            </div>
            <p style="font-size:12px;color:#8C8279;text-align:center;margin-top:24px;">
              Villa Serena &middot; Umbria, Italy &middot; <a href="mailto:${contactEmail}" style="color:#B8975A;">${contactEmail}</a>
            </p>
          </div>
        `

        try {
          await getResend().emails.send({
            from:    fromEmail,
            to:      guest.email,
            subject: `Your Villa Serena booking — ${statusText}`,
            html,
          })
        } catch (emailErr) {
          console.error('[bookings/patch] email send failed (non-critical):', emailErr)
        }
      }
    }

    return NextResponse.json({ success: true, booking })
  } catch (error) {
    console.error('[bookings/patch] error:', error)
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 })
  }
}

export async function GET(_request: Request, { params }: { params: { id: string } }) {
  try {
    const supabase = createServiceClient()

    const { data, error } = await supabase
      .from('bookings_with_guests')
      .select('*')
      .eq('id', params.id)
      .single()

    if (error || !data) {
      return NextResponse.json({ error: 'Booking not found.' }, { status: 404 })
    }

    return NextResponse.json({ booking: data })
  } catch (error) {
    console.error('[bookings/get] error:', error)
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 })
  }
}
