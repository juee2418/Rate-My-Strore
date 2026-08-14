# Store Rating App

Full-stack app: users rate stores (1-5). Three roles: System Administrator, Normal User, Store Owner.

Stack: **React (Vite + Tailwind)** frontend, **Express.js** backend, **MySQL** database, **JWT** auth.

## Folder structure
```
store-rating-app/
  backend/     Express API + MySQL
  frontend/    React app
```

## 1. Set up MySQL

1. Install MySQL locally if you haven't: https://dev.mysql.com/downloads/
2. Log in: `mysql -u root -p`
3. Run the schema file:
   ```
   mysql -u root -p < backend/schema.sql
   ```
   This creates the `store_rating_db` database and all 3 tables (`users`, `stores`, `ratings`).

## 2. Backend setup

```bash
cd backend
npm install
cp .env.example .env
```

Edit `.env` and set your real MySQL password + a random JWT secret:
```
DB_PASSWORD=your_actual_mysql_password
JWT_SECRET=any_long_random_string_here
```

Create your first admin account (since public signup only creates normal users):
```bash
node seedAdmin.js
```
This prints an email/password you can log in with (default: `admin@example.com` / `Admin@1234`) — change it in `seedAdmin.js` before running if you like, but note the name must be 20-60 characters and password must satisfy the rules.

Run the server:
```bash
npm run dev
```
Backend runs on **http://localhost:5000**.

## 3. Frontend setup

Open a new terminal:
```bash
cd frontend
npm install
npm run dev
```
Frontend runs on **http://localhost:5173**.

## 4. Try it out

1. Go to http://localhost:5173/login and log in as admin (`admin@example.com` / `Admin@1234`).
2. From the Admin Dashboard, add a **Store Owner** user, then add a **Store** and set its `owner_id` to that user's ID (shown after creation — you can also check via `SELECT id, email FROM users;` in MySQL).
3. Sign up as a Normal User at `/signup`, log in, browse stores, and submit ratings.
4. Log in as the Store Owner to see the ratings dashboard for their store.

## How roles work

- Signup (`/signup`) always creates a `normal_user`.
- Only an Admin can create `admin` or `store_owner` accounts (via the "Add User" modal in the Admin Dashboard).
- The JWT issued at login encodes `{ id, role }`, and the backend's `requireRole()` middleware enforces access per-route (see `backend/middleware/auth.js`).

## Validation rules implemented

- Name: 20-60 characters
- Address: max 400 characters
- Password: 8-16 characters, at least 1 uppercase letter + 1 special character
- Email: standard email format

Enforced both on the frontend (immediate feedback) and backend (via `express-validator`, source of truth).

## Notes / things you can extend

- Currently one store per owner is assumed for the owner dashboard — extend `getOwnerDashboard` if you want multi-store owners.
- Add pagination to the admin tables if your dataset grows large.
- Consider moving the JWT to an httpOnly cookie instead of localStorage for extra XSS protection in a production deployment.
