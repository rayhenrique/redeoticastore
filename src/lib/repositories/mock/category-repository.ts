import { mockCategories } from "@/mocks/categories";
import type {
  CategoryRepository,
  CreateCategoryInput,
  UpdateCategoryInput,
} from "@/lib/repositories/interfaces";
import type { ProductCategoryItem } from "@/types/domain";

let categoriesState = [...mockCategories];

function ensureSlugUnique(slug: string, currentId?: string) {
  const found = categoriesState.find(
    (category) => category.slug.toLowerCase() === slug.toLowerCase(),
  );

  if (found && found.id !== currentId) {
    throw new Error("Já existe uma categoria com este slug.");
  }
}

export const mockCategoryRepository: CategoryRepository = {
  async list() {
    return categoriesState.sort(
      (a, b) => +new Date(b.created_at) - +new Date(a.created_at),
    );
  },

  async create(input: CreateCategoryInput) {
    ensureSlugUnique(input.slug);

    const created: ProductCategoryItem = {
      id: crypto.randomUUID(),
      created_at: new Date().toISOString(),
      ...input,
    };

    categoriesState = [created, ...categoriesState];
    return created;
  },

  async update(id: string, input: UpdateCategoryInput) {
    const existing = categoriesState.find((category) => category.id === id);
    if (!existing) throw new Error("Categoria não encontrada.");

    if (input.slug) ensureSlugUnique(input.slug, id);
    const updated = { ...existing, ...input };
    categoriesState = categoriesState.map((category) =>
      category.id === id ? updated : category,
    );
    return updated;
  },

  async remove(id: string) {
    categoriesState = categoriesState.filter((category) => category.id !== id);
  },
};
