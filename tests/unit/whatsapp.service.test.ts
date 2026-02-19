import { describe, expect, it } from "vitest";
import { buildWhatsAppMessage, buildWhatsAppUrl } from "@/lib/services/whatsapp";

describe("whatsapp service", () => {
  it("monta mensagem com lista de produtos", () => {
    const message = buildWhatsAppMessage({
      name: "Joana",
      products: [
        {
          productId: "abc",
          name: "Solar Street Black",
          price: 289.9,
          quantity: 1,
          url: "http://localhost:3000/produto/abc",
        },
      ],
    });

    expect(message).toContain("Joana");
    expect(message).toContain("Solar Street Black");
  });

  it("gera URL wa.me válida", () => {
    const url = buildWhatsAppUrl("Olá");
    expect(url).toContain("https://wa.me/");
    expect(url).toContain("text=");
  });
});
