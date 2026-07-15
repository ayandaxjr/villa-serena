import { NextResponse } from 'next/server'
import { sendClientNotification, sendGuestConfirmation } from '@/lib/email'
import { isRateLimited, getIp, sanitize } from '@/lib/rateLimit'
import { createServiceClient } from '@/lib/supabase/server'

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

    if (body._trap) return NextResponse.json({ success: true })

    const name          = sanitize(body.name, 120)
    const email         = sanitize(body.email, 254)
    const phone         = sanitize(body.phone, 30)
    const guests        = sanitize(body.guests, 100)
    const preferredDate = sanitize(body.preferredDate, 120)
    const message       = sanitize(body.message, 2000)

    if (!name || !email) {
      return NextResponse.json({ error: 'Name and email are required.' }, { status: 400 })
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Invalid email address.' }, { status: 400 })
    }

    const contactData = { name, email, phone, guests, preferredDate, message }

    const supabase = createServiceClient()

    const { data: guest, error: guestError } = await supabase
      .from('guests')
      .upsert({ name, email, phone: phone || null }, { onConflict: 'email', ignoreDuplicates: false })
      .select('id')
      .single()

    if (guestError) {
      console.error('[contact] guest upsert error:', guestError)
    }

    const { data: inquiry, error: inquiryError } = await supabase
      .from('inquiries')
      .insert({
        guest_id:       guest?.id ?? null,
        name,
        email,
        phone:          phone || null,
        guests:         guests || null,
        preferred_date: preferredDate || null,
        message:        message || null,
        source:         'contact_form',
      })
      .select('id')
      .single()

    if (inquiryError) {
      console.error('[contact] inquiry insert error:', inquiryError)
      // Fall back to activity_log only if inquiries table not migrated yet
      await supabase.from('activity_log').insert({
        event_type: 'contact_inquiry',
        guest_id:   guest?.id ?? null,
        metadata:   { name, email, phone, guests, preferredDate, message },
        user_agent: request.headers.get('user-agent') ?? undefined,
      })
    } else {
      await supabase.from('activity_log').insert({
        event_type: 'contact_inquiry',
        guest_id:   guest?.id ?? null,
        metadata:   {
          name,
          email,
          phone,
          guests,
          preferredDate,
          message,
          inquiry_id: inquiry.id,
        },
        user_agent: request.headers.get('user-agent') ?? undefined,
      })
    }

    const [clientResult, guestResult] = await Promise.allSettled([
      sendClientNotification(contactData),
      sendGuestConfirmation(contactData),
    ])

    if (clientResult.status === 'rejected') {
      console.error('[contact] owner email failed:', clientResult.reason)
      return NextResponse.json(
        { error: 'Failed to send inquiry. Please email info@villa-serena.nl directly.' },
        { status: 500 }
      )
    }

    if (guestResult.status === 'rejected') {
      console.error('[contact] guest confirmation failed (non-critical):', guestResult.reason)
    }

    return NextResponse.json({
      success: true,
      message: 'Inquiry sent successfully.',
      inquiryId: inquiry?.id ?? null,
    })
  } catch (error) {
    console.error('[contact] error:', error)
    return NextResponse.json({ error: 'Internal server error. Please try again later.' }, { status: 500 })
  }
}
