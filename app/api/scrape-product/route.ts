import { NextRequest, NextResponse } from 'next/server';
import * as cheerio from 'cheerio';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

function calculateIkhorPrice(costUSD: number): number {
  const totalCost = costUSD + 10 + 15 + 7;
  const margin = 0.20 + 0.35;
  const price = totalCost * (1 + margin);
  return Math.floor(price) + 0.99;
}

interface ScrapedProduct {
  name: string;
  price: number;
  image: string;
  link: string;
  brand: string;
}

async function scrapeCategoryPage(url: string): Promise<ScrapedProduct[]> {
  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });
    
    const html = await response.text();
    const $ = cheerio.load(html);
    const products: ScrapedProduct[] = [];

    if (url.includes('giftexpress.com')) {
      $('li.flex.flex-col').each((i, el) => {
        const $el = $(el);
        const name = $el.find('a.product-item-photo').attr('title') || '';
        const link = $el.find('a.product-item-photo').attr('href') || '';
        const image = $el.find('img').attr('src') || '';
        const priceText = $el.find('.price').first().text();
        const priceMatch = priceText.match(/\$[\d.]+/g);
        const price = priceMatch ? parseFloat(priceMatch[priceMatch.length - 1].replace('$', '')) : 0;

        if (name && price > 0) {
          products.push({
            name,
            price,
            image: image.startsWith('http') ? image : `https://www.giftexpress.com${image}`,
            link,
            brand: 'GiftExpress'
          });
        }
      });
    }

    return products;
  } catch (error) {
    console.error('Error scraping:', error);
    return [];
  }
}

async function importProducts(products: ScrapedProduct[]) {
  const imported: string[] = [];
  const errors: any[] = [];

  for (const product of products) {
    try {
      const ikhorPrice = calculateIkhorPrice(product.price);
      
      const { data, error } = await supabase
        .from('perfumes')
        .insert([{
          name: product.name,
          description: '',
          price_cents: Math.round(ikhorPrice * 100),
          cost_cents: Math.round(product.price * 100),
          ml: 100,
          image_url: product.image,
          active: true,
          stock: 0,
          lead_time_days: 20,
          is_preorder_enabled: true,
          category: 'diseñador_premium',
          brand: product.brand,
          shipping_to_courier_cents: 1000,
          shipping_to_ecuador_cents: 1500,
          local_shipping_cents: 700
        }])
        .select()
        .single();

      if (error) {
        errors.push({ name: product.name, error: error.message });
      } else {
        imported.push(product.name);
      }
    } catch (err: any) {
      errors.push({ name: product.name, error: err.message });
    }
  }

  return { imported, errors };
}

export async function GET(request: NextRequest) {
  try {
    const url = request.nextUrl.searchParams.get('url');
    
    if (!url) {
      return NextResponse.json({ 
        error: 'URL requerida' 
      }, { status: 400, headers: corsHeaders });
    }

    const products = await scrapeCategoryPage(url);
    
    if (products.length === 0) {
      return NextResponse.json({ 
        error: 'No se encontraron productos',
        products: []
      }, { status: 200, headers: corsHeaders });
    }

    const result = await importProducts(products);

    return NextResponse.json({
      success: true,
      total: products.length,
      imported: result.imported.length,
      errors: result.errors.length,
      details: {
        imported: result.imported,
        errors: result.errors
      }
    }, { headers: corsHeaders });

  } catch (error: any) {
    return NextResponse.json({ 
      error: error.message 
    }, { status: 500, headers: corsHeaders });
  }
}
