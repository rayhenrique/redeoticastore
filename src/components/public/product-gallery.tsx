"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { Expand } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface ProductGalleryProps {
  productName: string;
  images: string[];
}

export function ProductGallery({ productName, images }: ProductGalleryProps) {
  const galleryImages = useMemo(
    () => (images.length ? images : ["/branding/05.jpg"]),
    [images],
  );
  const [selectedIndex, setSelectedIndex] = useState(0);

  const selectedImage = galleryImages[selectedIndex] ?? galleryImages[0];

  return (
    <div className="space-y-3">
      <Dialog>
        <DialogTrigger asChild>
          <button
            type="button"
            className="group relative block aspect-[4/3] w-full overflow-hidden rounded-3xl border border-zinc-200 bg-zinc-100"
            aria-label="Ampliar imagem do produto"
          >
            <Image
              src={selectedImage}
              alt={productName}
              fill
              priority
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <span className="absolute bottom-3 right-3 inline-flex items-center gap-1 rounded-full bg-black/75 px-2.5 py-1 text-xs font-semibold text-white">
              <Expand className="h-3.5 w-3.5" />
              Ampliar
            </span>
          </button>
        </DialogTrigger>
        <DialogContent className="max-w-4xl border-none bg-transparent p-0 shadow-none">
          <DialogTitle className="sr-only">Imagem ampliada de {productName}</DialogTitle>
          <DialogDescription className="sr-only">
            Visualização ampliada da imagem selecionada do produto.
          </DialogDescription>
          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-white/20 bg-black/70">
            <Image
              src={selectedImage}
              alt={`${productName} ampliado`}
              fill
              sizes="90vw"
              className="object-contain"
            />
          </div>
        </DialogContent>
      </Dialog>

      <div className="grid grid-cols-3 gap-3">
        {galleryImages.slice(0, 6).map((image, index) => (
          <Button
            key={`${image}-${index}`}
            type="button"
            variant="outline"
            onClick={() => setSelectedIndex(index)}
            className={`relative h-auto overflow-hidden rounded-2xl p-0 ${
              selectedIndex === index
                ? "ring-2 ring-black ring-offset-2 ring-offset-white"
                : ""
            }`}
            aria-label={`Selecionar imagem ${index + 1}`}
          >
            <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-zinc-100">
              <Image
                src={image}
                alt={`${productName} ${index + 1}`}
                fill
                sizes="160px"
                className="object-cover"
              />
            </div>
          </Button>
        ))}
      </div>
    </div>
  );
}
