import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createClient } from '@/lib/supabase/server'

function getStripe() {
  const key = process.env.STRIPE_SECRET_KEY
  if (!key) throw new Error('STRIPE_SECRET_KEY is not configured.')
  return new Stripe(key, { apiVersion: '2024-06-20' })
}

export async function POST(request: Request) {
  // Ensure user is authenticated
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const body = await request.json()
    const { guestName, guestEmail, amount, currency, description } = body

    if (!guestEmail || !amount || !description) {
      return NextResponse.json({ error: 'Missing required fields.' }, { status: 400 })
    }
    if (amount < 100) {
      return NextResponse.json({ error: 'Minimum amount is 1.00.' }, { status: 400 })
    }

    const stripe = getStripe()

    // Create a one-time price
    const price = await stripe.prices.create({
      unit_amount: amount,
      currency,
      product_data: {
        name: description,
        metadata: { source: 'villa-serena' },
      },
    })

    // Create payment link
    const paymentLink = await stripe.paymentLinks.create({
      line_items: [{ price: price.id, quantity: 1 }],
      after_completion: {
        type: 'hosted_confirmation',
        hosted_confirmation: {
          custom_message: 'Thank you! Your payment has been received. We look forward to welcoming you to Villa Serena.',
        },
      },
      metadata: {
        guest_email: guestEmail,
        guest_name:  guestName ?? '',
        source:      'villa-serena-admin',
      },
    })

    // Log the payment creation
    await supabase.from('activity_log').insert({
      event_type: 'contact_inquiry' as never, // closest available type
      metadata: {
        action:      'payment_link_created',
        amount:      amount / 100,
        currency,
        description,
        guestEmail,
        url:         paymentLink.url,
      },
    })

    return NextResponse.json({ url: paymentLink.url, id: paymentLink.id })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to create payment link.'
    console.error('[payments/create-link]', err)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
