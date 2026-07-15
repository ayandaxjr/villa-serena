-- ═══════════════════════════════════════════════════════════════════
-- Villa Serena — Content CMS patch (run after content-migration.sql)
-- Adds new editable fields + fixes video types
-- Supabase Dashboard → SQL Editor → Run
-- ═══════════════════════════════════════════════════════════════════

-- Fix video field types
update site_content set type = 'video' where key in ('hero_video_url', 'estate_tour_video_url');

insert into site_content (key, value, type, label, section) values

-- Spaces images
('spaces_house_1_image',    '/villa main interior.jpg',                                'image',    'Space 1 — Photo',                 'spaces'),
('spaces_house_2_image',    '/bed apatment.jpg',                                       'image',    'Space 2 — Photo',                 'spaces'),
('spaces_house_3_image',    '/villa couche.jpg',                                       'image',    'Space 3 — Photo',                 'spaces'),

-- Land
('land_background_image',   '/estate far.jpg',                                         'image',    'Full-width background photo',       'land'),
('land_goodie_1_label',     'Estate Wine',                                             'text',     'Highlight 1 — Label',             'land'),
('land_goodie_1_detail',    'From our vineyard',                                       'text',     'Highlight 1 — Detail',            'land'),
('land_goodie_2_label',     'Olive Oil',                                               'text',     'Highlight 2 — Label',             'land'),
('land_goodie_2_detail',    'Pressed on site',                                         'text',     'Highlight 2 — Detail',            'land'),
('land_goodie_3_label',     'I Romiti',                                                'text',     'Highlight 3 — Label',             'land'),
('land_goodie_3_detail',    'Open fields to explore',                                  'text',     'Highlight 3 — Detail',            'land'),
('land_goodie_4_label',     'Golf Club Lamborghini',                                   'text',     'Highlight 4 — Label',             'land'),
('land_goodie_4_detail',    'Nearby',                                                  'text',     'Highlight 4 — Detail',            'land'),

-- Seasons images
('seasons_image_spring',    '/villa sun.jpg',                                          'image',    'Spring card photo',               'seasons'),
('seasons_image_summer',    '/pool sode top.jpg',                                      'image',    'Summer card photo',               'seasons'),
('seasons_image_late',      '/villa night.jpg',                                        'image',    'Late Summer card photo',          'seasons'),

-- Wine images + years
('wine_1_year',             '2023',                                                    'text',     'Wine 1 — Year',                   'wine'),
('wine_1_image',            '/wine 1.jpg',                                             'image',    'Wine 1 — Bottle photo',           'wine'),
('wine_2_year',             '2022',                                                    'text',     'Wine 2 — Year',                   'wine'),
('wine_2_image',            '/wine 2.jpg',                                             'image',    'Wine 2 — Bottle photo',           'wine'),
('wine_3_year',             '2023',                                                    'text',     'Wine 3 — Year',                   'wine'),
('wine_3_image',            '/wine 3.jpg',                                             'image',    'Wine 3 — Bottle photo',           'wine'),

-- Booking
('booking_headline',        'Plan your stay',                                          'text',     'Section headline',                'booking'),
('booking_description',     'Select your dates and send an inquiry. We will confirm availability within 24 hours.', 'textarea', 'Section description', 'booking'),

-- Navigation
('nav_logo',                'Villa Serena',                                            'text',     'Navbar logo text',                'nav'),
('nav_cta',                 'Enquire',                                                 'text',     'Navbar button text',              'nav')

on conflict (key) do update set
  label      = excluded.label,
  section    = excluded.section,
  type       = excluded.type,
  updated_at = site_content.updated_at;
