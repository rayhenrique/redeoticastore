import type {
  Lead,
  LeadProductSnapshot,
  LeadStatus,
  HomeBanner,
  BrandItem,
  Product,
  ProductCategoryItem,
  SiteUser,
  SiteUserRole,
} from "@/types/domain";

export interface ProductFilters {
  q?: string;
  brand?: string;
  category?: string;
  active?: boolean;
}

export interface CreateProductInput {
  name: string;
  description: string | null;
  price: number | null;
  images: string[];
  brand: string;
  category: string;
  active: boolean;
}

export type UpdateProductInput = Partial<CreateProductInput>;

export interface ProductRepository {
  list(filters?: ProductFilters): Promise<Product[]>;
  listByIds(ids: string[]): Promise<Product[]>;
  findById(id: string): Promise<Product | null>;
  create(input: CreateProductInput): Promise<Product>;
  update(id: string, input: UpdateProductInput): Promise<Product>;
  remove(id: string): Promise<void>;
}

export interface CreateLeadInput {
  name: string;
  whatsapp: string;
  status?: LeadStatus;
  products_interest: LeadProductSnapshot[];
}

export interface LeadRepository {
  list(): Promise<Lead[]>;
  create(input: CreateLeadInput): Promise<Lead>;
  update(id: string, input: Partial<CreateLeadInput>): Promise<Lead>;
  remove(id: string): Promise<void>;
  updateStatus(id: string, status: LeadStatus): Promise<Lead>;
  countNewToday(): Promise<number>;
}

export interface CreateCategoryInput {
  name: string;
  slug: string;
  icon: string | null;
  image: string | null;
  active: boolean;
}

export type UpdateCategoryInput = Partial<CreateCategoryInput>;

export interface CategoryRepository {
  list(): Promise<ProductCategoryItem[]>;
  create(input: CreateCategoryInput): Promise<ProductCategoryItem>;
  update(id: string, input: UpdateCategoryInput): Promise<ProductCategoryItem>;
  remove(id: string): Promise<void>;
}

export interface CreateSiteUserInput {
  name: string;
  email: string;
  role: SiteUserRole;
  active: boolean;
}

export type UpdateSiteUserInput = Partial<CreateSiteUserInput>;

export interface SiteUserRepository {
  list(): Promise<SiteUser[]>;
  create(input: CreateSiteUserInput): Promise<SiteUser>;
  update(id: string, input: UpdateSiteUserInput): Promise<SiteUser>;
  remove(id: string): Promise<void>;
}

export interface BannerFilters {
  active?: boolean;
}

export interface CreateBannerInput {
  title: string;
  subtitle: string;
  cta: string;
  image: string;
  position: number;
  active: boolean;
}

export type UpdateBannerInput = Partial<CreateBannerInput>;

export interface BannerRepository {
  list(filters?: BannerFilters): Promise<HomeBanner[]>;
  create(input: CreateBannerInput): Promise<HomeBanner>;
  update(id: string, input: UpdateBannerInput): Promise<HomeBanner>;
  remove(id: string): Promise<void>;
}

export interface BrandFilters {
  active?: boolean;
}

export interface CreateBrandInput {
  name: string;
  image: string;
  active: boolean;
}

export type UpdateBrandInput = Partial<CreateBrandInput>;

export interface BrandRepository {
  list(filters?: BrandFilters): Promise<BrandItem[]>;
  create(input: CreateBrandInput): Promise<BrandItem>;
  update(id: string, input: UpdateBrandInput): Promise<BrandItem>;
  remove(id: string): Promise<void>;
}
