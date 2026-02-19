"use client";

import Image from "next/image";
import { Minus, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils";
import { useCartStore } from "@/stores/cart-store";

export function CartItems() {
  const items = useCartStore((state) => state.items);
  const removeItem = useCartStore((state) => state.removeItem);
  const setQuantity = useCartStore((state) => state.setQuantity);

  if (!items.length) {
    return (
      <div className="rounded-2xl border border-zinc-200 bg-white p-8 text-center text-zinc-600">
        Sua sacola está vazia.
      </div>
    );
  }

  const total = items.reduce((acc, item) => {
    if (item.product.price === null) return acc;
    return acc + item.product.price * item.quantity;
  }, 0);

  return (
    <div className="space-y-3">
      {items.map((item) => (
        <div
          key={item.product.id}
          className="flex items-center gap-3 rounded-2xl border border-zinc-200 bg-white p-3"
        >
          <div className="relative h-20 w-20 overflow-hidden rounded-xl bg-zinc-100">
            <Image
              src={item.product.images[0] ?? "/branding/05.jpg"}
              alt={item.product.name}
              fill
              className="object-cover"
            />
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold">{item.product.name}</p>
            <p className="text-sm text-zinc-600">{formatPrice(item.product.price)}</p>
            <div className="mt-2 flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setQuantity(item.product.id, item.quantity - 1)}
                aria-label="Diminuir"
              >
                <Minus className="h-4 w-4" />
              </Button>
              <span className="w-8 text-center text-sm font-bold">{item.quantity}</span>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setQuantity(item.product.id, item.quantity + 1)}
                aria-label="Aumentar"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => removeItem(item.product.id)}
            aria-label="Remover item"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ))}

      <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
        <p className="text-sm text-zinc-600">Total estimado</p>
        <p className="text-2xl font-black">{formatPrice(total || null)}</p>
      </div>
    </div>
  );
}
