# ÍKHOR (Ἰχώρ) — Premium Perfume Store

> *"No vestimos el cuerpo, vestimos la memoria que dejas al pasar."*

E-commerce de perfumería premium para Ecuador con sistema de **pre-orden automática** — el primero en LatAm.

## ✨ Features

- 🧴 **Pre-orden Automática** — Stock 0? El cliente compra igual con días estimados de llegada
- 💳 **Multi-Pago** — PayPal, Transferencia (4 bancos), Takenos (cripto)
- 📦 **Gestión de Cupos** — Control automático del límite aduanero $1,000
- 🧮 **Calculadora de Pricing** — Fórmula híbrida con márgenes por categoría
- 📥 **Importación Masiva** — Scraping inteligente desde proveedores
- 🔐 **Seguridad** — Middleware de protección + RLS en Supabase
- 🎨 **Diseño Premium** — Glassmorphism, cursor personalizado, animaciones 60fps

## 🛠 Stack Tecnológico

| Categoría | Tecnología |
|-----------|-----------|
| Frontend | Next.js 16, React 19, TypeScript, Tailwind CSS |
| Animaciones | Framer Motion |
| Backend | Supabase (PostgreSQL + Auth + RLS) |
| Pagos | PayPal, Transferencia Bancaria, Takenos |
| Email | Resend |
| Hosting | Vercel |
| Scraping | Cheerio + Axios |

## 🚀 Getting Started

1. Clone the repo
2. Copy `.env.example` to `.env.local` and fill in your values
3. Install dependencies and run:

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
├── app/               # Next.js App Router pages
│   ├── page.tsx       # Home (products, filters, search)
│   ├── layout.tsx     # Global layout + providers
│   ├── admin/         # Admin panel (orders, products, pricing)
│   ├── login/         # Authentication
│   ├── account/       # Customer panel
│   └── api/           # API routes (scraping, email, import)
├── components/        # Reusable UI components
├── hooks/             # Custom React hooks
├── lib/               # Utilities, types, Supabase client
└── src/               # Middleware
```

## 🌐 Deploy

Deployed on [Vercel](https://vercel.com). Push to `main` to auto-deploy.

## 📄 License

Private — All rights reserved.
