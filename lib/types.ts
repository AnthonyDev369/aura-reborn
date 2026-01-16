export type Perfume = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  price_cents: number;
  currency: string;
  image_url: string | null;
  ml: number | null;
  in_stock: boolean;
  featured: boolean;
  active: boolean;
};
