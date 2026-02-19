import type {
  BrandRepository,
  BannerRepository,
  CategoryRepository,
  LeadRepository,
  ProductRepository,
  SiteUserRepository,
} from "@/lib/repositories/interfaces";
import { supabaseBannerRepository } from "@/lib/repositories/supabase/banner-repository";
import { supabaseBrandRepository } from "@/lib/repositories/supabase/brand-repository";
import { supabaseCategoryRepository } from "@/lib/repositories/supabase/category-repository";
import { supabaseLeadRepository } from "@/lib/repositories/supabase/lead-repository";
import { supabaseProductRepository } from "@/lib/repositories/supabase/product-repository";
import { supabaseSiteUserRepository } from "@/lib/repositories/supabase/site-user-repository";

export function getProductRepository(): ProductRepository {
  return supabaseProductRepository;
}

export function getLeadRepository(): LeadRepository {
  return supabaseLeadRepository;
}

export function getCategoryRepository(): CategoryRepository {
  return supabaseCategoryRepository;
}

export function getSiteUserRepository(): SiteUserRepository {
  return supabaseSiteUserRepository;
}

export function getBannerRepository(): BannerRepository {
  return supabaseBannerRepository;
}

export function getBrandRepository(): BrandRepository {
  return supabaseBrandRepository;
}
