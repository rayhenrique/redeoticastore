"use client";

import { useMemo, useRef, useState } from "react";
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
  const [mobilePage, setMobilePage] = useState(0);
  const touchStartXRef = useRef<number | null>(null);
  const mobilePages = useMemo(() => {
    const chunks: ProductCategoryItem[][] = [];
    for (let i = 0; i < categories.length; i += 3) {
      chunks.push(categories.slice(i, i + 3));
    }
    return chunks;
  }, [categories]);
  const maxMobilePage = Math.max(0, mobilePages.length - 1);

  function goToPrevMobilePage() {
    setMobilePage((prev) => Math.max(0, prev - 1));
  }

  function goToNextMobilePage() {
    setMobilePage((prev) => Math.min(maxMobilePage, prev + 1));
  }

  return (
    <>
      <div className="md:hidden">
        {categories.length <= 3 ? (
          <div className="stagger-grid grid grid-cols-3 gap-3">
            {categories.map((category) => (
              <CategoryShortcutCard key={category.id} category={category} />
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            <div className="overflow-hidden">
              <div
                className="flex transition-transform duration-300 ease-out"
                style={{ transform: `translateX(-${mobilePage * 100}%)` }}
                onTouchStart={(event) => {
                  touchStartXRef.current = event.changedTouches[0]?.clientX ?? null;
                }}
                onTouchEnd={(event) => {
                  const startX = touchStartXRef.current;
                  const endX = event.changedTouches[0]?.clientX ?? null;
                  touchStartXRef.current = null;
                  if (startX === null || endX === null) return;

                  const delta = endX - startX;
                  const swipeThreshold = 40;
                  if (Math.abs(delta) < swipeThreshold) return;

                  if (delta < 0) {
                    goToNextMobilePage();
                  } else {
                    goToPrevMobilePage();
                  }
                }}
              >
                {mobilePages.map((page, pageIndex) => (
                  <div
                    key={`mobile-page-${pageIndex}`}
                    className="grid w-full shrink-0 grid-cols-3 gap-3"
                  >
                    {page.map((category) => (
                      <CategoryShortcutCard key={category.id} category={category} />
                    ))}
                    {page.length < 3
                      ? Array.from({ length: 3 - page.length }).map((_, idx) => (
                          <div key={`empty-${pageIndex}-${idx}`} />
                        ))
                      : null}
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between">
              <Button
                type="button"
                size="icon"
                variant="outline"
                className="h-8 w-8"
                onClick={goToPrevMobilePage}
                disabled={mobilePage === 0}
                aria-label="Página anterior de categorias"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>

              <div className="flex items-center gap-1.5">
                {mobilePages.map((_, index) => (
                  <button
                    key={`mobile-indicator-${index}`}
                    type="button"
                    onClick={() => setMobilePage(index)}
                    className={`h-2 rounded-full transition-all ${
                      mobilePage === index ? "w-5 bg-black" : "w-2 bg-zinc-300"
                    }`}
                    aria-label={`Ir para página ${index + 1}`}
                  />
                ))}
              </div>

              <Button
                type="button"
                size="icon"
                variant="outline"
                className="h-8 w-8"
                onClick={goToNextMobilePage}
                disabled={mobilePage === maxMobilePage}
                aria-label="Próxima página de categorias"
              >
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </div>

      <div className="hidden md:block">
        {categories.length <= 4 ? (
          <div className="stagger-grid grid gap-4 md:grid-cols-4">
            {categories.map((category) => (
              <CategoryShortcutCard key={category.id} category={category} />
            ))}
          </div>
        ) : (
          <div className="relative">
            <div className="mb-3 flex justify-end gap-2">
              <Button
                type="button"
                size="icon"
                variant="outline"
                onClick={() => {
                  const slider = document.getElementById("category-slider-desktop");
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
                  const slider = document.getElementById("category-slider-desktop");
                  slider?.scrollBy({ left: 320, behavior: "smooth" });
                }}
                aria-label="Avançar categorias"
              >
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>

            <div
              id="category-slider-desktop"
              className="stagger-grid flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2 [scrollbar-width:thin]"
            >
              {categories.map((category) => (
                <div key={category.id} className="w-[190px] shrink-0 snap-start">
                  <CategoryShortcutCard category={category} />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
