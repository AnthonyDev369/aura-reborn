export interface Perfume {
  id: string;
  name: string;
  description: string | null;
  price_cents: number;
  ml: number;
  image_url: string | null;
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
  subcategory: string | null;
  supplier_name: string | null;
  custom_lead_days: number | null;
  preorder_capacity: number;
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
  tracking_number: string | null;
  courier: string | null;
  estimated_delivery: string | null;
  user_id: string;
  
  // CAMPOS DE PRE-ORDEN
  is_preorder: boolean;
  preorder_estimated_arrival: string | null;
}
