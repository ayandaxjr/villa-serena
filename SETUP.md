# Villa Serena — Booking System & CRM Setup Guide

## Overview

This project now consists of two Next.js apps:

| App | Folder | URL |
|-----|--------|-----|
| Public website | `/` (root) | `villa-serena.nl` |
| Admin CRM | `/admin` | `admin.villa-serena.nl` |

Both share the same Supabase project.

---

## Step 1 — Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and create an account
2. Click **New Project** and fill in the details (name: "villa-serena", choose a strong DB password)
3. Wait for the project to initialise (~2 minutes)
4. Go to **Settings → API** and copy:
   - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role secret` key → `SUPABASE_SERVICE_ROLE_KEY` (keep this secret!)

---

## Step 2 — Run the Database Schema

1. In your Supabase project, go to **SQL Editor**
2. Click **New query**
3. Copy and paste the entire contents of `supabase/schema.sql`
4. Click **Run**

This creates all tables, indexes, RLS policies, and the `bookings_with_guests` view.

---

## Step 3 — Create the Admin User

1. In Supabase, go to **Authentication → Users**
2. Click **Invite user**
3. Enter your admin email address
4. Check your email and set a password

---

## Step 4 — Set Up Environment Variables

### Public website (root folder)
Copy `.env.example` to `.env.local` and fill in:
```
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
RESEND_API_KEY=...
FROM_EMAIL=Villa Serena <notifications@villaserena.nl>
CONTACT_EMAIL=info@villa-serena.nl
NEXT_PUBLIC_ADMIN_URL=https://admin.villa-serena.nl
ADMIN_SECRET=choose-a-long-random-string
```

---

## Step 4b — Resend Email (Inquiry Form)

The contact form (Section 10 — The Invitation) sends email via [Resend](https://resend.com). Until the domain is verified, use Resend’s test sender for local/dev only.

### For testing (no domain setup)
```
RESEND_API_KEY=re_...
FROM_EMAIL=Villa Serena <onboarding@resend.dev>
CONTACT_EMAIL=info@villa-serena.nl
```
Emails are delivered **to** `CONTACT_EMAIL`. The **from** address must be a verified sender in Resend.

### For production (`villaserena.nl`)

The client (domain owner) must verify the domain in Resend:

1. Log in at [resend.com/domains](https://resend.com/domains) and click **Add Domain**
2. Enter **`villaserena.nl`** (or `villa-serena.nl` if that is the primary domain — use whichever matches DNS)
3. Resend shows DNS records (SPF, DKIM, optional DMARC). Add them in the domain registrar (e.g. TransIP, Cloudflare)
4. Wait for verification (usually a few minutes to 24 hours)
5. Set on **Vercel** (public site project):
   ```
   RESEND_API_KEY=re_...
   FROM_EMAIL=Villa Serena <notifications@villaserena.nl>
   CONTACT_EMAIL=info@villa-serena.nl
   ```
   Use any `@villaserena.nl` address that Resend shows as verified (e.g. `notifications@`, `noreply@`).

**Important:** `CONTACT_EMAIL` is where inquiries arrive. `FROM_EMAIL` is what guests see as the sender — it must use the verified domain, not `info@` unless that mailbox is also added in Resend.

Also run `supabase/inquiries-migration.sql` in the Supabase SQL editor so inquiries are stored in the admin panel.

### Admin panel (admin folder)
Copy `admin/.env.example` to `admin/.env.local` and fill in:
```
NEXT_PUBLIC_SUPABASE_URL=...       (same as above)
NEXT_PUBLIC_SUPABASE_ANON_KEY=...  (same as above)
MAIN_SITE_URL=https://villa-serena.nl
ADMIN_SECRET=choose-a-long-random-string  (same as above)
```

---

## Step 5 — Install Dependencies

```bash
# Public website
npm install

# Admin panel
cd admin
npm install
```

---

## Step 6 — Run Locally

```bash
# Terminal 1 — public website (port 3000)
npm run dev

# Terminal 2 — admin panel (port 3001)
cd admin
npm run dev
```

Then visit:
- Public site: http://localhost:3000
- Admin panel: http://localhost:3001

---

## Step 7 — Deploy to Vercel

### Public website
- Deploy the root folder as a Vercel project
- Add all env vars from `.env.example` in the Vercel dashboard
- Domain: `villa-serena.nl`

### Admin panel
- Deploy the `/admin` folder as a **separate** Vercel project
  - In Vercel: `Root Directory` → set to `admin`
- Add all env vars from `admin/.env.example`
- Domain: `admin.villa-serena.nl`

---

## How the Booking Flow Works

1. Guest visits `villa-serena.nl`, selects dates on the calendar
2. Guest fills in name/email/message and submits
3. Data is stored in Supabase: guest → booking (status: `pending`)
4. Activity log entry is created
5. Owner gets email with a link to the admin panel
6. Owner logs in at `admin.villa-serena.nl`
7. Owner reviews the booking and clicks **Approve** or **Decline**
8. Guest receives automatic email notification
9. Approved bookings automatically block those dates in the public calendar

---

## Database Tables

| Table | Purpose |
|-------|---------|
| `guests` | All guests who have submitted a form |
| `bookings` | All booking requests and their status |
| `blocked_dates` | Manually blocked periods (owner use, maintenance) |
| `activity_log` | Every notable event on the site |

---

## Scalability Notes

This architecture is designed to scale:
- **Multiple villas**: Add a `properties` table and foreign key to `bookings`
- **Staff accounts**: Add roles via Supabase Auth `user_metadata`
- **Payments**: Integrate Stripe Checkout linked to `booking.id`
- **Channel sync**: Add iCal export endpoint reading from approved bookings
- **Analytics**: Query `activity_log` for occupancy charts, conversion rates
