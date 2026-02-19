"use client";

import { useSyncExternalStore } from "react";
import Image from "next/image";
import Link from "next/link";
import { Grid3X3, Home, Info, MapPin, Menu, ShoppingBag } from "lucide-react";
import { useCartStore } from "@/stores/cart-store";
import { Button } from "@/components/ui/button";
import {
  DialogClose,
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

interface SiteHeaderProps {
  compact?: boolean;
}

export function SiteHeader({ compact = false }: SiteHeaderProps) {
  const totalItems = useCartStore((state) => state.getTotalItems());
  const hydrated = useSyncExternalStore(
    (onStoreChange) => {
      const unsubHydrate = useCartStore.persist.onHydrate(() => onStoreChange());
      const unsubFinishHydration = useCartStore.persist.onFinishHydration(() =>
        onStoreChange(),
      );
      return () => {
        unsubHydrate();
        unsubFinishHydration();
      };
    },
    () => useCartStore.persist.hasHydrated(),
    () => false,
  );
  const navItems = [
    { href: "/", label: "Home", icon: Home },
    { href: "/sobre", label: "Sobre", icon: Info },
    { href: "/catalogo", label: "Catálogo", icon: Grid3X3 },
    { href: "/onde-estamos", label: "Onde estamos?", icon: MapPin },
  ];

  return (
    <header
      className={cn(
        "sticky top-0 z-40 border-b border-zinc-200 bg-[var(--background)]/95 backdrop-blur",
        compact ? "py-2" : "py-3",
      )}
    >
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 md:px-6">
        <Link href="/" className="flex items-center gap-3">
          <div className="relative h-11 w-11 overflow-hidden rounded-full border-2 border-black">
            <Image
              src="/branding/05.jpg"
              alt="Logo Rede Ótica Store"
              fill
              sizes="44px"
              className="object-cover"
            />
          </div>
          <div>
            <p className="text-xs uppercase tracking-wide text-zinc-600">Rede Ótica</p>
            <p className="text-lg font-black uppercase leading-none">Store</p>
          </div>
        </Link>

        <nav className="hidden items-center gap-6 text-sm font-medium md:flex">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className="inline-flex items-center gap-1.5 hover:underline"
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="h-10 w-10 md:hidden"
                aria-label="Abrir menu"
              >
                <Menu className="h-5 w-5" />
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-sm">
              <DialogTitle className="text-lg font-black uppercase">Menu</DialogTitle>
              <nav className="mt-4 flex flex-col gap-2">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <DialogClose key={item.href} asChild>
                      <Link
                        href={item.href}
                        className="inline-flex items-center gap-2 rounded-xl border border-zinc-200 px-3 py-2 text-sm font-medium hover:bg-zinc-50"
                      >
                        <Icon className="h-4 w-4" />
                        {item.label}
                      </Link>
                    </DialogClose>
                  );
                })}
              </nav>
            </DialogContent>
          </Dialog>

          <Button asChild variant="secondary" size="sm" className="h-10">
            <Link href="/sacola" data-cart-target="true">
              <ShoppingBag className="h-4 w-4" />
              Sacola
              <span className="rounded-full bg-[var(--brand)] px-2 py-0.5 text-xs font-black text-black">
                {hydrated ? totalItems : 0}
              </span>
            </Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
