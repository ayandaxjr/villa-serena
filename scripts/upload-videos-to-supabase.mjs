/** Upload hero + promise videos to Supabase (Vercel 100MB file limit). */
import { readFileSync, existsSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import { createClient } from '@supabase/supabase-js'
import ws from 'ws'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const envPath = join(root, '.env.local')
const bucket = 'site-images'

const VIDEOS = [
  { local: 'public/hero-video.mp4', storage: 'videos/hero-video.mp4', cmsKey: 'hero_video_url' },
  { local: 'public/video/vila-serena-music.mp4', storage: 'videos/vila-serena-music.mp4', cmsKey: null },
]

function loadEnv() {
  if (!existsSync(envPath)) return
  for (const line of readFileSync(envPath, 'utf8').split('\n')) {
    const m = line.match(/^([^#=]+)=(.*)$/)
    if (!m) continue
    let val = m[2].trim()
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) val = val.slice(1, -1)
    if (!process.env[m[1].trim()]) process.env[m[1].trim()] = val
  }
}

loadEnv()
const url = process.env.NEXT_PUBLIC_SUPABASE_URL
const key = process.env.SUPABASE_SERVICE_ROLE_KEY
if (!url || !key) { console.error('Missing Supabase env'); process.exit(1) }

const supabase = createClient(url, key, { auth: { persistSession: false }, realtime: { transport: ws } })

for (const v of VIDEOS) {
  const path = join(root, v.local)
  if (!existsSync(path)) { console.warn('Skip missing:', v.local); continue }
  console.log('Uploading', v.local, '…')
  const buf = readFileSync(path)
  const { error } = await supabase.storage.from(bucket).upload(v.storage, buf, { contentType: 'video/mp4', upsert: true })
  if (error) { console.error('FAIL', error.message); process.exit(1) }
  const { data } = supabase.storage.from(bucket).getPublicUrl(v.storage)
  console.log('OK', data.publicUrl)
  if (v.cmsKey) {
    await supabase.from('site_content').upsert({
      key: v.cmsKey, value: data.publicUrl, type: 'video', label: 'Background video', section: 'hero',
      updated_at: new Date().toISOString(),
    }, { onConflict: 'key' })
    console.log('CMS updated', v.cmsKey)
  }
  if (v.storage.includes('vila-serena-music')) {
    console.log('\nSet PROMISE_VIDEO in lib/site-assets.ts to:')
    console.log(data.publicUrl)
  }
}
