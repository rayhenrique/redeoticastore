import { mockProducts } from "@/mocks/products";
import type {
  CreateProductInput,
  ProductFilters,
  ProductRepository,
  UpdateProductInput,
} from "@/lib/repositories/interfaces";
import { slugifyProductName } from "@/lib/utils";
import type { Product } from "@/types/domain";

let productsState = [...mockProducts];

function matchFilters(product: Product, filters?: ProductFilters) {
  if (!filters) return true;

  if (typeof filters.active === "boolean" && product.active !== filters.active) {
    return false;
  }

  if (filters.category && product.category !== filters.category) return false;

  if (
    filters.brand &&
    product.brand.toLowerCase() !== filters.brand.toLowerCase()
  ) {
    return false;
  }

  if (filters.q) {
    const q = filters.q.toLowerCase();
    const haystack = `${product.name} ${product.brand}`.toLowerCase();
    if (!haystack.includes(q)) return false;
  }

  return true;
}

function uuidMock() {
  return crypto.randomUUID();
}

export const mockProductRepository: ProductRepository = {
  async list(filters) {
    return productsState
      .filter((product) => matchFilters(product, filters))
      .sort((a, b) => +new Date(b.created_at) - +new Date(a.created_at));
  },

  async listByIds(ids) {
    const set = new Set(ids);
    return productsState.filter((product) => set.has(product.id) && product.active);
  },

  async findById(id) {
    return productsState.find((product) => product.id === id) ?? null;
  },

  async findBySlug(slug) {
    return productsState.find((product) => product.slug === slug) ?? null;
  },

  async create(input: CreateProductInput) {
    const created: Product = {
      id: uuidMock(),
      slug: slugifyProductName(input.name),
      created_at: new Date().toISOString(),
      ...input,
    };
    productsState = [created, ...productsState];
    return created;
  },

  async update(id, input: UpdateProductInput) {
    const existing = productsState.find((product) => product.id === id);
    if (!existing) {
      throw new Error("Produto não encontrado.");
    }

    const updated = {
      ...existing,
      ...input,
      ...(input.name ? { slug: slugifyProductName(input.name) } : {}),
    };
    productsState = productsState.map((product) =>
      product.id === id ? updated : product,
    );
    return updated;
  },

  async remove(id) {
    productsState = productsState.filter((product) => product.id !== id);
  },
};
