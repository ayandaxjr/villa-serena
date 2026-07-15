import { NextResponse } from 'next/server'
import { Resend } from 'resend'
import { isRateLimited, getIp, sanitize } from '@/lib/rateLimit'
import { createServiceClient } from '@/lib/supabase/server'

function getResend() {
  const key = process.env.RESEND_API_KEY
  if (!key) throw new Error('RESEND_API_KEY is not set')
  return new Resend(key)
}

function formatDate(iso: string) {
  const d = new Date(iso)
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
}

function calcNights(start: string, end: string) {
  return Math.round((new Date(end).getTime() - new Date(start).getTime()) / 86_400_000)
}

export async function POST(request: Request) {
  const ip = getIp(request)
  if (isRateLimited(ip, 5, 60_000)) {
    return NextResponse.json(
      { error: 'Too many requests. Please wait a moment and try again.' },
      { status: 429 }
    )
  }

  try {
    const body = await request.json()

    // Honeypot
    if (body._trap) return NextResponse.json({ success: true })

    const name     = sanitize(body.name, 120)
    const email    = sanitize(body.email, 254)
    const phone    = sanitize(body.phone, 30)
    const guests   = sanitize(body.guests, 100)
    const message  = sanitize(body.message, 2000)
    const checkIn  = sanitize(body.checkIn, 10)
    const checkOut = sanitize(body.checkOut, 10)

    if (!name || !email || !checkIn || !checkOut) {
      return NextResponse.json({ error: 'Missing required fields.' }, { status: 400 })
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Invalid email address.' }, { status: 400 })
    }

    const n = calcNights(checkIn, checkOut)
    if (n < 1) {
      return NextResponse.json({ error: 'Invalid date range.' }, { status: 400 })
    }

    const guestsCount = parseInt(guests ?? '1', 10) || 1
    const supabase = createServiceClient()

    // Upsert guest (email is unique — returning existing if duplicate)
    const { data: guest, error: guestError } = await supabase
      .from('guests')
      .upsert({ name, email, phone: phone || null }, { onConflict: 'email', ignoreDuplicates: false })
      .select('id')
      .single()

    if (guestError || !guest) {
      console.error('[inquire] guest upsert error:', guestError)
      return NextResponse.json({ error: 'Failed to process request.' }, { status: 500 })
    }

    // Create booking record
    const { data: booking, error: bookingError } = await supabase
      .from('bookings')
      .insert({
        guest_id:     guest.id,
        check_in:     checkIn,
        check_out:    checkOut,
        guests_count: guestsCount,
        status:       'pending',
        message:      message || null,
      })
      .select('id')
      .single()

    if (bookingError || !booking) {
      console.error('[inquire] booking insert error:', bookingError)
      return NextResponse.json({ error: 'Failed to process request.' }, { status: 500 })
    }

    // Log the activity
    await supabase.from('activity_log').insert({
      event_type: 'booking_request',
      booking_id: booking.id,
      guest_id:   guest.id,
      metadata:   { name, email, checkIn, checkOut, nights: n, guestsCount },
      user_agent: request.headers.get('user-agent') ?? undefined,
    })

    // Send emails
    const fromEmail = process.env.FROM_EMAIL || 'Villa Serena <info@villa-serena.nl>'
    const toEmail   = process.env.CONTACT_EMAIL || 'info@villa-serena.nl'

    const ownerHtml = `
      <div style="font-family:'Georgia',serif;max-width:600px;margin:0 auto;background:#FAF8F5;padding:40px;">
        <div style="text-align:center;margin-bottom:40px;">
          <h1 style="font-size:28px;font-weight:300;color:#2C2824;margin:0;">Villa Serena</h1>
          <div style="width:40px;height:1px;background:#B8975A;margin:16px auto;"></div>
          <p style="font-size:11px;letter-spacing:3px;text-transform:uppercase;color:#B8975A;margin:0;">New Booking Request</p>
        </div>
        <div style="background:#B8975A;color:white;text-align:center;padding:20px 32px;margin-bottom:2px;border-radius:4px 4px 0 0;">
          <p style="margin:0;font-size:13px;letter-spacing:2px;text-transform:uppercase;opacity:.8;">Requested Period</p>
          <h2 style="margin:8px 0 4px;font-size:22px;font-weight:300;">
            ${formatDate(checkIn)} &rarr; ${formatDate(checkOut)}
          </h2>
          <p style="margin:0;font-size:13px;opacity:.85;">${n} night${n !== 1 ? 's' : ''}</p>
        </div>
        <div style="background:white;padding:32px;border:1px solid rgba(44,40,36,0.08);border-top:none;">
          <table style="width:100%;border-collapse:collapse;font-size:15px;color:#2C2824;">
            <tr><td style="padding:12px 0;border-bottom:1px solid #F5F0EB;font-weight:500;width:140px;">Name</td><td style="padding:12px 0;border-bottom:1px solid #F5F0EB;">${name}</td></tr>
            <tr><td style="padding:12px 0;border-bottom:1px solid #F5F0EB;font-weight:500;">Email</td><td style="padding:12px 0;border-bottom:1px solid #F5F0EB;"><a href="mailto:${email}" style="color:#B8975A;">${email}</a></td></tr>
            <tr><td style="padding:12px 0;border-bottom:1px solid #F5F0EB;font-weight:500;">Phone</td><td style="padding:12px 0;border-bottom:1px solid #F5F0EB;">${phone || 'Not provided'}</td></tr>
            <tr><td style="padding:12px 0;border-bottom:1px solid #F5F0EB;font-weight:500;">Guests</td><td style="padding:12px 0;border-bottom:1px solid #F5F0EB;">${guestsCount}</td></tr>
            <tr><td style="padding:12px 0;font-weight:500;">Message</td><td style="padding:12px 0;">${message || '—'}</td></tr>
          </table>
          <div style="margin-top:24px;padding:16px;background:#FAF8F5;border-radius:4px;">
            <p style="margin:0;font-size:13px;color:#5a5450;">
              Booking ID: <code style="color:#B8975A;">${booking.id.slice(0, 8)}</code> &middot;
              <a href="${process.env.NEXT_PUBLIC_ADMIN_URL ?? 'https://admin.villa-serena.nl'}/bookings/${booking.id}" style="color:#B8975A;">View in admin panel →</a>
            </p>
          </div>
        </div>
        <p style="font-size:12px;color:#8C8279;text-align:center;margin-top:24px;">Received via villa-serena.nl booking calendar</p>
      </div>
    `

    const guestHtml = `
      <div style="font-family:'Georgia',serif;max-width:600px;margin:0 auto;background:#FAF8F5;padding:40px;">
        <div style="text-align:center;margin-bottom:40px;">
          <h1 style="font-size:28px;font-weight:300;color:#2C2824;margin:0;">Villa Serena</h1>
          <div style="width:40px;height:1px;background:#B8975A;margin:16px auto;"></div>
          <p style="font-size:11px;letter-spacing:3px;text-transform:uppercase;color:#B8975A;margin:0;">Request Received</p>
        </div>
        <div style="background:white;padding:32px;border:1px solid rgba(44,40,36,0.08);">
          <p style="font-size:17px;font-weight:300;color:#2C2824;line-height:1.7;margin:0 0 20px;">Dear ${name},</p>
          <p style="font-size:15px;color:#5a5450;font-weight:300;line-height:1.8;margin:0 0 20px;">
            Thank you for your booking request for Villa Serena. We have received your request for
            <strong style="color:#2C2824;">${formatDate(checkIn)}</strong> to
            <strong style="color:#2C2824;">${formatDate(checkOut)}</strong> (${n} night${n !== 1 ? 's' : ''}).
          </p>
          <p style="font-size:15px;color:#5a5450;font-weight:300;line-height:1.8;margin:0 0 20px;">
            Your request is now <strong style="color:#B8975A;">pending review</strong>. We will get back to you within 24 hours to confirm availability and discuss the next steps.
          </p>
          <p style="font-size:14px;color:#8C8279;margin:0;">Reference: ${booking.id.slice(0, 8).toUpperCase()}</p>
        </div>
        <p style="font-size:12px;color:#8C8279;text-align:center;margin-top:24px;">Villa Serena &middot; Umbria, Italy &middot; info@villa-serena.nl</p>
      </div>
    `

    const [ownerResult, guestResult] = await Promise.allSettled([
      getResend().emails.send({
        from: fromEmail,
        to: toEmail,
        replyTo: email,
        subject: `Booking Request: ${formatDate(checkIn)} → ${formatDate(checkOut)} — ${name}`,
        html: ownerHtml,
      }),
      getResend().emails.send({
        from: fromEmail,
        to: email,
        subject: 'Your booking request — Villa Serena',
        html: guestHtml,
      }),
    ])

    if (ownerResult.status === 'rejected') {
      console.error('[inquire] owner email failed:', ownerResult.reason)
    }
    if (guestResult.status === 'rejected') {
      console.error('[inquire] guest email failed:', guestResult.reason)
    }

    return NextResponse.json({ success: true, bookingId: booking.id })
  } catch (error) {
    console.error('[inquire] error:', error)
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 })
  }
}
