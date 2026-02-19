"use client";

import { useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ChevronDown, ChevronUp, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface CatalogFiltersProps {
  brands: string[];
  categories: string[];
  showMockHints?: boolean;
}

export function CatalogFilters({
  brands,
  categories,
  showMockHints,
}: CatalogFiltersProps) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const [search, setSearch] = useState(searchParams.get("q") ?? "");
  const [brand, setBrand] = useState(searchParams.get("brand") ?? "");
  const [category, setCategory] = useState(searchParams.get("category") ?? "");
  const [isMobileOpen, setIsMobileOpen] = useState(
    Boolean(searchParams.get("q") || searchParams.get("brand") || searchParams.get("category")),
  );

  const hasActiveFilters = useMemo(
    () => Boolean(search || brand || category),
    [search, brand, category],
  );

  function applyFilters() {
    const params = new URLSearchParams(searchParams.toString());

    if (search) params.set("q", search);
    else params.delete("q");

    if (brand) params.set("brand", brand);
    else params.delete("brand");

    if (category) params.set("category", category);
    else params.delete("category");

    router.push(`${pathname}?${params.toString()}`);
  }

  function clearFilters() {
    setSearch("");
    setBrand("");
    setCategory("");
    router.push(pathname);
  }

  return (
    <aside className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm md:sticky md:top-24 md:self-start">
      <div className="flex items-center justify-between">
        <p className="text-sm font-bold uppercase">Filtros</p>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-8 px-2 md:hidden"
          onClick={() => setIsMobileOpen((open) => !open)}
          aria-expanded={isMobileOpen}
          aria-controls="catalog-filters-content"
        >
          {isMobileOpen ? (
            <>
              Ocultar <ChevronUp className="h-4 w-4" />
            </>
          ) : (
            <>
              Mostrar <ChevronDown className="h-4 w-4" />
            </>
          )}
        </Button>
      </div>

      <div
        id="catalog-filters-content"
        className={`mt-4 space-y-3 ${isMobileOpen ? "block" : "hidden"} md:block`}
      >
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
          <Input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Buscar modelo ou marca"
            className="pl-9"
          />
        </div>

        <select
          value={category}
          onChange={(event) => setCategory(event.target.value)}
          className="h-10 w-full rounded-full border border-zinc-300 bg-white px-4 text-sm text-zinc-900"
        >
          <option value="">Todos os tipos</option>
          {categories.map((categoryItem) => (
            <option key={categoryItem} value={categoryItem}>
              {categoryItem}
            </option>
          ))}
        </select>

        <select
          value={brand}
          onChange={(event) => setBrand(event.target.value)}
          className="h-10 w-full rounded-full border border-zinc-300 bg-white px-4 text-sm text-zinc-900"
        >
          <option value="">Todas as marcas</option>
          {brands.map((brandItem) => (
            <option key={brandItem} value={brandItem}>
              {brandItem}
            </option>
          ))}
        </select>

        <div className="flex gap-2">
          <Button onClick={applyFilters} className="flex-1">
            Aplicar
          </Button>
          <Button
            variant="outline"
            onClick={clearFilters}
            className="flex-1"
            disabled={!hasActiveFilters}
          >
            Limpar
          </Button>
        </div>

        {showMockHints ? (
          <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-3 text-xs text-zinc-600">
            Filtros extras de campanha (gênero/infantil/acessórios) aparecem no
            modo mock e não persistem no banco do MVP.
          </div>
        ) : null}
      </div>
    </aside>
  );
}
