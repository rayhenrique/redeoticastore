"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { HomeBanner } from "@/types/domain";

interface HeroCarouselProps {
  banners: HomeBanner[];
}

export function HeroCarousel({ banners }: HeroCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (!banners.length) return;
    const timer = setInterval(() => {
      setActiveIndex((current) => (current + 1) % banners.length);
    }, 5500);
    return () => clearInterval(timer);
  }, [banners.length]);

  if (!banners.length) return null;

  const active = banners[activeIndex];

  return (
    <section className="relative overflow-hidden rounded-3xl border border-zinc-200 bg-black text-white">
      <div className="absolute inset-0">
        <Image
          key={active.id}
          src={active.image}
          alt={active.title}
          fill
          priority
          className="hero-media-fx object-cover opacity-65"
        />
      </div>
      <div className="relative z-10 min-h-[24rem] bg-gradient-to-r from-black/85 via-black/55 to-black/20 p-6 md:p-10">
        <p className="inline-flex rounded-full bg-[var(--brand)] px-3 py-1 text-xs font-bold uppercase tracking-wide text-black">
          Campanha ativa
        </p>
        <h1 className="mt-5 max-w-xl text-4xl font-black uppercase leading-tight md:text-5xl">
          {active.title}
        </h1>
        <p className="mt-4 max-w-md text-base text-zinc-100 md:text-lg">
          {active.subtitle}
        </p>
        <div className="mt-7">
          <Button asChild size="lg">
            <Link href="/catalogo">
              {active.cta}
              <ChevronRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
      <div className="absolute bottom-4 left-1/2 z-20 flex -translate-x-1/2 gap-2">
        {banners.map((banner, index) => (
          <button
            key={banner.id}
            type="button"
            aria-label={`Selecionar banner ${index + 1}`}
            onClick={() => setActiveIndex(index)}
            className={`h-2.5 rounded-full transition-all ${
              index === activeIndex
                ? "w-7 bg-[var(--brand)]"
                : "w-2.5 bg-white/50 hover:bg-white/80"
            }`}
          />
        ))}
      </div>
    </section>
  );
}
