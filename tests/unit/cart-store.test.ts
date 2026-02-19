import { beforeEach, describe, expect, it } from "vitest";
import { useCartStore } from "@/stores/cart-store";
import { mockProducts } from "@/mocks/products";

describe("cart store", () => {
  beforeEach(() => {
    useCartStore.setState({ items: [] });
  });

  it("adiciona item na sacola", () => {
    useCartStore.getState().addItem(mockProducts[0]);
    expect(useCartStore.getState().items).toHaveLength(1);
  });

  it("incrementa quantidade ao adicionar item repetido", () => {
    const store = useCartStore.getState();
    store.addItem(mockProducts[0]);
    store.addItem(mockProducts[0]);

    expect(useCartStore.getState().items[0]?.quantity).toBe(2);
  });
});
