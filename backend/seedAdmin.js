// One-time script to create the first System Administrator account.
// Run with: node seedAdmin.js
const bcrypt = require('bcryptjs');
const pool = require('./config/db');
require('dotenv').config();

async function seed() {
  const name = 'Default System Administrator Account'; // must be 20-60 chars
  const email = 'admin@example.com';
  const password = 'Admin@1234'; // meets 8-16 chars, 1 uppercase, 1 special char
  const address = 'Head Office, Admin Street';

  const [existing] = await pool.query('SELECT id FROM users WHERE email = ?', [email]);
  if (existing.length > 0) {
    console.log('Admin already exists. Skipping.');
    process.exit(0);
  }

  const hashed = await bcrypt.hash(password, 10);
  await pool.query(
    'INSERT INTO users (name, email, password, address, role) VALUES (?, ?, ?, ?, ?)',
    [name, email, hashed, address, 'admin']
  );

  console.log('Admin created!');
  console.log('Email:', email);
  console.log('Password:', password);
  process.exit(0);
}

seed().catch(err => {
  console.error(err);
  process.exit(1);
});
