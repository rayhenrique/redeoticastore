import { mockBrands } from "@/mocks/brands";
import type {
  BrandFilters,
  BrandRepository,
  CreateBrandInput,
  UpdateBrandInput,
} from "@/lib/repositories/interfaces";
import type { BrandItem } from "@/types/domain";

let brandsState = [...mockBrands];

function matchFilters(brand: BrandItem, filters?: BrandFilters) {
  if (!filters) return true;
  if (typeof filters.active === "boolean" && brand.active !== filters.active) {
    return false;
  }
  return true;
}

function ensureNameUnique(name: string, currentId?: string) {
  const found = brandsState.find((item) => item.name.toLowerCase() === name.toLowerCase());
  if (found && found.id !== currentId) {
    throw new Error("Já existe uma marca com este nome.");
  }
}

export const mockBrandRepository: BrandRepository = {
  async list(filters) {
    return brandsState
      .filter((brand) => matchFilters(brand, filters))
      .sort((a, b) => +new Date(b.created_at) - +new Date(a.created_at));
  },

  async create(input: CreateBrandInput) {
    ensureNameUnique(input.name);
    const created: BrandItem = {
      id: crypto.randomUUID(),
      created_at: new Date().toISOString(),
      ...input,
    };
    brandsState = [created, ...brandsState];
    return created;
  },

  async update(id: string, input: UpdateBrandInput) {
    const existing = brandsState.find((brand) => brand.id === id);
    if (!existing) throw new Error("Marca não encontrada.");
    if (input.name) ensureNameUnique(input.name, id);

    const updated = { ...existing, ...input };
    brandsState = brandsState.map((brand) => (brand.id === id ? updated : brand));
    return updated;
  },

  async remove(id: string) {
    brandsState = brandsState.filter((brand) => brand.id !== id);
  },
};
