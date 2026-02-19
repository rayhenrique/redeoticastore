"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CategoryIcon } from "@/lib/category-icons";
import type { ProductCategoryItem } from "@/types/domain";

interface CategoryShortcutsProps {
  categories: ProductCategoryItem[];
}

function CategoryShortcutCard({ category }: { category: ProductCategoryItem }) {
  return (
    <Link
      href={`/catalogo?category=${category.slug}`}
      className="interactive-lift group flex flex-col items-center gap-3 rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm"
    >
      <div className="relative flex h-20 w-20 items-center justify-center overflow-hidden rounded-full border-2 border-black bg-[var(--brand)] transition-transform duration-300 group-hover:scale-105">
        {category.image ? (
          <Image
            src={category.image}
            alt={category.name}
            fill
            sizes="80px"
            className="object-cover"
          />
        ) : (
          <CategoryIcon iconName={category.icon} className="h-8 w-8 text-black" />
        )}
      </div>
      <p className="text-center text-sm font-black uppercase">{category.name}</p>
      <p className="inline-flex items-center gap-1 text-xs font-semibold text-zinc-600 group-hover:text-black">
        Explorar
        <ArrowRight className="h-3.5 w-3.5" />
      </p>
    </Link>
  );
}

export function CategoryShortcuts({ categories }: CategoryShortcutsProps) {
  if (categories.length <= 4) {
    return (
      <div className="stagger-grid grid grid-flow-col auto-cols-fr gap-3 md:grid-flow-row md:grid-cols-4 md:gap-4">
        {categories.map((category) => (
          <CategoryShortcutCard key={category.id} category={category} />
        ))}
      </div>
    );
  }

  return (
    <div className="relative">
      <div className="mb-3 hidden justify-end gap-2 md:flex">
        <Button
          type="button"
          size="icon"
          variant="outline"
          onClick={() => {
            const slider = document.getElementById("category-slider");
            slider?.scrollBy({ left: -320, behavior: "smooth" });
          }}
          aria-label="Voltar categorias"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          size="icon"
          variant="outline"
          onClick={() => {
            const slider = document.getElementById("category-slider");
            slider?.scrollBy({ left: 320, behavior: "smooth" });
          }}
          aria-label="Avançar categorias"
        >
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>

      <div
        id="category-slider"
        className="stagger-grid flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2 [scrollbar-width:thin]"
      >
        {categories.map((category) => (
          <div key={category.id} className="w-[170px] shrink-0 snap-start">
            <CategoryShortcutCard category={category} />
          </div>
        ))}
      </div>
    </div>
  );
}
