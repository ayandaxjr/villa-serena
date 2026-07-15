import { NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'

export interface BookedPeriod {
  start: string
  end: string
  label?: string
}

export async function GET() {
  try {
    const supabase = createServiceClient()

    const [
      { data: blocked, error: blockedErr },
      { data: confirmed, error: confirmedErr },
      { data: pending,  error: pendingErr },
    ] = await Promise.all([
      // Manually blocked periods (owner/maintenance)
      supabase.from('blocked_dates').select('start_date, end_date, label'),
      // Approved + completed bookings — hard block
      supabase
        .from('bookings')
        .select('check_in, check_out')
        .in('status', ['approved', 'completed']),
      // Pending bookings — soft block (shown as unavailable while awaiting decision)
      supabase
        .from('bookings')
        .select('check_in, check_out')
        .eq('status', 'pending'),
    ])

    if (blockedErr || confirmedErr || pendingErr) throw new Error('DB error')

    const periods: BookedPeriod[] = [
      ...(blocked ?? []).map(b => ({
        start: b.start_date,
        end:   b.end_date,
        label: b.label,
      })),
      ...(confirmed ?? []).map(b => ({
        start: b.check_in,
        end:   b.check_out,
        label: 'Booked',
      })),
      // Pending bookings also block the calendar — released if declined
      ...(pending ?? []).map(b => ({
        start: b.check_in,
        end:   b.check_out,
        label: 'Pending',
      })),
    ]

    // Short cache — availability must reflect pending blocks quickly
    return NextResponse.json(
      { periods },
      { headers: { 'Cache-Control': 'public, s-maxage=30, stale-while-revalidate=60' } }
    )
  } catch (err) {
    console.error('[availability] error, falling back to env var:', err)
    try {
      const raw = process.env.BOOKED_PERIODS ?? '[]'
      return NextResponse.json({ periods: JSON.parse(raw) })
    } catch {
      return NextResponse.json({ periods: [] })
    }
  }
}
