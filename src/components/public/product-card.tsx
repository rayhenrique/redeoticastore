import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { AddToCartButton } from "@/components/public/add-to-cart-button";
import { formatPrice } from "@/lib/utils";
import type { Product } from "@/types/domain";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <Card data-product-card className="interactive-lift group overflow-hidden">
      <Link href={`/produto/${product.slug}`} className="block">
        <div className="relative aspect-[4/3] overflow-hidden bg-zinc-100">
          <Image
            src={product.images[0] ?? "/branding/05.jpg"}
            alt={product.name}
            fill
            data-product-image
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>
      </Link>
      <CardContent className="space-y-2 pt-4">
        <div className="flex items-center justify-between gap-2">
          <p className="line-clamp-1 text-base font-bold">{product.name}</p>
          <Badge variant="secondary">{product.category}</Badge>
        </div>
        <p className="text-sm text-zinc-600">{product.brand}</p>
        <p className="text-lg font-black">{formatPrice(product.price)}</p>
        <p className="text-xs text-zinc-500">
          Disponibilidade sujeita a confirmação.
        </p>
      </CardContent>
      <CardFooter className="pt-0">
        <AddToCartButton product={product} />
      </CardFooter>
    </Card>
  );
}
