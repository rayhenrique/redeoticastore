"use client";

import { type FormEvent, useMemo, useState } from "react";
import { Edit3, LoaderCircle, Plus, Trash2 } from "lucide-react";
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
import type { SiteUser } from "@/types/domain";

interface AdminUsersManagerProps {
  initialUsers: SiteUser[];
}

interface UserFormState {
  name: string;
  email: string;
  role: "admin" | "seller";
  active: boolean;
}

const initialForm: UserFormState = {
  name: "",
  email: "",
  role: "seller",
  active: true,
};

export function AdminUsersManager({ initialUsers }: AdminUsersManagerProps) {
  const [users, setUsers] = useState(initialUsers);
  const [form, setForm] = useState<UserFormState>(initialForm);
  const [editingUser, setEditingUser] = useState<SiteUser | null>(null);
  const [editForm, setEditForm] = useState<UserFormState>(initialForm);
  const [submitting, setSubmitting] = useState(false);
  const [savingEdit, setSavingEdit] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sortedUsers = useMemo(
    () => [...users].sort((a, b) => +new Date(b.created_at) - +new Date(a.created_at)),
    [users],
  );

  async function createUser(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const response = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = (await response.json()) as SiteUser | { error: string };
      if (!response.ok || !("id" in data)) {
        throw new Error("error" in data ? data.error : "Erro ao criar usuário.");
      }

      setUsers((current) => [data, ...current]);
      setForm(initialForm);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao criar usuário.");
    } finally {
      setSubmitting(false);
    }
  }

  async function toggleActive(user: SiteUser) {
    const response = await fetch(`/api/admin/users/${user.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ active: !user.active }),
    });
    if (!response.ok) return;
    const data = (await response.json()) as SiteUser;
    setUsers((current) => current.map((item) => (item.id === data.id ? data : item)));
  }

  async function removeUser(id: string) {
    const response = await fetch(`/api/admin/users/${id}`, { method: "DELETE" });
    if (!response.ok) return;
    setUsers((current) => current.filter((item) => item.id !== id));
  }

  async function saveEdit() {
    if (!editingUser) return;

    setSavingEdit(true);
    setError(null);

    try {
      const response = await fetch(`/api/admin/users/${editingUser.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editForm),
      });

      const data = (await response.json()) as SiteUser | { error: string };
      if (!response.ok || !("id" in data)) {
        throw new Error("error" in data ? data.error : "Erro ao atualizar usuário.");
      }

      setUsers((current) => current.map((item) => (item.id === data.id ? data : item)));
      setEditingUser(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao atualizar usuário.");
    } finally {
      setSavingEdit(false);
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[360px,1fr]">
      <Card>
        <CardHeader>
          <CardTitle>Novo Usuário</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={createUser} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="user-name">Nome</Label>
              <Input
                id="user-name"
                value={form.name}
                onChange={(event) =>
                  setForm((current) => ({ ...current, name: event.target.value }))
                }
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="user-email">E-mail</Label>
              <Input
                id="user-email"
                type="email"
                value={form.email}
                onChange={(event) =>
                  setForm((current) => ({ ...current, email: event.target.value }))
                }
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="user-role">Perfil</Label>
              <select
                id="user-role"
                className="h-10 w-full rounded-full border border-zinc-300 px-4 text-sm"
                value={form.role}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    role: event.target.value as "admin" | "seller",
                  }))
                }
              >
                <option value="seller">Vendedor</option>
                <option value="admin">Administrador</option>
              </select>
            </div>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={form.active}
                onChange={(event) =>
                  setForm((current) => ({ ...current, active: event.target.checked }))
                }
              />
              Usuário ativo
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
                  Cadastrar usuário
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
        {sortedUsers.map((user) => (
          <div
            key={user.id}
            className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm"
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <p className="text-base font-bold">{user.name}</p>
                <p className="text-sm text-zinc-600">{user.email}</p>
                <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
                  {user.role}
                </p>
              </div>
              <div className="flex w-full items-center gap-2 sm:w-auto">
                <Button
                  size="sm"
                  variant={user.active ? "secondary" : "outline"}
                  className="flex-1 sm:flex-none"
                  onClick={() => toggleActive(user)}
                >
                  {user.active ? "Ativo" : "Inativo"}
                </Button>
                <Button
                  size="icon"
                  variant="outline"
                  className="shrink-0"
                  onClick={() => {
                    setEditingUser(user);
                    setEditForm({
                      name: user.name,
                      email: user.email,
                      role: user.role,
                      active: user.active,
                    });
                  }}
                >
                  <Edit3 className="h-4 w-4" />
                </Button>
                <Button
                  size="icon"
                  variant="destructive"
                  className="shrink-0"
                  onClick={() => removeUser(user.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <Dialog
        open={Boolean(editingUser)}
        onOpenChange={(open) => {
          if (!open) setEditingUser(null);
        }}
      >
        <DialogContent className="max-w-md">
          <DialogTitle>Editar Usuário</DialogTitle>
          <div className="space-y-3">
            <div className="space-y-2">
              <Label htmlFor="edit-user-name">Nome</Label>
              <Input
                id="edit-user-name"
                value={editForm.name}
                onChange={(event) =>
                  setEditForm((current) => ({ ...current, name: event.target.value }))
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-user-email">E-mail</Label>
              <Input
                id="edit-user-email"
                type="email"
                value={editForm.email}
                onChange={(event) =>
                  setEditForm((current) => ({ ...current, email: event.target.value }))
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-user-role">Perfil</Label>
              <select
                id="edit-user-role"
                className="h-10 w-full rounded-full border border-zinc-300 px-4 text-sm"
                value={editForm.role}
                onChange={(event) =>
                  setEditForm((current) => ({
                    ...current,
                    role: event.target.value as "admin" | "seller",
                  }))
                }
              >
                <option value="seller">Vendedor</option>
                <option value="admin">Administrador</option>
              </select>
            </div>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={editForm.active}
                onChange={(event) =>
                  setEditForm((current) => ({ ...current, active: event.target.checked }))
                }
              />
              Usuário ativo
            </label>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setEditingUser(null)}>
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
