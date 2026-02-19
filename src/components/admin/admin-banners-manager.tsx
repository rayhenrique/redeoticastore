"use client";

import { type FormEvent, useMemo, useState } from "react";
import { Edit3, Eye, EyeOff, LoaderCircle, Plus, Trash2, Upload } from "lucide-react";
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
import type { HomeBanner } from "@/types/domain";

interface AdminBannersManagerProps {
  initialBanners: HomeBanner[];
}

interface BannerFormState {
  title: string;
  subtitle: string;
  cta: string;
  image: string;
  position: string;
  active: boolean;
}

const initialForm: BannerFormState = {
  title: "",
  subtitle: "",
  cta: "Ver ofertas",
  image: "",
  position: "1",
  active: true,
};

export function AdminBannersManager({ initialBanners }: AdminBannersManagerProps) {
  const [banners, setBanners] = useState(initialBanners);
  const [form, setForm] = useState(initialForm);
  const [editingBanner, setEditingBanner] = useState<HomeBanner | null>(null);
  const [editForm, setEditForm] = useState(initialForm);
  const [submitting, setSubmitting] = useState(false);
  const [savingEdit, setSavingEdit] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sortedBanners = useMemo(
    () =>
      [...banners].sort((a, b) =>
        a.position === b.position
          ? +new Date(b.created_at) - +new Date(a.created_at)
          : a.position - b.position,
      ),
    [banners],
  );

  async function createBanner(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const response = await fetch("/api/admin/banners", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: form.title,
          subtitle: form.subtitle,
          cta: form.cta,
          image: form.image || "/branding/07.jpg",
          position: Number(form.position || "1"),
          active: form.active,
        }),
      });

      const data = (await response.json()) as HomeBanner | { error: string };
      if (!response.ok || !("id" in data)) {
        throw new Error("error" in data ? data.error : "Erro ao criar banner.");
      }

      setBanners((current) => [...current, data]);
      setForm(initialForm);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao criar banner.");
    } finally {
      setSubmitting(false);
    }
  }

  async function toggleActive(banner: HomeBanner) {
    const response = await fetch(`/api/admin/banners/${banner.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ active: !banner.active }),
    });
    if (!response.ok) return;
    const data = (await response.json()) as HomeBanner;
    setBanners((current) => current.map((item) => (item.id === data.id ? data : item)));
  }

  async function removeBanner(id: string) {
    const response = await fetch(`/api/admin/banners/${id}`, { method: "DELETE" });
    if (!response.ok) return;
    setBanners((current) => current.filter((item) => item.id !== id));
  }

  async function saveEdit() {
    if (!editingBanner) return;
    setSavingEdit(true);
    setError(null);

    try {
      const response = await fetch(`/api/admin/banners/${editingBanner.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: editForm.title,
          subtitle: editForm.subtitle,
          cta: editForm.cta,
          image: editForm.image,
          position: Number(editForm.position || "1"),
          active: editForm.active,
        }),
      });

      const data = (await response.json()) as HomeBanner | { error: string };
      if (!response.ok || !("id" in data)) {
        throw new Error("error" in data ? data.error : "Erro ao atualizar banner.");
      }

      setBanners((current) => current.map((item) => (item.id === data.id ? data : item)));
      setEditingBanner(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao atualizar banner.");
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

      const response = await fetch("/api/admin/banners/upload", {
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
          <CardTitle>Novo Banner</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={createBanner} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="banner-title">Título</Label>
              <Input
                id="banner-title"
                value={form.title}
                onChange={(event) =>
                  setForm((current) => ({ ...current, title: event.target.value }))
                }
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="banner-subtitle">Subtítulo</Label>
              <Input
                id="banner-subtitle"
                value={form.subtitle}
                onChange={(event) =>
                  setForm((current) => ({ ...current, subtitle: event.target.value }))
                }
                required
              />
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="banner-cta">CTA</Label>
                <Input
                  id="banner-cta"
                  value={form.cta}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, cta: event.target.value }))
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="banner-position">Posição</Label>
                <Input
                  id="banner-position"
                  type="number"
                  min="1"
                  value={form.position}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, position: event.target.value }))
                  }
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="banner-image">Imagem</Label>
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
                id="banner-image"
                value={form.image}
                placeholder="URL da imagem do banner"
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
              Banner ativo
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
                  Cadastrar banner
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
        {sortedBanners.map((banner) => (
          <div
            key={banner.id}
            className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm"
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <p className="text-base font-bold">{banner.title}</p>
                <p className="text-sm text-zinc-600">{banner.subtitle}</p>
                <p className="mt-1 text-xs font-semibold uppercase text-zinc-500">
                  CTA: {banner.cta} · Posição: {banner.position}
                </p>
              </div>
              <div className="flex w-full items-center gap-2 sm:w-auto">
                <Button
                  size="sm"
                  variant={banner.active ? "secondary" : "outline"}
                  className="flex-1 sm:flex-none"
                  onClick={() => toggleActive(banner)}
                >
                  {banner.active ? (
                    <>
                      <Eye className="h-4 w-4" />
                      Ativo
                    </>
                  ) : (
                    <>
                      <EyeOff className="h-4 w-4" />
                      Inativo
                    </>
                  )}
                </Button>
                <Button
                  size="icon"
                  variant="outline"
                  className="shrink-0"
                  onClick={() => {
                    setEditingBanner(banner);
                    setEditForm({
                      title: banner.title,
                      subtitle: banner.subtitle,
                      cta: banner.cta,
                      image: banner.image,
                      position: String(banner.position),
                      active: banner.active,
                    });
                  }}
                >
                  <Edit3 className="h-4 w-4" />
                </Button>
                <Button
                  size="icon"
                  variant="destructive"
                  className="shrink-0"
                  onClick={() => removeBanner(banner.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <p className="mt-2 line-clamp-1 text-xs text-zinc-500">{banner.image}</p>
          </div>
        ))}
      </div>

      <Dialog
        open={Boolean(editingBanner)}
        onOpenChange={(open) => {
          if (!open) setEditingBanner(null);
        }}
      >
        <DialogContent className="max-w-md">
          <DialogTitle>Editar Banner</DialogTitle>
          <div className="space-y-3">
            <div className="space-y-2">
              <Label htmlFor="edit-banner-title">Título</Label>
              <Input
                id="edit-banner-title"
                value={editForm.title}
                onChange={(event) =>
                  setEditForm((current) => ({ ...current, title: event.target.value }))
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-banner-subtitle">Subtítulo</Label>
              <Input
                id="edit-banner-subtitle"
                value={editForm.subtitle}
                onChange={(event) =>
                  setEditForm((current) => ({ ...current, subtitle: event.target.value }))
                }
              />
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="edit-banner-cta">CTA</Label>
                <Input
                  id="edit-banner-cta"
                  value={editForm.cta}
                  onChange={(event) =>
                    setEditForm((current) => ({ ...current, cta: event.target.value }))
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-banner-position">Posição</Label>
                <Input
                  id="edit-banner-position"
                  type="number"
                  min="1"
                  value={editForm.position}
                  onChange={(event) =>
                    setEditForm((current) => ({ ...current, position: event.target.value }))
                  }
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-banner-image">Imagem</Label>
              <Input
                id="edit-banner-image"
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
              Banner ativo
            </label>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setEditingBanner(null)}>
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
