/**
 * Upload site photos used on the live homepage to Supabase Storage and update CMS URLs.
 * Only uploads images referenced in lib/site-assets.ts (estate, seasons, wine sections).
 *
 * Usage:
 *   node scripts/upload-photos-to-supabase.mjs           # upload + update CMS
 *   node scripts/upload-photos-to-supabase.mjs --dry-run # preview only
 *   node scripts/upload-photos-to-supabase.mjs --skip-upload  # CMS update only (URLs already in bucket)
 */
import { readFileSync, existsSync, statSync } from 'fs'
import { join, dirname, extname } from 'path'
import { fileURLToPath } from 'url'
import { createClient } from '@supabase/supabase-js'
import ws from 'ws'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const envPath = join(root, '.env.local')
const photosDir = join(root, 'public', 'photos')
const bucket = 'site-images'
const storagePrefix = 'photos'

const IMAGE_EXTS = new Set(['.jpg', '.jpeg', '.png', '.webp', '.gif'])
const MIME = {
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.gif': 'image/gif',
}

/** Only images used on the current homepage (see lib/site-assets.ts) */
const USED_PHOTO_FILES = [
  'Villa_Serena_Ext_-30.jpg',  // estate 1 — The Vineyard
  'Villa_Serena_Ext_-12.jpg',  // estate 2 — The Serene Pool
  'Villa_Serena_Ext_-3.jpg',   // estate 3 — The Entrance
  'Villa_Serena_Ext_-1.jpg',   // estate 4 — A casa
  'Villa_Serena_Ext_-65.jpg',  // estate 5 — The Valley View
  'Villa_Serena_Ext_-68.jpg',  // estate 6 + wine section hero
  'Villa_Serena_Ext_-63.jpg',  // estate 7 — La terrassa
  '35128d23-d934-4b13-8200-b78c53872d9a.jpg', // seasons — spring
  'Main_Picture_Villa_Serena.jpg',            // seasons — summer
  '3d5c7ef8-729e-413f-bb87-6ec18c743d37.jpg', // seasons — late summer
  'L_Avvocato.jpg',            // wine 1 (optional — client may add later)
  'Villa_Serena_Ext_-66.jpg',  // wine 2
  'Villa_Serena_Ext_-67.jpg',  // wine 3
]

/** CMS image keys whose defaults live under /photos/ */
const PHOTO_CMS_DEFAULTS = {
  estate_card_image_1: '/photos/Villa_Serena_Ext_-30.jpg',
  estate_card_image_2: '/photos/Villa_Serena_Ext_-12.jpg',
  estate_card_image_3: '/photos/Villa_Serena_Ext_-3.jpg',
  estate_card_image_4: '/photos/Villa_Serena_Ext_-1.jpg',
  estate_card_image_5: '/photos/Villa_Serena_Ext_-65.jpg',
  estate_card_image_6: '/photos/Villa_Serena_Ext_-68.jpg',
  estate_card_image_7: '/photos/Villa_Serena_Ext_-63.jpg',
  seasons_image_spring: '/photos/35128d23-d934-4b13-8200-b78c53872d9a.jpg',
  seasons_image_summer: '/photos/Main_Picture_Villa_Serena.jpg',
  seasons_image_late: '/photos/3d5c7ef8-729e-413f-bb87-6ec18c743d37.jpg',
  wine_1_image: '/photos/L_Avvocato.jpg',
  wine_2_image: '/photos/Villa_Serena_Ext_-66.jpg',
  wine_3_image: '/photos/Villa_Serena_Ext_-67.jpg',
}

function loadEnv() {
  if (!existsSync(envPath)) return
  for (const line of readFileSync(envPath, 'utf8').split('\n')) {
    const m = line.match(/^([^#=]+)=(.*)$/)
    if (!m) continue
    const key = m[1].trim()
    let val = m[2].trim()
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
      val = val.slice(1, -1)
    }
    if (!process.env[key]) process.env[key] = val
  }
}

function formatBytes(n) {
  if (n < 1024) return `${n} B`
  if (n < 1024 ** 2) return `${(n / 1024).toFixed(1)} KB`
  if (n < 1024 ** 3) return `${(n / 1024 ** 2).toFixed(1)} MB`
  return `${(n / 1024 ** 3).toFixed(2)} GB`
}

function localPathForFile(name) {
  return `/photos/${name}`
}

function normalizePhotoPath(value) {
  if (!value) return null
  const v = value.trim()
  if (v.startsWith('/photos/')) return v
  const match = v.match(/\/photos\/([^/?#]+)$/i)
  return match ? `/photos/${decodeURIComponent(match[1])}` : null
}

function listUsedPhotoFiles() {
  if (!existsSync(photosDir)) {
    console.error(`Photos folder not found: ${photosDir}`)
    process.exit(1)
  }
  const found = []
  const missing = []
  for (const name of USED_PHOTO_FILES) {
    const filePath = join(photosDir, name)
    if (existsSync(filePath)) {
      found.push(name)
    } else {
      missing.push(name)
    }
  }
  if (missing.length) {
    console.warn(`Skipping ${missing.length} missing file(s): ${missing.join(', ')}`)
  }
  return found
}

async function uploadWithRetry(supabase, storagePath, buffer, contentType, retries = 3) {
  let lastError = null
  for (let attempt = 1; attempt <= retries; attempt++) {
    const { error } = await supabase.storage
      .from(bucket)
      .upload(storagePath, buffer, { contentType, upsert: true })
    if (!error) return null
    lastError = error
    if (attempt < retries) {
      await new Promise((r) => setTimeout(r, attempt * 2000))
    }
  }
  return lastError
}

async function uploadPhotos(supabase, files, dryRun) {
  const urlMap = new Map()
  let uploaded = 0
  let skipped = 0
  let failed = 0
  let totalBytes = 0

  console.log(`\nUploading ${files.length} files to bucket "${bucket}/${storagePrefix}/"…\n`)

  for (const name of files) {
    const localPath = localPathForFile(name)
    const storagePath = `${storagePrefix}/${name}`
    const filePath = join(photosDir, name)
    const size = statSync(filePath).size
    totalBytes += size
    const contentType = MIME[extname(name).toLowerCase()] ?? 'image/jpeg'

    if (dryRun) {
      console.log(`  [dry-run] ${name} (${formatBytes(size)}) → ${storagePath}`)
      urlMap.set(localPath, `https://YOUR-PROJECT.supabase.co/storage/v1/object/public/${bucket}/${storagePath}`)
      continue
    }

    const buffer = readFileSync(filePath)
    process.stdout.write(`  ↑ ${name} (${formatBytes(size)})… `)

    const error = await uploadWithRetry(supabase, storagePath, buffer, contentType)
    if (error) {
      console.log('FAIL')
      console.error(`     ${error.message}`)
      failed++
      continue
    }

    const { data } = supabase.storage.from(bucket).getPublicUrl(storagePath)
    urlMap.set(localPath, data.publicUrl)
    console.log('OK')
    uploaded++
  }

  console.log(`\nUpload summary: ${uploaded} ok, ${failed} failed, ${formatBytes(totalBytes)} total`)
  return { urlMap, uploaded, failed }
}

async function updateCmsUrls(supabase, urlMap, dryRun) {
  const { data: rows, error } = await supabase.from('site_content').select('key, value, type, label, section')
  if (error) {
    console.error('Failed to read site_content:', error.message)
    process.exit(1)
  }

  const rowMap = new Map((rows ?? []).map((r) => [r.key, r]))
  const updates = []

  for (const row of rows ?? []) {
    const photoPath = normalizePhotoPath(row.value)
    if (!photoPath || !urlMap.has(photoPath)) continue
    updates.push({
      key: row.key,
      oldValue: row.value,
      newValue: urlMap.get(photoPath),
      meta: row,
    })
  }

  // Ensure known image keys pick up URLs even if still on schema defaults (not in DB yet)
  for (const [key, defaultPath] of Object.entries(PHOTO_CMS_DEFAULTS)) {
    if (updates.some((u) => u.key === key)) continue
    const row = rowMap.get(key)
    const current = row?.value ?? defaultPath
    const photoPath = normalizePhotoPath(current)
    if (!photoPath || !urlMap.has(photoPath)) continue
    updates.push({
      key,
      oldValue: current,
      newValue: urlMap.get(photoPath),
      meta: row,
    })
  }

  if (updates.length === 0) {
    console.log('\nNo CMS rows reference /photos/ paths — nothing to update.')
    return { updated: 0, failed: 0 }
  }

  console.log(`\nUpdating ${updates.length} CMS image URL(s)…\n`)

  let updated = 0
  let failed = 0

  for (const u of updates) {
    if (dryRun) {
      console.log(`  [dry-run] ${u.key}`)
      console.log(`            ${u.oldValue}`)
      console.log(`         →  ${u.newValue}\n`)
      updated++
      continue
    }

    const payload = {
      key: u.key,
      value: u.newValue,
      type: u.meta?.type ?? 'image',
      label: u.meta?.label ?? u.key,
      section: u.meta?.section ?? 'general',
      updated_at: new Date().toISOString(),
    }

    const { error: upsertErr } = await supabase.from('site_content').upsert(payload, { onConflict: 'key' })
    if (upsertErr) {
      console.error(`  FAIL ${u.key}: ${upsertErr.message}`)
      failed++
    } else {
      console.log(`  OK   ${u.key}`)
      updated++
    }
  }

  return { updated, failed }
}

async function main() {
  const args = process.argv.slice(2)
  const dryRun = args.includes('--dry-run')
  const skipUpload = args.includes('--skip-upload')

  loadEnv()

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!url || !key) {
    console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local')
    console.error('The service role key is required (Dashboard → Settings → API → service_role).')
    process.exit(1)
  }

  const supabase = createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
    realtime: { transport: ws },
  })
  const files = listUsedPhotoFiles()

  console.log(`Uploading ${files.length} of ${USED_PHOTO_FILES.length} site images (homepage only)`)

  let urlMap = new Map()

  if (skipUpload) {
    console.log('\n--skip-upload: building URL map from existing bucket files…')
    for (const name of files) {
      const storagePath = `${storagePrefix}/${name}`
      const { data } = supabase.storage.from(bucket).getPublicUrl(storagePath)
      urlMap.set(localPathForFile(name), data.publicUrl)
    }
  } else {
    const result = await uploadPhotos(supabase, files, dryRun)
    urlMap = result.urlMap
    if (!dryRun && result.failed > 0) {
      console.warn('\nSome uploads failed — CMS will only update successfully uploaded files.')
    }
  }

  const cms = await updateCmsUrls(supabase, urlMap, dryRun)

  console.log('\n── Done ──')
  if (dryRun) {
    console.log('Dry run only — re-run without --dry-run to apply changes.')
  } else {
    console.log(`CMS: ${cms.updated} updated, ${cms.failed} failed`)
    console.log('\nNext steps:')
    console.log('  1. Verify images on the live/preview site (they load from Supabase now).')
    console.log('  2. Remove public/photos/ from git to shrink the repo:')
    console.log('       echo "public/photos/" >> .gitignore')
    console.log('       git rm -r --cached public/photos')
  }
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
