-- ===================================================
-- Store Rating App — MySQL Schema
-- ===================================================

CREATE DATABASE IF NOT EXISTS store_rating_db;
USE store_rating_db;

-- ---------------------------------------------------
-- USERS TABLE
-- Holds Admins, Normal Users, and Store Owners (single login system)
-- ---------------------------------------------------
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(60) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,        -- bcrypt hash
  address VARCHAR(400),
  role ENUM('admin', 'normal_user', 'store_owner') NOT NULL DEFAULT 'normal_user',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ---------------------------------------------------
-- STORES TABLE
-- Each store is linked to a store_owner (a user with role='store_owner')
-- ---------------------------------------------------
CREATE TABLE stores (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(60) NOT NULL,
  email VARCHAR(255),
  address VARCHAR(400),
  owner_id INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE SET NULL
);

-- ---------------------------------------------------
-- RATINGS TABLE
-- A normal user can rate a store once (unique constraint) — updating
-- their rating later just updates this row (upsert).
-- ---------------------------------------------------
CREATE TABLE ratings (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  store_id INT NOT NULL,
  rating TINYINT NOT NULL CHECK (rating BETWEEN 1 AND 5),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY unique_user_store (user_id, store_id),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (store_id) REFERENCES stores(id) ON DELETE CASCADE
);

-- ---------------------------------------------------
-- Seed a default System Administrator
-- Password below is: Admin@1234  (hashed with bcrypt, see note)
-- Since bcrypt hashes are generated at runtime, actually create this
-- user via the /api/auth/seed-admin route (see backend README) OR
-- replace the hash below by running: node utils/hashPassword.js
-- ---------------------------------------------------
-- INSERT INTO users (name, email, password, address, role)
-- VALUES ('Default System Administrator Account', 'admin@example.com', '<bcrypt_hash_here>', 'HQ Address', 'admin');
