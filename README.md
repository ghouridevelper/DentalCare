# Clinic Booking & Appointment System (MERN)

Multi-branch clinic website + online booking + admin dashboard + WhatsApp automation via Zapier.

Stack: **MongoDB, Express, React (Vite + Tailwind + Framer Motion), Node.js**

See `ZAPIER_SETUP.md` for wiring up the two WhatsApp Zaps (instant confirmation + 24h reminder).

---

## 1. Prerequisites

- Node.js 18+
- A MongoDB connection string (local `mongod`, or a free MongoDB Atlas cluster)

## 2. Backend

```bash
cd backend
npm install
cp .env.example .env
# edit .env: set MONGO_URI, JWT_SECRET, ZAPIER_CONFIRMATION_WEBHOOK_URL, ZAPIER_SHARED_SECRET
npm run seed
npm run dev
```

API runs at `http://localhost:5000`.

## 3. Frontend

Open a second terminal:

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

Site runs at `http://localhost:5173`.

## 4. Log in to the admin dashboard

Go to `http://localhost:5173/admin/login` and use the credentials printed by `npm run seed`
(defaults: `owner@clinic.com` / `ChangeMe123!` unless overridden in `.env`).

## 5. Production build (frontend)

```bash
cd frontend
npm run build
npm run preview
```

## 6. Production start (backend)

```bash
cd backend
npm start
```
