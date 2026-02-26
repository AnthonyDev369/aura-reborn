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

export interface PerfumeVariant {
  id: string;
  perfume_id: string;
  size_ml: number;
  price_cents: number;
  cost_cents: number;
  stock: number;
  is_tester: boolean;
  is_default: boolean;
  is_preorder_enabled?: boolean;
  active: boolean;
}

export interface ImportSettings {
  id: string;
  active_method: 'courier' | 'viajero';
  courier_quota_limit_cents: number;
  courier_quota_used_cents: number;
  courier_supplier_days_min: number;
  courier_supplier_days_max: number;
  courier_shipping_days: number;
  courier_warehouse_days_min: number;
  courier_warehouse_days_max: number;
  viajero_supplier_days_min: number;
  viajero_supplier_days_max: number;
  viajero_shipping_days_min: number;
  viajero_shipping_days_max: number;
  viajero_warehouse_days_min: number;
  viajero_warehouse_days_max: number;
}

export interface CartItem extends Perfume {
  quantity?: number;
  variant_id?: string;
}

export interface SavedAddress {
  id: string;
  user_id: string;
  name: string;
  whatsapp: string;
  city: string;
  address: string;
  is_default: boolean;
}

export type PaymentMethod = 'transferencia' | 'payphone' | 'paypal' | 'diferimiento' | 'takenos';

export type OrderStatus = 'esperando_pago' | 'confirmado' | 'preparando' | 'enviado' | 'entregado';
