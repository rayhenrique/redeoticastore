import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/lib/guards/admin", () => ({
  requireAdminForApi: vi.fn(async () => null),
}));

import { PATCH } from "@/app/api/admin/leads/[id]/status/route";

describe("PATCH /api/admin/leads/:id/status", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("atualiza status de lead válido", async () => {
    const request = new Request("http://localhost/api/admin/leads/x/status", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "sold" }),
    });

    const response = await PATCH(request, {
      params: Promise.resolve({ id: "f6666666-6666-4666-8666-666666666666" }),
    });

    const payload = await response.json();
    expect(response.status).toBe(200);
    expect(payload.status).toBe("sold");
  });

  it("rejeita status inválido", async () => {
    const request = new Request("http://localhost/api/admin/leads/x/status", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "invalid-status" }),
    });

    const response = await PATCH(request, {
      params: Promise.resolve({ id: "f6666666-6666-4666-8666-666666666666" }),
    });

    expect(response.status).toBe(400);
  });
});
