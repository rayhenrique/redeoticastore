import { describe, expect, it } from "vitest";
import { checkoutSchema } from "@/lib/validators/checkout";

describe("checkoutSchema", () => {
  it("valida payload correto", () => {
    const result = checkoutSchema.safeParse({
      name: "Maria",
      whatsapp: "(82) 99999-8888",
      items: [{ productId: "123", quantity: 1 }],
    });

    expect(result.success).toBe(true);
  });

  it("rejeita payload sem itens", () => {
    const result = checkoutSchema.safeParse({
      name: "Maria",
      whatsapp: "(82) 99999-8888",
      items: [],
    });

    expect(result.success).toBe(false);
  });
});
