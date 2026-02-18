// app/api/import-product/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import crypto from 'node:crypto';

export const runtime = 'nodejs';

const corsHeaders: Record<string, string> = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, x-ikhor-import-token',
};

function normalizeToken(value: string | null | undefined) {
  const t = String(value ?? '').trim();
  return t.replace(/^"(.*)"$/, '$1').replace(/^'(.*)'$/, '$1').trim();
}

function toInt(value: any, fallback: number) {
  const n = Number(value);
  return Number.isFinite(n) ? Math.round(n) : fallback;
}

function toBool(value: any, fallback = false) {
  if (value === true || value === false) return value;
  if (typeof value === 'string') {
    const v = value.trim().toLowerCase();
    if (v === 'true' || v === '1' || v === 'yes') return true;
    if (v === 'false' || v === '0' || v === 'no') return false;
  }
  if (typeof value === 'number') return value !== 0;
  return fallback;
}

function toStr(value: any, fallback = '') {
  const s = String(value ?? '').trim();
  return s || fallback;
}

function makeSlug(input: string) {
  return input
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
    .slice(0, 70);
}

function randomSuffix(len = 6) {
  return crypto.randomBytes(Math.ceil(len / 2)).toString('hex').slice(0, len);
}

function missingColumnName(err: any): string | null {
  const msg = String(err?.message ?? '');
  // PostgREST typical: "Could not find the 'cost_cents' column of 'perfumes' in the schema cache"
  const m = msg.match(/Could not find the '([^']+)' column/i);
  return m?.[1] ?? null;
}

async function insertWithAutoStrip(
  supabase: any,
  table: string,
  row: Record<string, any>,
  select = '*',
  maxStrips = 8
) {
  const data = { ...row };

  for (let i = 0; i <= maxStrips; i++) {
    const res = await supabase.from(table).insert(data).select(select).single();
    if (!res.error) return res;

    const col = missingColumnName(res.error);
    if (!col) return res;

    if (Object.prototype.hasOwnProperty.call(data, col)) {
      delete data[col];
      continue;
    }

    // Column missing but not present in our payload; stop.
    return res;
  }

  return await supabase.from(table).insert(row).select(select).single();
}

async function insertManyWithAutoStrip(
  supabase: any,
  table: string,
  rows: Array<Record<string, any>>,
  maxStrips = 8
) {
  if (rows.length === 0) return { error: null as any };

  let payload = rows.map(r => ({ ...r }));

  for (let i = 0; i <= maxStrips; i++) {
    const res = await supabase.from(table).insert(payload);
    if (!res.error) return res;

    const col = missingColumnName(res.error);
    if (!col) return res;

    payload = payload.map(r => {
      if (Object.prototype.hasOwnProperty.call(r, col)) {
        const copy = { ...r };
        delete copy[col];
        return copy;
      }
      return r;
    });
  }

  return await supabase.from(table).insert(rows);
}

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function POST(request: NextRequest) {
  try {
    // Token check (si existe en env)
    const importToken = normalizeToken(process.env.IKHOR_IMPORT_TOKEN);
    if (importToken) {
      const headerToken = normalizeToken(request.headers.get('x-ikhor-import-token'));
      if (!headerToken || headerToken !== importToken) {
        return NextResponse.json(
          { success: false, error: 'Unauthorized' },
          { status: 401, headers: corsHeaders }
        );
      }
    }

    // Supabase
    const supabaseUrl =
      process.env.NEXT_PUBLIC_SUPABASE_URL ||
      process.env.NEXT_PUBLIC_SUPABASEURL ||
      process.env.SUPABASE_URL;

    const supabaseKey =
      process.env.SUPABASE_SERVICE_ROLE_KEY ||
      process.env.SUPABASE_SERVICE_ROLE ||
      process.env.SUPABASE_SERVICE_KEY ||
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLEKEY;

    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.json(
        { success: false, error: 'Faltan variables de Supabase (URL o KEY).' },
        { status: 500, headers: corsHeaders }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseKey, {
      auth: { persistSession: false },
    });

    const body = await request.json().catch(() => ({} as any));

    // Validación mínima
    const name = toStr(body.name);
    const brand = toStr(body.brand);

    if (!name || !brand) {
      return NextResponse.json(
        { success: false, error: 'name y brand son requeridos' },
        { status: 400, headers: corsHeaders }
      );
    }

    // Acepta camel o snake en el input
    const priceCents = toInt(body.price_cents ?? body.pricecents ?? body.priceCents, 0);
    const costCents = toInt(body.cost_cents ?? body.costcents ?? body.costCents, 0);
    const currency = toStr(body.currency, 'USD');
    const imageUrl = toStr(body.image_url ?? body.imageurl ?? body.imageUrl, '') || null;
    const ml = toInt(body.ml, 100);
    const description = toStr(body.description, '') || null;

    // slug siempre único para evitar choques
    const baseSlug = makeSlug(toStr(body.slug, '')) || makeSlug(name);
    const slug = `${baseSlug}-${randomSuffix(6)}`.slice(0, 80);

    // Producto (snake_case)
    const productRow: Record<string, any> = {
      name,
      slug,
      description,
      price_cents: priceCents,
      cost_cents: costCents,
      currency,
      image_url: imageUrl,
      ml,
      brand,

      // Opcionales si vienen (si no existen en tu tabla, se auto-quitan)
      category: body.category ?? null,
      subcategory: body.subcategory ?? null,
      concentration: body.concentration ?? null,
      origin_country: body.origin_country ?? body.origincountry ?? null,

      active: body.active ?? true,
      stock: body.stock ?? 0,
      lead_time_days: body.lead_time_days ?? body.leadtimedays ?? 14,
      is_preorder_enabled: body.is_preorder_enabled ?? body.ispreorderenabled ?? true,
      supplier_name: body.supplier_name ?? body.suppliername ?? null,
    };

    const created = await insertWithAutoStrip(supabase, 'perfumes', productRow, '*', 10);

    if (created.error || !created.data) {
      return NextResponse.json(
        { success: false, error: created.error?.message ?? 'Error creando perfume' },
        { status: 500, headers: corsHeaders }
      );
    }

    const perfume = created.data;

    // Variantes -> tabla correcta: perfume_variants
    const variants = Array.isArray(body.variants) ? body.variants : [];
    if (variants.length > 0) {
      const rows = variants
        .map((v: any) => ({
          perfume_id: perfume.id,
          size_ml: toInt(v.size_ml ?? v.sizeMl ?? v.sizeml, 100),
          price_cents: toInt(v.price_cents ?? v.pricecents ?? v.priceCents, priceCents),
          cost_cents: toInt(v.cost_cents ?? v.costcents ?? v.costCents, 0),
          is_tester: toBool(v.is_tester ?? v.isTester ?? v.istester, false),
          sku: toStr(v.sku, '') || null,
          active: v.active ?? true,
        }))
        .filter((r: Record<string, any>) => r.size_ml > 0);

      if (rows.length > 0) {
        const vRes = await insertManyWithAutoStrip(supabase, 'perfume_variants', rows, 10);

        if (vRes.error) {
          return NextResponse.json(
            {
              success: true,
              product: perfume,
              warning: 'Producto creado, pero no se pudieron insertar variantes.',
              variantsError: vRes.error.message,
            },
            { status: 200, headers: corsHeaders }
          );
        }
      }
    }

    return NextResponse.json(
      { success: true, product: perfume },
      { status: 200, headers: corsHeaders }
    );
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: String(err?.message ?? err) },
      { status: 500, headers: corsHeaders }
    );
  }
}
