"use client";

import Image from "next/image";
import type { BrandItem } from "@/types/domain";

interface BrandsCarouselProps {
  brands: BrandItem[];
}

function BrandCard({ brand }: { brand: BrandItem }) {
  return (
    <div className="flex w-44 shrink-0 items-center gap-3 rounded-xl border border-zinc-200 bg-white px-4 py-3">
      <div className="relative h-10 w-10 overflow-hidden rounded-full border border-zinc-200">
        <Image
          src={brand.image}
          alt={brand.name}
          fill
          sizes="40px"
          className="object-cover"
        />
      </div>
      <p className="line-clamp-1 text-sm font-semibold text-zinc-700">{brand.name}</p>
    </div>
  );
}

export function BrandsCarousel({ brands }: BrandsCarouselProps) {
  if (!brands.length) return null;

  const loopBrands = [...brands, ...brands];

  return (
    <div className="relative overflow-hidden">
      <div className="brands-marquee-track flex w-max items-center gap-3">
        {loopBrands.map((brand, index) => (
          <BrandCard key={`${brand.id}-${index}`} brand={brand} />
        ))}
      </div>
    </div>
  );
}
