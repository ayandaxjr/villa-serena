import { NextResponse, type NextRequest } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'
import { CONTENT_SCHEMA } from '@/lib/content-schema'

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const file = formData.get('file') as File | null
    const key  = formData.get('key') as string | null

    if (!file || !key) return NextResponse.json({ error: 'Missing file or key' }, { status: 400 })

    const def = CONTENT_SCHEMA.find(d => d.key === key)
    if (!def) return NextResponse.json({ error: `Unknown content key: ${key}` }, { status: 400 })

    const ext  = file.name.split('.').pop() ?? 'jpg'
    const path = `${key}-${Date.now()}.${ext}`
    const buffer = Buffer.from(await file.arrayBuffer())

    const supabase = createServiceClient()

    const { error: uploadErr } = await supabase.storage
      .from('site-images')
      .upload(path, buffer, { contentType: file.type, upsert: true })

    if (uploadErr) return NextResponse.json({ error: uploadErr.message }, { status: 500 })

    const { data } = supabase.storage.from('site-images').getPublicUrl(path)
    const publicUrl = data.publicUrl

    const { error: saveErr } = await supabase
      .from('site_content')
      .upsert({
        key,
        value: publicUrl,
        type: def.type,
        label: def.label,
        section: def.section,
        updated_at: new Date().toISOString(),
      }, { onConflict: 'key' })

    if (saveErr) return NextResponse.json({ error: saveErr.message }, { status: 500 })

    return NextResponse.json({ url: publicUrl })
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : 'Upload failed' }, { status: 500 })
  }
}
