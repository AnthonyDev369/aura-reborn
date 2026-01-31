export interface Perfume {
  id: string;
  name: string;
  description?: string;
  price_cents: number;
  ml: number;
  image_url?: string;
  active: boolean;
  created_at: string;
  
  // CAMPOS DE PRE-ORDEN
  stock: number;
  lead_time_days: number;
  is_preorder_enabled: boolean;
  
  // CAMPOS DE COSTOS
  cost_cents: number;
  shipping_to_courier_cents: number;
  shipping_to_ecuador_cents: number;
  local_shipping_cents: number;
  category: string;
  subcategory?: string;
  supplier_name?: string;
  custom_lead_days?: number;
  preorder_capacity: number;
  
  // CAMPOS OLFATIVOS
  brand?: string;
  origin_country?: string;
  fragrance_family?: string;
  top_notes?: string;
  heart_notes?: string;
  base_notes?: string;
  concentration?: string;
}

export interface Order {
  id: string;
  created_at: string;
  customer_name: string;
  city: string;
  address: string;
  whatsapp: string;
  total_cents: number;
  status: string;
  tracking_number?: string;
  courier?: string;
  estimated_delivery?: string;
  user_id: string;
  
  // CAMPOS DE PRE-ORDEN
  is_preorder?: boolean;
  preorder_estimated_arrival?: string;
  
  // CAMPOS DE PAGO
  payment_method?: string;
  payment_status?: string;
  payment_id?: string;
  paid_at?: string;
}
