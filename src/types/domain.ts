export type ProductCategory = string;

export type LeadStatus = "new" | "contacted" | "sold" | "archived";

export interface Product {
  id: string;
  slug: string;
  created_at: string;
  name: string;
  description: string | null;
  price: number | null;
  images: string[];
  brand: string;
  category: ProductCategory;
  active: boolean;
}

export interface LeadProductSnapshot {
  productId: string;
  name: string;
  price: number | null;
  url: string;
  quantity: number;
}

export interface Lead {
  id: string;
  created_at: string;
  name: string;
  whatsapp: string;
  status: LeadStatus;
  products_interest: LeadProductSnapshot[];
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface ProductCategoryItem {
  id: string;
  created_at: string;
  name: string;
  slug: string;
  icon: string | null;
  image: string | null;
  active: boolean;
}

export type SiteUserRole = "admin" | "seller";

export interface SiteUser {
  id: string;
  created_at: string;
  name: string;
  email: string;
  role: SiteUserRole;
  active: boolean;
}

export interface HomeBanner {
  id: string;
  created_at: string;
  title: string;
  subtitle: string;
  cta: string;
  image: string;
  position: number;
  active: boolean;
}

export interface BrandItem {
  id: string;
  created_at: string;
  name: string;
  image: string;
  active: boolean;
}
