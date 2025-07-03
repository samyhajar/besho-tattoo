# Tattoo Studio Website – PRD

## 🧩 Overview
The website has two core areas:
1. **Tattoo Portfolio & Appointment Booking** – showcasing tattoo works and allowing clients to book appointments.
2. **T-Shirt Shop** – a basic e-commerce section for selling merchandise.

We're using:
- **Supabase** (database + auth)
- **Next.js 15** (App Router)
- **Tailwind CSS v4** (styling)
- **Custom Appointment Calendar** built into the app (replacing Calendly)

---

## 🗃️ Supabase Schema

### 1. `profiles`
Stores user profiles (both client and potential users if needed):
```ts
id             UUID (PK, references auth.users.id)
full_name      TEXT
email          TEXT
is_admin       BOOLEAN (default: false)
created_at     TIMESTAMP
```

### 2. `tattoos`
Tattoo portfolio entries:
```ts
id             UUID (PK)
title          TEXT
description    TEXT
image_url      TEXT
category       TEXT
created_at     TIMESTAMP
```

### 3. `availabilities`
Time slots the artist is available:
```ts
id             UUID (PK)
date           DATE
time_start     TIME
time_end       TIME
is_booked      BOOLEAN (default: false)
```

### 4. `appointments`
Client bookings:
```ts
id             UUID (PK)
user_id        UUID (FK to auth.users)
full_name      TEXT
email          TEXT
date           DATE
time_start     TIME
time_end       TIME
status         TEXT  -- (pending, confirmed, cancelled)
notes          TEXT
created_at     TIMESTAMP
```

### 5. `products`
Shop products (e.g., t-shirts):
```ts
id             UUID (PK)
name           TEXT
description    TEXT
price_cents    INTEGER
image_url      TEXT
stock_quantity INTEGER
is_active      BOOLEAN
created_at     TIMESTAMP
```

### 6. `orders`
Order records from customers:
```ts
id             UUID (PK)
user_id        UUID (FK to auth.users)
total_cents    INTEGER
status         TEXT -- (pending, paid, cancelled)
created_at     TIMESTAMP
```

### 7. `order_items`
Products linked to an order:
```ts
id             UUID (PK)
order_id       UUID (FK to orders)
product_id     UUID (FK to products)
quantity       INTEGER
price_cents    INTEGER
```

---

## 🔒 RLS Policies (Recommendations)

- **`profiles`**: User can `SELECT` their own profile. Admin can `SELECT` all.
- **`tattoos`**: Public `SELECT`. Admin can `INSERT`, `UPDATE`, `DELETE`.
- **`availabilities`**: Admin can manage all. Public can only `SELECT` non-booked slots.
- **`appointments`**: Admin can `SELECT` all. Users can `SELECT` their own.
- **`products`**: Public `SELECT`. Admin can `INSERT`, `UPDATE`, `DELETE`.
- **`orders`**: Only owner can `SELECT`. Admin can `SELECT` all.
- **`order_items`**: Same as `orders`.

---

## 🧠 Custom Appointment Calendar
- Tattoo artist defines availability in admin dashboard (`availabilities` table)
- Clients select available time slots on the frontend (rendered from `availabilities`)
- On submission, an `appointment` is created, and that slot is marked `is_booked = true`
- Admin sees upcoming appointments and calendar view on their dashboard

---

## 🔧 Admin Features
- Add/edit/delete tattoos
- Manage availability slots
- View upcoming appointments in a dashboard calendar
- Manage products and orders

---

## 🛒 Shop Flow
- Public visitors can browse products
- Orders placed via Stripe or similar (integration TBD)
- Order + items stored in `orders` and `order_items`

---

## 📬 Optional
- Email confirmation via Resend on appointment insert
- Supabase Storage for tattoo images
- Stripe Webhooks for order confirmations

---

## ✅ Summary
This PRD outlines the base schema for a dual-purpose tattoo studio site using Supabase. Appointment booking is handled via a custom calendar system, giving full control and avoiding 3rd-party subscription costs. Admin panel allows managing tattoos, calendar availability, and shop products.