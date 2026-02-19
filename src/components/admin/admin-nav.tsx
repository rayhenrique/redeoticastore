"use client";

import Image from "next/image";
import Link from "next/link";
import { LayoutGrid, Menu } from "lucide-react";
import { cn } from "@/lib/utils";
import { LogoutButton } from "@/components/admin/logout-button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const links = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/banners", label: "Banners" },
  { href: "/admin/marcas", label: "Marcas" },
  { href: "/admin/produtos", label: "Produtos" },
  { href: "/admin/categorias", label: "Categorias" },
  { href: "/admin/leads", label: "Leads" },
  { href: "/admin/usuarios", label: "Usuários" },
];

interface AdminNavProps {
  currentPath: string;
}

export function AdminNav({ currentPath }: AdminNavProps) {
  return (
    <header className="border-b border-zinc-200 bg-white">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-3 px-4 py-4 md:px-6">
        <div className="flex items-center gap-3">
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
            <p className="text-xs uppercase tracking-wide text-zinc-600">Área da Loja</p>
            <h1 className="text-xl font-black uppercase">Rede Ótica Store</h1>
          </div>
        </div>

        <div className="hidden items-center gap-2 md:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "rounded-full px-4 py-2 text-sm font-semibold",
                currentPath === link.href
                  ? "bg-[var(--brand)] text-black"
                  : "bg-zinc-100 text-zinc-700 hover:bg-zinc-200",
              )}
            >
              {link.label}
            </Link>
          ))}
          <LogoutButton />
        </div>

        <div className="flex items-center gap-2 md:hidden">
          <Dialog>
            <DialogTrigger asChild>
              <button
                type="button"
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-zinc-200 bg-white"
                aria-label="Abrir menu administrativo"
              >
                <Menu className="h-5 w-5" />
              </button>
            </DialogTrigger>
            <DialogContent className="max-w-sm">
              <DialogTitle>Menu Admin</DialogTitle>
              <nav className="mt-4 flex flex-col gap-2">
                {links.map((link) => (
                  <DialogClose key={link.href} asChild>
                    <Link
                      href={link.href}
                      className={cn(
                        "inline-flex items-center gap-2 rounded-xl border border-zinc-200 px-3 py-2 text-sm font-medium",
                        currentPath === link.href
                          ? "bg-[var(--brand)] text-black"
                          : "bg-white text-zinc-700",
                      )}
                    >
                      <LayoutGrid className="h-4 w-4" />
                      {link.label}
                    </Link>
                  </DialogClose>
                ))}
                <div className="pt-1">
                  <LogoutButton className="w-full" />
                </div>
              </nav>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </header>
  );
}
