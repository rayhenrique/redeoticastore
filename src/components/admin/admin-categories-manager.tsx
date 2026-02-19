"use client";

import { type FormEvent, useMemo, useState } from "react";
import Image from "next/image";
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
import { CategoryIcon, categoryIconOptions } from "@/lib/category-icons";
import type { ProductCategoryItem } from "@/types/domain";

interface AdminCategoriesManagerProps {
  initialCategories: ProductCategoryItem[];
}

interface CategoryFormState {
  name: string;
  slug: string;
  icon: string;
  image: string;
  active: boolean;
}

const initialForm: CategoryFormState = {
  name: "",
  slug: "",
  icon: "sparkles",
  image: "",
  active: true,
};

function normalizeSlug(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

export function AdminCategoriesManager({
  initialCategories,
}: AdminCategoriesManagerProps) {
  const [categories, setCategories] = useState(initialCategories);
  const [form, setForm] = useState<CategoryFormState>(initialForm);
  const [editingCategory, setEditingCategory] = useState<ProductCategoryItem | null>(null);
  const [editForm, setEditForm] = useState<CategoryFormState>(initialForm);
  const [submitting, setSubmitting] = useState(false);
  const [savingEdit, setSavingEdit] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sortedCategories = useMemo(
    () =>
      [...categories].sort((a, b) => +new Date(b.created_at) - +new Date(a.created_at)),
    [categories],
  );

  async function createCategory(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const response = await fetch("/api/admin/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          slug: normalizeSlug(form.slug || form.name),
          icon: form.image ? null : form.icon,
          image: form.image || null,
          active: form.active,
        }),
      });

      const data = (await response.json()) as ProductCategoryItem | { error: string };
      if (!response.ok || !("id" in data)) {
        throw new Error("error" in data ? data.error : "Erro ao criar categoria.");
      }

      setCategories((current) => [data, ...current]);
      setForm(initialForm);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao criar categoria.");
    } finally {
      setSubmitting(false);
    }
  }

  async function toggleActive(category: ProductCategoryItem) {
    const response = await fetch(`/api/admin/categories/${category.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ active: !category.active }),
    });
    if (!response.ok) return;
    const data = (await response.json()) as ProductCategoryItem;
    setCategories((current) =>
      current.map((item) => (item.id === data.id ? data : item)),
    );
  }

  async function removeCategory(id: string) {
    const response = await fetch(`/api/admin/categories/${id}`, { method: "DELETE" });
    if (!response.ok) return;
    setCategories((current) => current.filter((item) => item.id !== id));
  }

  async function saveEdit() {
    if (!editingCategory) return;

    setSavingEdit(true);
    setError(null);

    try {
      const response = await fetch(`/api/admin/categories/${editingCategory.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: editForm.name,
          slug: normalizeSlug(editForm.slug || editForm.name),
          icon: editForm.image ? null : editForm.icon,
          image: editForm.image || null,
          active: editForm.active,
        }),
      });

      const data = (await response.json()) as ProductCategoryItem | { error: string };
      if (!response.ok || !("id" in data)) {
        throw new Error("error" in data ? data.error : "Erro ao atualizar categoria.");
      }

      setCategories((current) => current.map((item) => (item.id === data.id ? data : item)));
      setEditingCategory(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao atualizar categoria.");
    } finally {
      setSavingEdit(false);
    }
  }

  async function handleFileUpload(file: File) {
    setUploadingImage(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/admin/categories/upload", {
        method: "POST",
        body: formData,
      });

      const data = (await response.json()) as { url?: string; error?: string };
      if (!response.ok || !data.url) {
        throw new Error(data.error ?? "Erro no upload da imagem.");
      }

      setForm((current) => ({ ...current, image: data.url!, icon: "" }));
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
          <CardTitle>Nova Categoria</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={createCategory} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="category-name">Nome</Label>
              <Input
                id="category-name"
                value={form.name}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    name: event.target.value,
                    slug: normalizeSlug(event.target.value),
                  }))
                }
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category-slug">Slug</Label>
              <Input
                id="category-slug"
                value={form.slug}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    slug: normalizeSlug(event.target.value),
                  }))
                }
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category-icon">Ícone da categoria</Label>
              <select
                id="category-icon"
                className="h-10 w-full rounded-full border border-zinc-300 px-4 text-sm"
                value={form.icon}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    icon: event.target.value,
                    image: "",
                  }))
                }
                disabled={Boolean(form.image)}
              >
                {categoryIconOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="category-image">Imagem da categoria (opcional)</Label>
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
                    if (file) void handleFileUpload(file);
                  }}
                />
              </label>
              <Input
                id="category-image"
                value={form.image}
                placeholder="/uploads/categoria.jpg"
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    image: event.target.value,
                    icon: event.target.value ? "" : current.icon || "sparkles",
                  }))
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
              Categoria ativa
            </label>
            <Button type="submit" className="w-full" disabled={submitting}>
              {submitting ? (
                <>
                  <LoaderCircle className="h-4 w-4 animate-spin" />
                  Salvando...
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4" />
                  Cadastrar categoria
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
        {sortedCategories.map((category) => (
          <CategoryListItem
            key={category.id}
            category={category}
            onToggle={toggleActive}
            onRemove={removeCategory}
            onEdit={(categoryItem) => {
              setEditingCategory(categoryItem);
              setEditForm({
                name: categoryItem.name,
                slug: categoryItem.slug,
                icon: categoryItem.icon ?? "sparkles",
                image: categoryItem.image ?? "",
                active: categoryItem.active,
              });
            }}
          />
        ))}
      </div>

      <Dialog
        open={Boolean(editingCategory)}
        onOpenChange={(open) => {
          if (!open) setEditingCategory(null);
        }}
      >
        <DialogContent className="max-w-md">
          <DialogTitle>Editar Categoria</DialogTitle>
          <div className="space-y-3">
            <div className="space-y-2">
              <Label htmlFor="edit-category-name">Nome</Label>
              <Input
                id="edit-category-name"
                value={editForm.name}
                onChange={(event) =>
                  setEditForm((current) => ({
                    ...current,
                    name: event.target.value,
                    slug: normalizeSlug(event.target.value),
                  }))
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-category-slug">Slug</Label>
              <Input
                id="edit-category-slug"
                value={editForm.slug}
                onChange={(event) =>
                  setEditForm((current) => ({
                    ...current,
                    slug: normalizeSlug(event.target.value),
                  }))
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-category-icon">Ícone</Label>
              <select
                id="edit-category-icon"
                className="h-10 w-full rounded-full border border-zinc-300 px-4 text-sm"
                value={editForm.icon}
                onChange={(event) =>
                  setEditForm((current) => ({
                    ...current,
                    icon: event.target.value,
                    image: "",
                  }))
                }
                disabled={Boolean(editForm.image)}
              >
                {categoryIconOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-category-image">Imagem (opcional)</Label>
              <Input
                id="edit-category-image"
                value={editForm.image}
                onChange={(event) =>
                  setEditForm((current) => ({
                    ...current,
                    image: event.target.value,
                    icon: event.target.value ? "" : current.icon || "sparkles",
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
              Categoria ativa
            </label>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setEditingCategory(null)}>
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

function CategoryListItem({
  category,
  onToggle,
  onRemove,
  onEdit,
}: {
  category: ProductCategoryItem;
  onToggle: (category: ProductCategoryItem) => void;
  onRemove: (id: string) => void;
  onEdit: (category: ProductCategoryItem) => void;
}) {
  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-3">
          <div className="relative flex h-12 w-12 items-center justify-center overflow-hidden rounded-full border border-zinc-200 bg-zinc-50">
            {category.image ? (
              <Image
                src={category.image}
                alt={category.name}
                fill
                sizes="48px"
                className="object-cover"
              />
            ) : (
              <CategoryIcon
                iconName={category.icon}
                className="h-5 w-5 text-zinc-700"
              />
            )}
          </div>
          <div>
            <p className="text-base font-bold">{category.name}</p>
            <p className="text-sm text-zinc-600">Slug: {category.slug}</p>
          </div>
        </div>
        <div className="flex w-full items-center gap-2 sm:w-auto">
          <Button
            size="sm"
            variant={category.active ? "secondary" : "outline"}
            className="flex-1 sm:flex-none"
            onClick={() => onToggle(category)}
          >
            {category.active ? "Ativa" : "Inativa"}
          </Button>
          <Button
            size="icon"
            variant="outline"
            className="shrink-0"
            onClick={() => onEdit(category)}
          >
            <Edit3 className="h-4 w-4" />
          </Button>
          <Button
            size="icon"
            variant="destructive"
            className="shrink-0"
            onClick={() => onRemove(category.id)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
