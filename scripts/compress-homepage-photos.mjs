/**
 * Resize homepage JPGs in public/photos/ for faster first load.
 * Overwrites files in place (writes to .tmp then replaces).
 */
import { spawnSync } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import ffmpegPath from '@ffmpeg-installer/ffmpeg'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const photosDir = path.join(__dirname, '..', 'public', 'photos')
const MAX_WIDTH = 1920
const MIN_MB = 0.5

const files = fs.readdirSync(photosDir).filter((f) => /\.jpe?g$/i.test(f))

for (const file of files) {
  const full = path.join(photosDir, file)
  const mb = fs.statSync(full).size / (1024 * 1024)
  if (mb < MIN_MB) {
    console.log(`skip ${file} (${mb.toFixed(2)} MB)`)
    continue
  }

  const tmp = `${full}.tmp.jpg`
  console.log(`compress ${file} (${mb.toFixed(2)} MB)…`)

  const result = spawnSync(
    ffmpegPath.path,
    [
      '-y',
      '-i', full,
      '-vf', `scale='min(${MAX_WIDTH},iw)':-2`,
      '-q:v', '3',
      tmp,
    ],
    { stdio: 'inherit' },
  )

  if (result.status !== 0) {
    console.error(`failed: ${file}`)
    if (fs.existsSync(tmp)) fs.unlinkSync(tmp)
    continue
  }

  const newMb = fs.statSync(tmp).size / (1024 * 1024)
  fs.renameSync(tmp, full)
  console.log(`  → ${newMb.toFixed(2)} MB`)
}

console.log('done')
