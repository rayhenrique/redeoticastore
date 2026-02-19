import { mockUsers } from "@/mocks/users";
import type {
  CreateSiteUserInput,
  SiteUserRepository,
  UpdateSiteUserInput,
} from "@/lib/repositories/interfaces";
import type { SiteUser } from "@/types/domain";

let usersState = [...mockUsers];

function ensureEmailUnique(email: string, currentId?: string) {
  const found = usersState.find(
    (user) => user.email.toLowerCase() === email.toLowerCase(),
  );
  if (found && found.id !== currentId) {
    throw new Error("Já existe um usuário com este e-mail.");
  }
}

export const mockSiteUserRepository: SiteUserRepository = {
  async list() {
    return usersState.sort(
      (a, b) => +new Date(b.created_at) - +new Date(a.created_at),
    );
  },

  async create(input: CreateSiteUserInput) {
    ensureEmailUnique(input.email);

    const created: SiteUser = {
      id: crypto.randomUUID(),
      created_at: new Date().toISOString(),
      ...input,
    };
    usersState = [created, ...usersState];
    return created;
  },

  async update(id: string, input: UpdateSiteUserInput) {
    const existing = usersState.find((user) => user.id === id);
    if (!existing) throw new Error("Usuário não encontrado.");

    if (input.email) ensureEmailUnique(input.email, id);
    const updated = { ...existing, ...input };
    usersState = usersState.map((user) => (user.id === id ? updated : user));
    return updated;
  },

  async remove(id: string) {
    usersState = usersState.filter((user) => user.id !== id);
  },
};
