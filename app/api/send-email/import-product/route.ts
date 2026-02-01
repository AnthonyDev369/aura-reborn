import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const productData = {
      name: body.name,
      description: body.description || '',
      price_cents: body.price_cents,
      cost_cents: body.cost_cents,
      ml: body.ml || 100,
      image_url: body.image_url,
      active: true,
      stock: 0, // Pre-orden
      lead_time_days: 20,
      is_preorder_enabled: true,
      category: body.category || 'diseñador_premium',
      brand: body.brand,
      shipping_to_courier_cents: 1000,
      shipping_to_ecuador_cents: 1500,
      local_shipping_cents: 700
    };
    
    const { data, error } = await supabase
      .from('perfumes')
      .insert([productData])
      .select()
      .single();
    
    if (error) {
      return NextResponse.json({ 
        success: false, 
        error: error.message 
      }, { status: 500 });
    }
    
    return NextResponse.json({ 
      success: true, 
      product: data 
    });
    
  } catch (error: any) {
    return NextResponse.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 });
  }
}
