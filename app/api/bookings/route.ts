import { NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'
import type { BookingStatus } from '@/lib/supabase/types'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const status  = searchParams.get('status') as BookingStatus | null
    const limit   = Math.min(parseInt(searchParams.get('limit') ?? '50'), 200)
    const offset  = parseInt(searchParams.get('offset') ?? '0')

    const supabase = createServiceClient()

    let query = supabase
      .from('bookings_with_guests')
      .select('*')
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (status) {
      query = query.eq('status', status)
    }

    const { data, error, count } = await query

    if (error) throw error

    return NextResponse.json({ bookings: data ?? [], total: count ?? 0 })
  } catch (error) {
    console.error('[bookings/list] error:', error)
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 })
  }
}
