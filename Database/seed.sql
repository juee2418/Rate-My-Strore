-- ===================================================
-- Store Rating App — Seed Data
-- ===================================================

USE store_rating_db;

-- ---------------------------------------------------
-- USERS
-- ---------------------------------------------------

INSERT INTO users
(id, name, email, password, address, role, created_at)
VALUES
(1, 'Default System Administrator Account',
 'admin@example.com',
 '$2a$10$y/wDNjyqn/Whyu6deeOwAe6m2XUqNc833dDvw2kXdsP5/XrDqtJ3.',
 'Head Office, Admin Street',
 'admin',
 '2026-08-13 15:12:06'),

(2, 'Jueeeee Ashwiniiiii Sachinnnn bhosaleeeee',
 'jueebhosale18@gmail.com',
 '$2a$10$HR9WTyJ6DiZIZCNFegD1x.seo6NAnx8oGYFA.UqabFpvFHUdxXisS',
 'Panhala',
 'normal_user',
 '2026-08-13 15:23:19'),

(4, 'Rucha  bhosaleeeeeeeeeeeee',
 'vish@gmail.com',
 '$2a$10$0piw1TPsqtfxpx/hyNI/n.tGIk48WiVhD4qbQfw.QqD6/jDdWaYsK',
 'pune',
 'normal_user',
 '2026-08-14 00:17:39'),

(5, 'jueeeeeeeeeee bhosale',
 'jueebhosale42@gmail.com',
 '$2a$10$BVXKu4Opp86im/A/fZZmb.3VhifQfi5E1I4pyADueDEiyw0wv0Nr6',
 'pune',
 'store_owner',
 '2026-08-14 00:36:14'),

(6, 'Rucha Sachin Bhosale',
 'rucha18@gmail.com',
 '$2a$10$uSGLQvUW8qXMkyXguePffO9sCyrDvdUfUbL16DxAfs1J1QgneP8Gi',
 'Panhala',
 'normal_user',
 '2026-08-14 13:38:56'),

(7, 'Kasav Bhosale',
 'kasav@gmail.com',
 '$2a$10$JXetSPMLRZrB9GRaSje4xOkEJT6guG9ug90tBcUa3kL7GSAPr7M.2',
 'Pune',
 'store_owner',
 '2026-08-14 14:04:58'),

(8, 'saloni mandale',
 'saloni@gmail.com',
 '$2a$10$TmdNkHiEY.Nl6dIRsoP4F.GPWNXA3PAZudz8LXH58DIbv8v3x1K06',
 'sangali',
 'normal_user',
 '2026-08-14 14:17:22');

-- ---------------------------------------------------
-- STORES
-- ---------------------------------------------------

INSERT INTO stores
(id, name, email, address, owner_id, created_at)
VALUES
(2, 'Vishwa', 'vish18@gmail.com', 'Solapur', NULL, '2026-08-14 00:00:53'),

(3, 'bhosale', NULL, 'panhala', 5, '2026-08-14 01:13:11'),

(5, 'Kasav', NULL, 'Pune', 7, '2026-08-14 14:05:39');

-- ---------------------------------------------------
-- RATINGS
-- ---------------------------------------------------

INSERT INTO ratings
(id, user_id, store_id, rating, created_at, updated_at)
VALUES
(6, 2, 3, 4, '2026-08-14 01:14:27', '2026-08-14 01:14:27'),

(7, 2, 5, 4, '2026-08-14 14:06:20', '2026-08-14 14:06:20'),

(8, 8, 5, 1, '2026-08-14 14:17:26', '2026-08-14 14:17:26');

-- ---------------------------------------------------
-- Reset AUTO_INCREMENT values
-- ---------------------------------------------------

ALTER TABLE users AUTO_INCREMENT = 9;
ALTER TABLE stores AUTO_INCREMENT = 6;
ALTER TABLE ratings AUTO_INCREMENT = 9;