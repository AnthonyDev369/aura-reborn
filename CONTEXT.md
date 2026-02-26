text
# ÍKHOR (Ἰχώρ) - E-commerce de Perfumes

## 🎯 PROYECTO
Plataforma de e-commerce para venta de perfumes en Ecuador con modelo de pre-orden innovador.

## 💻 STACK TECNOLÓGICO
- **Frontend:** Next.js 14 (App Router), TypeScript, Tailwind CSS, Framer Motion
- **Backend:** Supabase (PostgreSQL + Auth + RLS)
- **Pagos:** PayPal, Transferencia Bancaria (4 bancos), Takenos (cripto/internacional)
- **Hosting:** Vercel
- **Dominio:** ikhor.store

## 💰 MODELO DE NEGOCIO
- **Pre-orden automática:** Stock 0 por defecto
- **Flujo:** Cliente compra → Pedimos a proveedor → Enviamos cuando llega
- **Proveedores:** GiftExpress, Jomashop, FragranceX
- **Cálculo de precio:** Fórmula híbrida automática
- **Gestión de cupos:** $1,000 límite en courier, después viajero

## 📐 ARQUITECTURA DE CARPETAS
aura-reborn/
├─ app/
│ ├─ page.tsx # Home (productos, filtros, búsqueda)
│ ├─ layout.tsx # Layout global + PayPal provider
│ ├─ globals.css # Estilos globales
│ ├─ login/page.tsx # Autenticación
│ ├─ account/page.tsx # Panel de cliente (órdenes, favoritos)
│ ├─ reset-password/page.tsx # Recuperación de contraseña
│ ├─ admin/
│ │ ├─ page.tsx # Panel órdenes (buscador, filtros, tracking)
│ │ ├─ products/page.tsx # Gestión de productos (stock, variantes)
│ │ ├─ pricing/page.tsx # Calculadora de precios
│ │ ├─ import-settings/page.tsx # Gestión de cupos (courier/viajero)
│ │ └─ import/page.tsx # Importación masiva
│ └─ api/
│ ├─ scrape-product/route.ts # Scraping de proveedores
│ ├─ send-email/route.ts # Emails automáticos
│ └─ import-product/route.ts # Endpoint importación
├─ components/
│ ├─ Navbar.tsx # Logo ÍKHOR + Carrito + Usuario
│ ├─ ProductCard.tsx # Tarjeta de producto (badges stock/pre-orden)
│ ├─ CartDrawer.tsx # Carrito lateral (max-w-xl)
│ ├─ CheckoutForm.tsx # Formulario pago (5 métodos)
│ ├─ SuccessRitual.tsx # Pantalla confirmación
│ ├─ OrderTimeline.tsx # Timeline de tracking
│ ├─ CustomCursor.tsx # Cursor platino personalizado
│ └─ PayPalButton.tsx # Botón PayPal
├─ lib/
│ ├─ types.ts # Interfaces TypeScript (Perfume, Order)
│ ├─ supabaseClient.ts # Cliente Supabase
│ ├─ cart.ts # Lógica de carrito
│ ├─ wishlist.ts # Lógica de favoritos
│ └─ emails.ts # Templates email
├─ src/
│ └─ middleware.ts # Protección /admin
└─ tailwind.config.ts # Colores Platinum Whisper

text

## 🎨 SISTEMA DE DISEÑO (40/40)
**Paleta:** Platinum Whisper
```css
bg: #FDFBF7          /* Blanco marfil */
text: #1C1917        /* Negro piedra */
accent: #A8A29E      /* Platino champagne */
muted: #78716C       /* Piedra oscura */
glassBorder: rgba(120, 113, 108, 0.15)
Tipografía:

Sans: Inter (texto general)

Serif: Playfair Display (logo, títulos)

Objetivo: Diseño minimalista que funciona para ricos, clase media y clase baja.

🗄️ BASE DE DATOS (Supabase)
Tabla: perfumes
sql
id, name, description, price_cents, cost_cents, ml, image_url, active, stock,
lead_time_days, is_preorder_enabled, category, brand, concentration,
shipping_to_courier_cents, shipping_to_ecuador_cents, local_shipping_cents,
supplier_name, origin_country, fragrance_family, top_notes, heart_notes, base_notes
Tabla: orders
sql
id, user_id, customer_name, whatsapp, city, address, total_cents, status,
is_preorder, preorder_estimated_arrival, payment_method, payment_status,
tracking_number, courier, estimated_delivery
Tabla: perfume_variants
sql
id, perfume_id, size_ml, price_cents, cost_cents, stock, is_tester, is_default
Tabla: import_settings
sql
active_method (courier/viajero), courier_quota_limit_cents, courier_quota_used_cents,
tiempos de entrega configurables
⚙️ FUNCIONALIDADES CLAVE
1. Sistema de Pre-orden
Stock = 0 → Cliente puede comprar igual (pre-orden)

Cálculo automático de días (proveedor + envío + entrega)

Badge azul: "PRE-ORDEN • LLEGA EN 20-23 DÍAS"

2. Gestión de Cupos
Límite de $1,000 en courier

Solo se cuenta: costo_perfume + shipping_to_courier

Auto-cambio a viajero cuando se excede

Panel /admin/import-settings para gestionar

3. Calculadora de Precios (Fórmula Híbrida)
text
Precio = (Costo + Envío Courier + Envío Ecuador + Servientrega) × (1 + Margen)

Margen = 0.20 (base) + Bono Categoría

Bonos:
- Dupe Árabe: +10%
- Árabe Medio: +25%
- Árabe Premium: +35%
- Diseñador Mainstream: +20%
- Diseñador Premium: +35%
- Nicho: +25-40%

Redondeo: .99 psicológico
4. Importación Masiva
Scraping de páginas de categoría (GiftExpress, Jomashop)

Extracción inteligente: marca, categoría, concentración, ML

Detección automática:

Marca: Meta tags > JSON-LD > URL > nombre

Concentración: EDT, EDP, Extrait, Parfum (del nombre)

Categoría: Por marca conocida (Armaf = árabe, Chanel = premium)

ML: Del nombre o default 100ml

Importación batch a Supabase

5. Métodos de Pago
PayPal: Automático (credenciales en env vars)

Transferencia: 4 bancos (Pichincha, Guayaquil, Produbanco, Internacional)

Takenos: USD/EUR/USDT (link + datos bancarios + wallets)

PayPhone: Próximamente (verificación pendiente)

Diferimiento: Próximamente

🔒 SEGURIDAD
Middleware: Protege /admin (solo administradores autorizados)

RLS: Row Level Security en todas las tablas

Roles: user_roles (customer/admin)

Validación: CERO segundos de exposición de datos sensibles

🚀 FEATURES ÚNICAS (No existen en Ecuador/LatAm)
✅ Pre-orden automática con cálculo de días real

✅ Gestión de cupos aduaneros ($1,000 límite)

✅ Calculadora de pricing con fórmula matemática

✅ Importación masiva desde proveedores

✅ Multi-pago (hasta cripto)

🎯 OBJETIVOS 40/40
Cada feature debe ser perfecta para:

Ricos (10/10): Sofisticado, premium, minimalista

Clase media (10/10): Profesional, confiable, claro

Clase baja (10/10): Fácil de usar, accesible, sin confusión

Minimalismo (10/10): Solo lo esencial, espacios perfectos

📧 CONTACTOS
Email negocio: [stored in env vars]

Email personal: [stored in env vars]

PayPal: [stored in env vars]

🌐 URLs
Producción: https://ikhor.store

Local: http://localhost:3000

Vercel: aura-reborn.vercel.app

🐛 PROBLEMAS COMUNES Y SOLUCIONES
url no definida en funciones: Usar sourceUrl como parámetro

Marcas = "Brands": Usar función extractBrand() mejorada

CORS en extensión Chrome: Hacer scraping desde servidor (API route)

Campos opcionales TypeScript: Usar ?: en lugar de | null

Middleware deprecated warning: Ignorar o mover a src/middleware.ts

🔄 WORKFLOW DE IMPORTACIÓN
Admin va a /admin/import

Pega URL de categoría (ej: giftexpress.com/brand/armaf.html)

Sistema scrapea página

Extrae: nombre, precio, imagen, marca, concentración, ML

Calcula precio ÍKHOR automáticamente

Importa a Supabase con stock 0

Productos aparecen en ikhor.store con badge de pre-orden

📊 DATOS CRÍTICOS
Cédula: [stored privately]

Titular cuentas: [stored privately]

Cupo usado actual: ~$150/$1,000

Total perfumes: 24+

Dominio: ikhor.store ($1.98/año)