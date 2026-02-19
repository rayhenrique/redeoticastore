import { dataProvider } from "@/lib/config";
import type {
  BrandRepository,
  BannerRepository,
  CategoryRepository,
  LeadRepository,
  ProductRepository,
  SiteUserRepository,
} from "@/lib/repositories/interfaces";
import { mockBrandRepository } from "@/lib/repositories/mock/brand-repository";
import { mockBannerRepository } from "@/lib/repositories/mock/banner-repository";
import { mockCategoryRepository } from "@/lib/repositories/mock/category-repository";
import { mockLeadRepository } from "@/lib/repositories/mock/lead-repository";
import { mockProductRepository } from "@/lib/repositories/mock/product-repository";
import { mockSiteUserRepository } from "@/lib/repositories/mock/site-user-repository";
import { supabaseBannerRepository } from "@/lib/repositories/supabase/banner-repository";
import { supabaseBrandRepository } from "@/lib/repositories/supabase/brand-repository";
import { supabaseCategoryRepository } from "@/lib/repositories/supabase/category-repository";
import { supabaseLeadRepository } from "@/lib/repositories/supabase/lead-repository";
import { supabaseProductRepository } from "@/lib/repositories/supabase/product-repository";
import { supabaseSiteUserRepository } from "@/lib/repositories/supabase/site-user-repository";

export function getProductRepository(): ProductRepository {
  return dataProvider === "supabase"
    ? supabaseProductRepository
    : mockProductRepository;
}

export function getLeadRepository(): LeadRepository {
  return dataProvider === "supabase" ? supabaseLeadRepository : mockLeadRepository;
}

export function getCategoryRepository(): CategoryRepository {
  return dataProvider === "supabase"
    ? supabaseCategoryRepository
    : mockCategoryRepository;
}

export function getSiteUserRepository(): SiteUserRepository {
  return dataProvider === "supabase"
    ? supabaseSiteUserRepository
    : mockSiteUserRepository;
}

export function getBannerRepository(): BannerRepository {
  return dataProvider === "supabase"
    ? supabaseBannerRepository
    : mockBannerRepository;
}

export function getBrandRepository(): BrandRepository {
  return dataProvider === "supabase"
    ? supabaseBrandRepository
    : mockBrandRepository;
}
