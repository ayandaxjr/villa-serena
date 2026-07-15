/**
 * Sync website-update image paths to Supabase site_content.
 * Usage: node scripts/sync-website-update.mjs
 */
import { readFileSync, existsSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import { createClient } from '@supabase/supabase-js'
import ws from 'ws'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const envPath = join(root, '.env.local')

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

const UPDATES = {
  hero_video_url: '/hero-video-web.mp4',
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
  wine_1_name: "L'Avvocato",
  wine_1_type: 'Super Tuscan style',
  wine_2_name: 'Il Colonnello',
  wine_2_type: 'Sangiovese',
  wine_3_name: 'La Contessa',
  wine_3_type: 'Grechetto',
  wine_1_desc: 'A powerful, elegant blend of Merlot and Cabernet Sauvignon from Umbria, with 12 months aging on French oak. Complex, structured and made in small quantities (approximately 500 bottles). A wine with aging potential for lovers of the classic Super Tuscan style.',
  wine_2_desc: 'This 100% Sangiovese from 2022 first aged a year on new oak and then a year on used wood. The tannins are beautifully balanced, the nose is fruity and the finish soft. An ideal companion for both red and white meat.',
  wine_3_desc: 'A pure Grechetto, a white grape variety that is only grown around Lake Trasimeno. Harvest 2024, aged on stainless steel. The nose is fresh and mild, the taste soft with a nutty finish. Perfect with fish dishes and (vegetarian) pasta.',
}

loadEnv()

const url = process.env.NEXT_PUBLIC_SUPABASE_URL
const key = process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!url || !key) {
  console.error('Missing Supabase env vars in .env.local')
  process.exit(1)
}

const supabase = createClient(url, key, {
  auth: { persistSession: false, autoRefreshToken: false },
  realtime: { transport: ws },
})

let ok = 0
let fail = 0

for (const [keyName, value] of Object.entries(UPDATES)) {
  const { error } = await supabase.from('site_content').update({ value }).eq('key', keyName)
  if (error) {
    console.error(`FAIL ${keyName}:`, error.message)
    fail++
  } else {
    console.log(`OK   ${keyName}`)
    ok++
  }
}

console.log(`\nDone: ${ok} updated, ${fail} failed`)
process.exit(fail > 0 ? 1 : 0)
