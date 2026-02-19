"use client";

import Image from "next/image";
import { type FormEvent, useMemo, useState } from "react";
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
import type { BrandItem } from "@/types/domain";

interface AdminBrandsManagerProps {
  initialBrands: BrandItem[];
}

interface BrandFormState {
  name: string;
  image: string;
  active: boolean;
}

const initialForm: BrandFormState = {
  name: "",
  image: "",
  active: true,
};

export function AdminBrandsManager({ initialBrands }: AdminBrandsManagerProps) {
  const [brands, setBrands] = useState(initialBrands);
  const [form, setForm] = useState(initialForm);
  const [editingBrand, setEditingBrand] = useState<BrandItem | null>(null);
  const [editForm, setEditForm] = useState(initialForm);
  const [submitting, setSubmitting] = useState(false);
  const [savingEdit, setSavingEdit] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sortedBrands = useMemo(
    () => [...brands].sort((a, b) => +new Date(b.created_at) - +new Date(a.created_at)),
    [brands],
  );

  async function createBrand(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const response = await fetch("/api/admin/brands", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          image: form.image || "/branding/05.jpg",
          active: form.active,
        }),
      });

      const data = (await response.json()) as BrandItem | { error: string };
      if (!response.ok || !("id" in data)) {
        throw new Error("error" in data ? data.error : "Erro ao criar marca.");
      }

      setBrands((current) => [data, ...current]);
      setForm(initialForm);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao criar marca.");
    } finally {
      setSubmitting(false);
    }
  }

  async function toggleActive(brand: BrandItem) {
    const response = await fetch(`/api/admin/brands/${brand.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ active: !brand.active }),
    });
    if (!response.ok) return;
    const data = (await response.json()) as BrandItem;
    setBrands((current) => current.map((item) => (item.id === data.id ? data : item)));
  }

  async function removeBrand(id: string) {
    const response = await fetch(`/api/admin/brands/${id}`, { method: "DELETE" });
    if (!response.ok) return;
    setBrands((current) => current.filter((item) => item.id !== id));
  }

  async function saveEdit() {
    if (!editingBrand) return;
    setSavingEdit(true);
    setError(null);

    try {
      const response = await fetch(`/api/admin/brands/${editingBrand.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editForm),
      });
      const data = (await response.json()) as BrandItem | { error: string };
      if (!response.ok || !("id" in data)) {
        throw new Error("error" in data ? data.error : "Erro ao atualizar marca.");
      }

      setBrands((current) => current.map((item) => (item.id === data.id ? data : item)));
      setEditingBrand(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao atualizar marca.");
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

      const response = await fetch("/api/admin/brands/upload", {
        method: "POST",
        body: formData,
      });

      const data = (await response.json()) as { url?: string; error?: string };
      if (!response.ok || !data.url) {
        throw new Error(data.error ?? "Erro no upload da imagem.");
      }

      setForm((current) => ({ ...current, image: data.url! }));
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
          <CardTitle>Nova Marca</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={createBrand} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="brand-name">Nome</Label>
              <Input
                id="brand-name"
                value={form.name}
                onChange={(event) =>
                  setForm((current) => ({ ...current, name: event.target.value }))
                }
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="brand-image">Imagem</Label>
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
                id="brand-image"
                value={form.image}
                placeholder="/uploads/marca.jpg"
                onChange={(event) =>
                  setForm((current) => ({ ...current, image: event.target.value }))
                }
                required
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
              Marca ativa
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
                  Cadastrar marca
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
        {sortedBrands.map((brand) => (
          <div
            key={brand.id}
            className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm"
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-3">
                <div className="relative h-12 w-12 overflow-hidden rounded-full border border-zinc-200">
                  <Image
                    src={brand.image}
                    alt={brand.name}
                    fill
                    sizes="48px"
                    className="object-cover"
                  />
                </div>
                <div>
                  <p className="text-base font-bold">{brand.name}</p>
                  <p className="line-clamp-1 text-xs text-zinc-500">{brand.image}</p>
                </div>
              </div>
              <div className="flex w-full items-center gap-2 sm:w-auto">
                <Button
                  size="sm"
                  variant={brand.active ? "secondary" : "outline"}
                  className="flex-1 sm:flex-none"
                  onClick={() => toggleActive(brand)}
                >
                  {brand.active ? "Ativa" : "Inativa"}
                </Button>
                <Button
                  size="icon"
                  variant="outline"
                  className="shrink-0"
                  onClick={() => {
                    setEditingBrand(brand);
                    setEditForm({
                      name: brand.name,
                      image: brand.image,
                      active: brand.active,
                    });
                  }}
                >
                  <Edit3 className="h-4 w-4" />
                </Button>
                <Button
                  size="icon"
                  variant="destructive"
                  className="shrink-0"
                  onClick={() => removeBrand(brand.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <Dialog
        open={Boolean(editingBrand)}
        onOpenChange={(open) => {
          if (!open) setEditingBrand(null);
        }}
      >
        <DialogContent className="max-w-md">
          <DialogTitle>Editar Marca</DialogTitle>
          <div className="space-y-3">
            <div className="space-y-2">
              <Label htmlFor="edit-brand-name">Nome</Label>
              <Input
                id="edit-brand-name"
                value={editForm.name}
                onChange={(event) =>
                  setEditForm((current) => ({ ...current, name: event.target.value }))
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-brand-image">Imagem</Label>
              <Input
                id="edit-brand-image"
                value={editForm.image}
                onChange={(event) =>
                  setEditForm((current) => ({ ...current, image: event.target.value }))
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
              Marca ativa
            </label>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setEditingBrand(null)}>
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
