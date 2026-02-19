import { defaultHomeBanners } from "@/mocks/banners";
import type {
  BannerFilters,
  BannerRepository,
  CreateBannerInput,
  UpdateBannerInput,
} from "@/lib/repositories/interfaces";
import type { HomeBanner } from "@/types/domain";

let bannersState = [...defaultHomeBanners];

function matchFilters(banner: HomeBanner, filters?: BannerFilters) {
  if (!filters) return true;
  if (typeof filters.active === "boolean" && banner.active !== filters.active) {
    return false;
  }
  return true;
}

export const mockBannerRepository: BannerRepository = {
  async list(filters) {
    return bannersState
      .filter((banner) => matchFilters(banner, filters))
      .sort((a, b) =>
        a.position === b.position
          ? +new Date(b.created_at) - +new Date(a.created_at)
          : a.position - b.position,
      );
  },

  async create(input: CreateBannerInput) {
    const created: HomeBanner = {
      id: crypto.randomUUID(),
      created_at: new Date().toISOString(),
      ...input,
    };
    bannersState = [created, ...bannersState];
    return created;
  },

  async update(id: string, input: UpdateBannerInput) {
    const existing = bannersState.find((banner) => banner.id === id);
    if (!existing) throw new Error("Banner não encontrado.");
    const updated = { ...existing, ...input };
    bannersState = bannersState.map((banner) => (banner.id === id ? updated : banner));
    return updated;
  },

  async remove(id: string) {
    bannersState = bannersState.filter((banner) => banner.id !== id);
  },
};
