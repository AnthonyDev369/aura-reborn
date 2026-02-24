# ÍKHOR (Ἰχώρ) — Premium Perfume Store

Premium perfume e-commerce platform for Ecuador, featuring a pre-order system, multi-payment methods, and a refined minimalist UI.

## Tech Stack

- **Framework:** Next.js 14 (App Router), TypeScript
- **Styling:** Tailwind CSS, Framer Motion
- **Backend:** Supabase (PostgreSQL + Auth + RLS)
- **Payments:** PayPhone, PayPal, Transferencia Bancaria, Takenos
- **Hosting:** Vercel

## Features

- 🛒 Pre-order system with automatic lead-time calculation
- 💳 Multi-payment: PayPhone, PayPal, Bank Transfer, Takenos (crypto/international)
- 🔔 Social proof toasts ("VENDIDO" notifications)
- 🧴 Variant selector (size/ml per product)
- 🔍 Real-time search & brand filter
- 📦 Import quota management (courier/viajero)
- 📊 Admin panel with order tracking & pricing calculator

## Getting Started

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure environment variables:**
   ```bash
   cp .env.example .env.local
   # Fill in your Supabase, PayPal, and Resend credentials
   ```

3. **Run the development server:**
   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) in your browser.

## Environment Variables

See `.env.example` for required variables:

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Supabase anon key |
| `NEXT_PUBLIC_PAYPAL_CLIENT_ID` | PayPal client ID |
| `RESEND_API_KEY` | Resend API key for emails |

## Project Structure

```
aura-reborn/
├─ app/
│  ├─ page.tsx              # Home (products, filters, search)
│  ├─ layout.tsx            # Global layout + PayPal provider
│  ├─ globals.css           # Global styles
│  ├─ login/                # Authentication
│  ├─ account/              # Customer panel (orders, wishlist)
│  ├─ reset-password/       # Password recovery
│  └─ admin/                # Admin panel (orders, products, pricing)
├─ components/
│  ├─ Navbar.tsx            # Logo + Cart + User
│  ├─ ProductCard.tsx       # Product card (stock/pre-order badges)
│  ├─ CartDrawer.tsx        # Side cart drawer
│  ├─ CheckoutForm.tsx      # Checkout (5 payment methods)
│  ├─ HeroSection.tsx       # Hero section
│  ├─ ProductModal.tsx      # Product detail modal
│  └─ Footer.tsx            # Footer
├─ hooks/
│  ├─ useCart.ts            # Cart state & logic
│  ├─ useProducts.ts        # Product fetching & filtering
│  └─ useSocialProof.ts     # Social proof toast logic
├─ lib/
│  ├─ types.ts              # TypeScript interfaces
│  ├─ supabaseClient.ts     # Supabase client
│  ├─ cart.ts               # Cart DB operations
│  └─ emails.ts             # Email templates
└─ tailwind.config.ts       # Platinum Whisper design system
```

## Design System

**Palette: Platinum Whisper**

| Token | Value | Use |
|---|---|---|
| `bg` | `#FDFBF7` | Ivory white background |
| `text` | `#1C1917` | Stone black text |
| `accent` | `#A8A29E` | Platinum champagne |
| `muted` | `#78716C` | Dark stone |

**Typography:** Inter (body) + Playfair Display (headings/logo)

