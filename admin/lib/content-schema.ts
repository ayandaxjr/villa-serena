/** Canonical list of every editable block on the public site */

export type ContentBlockDef = {
  key: string
  value: string
  type: 'text' | 'textarea' | 'image' | 'video'
  label: string
  section: string
}

export const SECTION_LABELS: Record<string, string> = {
  hero:     'Hero section',
  promise:  '01 — The Promise',
  estate:   '02 — The Estate',
  spaces:   '03 — The Spaces',
  land:     '04 — The Land',
  location: '05 — The Location',
  seasons:  '06 — The Seasons',
  wine:     '07 — The Cellar',
  gallery:  '08 — Gallery',
  booking:  'Booking',
  contact:  'Contact & Footer',
  nav:      'Navigation',
}

export const SECTION_ORDER = [
  'hero', 'promise', 'estate', 'spaces', 'land', 'location',
  'seasons', 'wine', 'gallery', 'booking', 'contact', 'nav',
]

export const CONTENT_SCHEMA: ContentBlockDef[] = [
  // Hero
  { key: 'hero_video_url',          value: '/hero-video.mp4',                                         type: 'video',    label: 'Background video (MP4)',          section: 'hero' },
  { key: 'hero_fallback_image_url', value: '/hero-image.jpg',                                         type: 'image',    label: 'Fallback image (if video fails)', section: 'hero' },
  { key: 'hero_label',              value: 'A Private Italian Estate',                                type: 'text',     label: 'Small label above title',         section: 'hero' },
  { key: 'hero_title',              value: 'Villa Serena',                                            type: 'text',     label: 'Main title',                      section: 'hero' },
  { key: 'hero_subtitle',           value: 'An Italian estate for fourteen. Between Rome & Florence.', type: 'textarea', label: 'Tagline / subtitle',             section: 'hero' },
  { key: 'hero_cta_primary',        value: 'Book a Viewing',                                          type: 'text',     label: 'Primary button text',             section: 'hero' },
  { key: 'hero_cta_secondary',      value: 'Discover the Estate',                                     type: 'text',     label: 'Secondary button text',           section: 'hero' },

  // Promise
  { key: 'promise_headline',        value: 'Some places you visit.',                                  type: 'text',     label: 'Headline (first line)',           section: 'promise' },
  { key: 'promise_headline_em',     value: 'This one, you inhabit.',                                  type: 'text',     label: 'Headline (italic emphasis)',      section: 'promise' },
  { key: 'promise_body',            value: "Villa Serena is a working Italian estate on the border of Umbria and Tuscany - with its own olive groves, a vineyard, and three separate homes that together welcome fourteen guests. You won't need to search for anything. Everything a group needs to truly be together - and still have space - is already here.", type: 'textarea', label: 'Body paragraph', section: 'promise' },

  // Estate
  { key: 'estate_headline',         value: 'A Visual Tour',                                           type: 'text',     label: 'Section headline',                section: 'estate' },
  { key: 'estate_description',      value: 'Every corner of Villa Serena tells a story. Walk the grounds, feel the light, and discover why this place stays with you long after you leave.', type: 'textarea', label: 'Section description', section: 'estate' },
  { key: 'estate_tour_video_url',   value: '',                                                      type: 'video',    label: 'Estate tour video (MP4) — removed per client brief', section: 'estate' },
  { key: 'estate_card_image_1',     value: '/photos/Villa_Serena_Ext_-30.jpg',                        type: 'image',    label: 'Grounds photo 1 — The Vineyard',          section: 'estate' },
  { key: 'estate_card_image_2',     value: '/photos/Villa_Serena_Ext_-12.jpg',                        type: 'image',    label: 'Grounds photo 2 — The Serene Pool',       section: 'estate' },
  { key: 'estate_card_image_3',     value: '/photos/Villa_Serena_Ext_-3.jpg',                         type: 'image',    label: 'Grounds photo 3 — The Entrance',          section: 'estate' },
  { key: 'estate_card_image_4',     value: '/photos/Villa_Serena_Ext_-1.jpg',                         type: 'image',    label: 'Grounds photo 4 — A casa',                  section: 'estate' },
  { key: 'estate_card_image_5',     value: '/photos/Villa_Serena_Ext_-65.jpg',                        type: 'image',    label: 'Grounds photo 5 — The Valley View',       section: 'estate' },
  { key: 'estate_card_image_6',     value: '/photos/Villa_Serena_Ext_-68.jpg',                        type: 'image',    label: 'Grounds photo 6 — Villa Serena Wines',    section: 'estate' },
  { key: 'estate_card_image_7',     value: '/photos/Villa_Serena_Ext_-63.jpg',                        type: 'image',    label: 'Grounds photo 7 — La terrassa',           section: 'estate' },

  // Spaces
  { key: 'spaces_headline',         value: 'Three homes. One estate.',                                type: 'text',     label: 'Section headline',                section: 'spaces' },
  { key: 'spaces_note',             value: 'All homes are also available separately - ideal for smaller groups who want the full estate experience.', type: 'textarea', label: 'Note below spaces', section: 'spaces' },
  { key: 'spaces_house_1_name',     value: 'The Main House',                                          type: 'text',     label: 'Space 1 — Name',                  section: 'spaces' },
  { key: 'spaces_house_1_desc',     value: 'The heart of the estate. Generous rooms, a fully equipped kitchen, and a living space where the whole group gathers. Where mornings begin and evenings end.', type: 'textarea', label: 'Space 1 — Description', section: 'spaces' },
  { key: 'spaces_house_1_image',    value: '/villa main interior.jpg',                                type: 'image',    label: 'Space 1 — Photo',                 section: 'spaces' },
  { key: 'spaces_house_2_name',     value: 'The West Apartment',                                      type: 'text',     label: 'Space 2 — Name',                  section: 'spaces' },
  { key: 'spaces_house_2_desc',     value: 'Quiet and independent, with its own entrance and full accessibility for guests with limited mobility. Perfect for those who want a moment apart - but never far away.', type: 'textarea', label: 'Space 2 — Description', section: 'spaces' },
  { key: 'spaces_house_2_image',    value: '/bed apatment.jpg',                                       type: 'image',    label: 'Space 2 — Photo',                 section: 'spaces' },
  { key: 'spaces_house_3_name',     value: 'The Cantina Apartment',                                   type: 'text',     label: 'Space 3 — Name',                  section: 'spaces' },
  { key: 'spaces_house_3_desc',     value: "Set in the estate's former wine cellar. Authentic stone walls, cool rooms, and a character all its own. For the guests who appreciate atmosphere.", type: 'textarea', label: 'Space 3 — Description', section: 'spaces' },
  { key: 'spaces_house_3_image',    value: '/villa couche.jpg',                                       type: 'image',    label: 'Space 3 — Photo',                 section: 'spaces' },

  // Land
  { key: 'land_background_image',   value: '/estate far.jpg',                                         type: 'image',    label: 'Full-width background photo',       section: 'land' },
  { key: 'land_headline',           value: "This isn't a holiday rental.",                            type: 'text',     label: 'Headline (first line)',           section: 'land' },
  { key: 'land_headline_em',        value: "It's an estate.",                                         type: 'text',     label: 'Headline (emphasis)',             section: 'land' },
  { key: 'land_body1',              value: "You'll taste the difference the moment you arrive. A bottle of wine from the estate's own vineyard waits for you. The olive oil on your table comes from the trees outside your window. The fields of I Romiti are open for walks. And perhaps - if it calls to you - a round at Golf Club Lamborghini.", type: 'textarea', label: 'First body paragraph', section: 'land' },
  { key: 'land_body2',              value: "Villa Serena is a working agricultural estate. The groves are tended, the olives are harvested, the wine is made. You're not a tourist here. For a while, you're a resident.", type: 'textarea', label: 'Second body paragraph', section: 'land' },
  { key: 'land_goodie_1_label',     value: 'Estate Wine',                                             type: 'text',     label: 'Highlight 1 — Label',             section: 'land' },
  { key: 'land_goodie_1_detail',    value: 'From our vineyard',                                       type: 'text',     label: 'Highlight 1 — Detail',            section: 'land' },
  { key: 'land_goodie_2_label',     value: 'Olive Oil',                                               type: 'text',     label: 'Highlight 2 — Label',             section: 'land' },
  { key: 'land_goodie_2_detail',    value: 'Pressed on site',                                         type: 'text',     label: 'Highlight 2 — Detail',            section: 'land' },
  { key: 'land_goodie_3_label',     value: 'I Romiti',                                                type: 'text',     label: 'Highlight 3 — Label',             section: 'land' },
  { key: 'land_goodie_3_detail',    value: 'Open fields to explore',                                  type: 'text',     label: 'Highlight 3 — Detail',            section: 'land' },
  { key: 'land_goodie_4_label',     value: 'Golf Club Lamborghini',                                   type: 'text',     label: 'Highlight 4 — Label',             section: 'land' },
  { key: 'land_goodie_4_detail',    value: 'Nearby',                                                  type: 'text',     label: 'Highlight 4 — Detail',            section: 'land' },

  // Location
  { key: 'location_headline',       value: 'Between two worlds',                                      type: 'text',     label: 'Section headline',                section: 'location' },
  { key: 'location_body1',          value: 'On the border of Umbria and Tuscany, exactly where the landscape shifts. Rome and Florence are each a drive away. Cortona is close enough for a morning, Città della Pieve for an afternoon.', type: 'textarea', label: 'First body paragraph', section: 'location' },
  { key: 'location_body2',          value: "You're not remote - you're strategic. In the heart of the Italy most tourists never find.", type: 'textarea', label: 'Second body paragraph', section: 'location' },
  { key: 'location_maps_url',       value: 'https://maps.google.com/?q=Villa+Serena+Umbria+Italy',   type: 'text',     label: 'Google Maps URL (directions)',    section: 'location' },

  // Seasons
  { key: 'seasons_headline',        value: 'Every season has its own light',                          type: 'text',     label: 'Section headline',                section: 'seasons' },
  { key: 'seasons_spring_desc',     value: 'The landscape at its greenest. Mild days, empty roads, and the first evenings spent outside. The perfect moment for those who want to taste Italy without the crowds.', type: 'textarea', label: 'Spring description', section: 'seasons' },
  { key: 'seasons_summer_desc',     value: "Golden heat, long evenings by the pool, and the scent of ripening olives in the air. This is the Italy of postcards - only it's real.", type: 'textarea', label: 'Summer description', section: 'seasons' },
  { key: 'seasons_late_summer_desc',value: 'The harvest begins. The light softens, the temperature drops, and the estate feels its most intimate. For those who know.', type: 'textarea', label: 'Late Summer description', section: 'seasons' },
  { key: 'seasons_note',            value: 'Pricing varies by season and group size. Get in touch for a tailored proposal.', type: 'textarea', label: 'Pricing / availability note', section: 'seasons' },
  { key: 'seasons_image_spring',    value: '/photos/35128d23-d934-4b13-8200-b78c53872d9a.jpg',        type: 'image',    label: 'Spring card photo',               section: 'seasons' },
  { key: 'seasons_image_summer',    value: '/photos/Main_Picture_Villa_Serena.jpg',                   type: 'image',    label: 'Summer card photo',               section: 'seasons' },
  { key: 'seasons_image_late',      value: '/photos/3d5c7ef8-729e-413f-bb87-6ec18c743d37.jpg',        type: 'image',    label: 'Late Summer card photo',          section: 'seasons' },

  // Wine
  { key: 'wine_headline',           value: 'From Our Vineyard to Your Table',                         type: 'text',     label: 'Section headline',                section: 'wine' },
  { key: 'wine_description',        value: 'Around Villa Serena lie the vineyards of the estate. During a stay you can taste and buy the wines on site – perfect for an aperitivo by the pool or an extensive dinner on the terrace.', type: 'textarea', label: 'Section introduction', section: 'wine' },
  { key: 'wine_1_name',             value: "L'Avvocato – Super Tuscan style",                         type: 'text',     label: 'Wine 1 — Name',                   section: 'wine' },
  { key: 'wine_1_type',             value: 'Red — Super Tuscan style',                                type: 'text',     label: 'Wine 1 — Type',                   section: 'wine' },
  { key: 'wine_1_year',             value: '2023',                                                    type: 'text',     label: 'Wine 1 — Year',                   section: 'wine' },
  { key: 'wine_1_desc',             value: 'A powerful, elegant blend of Merlot and Cabernet Sauvignon from Umbria, with 12 months aging on French oak. Complex, structured and made in small quantities (approximately 500 bottles). A wine with aging potential for lovers of the classic Super Tuscan style.', type: 'textarea', label: 'Wine 1 — Description', section: 'wine' },
  { key: 'wine_1_image',            value: '/photos/L_Avvocato.jpg',                                  type: 'image',    label: 'Wine 1 — Bottle photo',           section: 'wine' },
  { key: 'wine_2_name',             value: 'Il Colonnello – Sangiovese',                              type: 'text',     label: 'Wine 2 — Name',                   section: 'wine' },
  { key: 'wine_2_type',             value: 'Red — Sangiovese',                                        type: 'text',     label: 'Wine 2 — Type',                   section: 'wine' },
  { key: 'wine_2_year',             value: '2022',                                                    type: 'text',     label: 'Wine 2 — Year',                   section: 'wine' },
  { key: 'wine_2_desc',             value: 'This 100% Sangiovese from 2022 first aged a year on new oak and then a year on used wood. The tannins are beautifully balanced, the nose is fruity and the finish soft. An ideal companion for both red and white meat.', type: 'textarea', label: 'Wine 2 — Description', section: 'wine' },
  { key: 'wine_2_image',            value: '/photos/Villa_Serena_Ext_-66.jpg',                        type: 'image',    label: 'Wine 2 — Bottle photo',           section: 'wine' },
  { key: 'wine_3_name',             value: 'La Contessa – Grechetto',                                 type: 'text',     label: 'Wine 3 — Name',                   section: 'wine' },
  { key: 'wine_3_type',             value: 'White — Grechetto',                                       type: 'text',     label: 'Wine 3 — Type',                   section: 'wine' },
  { key: 'wine_3_year',             value: '2023',                                                    type: 'text',     label: 'Wine 3 — Year',                   section: 'wine' },
  { key: 'wine_3_desc',             value: 'A pure Grechetto, a white grape variety that is only grown around Lake Trasimeno. Harvest 2024, aged on stainless steel. The nose is fresh and mild, the taste soft with a nutty finish. Perfect with fish dishes and (vegetarian) pasta.', type: 'textarea', label: 'Wine 3 — Description', section: 'wine' },
  { key: 'wine_3_image',            value: '/photos/Villa_Serena_Ext_-67.jpg',                        type: 'image',    label: 'Wine 3 — Bottle photo',           section: 'wine' },

  // Gallery
  { key: 'gallery_image_1',         value: '/villa outside.jpg',                                      type: 'image',    label: 'Gallery photo 1',                 section: 'gallery' },
  { key: 'gallery_image_2',         value: '/villa sun.jpg',                                          type: 'image',    label: 'Gallery photo 2',                 section: 'gallery' },
  { key: 'gallery_image_3',         value: '/pool side 2.jpg',                                        type: 'image',    label: 'Gallery photo 3',                 section: 'gallery' },
  { key: 'gallery_image_4',         value: '/villa living room.jpg',                                  type: 'image',    label: 'Gallery photo 4',                 section: 'gallery' },
  { key: 'gallery_image_5',         value: '/villa kitchen.jpg',                                      type: 'image',    label: 'Gallery photo 5',                 section: 'gallery' },
  { key: 'gallery_image_6',         value: '/villa main bed.jpg',                                     type: 'image',    label: 'Gallery photo 6',                 section: 'gallery' },
  { key: 'gallery_image_7',         value: '/villa bath clean.jpg',                                   type: 'image',    label: 'Gallery photo 7',                 section: 'gallery' },
  { key: 'gallery_image_8',         value: '/villa night.jpg',                                        type: 'image',    label: 'Gallery photo 8',                 section: 'gallery' },

  // Booking
  { key: 'booking_headline',        value: 'Plan your stay',                                          type: 'text',     label: 'Section headline',                section: 'booking' },
  { key: 'booking_description',     value: 'Select your dates and send an inquiry. We will confirm availability within 24 hours.', type: 'textarea', label: 'Section description', section: 'booking' },

  // Contact & Footer
  { key: 'contact_phone',           value: '+31 06 44 83 33 30',                                      type: 'text',     label: 'WhatsApp / phone number',         section: 'contact' },
  { key: 'contact_email',           value: 'info@villa-serena.nl',                                    type: 'text',     label: 'Email address',                   section: 'contact' },
  { key: 'contact_instagram_url',   value: 'https://instagram.com/villaserena',                       type: 'text',     label: 'Instagram URL',                   section: 'contact' },
  { key: 'footer_email',            value: 'info@villa-serena.nl',                                    type: 'text',     label: 'Footer email address',            section: 'contact' },
  { key: 'footer_credit_name',      value: 'VILATECH',                                                type: 'text',     label: 'Footer "Design by" credit name',  section: 'contact' },

  // Navigation
  { key: 'nav_logo',                value: 'Villa Serena',                                            type: 'text',     label: 'Navbar logo text',                section: 'nav' },
  { key: 'nav_cta',                 value: 'Enquire',                                                 type: 'text',     label: 'Navbar button text',              section: 'nav' },
]

export type ContentBlock = {
  key: string
  value: string | null
  type: string
  label: string
  section: string
}

/** Merge DB rows with schema — schema always wins for metadata, DB wins for values */
export function mergeContentBlocks(dbRows: ContentBlock[]): ContentBlock[] {
  const dbMap = new Map(dbRows.map(r => [r.key, r.value]))
  return CONTENT_SCHEMA.map(def => ({
    key: def.key,
    value: dbMap.has(def.key) ? (dbMap.get(def.key) ?? def.value) : def.value,
    type: def.type,
    label: def.label,
    section: def.section,
  }))
}

export function groupBlocks(blocks: ContentBlock[]): Record<string, ContentBlock[]> {
  return blocks.reduce<Record<string, ContentBlock[]>>((acc, b) => {
    acc[b.section] = [...(acc[b.section] ?? []), b]
    return acc
  }, {})
}
