"use client";

import { useRef, useState } from "react";
import { Check, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/stores/cart-store";
import type { Product } from "@/types/domain";

interface AddToCartButtonProps {
  product: Product;
}

export function AddToCartButton({ product }: AddToCartButtonProps) {
  const addItem = useCartStore((state) => state.addItem);
  const [added, setAdded] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  function playFlyToCart() {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const buttonEl = buttonRef.current;
    const cartEl = document.querySelector("[data-cart-target='true']");
    if (!buttonEl || !(cartEl instanceof HTMLElement)) return;

    const sourceImage = buttonEl
      .closest("[data-product-card]")
      ?.querySelector("[data-product-image]");

    const startRect =
      sourceImage instanceof HTMLElement
        ? sourceImage.getBoundingClientRect()
        : buttonEl.getBoundingClientRect();
    const endRect = cartEl.getBoundingClientRect();

    const ghost = document.createElement(
      sourceImage instanceof HTMLImageElement ? "img" : "div",
    );

    if (ghost instanceof HTMLImageElement && sourceImage instanceof HTMLImageElement) {
      ghost.src = sourceImage.currentSrc || sourceImage.src;
      ghost.alt = "";
      ghost.style.objectFit = "cover";
    } else {
      ghost.style.background = "var(--brand)";
      ghost.style.border = "2px solid #000";
    }

    ghost.className = "pointer-events-none fixed z-[120] rounded-full shadow-xl";
    ghost.style.left = `${startRect.left}px`;
    ghost.style.top = `${startRect.top}px`;
    ghost.style.width = `${Math.max(32, Math.min(84, startRect.width * 0.35))}px`;
    ghost.style.height = `${Math.max(32, Math.min(84, startRect.height * 0.35))}px`;
    ghost.style.transition =
      "transform 620ms cubic-bezier(0.2, 0.7, 0.2, 1), opacity 620ms ease";
    ghost.style.transform = "translate3d(0,0,0) scale(1)";
    ghost.style.opacity = "0.95";
    document.body.appendChild(ghost);

    const dx = endRect.left + endRect.width / 2 - (startRect.left + startRect.width / 2);
    const dy = endRect.top + endRect.height / 2 - (startRect.top + startRect.height / 2);

    requestAnimationFrame(() => {
      ghost.style.transform = `translate3d(${dx}px, ${dy}px, 0) scale(0.2)`;
      ghost.style.opacity = "0.12";
    });

    cartEl.classList.remove("cart-bump");
    requestAnimationFrame(() => {
      cartEl.classList.add("cart-bump");
    });

    window.setTimeout(() => {
      ghost.remove();
      cartEl.classList.remove("cart-bump");
    }, 700);
  }

  return (
    <Button
      ref={buttonRef}
      onClick={() => {
        playFlyToCart();
        addItem(product);
        setAdded(true);
        setTimeout(() => setAdded(false), 1400);
      }}
      className="w-full"
    >
      {added ? <Check className="h-4 w-4" /> : <ShoppingBag className="h-4 w-4" />}
      {added ? "Adicionado" : "Adicionar à Sacola"}
    </Button>
  );
}
