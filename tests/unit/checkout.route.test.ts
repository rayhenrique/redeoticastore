import { describe, expect, it, vi } from "vitest";

vi.mock("@/lib/services/checkout", () => ({
  executeCheckout: vi.fn(async () => ({
    leadId: "f6666666-6666-4666-8666-666666666666",
    whatsappUrl: "https://wa.me/5582996265666?text=ola",
  })),
}));

import { POST } from "@/app/api/leads/checkout/route";

describe("POST /api/leads/checkout", () => {
  it("cria lead e retorna url do WhatsApp", async () => {
    const request = new Request("http://localhost/api/leads/checkout", {
      method: "POST",
      body: JSON.stringify({
        name: "Cliente Teste",
        whatsapp: "(82) 99999-9999",
        items: [
          {
            productId: "a1111111-1111-4111-8111-111111111111",
            quantity: 1,
          },
        ],
      }),
      headers: { "Content-Type": "application/json" },
    });

    const response = await POST(request);
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(payload.whatsappUrl).toContain("wa.me");
    expect(payload.leadId).toBeTypeOf("string");
  });
});
