/* ─── Site Content — fetched from Supabase, fallback to defaults ── */

export type SiteContent = {
  // Hero
  hero_video_url:          string
  hero_fallback_image_url: string
  hero_label:              string
  hero_title:              string
  hero_subtitle:           string
  hero_cta_primary:        string
  hero_cta_secondary:      string
  // Promise
  promise_headline:        string
  promise_headline_em:     string
  promise_body:            string
  // Estate
  estate_headline:         string
  estate_description:      string
  estate_tour_video_url:   string
  estate_card_image_1:     string
  estate_card_image_2:     string
  estate_card_image_3:     string
  estate_card_image_4:     string
  estate_card_image_5:     string
  estate_card_image_6:     string
  estate_card_image_7:     string
  // Spaces
  spaces_headline:         string
  spaces_note:             string
  spaces_house_1_name:     string
  spaces_house_1_desc:     string
  spaces_house_1_image:    string
  spaces_house_2_name:     string
  spaces_house_2_desc:     string
  spaces_house_2_image:    string
  spaces_house_3_name:     string
  spaces_house_3_desc:     string
  spaces_house_3_image:    string
  // Land
  land_background_image:   string
  land_headline:           string
  land_headline_em:        string
  land_body1:              string
  land_body2:              string
  land_goodie_1_label:     string
  land_goodie_1_detail:    string
  land_goodie_2_label:     string
  land_goodie_2_detail:    string
  land_goodie_3_label:     string
  land_goodie_3_detail:    string
  land_goodie_4_label:     string
  land_goodie_4_detail:    string
  // Location
  location_headline:       string
  location_body1:          string
  location_body2:          string
  location_maps_url:       string
  // Seasons
  seasons_headline:        string
  seasons_spring_desc:     string
  seasons_summer_desc:     string
  seasons_late_summer_desc:string
  seasons_note:            string
  seasons_image_spring:    string
  seasons_image_summer:    string
  seasons_image_late:      string
  // Wine
  wine_headline:           string
  wine_description:        string
  wine_1_name:             string
  wine_1_type:             string
  wine_1_year:             string
  wine_1_desc:             string
  wine_1_image:            string
  wine_2_name:             string
  wine_2_type:             string
  wine_2_year:             string
  wine_2_desc:             string
  wine_2_image:            string
  wine_3_name:             string
  wine_3_type:             string
  wine_3_year:             string
  wine_3_desc:             string
  wine_3_image:            string
  // Gallery
  gallery_image_1:         string
  gallery_image_2:         string
  gallery_image_3:         string
  gallery_image_4:         string
  gallery_image_5:         string
  gallery_image_6:         string
  gallery_image_7:         string
  gallery_image_8:         string
  // Booking
  booking_headline:        string
  booking_description:     string
  // Contact
  contact_phone:           string
  contact_email:           string
  contact_instagram_url:   string
  footer_email:            string
  footer_credit_name:      string
  // Nav
  nav_logo:                string
  nav_cta:                 string
}

/** Hardcoded fallbacks — used if DB is unavailable or key not yet set */
export const CONTENT_DEFAULTS: SiteContent = {
  hero_video_url:           '/hero-video-web.mp4',
  hero_fallback_image_url:  '/hero-image.jpg',
  hero_label:               'A Private Italian Estate',
  hero_title:               'Villa Serena',
  hero_subtitle:            'An Italian estate for fourteen. Between Rome & Florence.',
  hero_cta_primary:         'Book a Viewing',
  hero_cta_secondary:       'Discover the Estate',
  promise_headline:         'Some places you visit.',
  promise_headline_em:      'This one, you inhabit.',
  promise_body:             "Villa Serena is a working Italian estate on the border of Umbria and Tuscany - with its own olive groves, a vineyard, and three separate homes that together welcome fourteen guests. You won't need to search for anything. Everything a group needs to truly be together - and still have space - is already here.",
  estate_headline:          'A Visual Tour',
  estate_description:       'Every corner of Villa Serena tells a story. Walk the grounds, feel the light, and discover why this place stays with you long after you leave.',
  estate_tour_video_url:    '',
  estate_card_image_1:      '/photos/Villa_Serena_Ext_-30.jpg',
  estate_card_image_2:      '/photos/Villa_Serena_Ext_-12.jpg',
  estate_card_image_3:      '/photos/Villa_Serena_Ext_-3.jpg',
  estate_card_image_4:      '/photos/Villa_Serena_Ext_-1.jpg',
  estate_card_image_5:      '/photos/Villa_Serena_Ext_-65.jpg',
  estate_card_image_6:      '/photos/Villa_Serena_Ext_-68.jpg',
  estate_card_image_7:      '/photos/Villa_Serena_Ext_-63.jpg',
  spaces_headline:          'Three homes. One estate.',
  spaces_note:              'All homes are also available separately - ideal for smaller groups who want the full estate experience.',
  spaces_house_1_name:      'The Main House',
  spaces_house_1_desc:      'The heart of the estate. Generous rooms, a fully equipped kitchen, and a living space where the whole group gathers. Where mornings begin and evenings end.',
  spaces_house_1_image:       '/villa main interior.jpg',
  spaces_house_2_name:      'The West Apartment',
  spaces_house_2_desc:      "Quiet and independent, with its own entrance and full accessibility for guests with limited mobility. Perfect for those who want a moment apart - but never far away.",
  spaces_house_2_image:       '/bed apatment.jpg',
  spaces_house_3_name:      'The Cantina Apartment',
  spaces_house_3_desc:      "Set in the estate's former wine cellar. Authentic stone walls, cool rooms, and a character all its own. For the guests who appreciate atmosphere.",
  spaces_house_3_image:       '/villa couche.jpg',
  land_background_image:    '/estate far.jpg',
  land_headline:            "This isn't a holiday rental.",
  land_headline_em:         "It's an estate.",
  land_body1:               "You'll taste the difference the moment you arrive. A bottle of wine from the estate's own vineyard waits for you. The olive oil on your table comes from the trees outside your window. The fields of I Romiti are open for walks. And perhaps - if it calls to you - a round at Golf Club Lamborghini.",
  land_body2:               "Villa Serena is a working agricultural estate. The groves are tended, the olives are harvested, the wine is made. You're not a tourist here. For a while, you're a resident.",
  land_goodie_1_label:      'Estate Wine',
  land_goodie_1_detail:     'From our vineyard',
  land_goodie_2_label:      'Olive Oil',
  land_goodie_2_detail:     'Pressed on site',
  land_goodie_3_label:      'I Romiti',
  land_goodie_3_detail:     'Open fields to explore',
  land_goodie_4_label:      'Golf Club Lamborghini',
  land_goodie_4_detail:     'Nearby',
  location_headline:        'Between two worlds',
  location_body1:           "On the border of Umbria and Tuscany, exactly where the landscape shifts. Rome and Florence are each a drive away. Cortona is close enough for a morning, Città della Pieve for an afternoon.",
  location_body2:           "You're not remote - you're strategic. In the heart of the Italy most tourists never find.",
  location_maps_url:        'https://maps.google.com/?q=Villa+Serena+Umbria+Italy',
  seasons_headline:         'Every season has its own light',
  seasons_spring_desc:      'The landscape at its greenest. Mild days, empty roads, and the first evenings spent outside. The perfect moment for those who want to taste Italy without the crowds.',
  seasons_summer_desc:      "Golden heat, long evenings by the pool, and the scent of ripening olives in the air. This is the Italy of postcards - only it's real.",
  seasons_late_summer_desc: 'The harvest begins. The light softens, the temperature drops, and the estate feels its most intimate. For those who know.',
  seasons_note:             'Pricing varies by season and group size. Get in touch for a tailored proposal.',
  seasons_image_spring:     '/photos/35128d23-d934-4b13-8200-b78c53872d9a.jpg',
  seasons_image_summer:     '/photos/Main_Picture_Villa_Serena.jpg',
  seasons_image_late:       '/photos/3d5c7ef8-729e-413f-bb87-6ec18c743d37.jpg',
  wine_headline:            'From Our Vineyard to Your Table',
  wine_description:         'Around Villa Serena lie the vineyards of the estate. During a stay you can taste and buy the wines on site – perfect for an aperitivo by the pool or an extensive dinner on the terrace.',
  wine_1_name:              "L'Avvocato",
  wine_1_type:              'Super Tuscan style',
  wine_1_year:              '2023',
  wine_1_desc:              'A powerful, elegant blend of Merlot and Cabernet Sauvignon from Umbria, with 12 months aging on French oak. Complex, structured and made in small quantities (approximately 500 bottles). A wine with aging potential for lovers of the classic Super Tuscan style.',
  wine_1_image:             '/photos/L_Avvocato.jpg',
  wine_2_name:              'Il Colonnello',
  wine_2_type:              'Sangiovese',
  wine_2_year:              '2022',
  wine_2_desc:              'This 100% Sangiovese from 2022 first aged a year on new oak and then a year on used wood. The tannins are beautifully balanced, the nose is fruity and the finish soft. An ideal companion for both red and white meat.',
  wine_2_image:             '/photos/Villa_Serena_Ext_-66.jpg',
  wine_3_name:              'La Contessa',
  wine_3_type:              'Grechetto',
  wine_3_year:              '2023',
  wine_3_desc:              'A pure Grechetto, a white grape variety that is only grown around Lake Trasimeno. Harvest 2024, aged on stainless steel. The nose is fresh and mild, the taste soft with a nutty finish. Perfect with fish dishes and (vegetarian) pasta.',
  wine_3_image:             '/photos/Villa_Serena_Ext_-67.jpg',
  gallery_image_1:          '/villa outside.jpg',
  gallery_image_2:          '/villa sun.jpg',
  gallery_image_3:          '/pool side 2.jpg',
  gallery_image_4:          '/villa living room.jpg',
  gallery_image_5:          '/villa kitchen.jpg',
  gallery_image_6:          '/villa main bed.jpg',
  gallery_image_7:          '/villa bath clean.jpg',
  gallery_image_8:          '/villa night.jpg',
  booking_headline:         'Plan your stay',
  booking_description:      'Select your dates and send an inquiry. We will confirm availability within 24 hours.',
  contact_phone:            '+31 06 44 83 33 30',
  contact_email:            'info@villa-serena.nl',
  contact_instagram_url:    'https://instagram.com/villaserena',
  footer_email:             'info@villa-serena.nl',
  footer_credit_name:       'VILATECH',
  nav_logo:                 'Villa Serena',
  nav_cta:                  'Enquire',
}

/**
 * Server-side: fetch all site content from Supabase.
 * Falls back to CONTENT_DEFAULTS if DB is unreachable or a key is missing/empty.
 * Uses the anon key with public read RLS — no auth needed for site_content.
 */
export async function getSiteContent(): Promise<SiteContent> {
  try {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    if (!url || !key) return CONTENT_DEFAULTS

    const { createClient } = await import('@supabase/supabase-js')
    const supabase = createClient(url, key, {
      auth: { persistSession: false, autoRefreshToken: false },
      global: { fetch: fetch.bind(globalThis) },
    })

    const { data, error } = await supabase.from('site_content').select('key, value')
    if (error || !data) return CONTENT_DEFAULTS

    // Merge: DB values override defaults; empty/null/blank values use defaults
    const fromDB = data.reduce<Record<string, string>>((acc, row) => {
      if (row.value && row.value.trim() !== '') acc[row.key] = row.value
      return acc
    }, {})

    return { ...CONTENT_DEFAULTS, ...fromDB } as SiteContent
  } catch {
    return CONTENT_DEFAULTS
  }
}
