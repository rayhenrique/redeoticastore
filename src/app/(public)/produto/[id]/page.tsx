import { notFound } from "next/navigation";
import { AddToCartButton } from "@/components/public/add-to-cart-button";
import { ProductGallery } from "@/components/public/product-gallery";
import { Badge } from "@/components/ui/badge";
import { getProductRepository } from "@/lib/repositories";
import { formatPrice } from "@/lib/utils";

interface ProductPageProps {
  params: Promise<{ id: string }>;
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = await params;
  const repository = getProductRepository();
  const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    id,
  );
  const product = isUuid
    ? await repository.findById(id)
    : await repository.findBySlug(id);

  if (!product || !product.active) notFound();

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      <ProductGallery productName={product.name} images={product.images} />
      <div className="space-y-4 rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
        <Badge variant="secondary">{product.category}</Badge>
        <h1 className="text-3xl font-black uppercase leading-tight">{product.name}</h1>
        <p className="text-sm font-semibold text-zinc-600">{product.brand}</p>
        <p className="text-3xl font-black">{formatPrice(product.price)}</p>
        <p className="text-zinc-700">{product.description}</p>
        <p className="rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm text-zinc-600">
          Disponibilidade sujeita a confirmação.
        </p>
        <AddToCartButton product={product} />
      </div>
    </div>
  );
}
