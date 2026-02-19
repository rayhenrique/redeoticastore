"use client";

import { type FormEvent, useMemo, useState } from "react";
import Link from "next/link";
import { Edit3, LoaderCircle, Plus, Trash2, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { formatPrice } from "@/lib/utils";
import type { Product, ProductCategoryItem } from "@/types/domain";

interface AdminProductsManagerProps {
  initialProducts: Product[];
  initialCategories: ProductCategoryItem[];
}

interface ProductFormState {
  name: string;
  brand: string;
  category: string;
  price: string;
  description: string;
  images: string[];
  active: boolean;
}

const MAX_PRODUCT_IMAGES = 3;
const defaultProductImage = "/branding/06.jpg";

function normalizeProductImages(images: string[]) {
  return images
    .map((value) => value.trim())
    .filter(Boolean)
    .slice(0, MAX_PRODUCT_IMAGES);
}

function buildInitialForm(defaultCategory: string): ProductFormState {
  return {
    name: "",
    brand: "",
    category: defaultCategory,
    price: "",
    description: "",
    images: [""],
    active: true,
  };
}

export function AdminProductsManager({
  initialProducts,
  initialCategories,
}: AdminProductsManagerProps) {
  const defaultCategory = initialCategories.find((item) => item.active)?.slug ?? "solar";
  const [products, setProducts] = useState(initialProducts);
  const [form, setForm] = useState<ProductFormState>(buildInitialForm(defaultCategory));
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editForm, setEditForm] = useState<ProductFormState>(buildInitialForm(defaultCategory));
  const [categories] = useState(initialCategories);
  const [submitting, setSubmitting] = useState(false);
  const [savingEdit, setSavingEdit] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const activeCategories = useMemo(
    () => categories.filter((category) => category.active),
    [categories],
  );

  const sortedProducts = useMemo(
    () => [...products].sort((a, b) => +new Date(b.created_at) - +new Date(a.created_at)),
    [products],
  );

  async function createProduct(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const images = normalizeProductImages(form.images);
      const response = await fetch("/api/admin/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          brand: form.brand,
          category: form.category,
          price: form.price ? Number(form.price) : null,
          description: form.description || null,
          images: images.length ? images : [defaultProductImage],
          active: form.active,
        }),
      });

      const data = (await response.json()) as Product | { error: string };
      if (!response.ok || !("id" in data)) {
        throw new Error("error" in data ? data.error : "Erro ao criar produto.");
      }

      setProducts((current) => [data, ...current]);
      setForm(buildInitialForm(defaultCategory));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao criar produto.");
    } finally {
      setSubmitting(false);
    }
  }

  async function toggleActive(product: Product) {
    const response = await fetch(`/api/admin/products/${product.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ active: !product.active }),
    });
    if (!response.ok) return;
    const data = (await response.json()) as Product;
    setProducts((current) => current.map((item) => (item.id === data.id ? data : item)));
  }

  async function removeProduct(id: string) {
    const response = await fetch(`/api/admin/products/${id}`, { method: "DELETE" });
    if (!response.ok) return;
    setProducts((current) => current.filter((item) => item.id !== id));
  }

  async function saveEdit() {
    if (!editingProduct) return;
    setSavingEdit(true);
    setError(null);

    try {
      const images = normalizeProductImages(editForm.images);
      const response = await fetch(`/api/admin/products/${editingProduct.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: editForm.name,
          brand: editForm.brand,
          category: editForm.category,
          price: editForm.price ? Number(editForm.price) : null,
          description: editForm.description || null,
          images: images.length ? images : [defaultProductImage],
          active: editForm.active,
        }),
      });

      const data = (await response.json()) as Product | { error: string };
      if (!response.ok || !("id" in data)) {
        throw new Error("error" in data ? data.error : "Erro ao atualizar produto.");
      }

      setProducts((current) => current.map((item) => (item.id === data.id ? data : item)));
      setEditingProduct(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao atualizar produto.");
    } finally {
      setSavingEdit(false);
    }
  }

  async function handleFileUpload(file: File, target: "create" | "edit", imageIndex: number) {
    setUploadingImage(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/admin/products/upload", {
        method: "POST",
        body: formData,
      });

      const data = (await response.json()) as { url?: string; error?: string };
      if (!response.ok || !data.url) {
        throw new Error(data.error ?? "Erro no upload da imagem.");
      }

      if (target === "create") {
        setForm((current) => {
          const images = [...current.images];
          images[imageIndex] = data.url!;
          return { ...current, images };
        });
        return;
      }

      setEditForm((current) => {
        const images = [...current.images];
        images[imageIndex] = data.url!;
        return { ...current, images };
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro no upload da imagem.");
    } finally {
      setUploadingImage(false);
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[360px,1fr]">
      <Card>
        <CardHeader>
          <CardTitle>Novo Produto</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={createProduct} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome</Label>
              <Input
                id="name"
                value={form.name}
                onChange={(event) =>
                  setForm((current) => ({ ...current, name: event.target.value }))
                }
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="brand">Marca</Label>
              <Input
                id="brand"
                value={form.brand}
                onChange={(event) =>
                  setForm((current) => ({ ...current, brand: event.target.value }))
                }
                required
              />
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="category">Categoria</Label>
                <select
                  id="category"
                  className="h-10 w-full rounded-full border border-zinc-300 px-4 text-sm"
                  value={form.category}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      category: event.target.value,
                    }))
                  }
                >
                  {activeCategories.length ? (
                    activeCategories.map((category) => (
                      <option key={category.id} value={category.slug}>
                        {category.name}
                      </option>
                    ))
                  ) : (
                    <option value="">Cadastre uma categoria primeiro</option>
                  )}
                </select>
                <Link
                  href="/admin/categorias"
                  className="mt-1 inline-block text-xs font-semibold text-zinc-600 hover:underline"
                >
                  Gerenciar categorias
                </Link>
              </div>
              <div className="space-y-2">
                <Label htmlFor="price">Preço</Label>
                <Input
                  id="price"
                  type="number"
                  min="0"
                  step="0.01"
                  value={form.price}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, price: event.target.value }))
                  }
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Imagens</Label>
              <p className="text-xs text-zinc-600">
                Envie até 3 imagens por produto (1 principal + 2 adicionais).
              </p>
              <label className="flex cursor-pointer items-center justify-center gap-2 rounded-full border border-dashed border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50">
                <Upload className="h-4 w-4" />
                {uploadingImage ? "Enviando..." : "Enviar arquivo"}
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  disabled={uploadingImage}
                  onChange={(event) => {
                    const file = event.target.files?.[0];
                    if (file) void handleFileUpload(file, "create", 0);
                  }}
                />
              </label>
              <div className="space-y-2">
                {Array.from({ length: MAX_PRODUCT_IMAGES }).map((_, index) => (
                  <div key={`create-image-${index}`} className="space-y-2">
                    <Label htmlFor={`image-${index}`}>
                      {index === 0 ? "Imagem principal" : `Imagem ${index + 1}`}
                    </Label>
                    <div className="flex gap-2">
                      <Input
                        id={`image-${index}`}
                        value={form.images[index] ?? ""}
                        placeholder={
                          index === 0
                            ? "URL da imagem principal"
                            : `URL da imagem ${index + 1} (opcional)`
                        }
                        onChange={(event) =>
                          setForm((current) => {
                            const images = [...current.images];
                            images[index] = event.target.value;
                            return { ...current, images };
                          })
                        }
                      />
                      <Button
                        type="button"
                        variant="outline"
                        disabled={uploadingImage}
                        onClick={() =>
                          document.getElementById(`upload-create-image-${index}`)?.click()
                        }
                      >
                        Upload
                      </Button>
                    </div>
                    <input
                      id={`upload-create-image-${index}`}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      disabled={uploadingImage}
                      onChange={(event) => {
                        const file = event.target.files?.[0];
                        if (file) void handleFileUpload(file, "create", index);
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Descrição</Label>
              <Textarea
                id="description"
                value={form.description}
                onChange={(event) =>
                  setForm((current) => ({ ...current, description: event.target.value }))
                }
              />
            </div>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={form.active}
                onChange={(event) =>
                  setForm((current) => ({ ...current, active: event.target.checked }))
                }
              />
              Produto ativo
            </label>
            <Button
              type="submit"
              className="w-full"
              disabled={submitting || !activeCategories.length}
            >
              {submitting ? (
                <>
                  <LoaderCircle className="h-4 w-4 animate-spin" />
                  Salvando...
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4" />
                  Cadastrar produto
                </>
              )}
            </Button>
          </form>
          {error ? (
            <p className="mt-4 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              {error}
            </p>
          ) : null}
        </CardContent>
      </Card>

      <div className="space-y-3">
        {sortedProducts.map((product) => (
          <div
            key={product.id}
            className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm"
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <p className="text-base font-bold">{product.name}</p>
                <p className="text-sm text-zinc-600">
                  {product.brand} · {product.category}
                </p>
              </div>
              <div className="flex w-full items-center gap-2 sm:w-auto">
                <Button
                  size="sm"
                  variant={product.active ? "secondary" : "outline"}
                  className="flex-1 sm:flex-none"
                  onClick={() => toggleActive(product)}
                >
                  {product.active ? "Ativo" : "Inativo"}
                </Button>
                <Button
                  size="icon"
                  variant="outline"
                  className="shrink-0"
                  onClick={() => {
                    setEditingProduct(product);
                    setEditForm({
                      name: product.name,
                      brand: product.brand,
                      category: product.category,
                      price: product.price?.toString() ?? "",
                      description: product.description ?? "",
                      images: [
                        product.images[0] ?? "",
                        product.images[1] ?? "",
                        product.images[2] ?? "",
                      ],
                      active: product.active,
                    });
                  }}
                >
                  <Edit3 className="h-4 w-4" />
                </Button>
                <Button
                  size="icon"
                  variant="destructive"
                  className="shrink-0"
                  onClick={() => removeProduct(product.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <p className="mt-3 text-sm text-zinc-700">{product.description ?? "Sem descrição."}</p>
            <p className="mt-2 text-sm font-semibold">{formatPrice(product.price)}</p>
          </div>
        ))}
      </div>

      <Dialog
        open={Boolean(editingProduct)}
        onOpenChange={(open) => {
          if (!open) setEditingProduct(null);
        }}
      >
        <DialogContent className="max-w-md">
          <DialogTitle>Editar Produto</DialogTitle>
          <div className="space-y-3">
            <div className="space-y-2">
              <Label htmlFor="edit-product-name">Nome</Label>
              <Input
                id="edit-product-name"
                value={editForm.name}
                onChange={(event) =>
                  setEditForm((current) => ({ ...current, name: event.target.value }))
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-product-brand">Marca</Label>
              <Input
                id="edit-product-brand"
                value={editForm.brand}
                onChange={(event) =>
                  setEditForm((current) => ({ ...current, brand: event.target.value }))
                }
              />
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="edit-product-category">Categoria</Label>
                <select
                  id="edit-product-category"
                  className="h-10 w-full rounded-full border border-zinc-300 px-4 text-sm"
                  value={editForm.category}
                  onChange={(event) =>
                    setEditForm((current) => ({ ...current, category: event.target.value }))
                  }
                >
                  {activeCategories.map((category) => (
                    <option key={category.id} value={category.slug}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-product-price">Preço</Label>
                <Input
                  id="edit-product-price"
                  type="number"
                  min="0"
                  step="0.01"
                  value={editForm.price}
                  onChange={(event) =>
                    setEditForm((current) => ({ ...current, price: event.target.value }))
                  }
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Imagens</Label>
              {Array.from({ length: MAX_PRODUCT_IMAGES }).map((_, index) => (
                <div key={`edit-image-${index}`} className="space-y-2">
                  <Label htmlFor={`edit-product-image-${index}`}>
                    {index === 0 ? "Imagem principal" : `Imagem ${index + 1}`}
                  </Label>
                  <div className="flex gap-2">
                    <Input
                      id={`edit-product-image-${index}`}
                      value={editForm.images[index] ?? ""}
                      placeholder={
                        index === 0
                          ? "URL da imagem principal"
                          : `URL da imagem ${index + 1} (opcional)`
                      }
                      onChange={(event) =>
                        setEditForm((current) => {
                          const images = [...current.images];
                          images[index] = event.target.value;
                          return { ...current, images };
                        })
                      }
                    />
                    <Button
                      type="button"
                      variant="outline"
                      disabled={uploadingImage}
                      onClick={() =>
                        document.getElementById(`upload-edit-image-${index}`)?.click()
                      }
                    >
                      Upload
                    </Button>
                  </div>
                  <input
                    id={`upload-edit-image-${index}`}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    disabled={uploadingImage}
                    onChange={(event) => {
                      const file = event.target.files?.[0];
                      if (file) void handleFileUpload(file, "edit", index);
                    }}
                  />
                </div>
              ))}
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-product-description">Descrição</Label>
              <Textarea
                id="edit-product-description"
                value={editForm.description}
                onChange={(event) =>
                  setEditForm((current) => ({
                    ...current,
                    description: event.target.value,
                  }))
                }
              />
            </div>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={editForm.active}
                onChange={(event) =>
                  setEditForm((current) => ({ ...current, active: event.target.checked }))
                }
              />
              Produto ativo
            </label>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setEditingProduct(null)}>
              Cancelar
            </Button>
            <Button type="button" onClick={saveEdit} disabled={savingEdit}>
              {savingEdit ? (
                <>
                  <LoaderCircle className="h-4 w-4 animate-spin" />
                  Salvando...
                </>
              ) : (
                "Salvar"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
