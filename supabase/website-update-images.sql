-- Villa Serena — Website Update Brief (image + wine text paths)
-- Run in Supabase SQL Editor after content-migration.sql

update site_content set value = '' where key = 'estate_tour_video_url';

-- Estate carousel (A Visual Tour)
update site_content set value = '/photos/Villa_Serena_Ext_-30.jpg' where key = 'estate_card_image_1';
update site_content set value = '/photos/Villa_Serena_Ext_-12.jpg' where key = 'estate_card_image_2';
update site_content set value = '/photos/Villa_Serena_Ext_-3.jpg'  where key = 'estate_card_image_3';
update site_content set value = '/photos/Villa_Serena_Ext_-1.jpg'  where key = 'estate_card_image_4';
update site_content set value = '/photos/Villa_Serena_Ext_-65.jpg' where key = 'estate_card_image_5';
update site_content set value = '/photos/Villa_Serena_Ext_-68.jpg' where key = 'estate_card_image_6';
update site_content set value = '/photos/Villa_Serena_Ext_-63.jpg' where key = 'estate_card_image_7';

-- Seasons
update site_content set value = '/photos/35128d23-d934-4b13-8200-b78c53872d9a.jpg' where key = 'seasons_image_spring';
update site_content set value = '/photos/Main_Picture_Villa_Serena.jpg'             where key = 'seasons_image_summer';
update site_content set value = '/photos/3d5c7ef8-729e-413f-bb87-6ec18c743d37.jpg' where key = 'seasons_image_late';

-- Wine section
update site_content set value = '/photos/L_Avvocato.jpg'            where key = 'wine_1_image';
update site_content set value = '/photos/Villa_Serena_Ext_-66.jpg'  where key = 'wine_2_image';
update site_content set value = '/photos/Villa_Serena_Ext_-67.jpg'  where key = 'wine_3_image';
update site_content set value = 'L''Avvocato – Super Tuscan style'  where key = 'wine_1_name';
update site_content set value = 'Il Colonnello – Sangiovese'        where key = 'wine_2_name';
update site_content set value = 'La Contessa – Grechetto'           where key = 'wine_3_name';
update site_content set value = 'A powerful, elegant blend of Merlot and Cabernet Sauvignon from Umbria, with 12 months aging on French oak. Complex, structured and made in small quantities (approximately 500 bottles). A wine with aging potential for lovers of the classic Super Tuscan style.' where key = 'wine_1_desc';
update site_content set value = 'This 100% Sangiovese from 2022 first aged a year on new oak and then a year on used wood. The tannins are beautifully balanced, the nose is fruity and the finish soft. An ideal companion for both red and white meat.' where key = 'wine_2_desc';
update site_content set value = 'A pure Grechetto, a white grape variety that is only grown around Lake Trasimeno. Harvest 2024, aged on stainless steel. The nose is fresh and mild, the taste soft with a nutty finish. Perfect with fish dishes and (vegetarian) pasta.' where key = 'wine_3_desc';
