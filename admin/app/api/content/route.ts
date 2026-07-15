import { NextResponse, type NextRequest } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'
import { CONTENT_SCHEMA } from '@/lib/content-schema'

export async function POST(req: NextRequest) {
  try {
    const { key, value } = await req.json()
    if (!key) return NextResponse.json({ error: 'Missing key' }, { status: 400 })

    const def = CONTENT_SCHEMA.find(d => d.key === key)
    if (!def) return NextResponse.json({ error: `Unknown content key: ${key}` }, { status: 400 })

    const supabase = createServiceClient()
    const { error } = await supabase
      .from('site_content')
      .upsert({
        key,
        value,
        type: def.type,
        label: def.label,
        section: def.section,
        updated_at: new Date().toISOString(),
      }, { onConflict: 'key' })

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ ok: true })
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : 'Unknown error' }, { status: 500 })
  }
}
