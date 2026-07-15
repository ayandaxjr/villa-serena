-- ═══════════════════════════════════════════════════════════════════
-- Villa Serena — Site Content Table & Storage
-- Run once in: Supabase Dashboard → SQL Editor → New query → Run
-- ═══════════════════════════════════════════════════════════════════

-- ─── Drop & recreate for clean state (idempotent) ────────────────
create table if not exists site_content (
  key         text primary key,
  value       text,
  type        text not null default 'text',  -- 'text' | 'textarea' | 'image'
  label       text not null,
  section     text not null,
  updated_at  timestamptz not null default now()
);

-- ─── Row Level Security ───────────────────────────────────────────
alter table site_content enable row level security;

-- Public website can READ all content
drop policy if exists "Public read site_content" on site_content;
create policy "Public read site_content" on site_content
  for select using (true);

-- Only service_role can write (admin uses service role via API routes)
-- No insert/update policies needed — service role bypasses RLS entirely

-- ─── Storage bucket for uploaded images & videos ─────────────────
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
  values (
    'site-images',
    'site-images',
    true,
    524288000,  -- 500 MB limit per file
    array['image/jpeg','image/jpg','image/png','image/webp','image/gif','video/mp4','video/webm','video/quicktime']
  )
  on conflict (id) do update set
    public = true,
    file_size_limit = 524288000,
    allowed_mime_types = array['image/jpeg','image/jpg','image/png','image/webp','image/gif','video/mp4','video/webm','video/quicktime'];

-- Public can read/download from bucket
drop policy if exists "Public read site-images" on storage.objects;
create policy "Public read site-images"
  on storage.objects for select
  using (bucket_id = 'site-images');

-- ═══════════════════════════════════════════════════════════════════
-- SEED — All editable content blocks
-- Values below are defaults. The CMS overwrites them when saved.
-- ═══════════════════════════════════════════════════════════════════

insert into site_content (key, value, type, label, section) values

-- ── HERO ──────────────────────────────────────────────────────────
('hero_video_url',          '/hero-video.mp4',                                         'image',    'Background video (MP4)',         'hero'),
('hero_fallback_image_url', '/hero-image.jpg',                                         'image',    'Fallback image (if video fails)', 'hero'),
('hero_label',              'A Private Italian Estate',                                'text',     'Small label above title',        'hero'),
('hero_title',              'Villa Serena',                                            'text',     'Main title',                     'hero'),
('hero_subtitle',           'An Italian estate for fourteen. Between Rome & Florence.','textarea', 'Tagline / subtitle',             'hero'),
('hero_cta_primary',        'Book a Viewing',                                          'text',     'Primary button text',            'hero'),
('hero_cta_secondary',      'Discover the Estate',                                     'text',     'Secondary button text',          'hero'),

-- ── PROMISE (01) ──────────────────────────────────────────────────
('promise_headline',        'Some places you visit.',                                  'text',     'Headline (first line)',           'promise'),
('promise_headline_em',     'This one, you inhabit.',                                  'text',     'Headline (italic emphasis)',      'promise'),
('promise_body',            'Villa Serena is a working Italian estate on the border of Umbria and Tuscany - with its own olive groves, a vineyard, and three separate homes that together welcome fourteen guests. You won''t need to search for anything. Everything a group needs to truly be together - and still have space - is already here.',
                                                                                       'textarea', 'Body paragraph',                 'promise'),

-- ── ESTATE (02) ───────────────────────────────────────────────────
('estate_headline',         'A Visual Tour',                                           'text',     'Section headline',               'estate'),
('estate_description',      'Every corner of Villa Serena tells a story. Walk the grounds, feel the light, and discover why this place stays with you long after you leave.',
                                                                                       'textarea', 'Section description',            'estate'),
('estate_tour_video_url',   '/video/estate-tour.mp4',                                 'image',    'Estate tour video (MP4)',        'estate'),
('estate_card_image_1',     '/villa outside.jpg',                                      'image',    'Grounds photo 1 — The Olive Grove',    'estate'),
('estate_card_image_2',     '/pool side.jpg',                                          'image',    'Grounds photo 2 — The Pool',           'estate'),
('estate_card_image_3',     '/villa area chill.jpg',                                   'image',    'Grounds photo 3 — The Terrace',        'estate'),
('estate_card_image_4',     '/vineyard.jpg',                                           'image',    'Grounds photo 4 — The Vineyard',       'estate'),
('estate_card_image_5',     '/estate far.jpg',                                         'image',    'Grounds photo 5 — The Valley View',    'estate'),
('estate_card_image_6',     '/villa driveway.jpg',                                     'image',    'Grounds photo 6 — The Stone Courtyard','estate'),
('estate_card_image_7',     '/villa sun shine.jpg',                                    'image',    'Grounds photo 7 — The Kitchen Garden', 'estate'),

-- ── SPACES (03) ───────────────────────────────────────────────────
('spaces_headline',         'Three homes. One estate.',                                'text',     'Section headline',               'spaces'),
('spaces_note',             'All homes are also available separately - ideal for smaller groups who want the full estate experience.',
                                                                                       'textarea', 'Note below spaces',              'spaces'),
('spaces_house_1_name',     'The Main House',                                          'text',     'Space 1 — Name',                 'spaces'),
('spaces_house_1_desc',     'The heart of the estate. Generous rooms, a fully equipped kitchen, and a living space where the whole group gathers. Where mornings begin and evenings end.',
                                                                                       'textarea', 'Space 1 — Description',          'spaces'),
('spaces_house_2_name',     'The West Apartment',                                      'text',     'Space 2 — Name',                 'spaces'),
('spaces_house_2_desc',     'Quiet and independent, with its own entrance and full accessibility for guests with limited mobility. Perfect for those who want a moment apart - but never far away.',
                                                                                       'textarea', 'Space 2 — Description',          'spaces'),
('spaces_house_3_name',     'The Cantina Apartment',                                   'text',     'Space 3 — Name',                 'spaces'),
('spaces_house_3_desc',     'Set in the estate''s former wine cellar. Authentic stone walls, cool rooms, and a character all its own. For the guests who appreciate atmosphere.',
                                                                                       'textarea', 'Space 3 — Description',          'spaces'),

-- ── LAND (04) ─────────────────────────────────────────────────────
('land_headline',           'This isn''t a holiday rental.',                           'text',     'Section headline (first line)',   'land'),
('land_headline_em',        'It''s an estate.',                                        'text',     'Section headline (emphasis)',     'land'),
('land_body1',              'You''ll taste the difference the moment you arrive. A bottle of wine from the estate''s own vineyard waits for you. The olive oil on your table comes from the trees outside your window. The fields of I Romiti are open for walks. And perhaps - if it calls to you - a round at Golf Club Lamborghini.',
                                                                                       'textarea', 'First body paragraph',           'land'),
('land_body2',              'Villa Serena is a working agricultural estate. The groves are tended, the olives are harvested, the wine is made. You''re not a tourist here. For a while, you''re a resident.',
                                                                                       'textarea', 'Second body paragraph',          'land'),

-- ── LOCATION (05) ─────────────────────────────────────────────────
('location_headline',       'Between two worlds',                                      'text',     'Section headline',               'location'),
('location_body1',          'On the border of Umbria and Tuscany, exactly where the landscape shifts. Rome and Florence are each a drive away. Cortona is close enough for a morning, Città della Pieve for an afternoon.',
                                                                                       'textarea', 'First body paragraph',           'location'),
('location_body2',          'You''re not remote - you''re strategic. In the heart of the Italy most tourists never find.',
                                                                                       'textarea', 'Second body paragraph',          'location'),
('location_maps_url',       'https://maps.google.com/?q=Villa+Serena+Umbria+Italy',   'text',     'Google Maps URL (directions)',   'location'),

-- ── SEASONS (06) ──────────────────────────────────────────────────
('seasons_headline',        'Every season has its own light',                          'text',     'Section headline',               'seasons'),
('seasons_spring_desc',     'The landscape at its greenest. Mild days, empty roads, and the first evenings spent outside. The perfect moment for those who want to taste Italy without the crowds.',
                                                                                       'textarea', 'Spring description',             'seasons'),
('seasons_summer_desc',     'Golden heat, long evenings by the pool, and the scent of ripening olives in the air. This is the Italy of postcards - only it''s real.',
                                                                                       'textarea', 'Summer description',             'seasons'),
('seasons_late_summer_desc','The harvest begins. The light softens, the temperature drops, and the estate feels its most intimate. For those who know.',
                                                                                       'textarea', 'Late Summer description',        'seasons'),
('seasons_note',            'Pricing varies by season and group size. Get in touch for a tailored proposal.',
                                                                                       'textarea', 'Pricing / availability note',   'seasons'),

-- ── WINE (07) ─────────────────────────────────────────────────────
('wine_headline',           'From Our Vineyard to Your Table',                         'text',     'Section headline',               'wine'),
('wine_description',        'Around Villa Serena lie the vineyards of the estate. During a stay you can taste and buy the wines on site – perfect for an aperitivo by the pool or an extensive dinner on the terrace.',
                                                                                       'textarea', 'Section introduction',           'wine'),
('wine_1_name',             'L''Avvocato',                                             'text',     'Wine 1 — Name',                  'wine'),
('wine_1_type',             'Red — Super Tuscan style',                                'text',     'Wine 1 — Type',                  'wine'),
('wine_1_desc',             'A powerful, elegant blend of Merlot and Cabernet Sauvignon from Umbria, with 12 months aging on French oak. Complex, structured and made in small quantities (approximately 500 bottles). A wine with aging potential for lovers of the classic Super Tuscan style.',
                                                                                       'textarea', 'Wine 1 — Description',           'wine'),
('wine_2_name',             'Il Colonnello',                                           'text',     'Wine 2 — Name',                  'wine'),
('wine_2_type',             'Red — Sangiovese',                                        'text',     'Wine 2 — Type',                  'wine'),
('wine_2_desc',             'This 100% Sangiovese from 2022 first aged a year on new oak and then a year on used wood. The tannins are beautifully balanced, the nose is fruity and the finish soft. An ideal companion for both red and white meat.',
                                                                                       'textarea', 'Wine 2 — Description',           'wine'),
('wine_3_name',             'Greggetho',                                               'text',     'Wine 3 — Name',                  'wine'),
('wine_3_type',             'White — Grechetto',                                       'text',     'Wine 3 — Type',                  'wine'),
('wine_3_desc',             'A pure Grechetto, a white grape variety that is only grown around Lake Trasimeno. Harvest 2024, aged on stainless steel. The nose is fresh and mild, the taste soft with a nutty finish. Perfect with fish dishes and (vegetarian) pasta.',
                                                                                       'textarea', 'Wine 3 — Description',           'wine'),

-- ── GALLERY (08) ──────────────────────────────────────────────────
('gallery_image_1',         '/villa outside.jpg',                                      'image',    'Gallery photo 1',                'gallery'),
('gallery_image_2',         '/villa sun.jpg',                                          'image',    'Gallery photo 2',                'gallery'),
('gallery_image_3',         '/pool side 2.jpg',                                        'image',    'Gallery photo 3',                'gallery'),
('gallery_image_4',         '/villa living room.jpg',                                  'image',    'Gallery photo 4',                'gallery'),
('gallery_image_5',         '/villa kitchen.jpg',                                      'image',    'Gallery photo 5',                'gallery'),
('gallery_image_6',         '/villa main bed.jpg',                                     'image',    'Gallery photo 6',                'gallery'),
('gallery_image_7',         '/villa bath clean.jpg',                                   'image',    'Gallery photo 7',                'gallery'),
('gallery_image_8',         '/villa night.jpg',                                        'image',    'Gallery photo 8',                'gallery'),

-- ── CONTACT & FOOTER ──────────────────────────────────────────────
('contact_phone',           '+31 06 44 83 33 30',                                      'text',     'WhatsApp / phone number',        'contact'),
('contact_email',           'info@villa-serena.nl',                                    'text',     'Email address',                  'contact'),
('contact_instagram_url',   'https://instagram.com/villaserena',                       'text',     'Instagram URL',                  'contact'),
('footer_email',            'info@villa-serena.nl',                                    'text',     'Footer email address',           'contact'),
('footer_credit_name',      'VILATECH',                                                'text',     'Footer "Design by" credit name', 'contact')

on conflict (key) do update set
  label      = excluded.label,
  section    = excluded.section,
  type       = excluded.type,
  -- Do NOT overwrite value — keep whatever the admin has already saved
  updated_at = site_content.updated_at;
