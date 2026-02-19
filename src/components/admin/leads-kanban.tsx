"use client";

import { type FormEvent, type ReactNode, useMemo, useState } from "react";
import {
  DndContext,
  DragEndEvent,
  PointerSensor,
  closestCorners,
  useDroppable,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  rectSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Edit3, GripVertical, LoaderCircle, Plus, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
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
import { formatDateTime } from "@/lib/utils";
import type { Lead, LeadStatus } from "@/types/domain";

interface LeadsKanbanProps {
  initialLeads: Lead[];
}

interface LeadFormState {
  name: string;
  whatsapp: string;
  status: LeadStatus;
}

const initialForm: LeadFormState = {
  name: "",
  whatsapp: "",
  status: "new",
};

const statusConfig: { key: LeadStatus; label: string }[] = [
  { key: "new", label: "Novos" },
  { key: "contacted", label: "Em Atendimento" },
  { key: "sold", label: "Vendido" },
  { key: "archived", label: "Arquivado" },
];

function KanbanColumn({
  status,
  children,
}: {
  status: LeadStatus;
  children: ReactNode;
}) {
  const { setNodeRef, isOver } = useDroppable({ id: status });

  return (
    <div
      ref={setNodeRef}
      className={`space-y-2 rounded-xl p-2 transition ${
        isOver ? "bg-zinc-100" : ""
      }`}
    >
      {children}
    </div>
  );
}

function LeadCard({
  lead,
  onEdit,
  onDelete,
}: {
  lead: Lead;
  onEdit: (lead: Lead) => void;
  onDelete: (lead: Lead) => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: lead.id,
    data: { status: lead.status },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <article
      ref={setNodeRef}
      style={style}
      className={`rounded-xl border border-zinc-200 bg-white p-3 shadow-sm ${
        isDragging ? "opacity-50" : "opacity-100"
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="truncate text-sm font-bold">{lead.name}</p>
          <p className="mt-1 truncate text-xs text-zinc-600">{lead.whatsapp}</p>
        </div>
        <div className="flex items-center gap-1">
          <Button
            size="icon"
            variant="ghost"
            className="h-7 w-7"
            onClick={() => onEdit(lead)}
          >
            <Edit3 className="h-3.5 w-3.5" />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            className="h-7 w-7 text-red-600 hover:text-red-700"
            onClick={() => onDelete(lead)}
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
          <button
            type="button"
            className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-zinc-200 text-zinc-500"
            aria-label="Arrastar lead"
            {...attributes}
            {...listeners}
          >
            <GripVertical className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
      <div className="mt-2 flex items-center justify-between gap-2">
        <Badge variant="secondary">{lead.products_interest.length} itens</Badge>
        <p className="text-xs text-zinc-500">{formatDateTime(lead.created_at)}</p>
      </div>
    </article>
  );
}

export function LeadsKanban({ initialLeads }: LeadsKanbanProps) {
  const [leads, setLeads] = useState(initialLeads);
  const [form, setForm] = useState<LeadFormState>(initialForm);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editingLead, setEditingLead] = useState<Lead | null>(null);
  const [editForm, setEditForm] = useState<LeadFormState>(initialForm);
  const [savingEdit, setSavingEdit] = useState(false);

  const sensors = useSensors(useSensor(PointerSensor));

  const leadsByStatus = useMemo(() => {
    return statusConfig.reduce<Record<LeadStatus, Lead[]>>(
      (acc, status) => {
        acc[status.key] = leads.filter((lead) => lead.status === status.key);
        return acc;
      },
      { new: [], contacted: [], sold: [], archived: [] },
    );
  }, [leads]);

  async function createLead(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const response = await fetch("/api/admin/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          whatsapp: form.whatsapp,
          status: form.status,
          products_interest: [],
        }),
      });

      const data = (await response.json()) as Lead | { error: string };
      if (!response.ok || !("id" in data)) {
        throw new Error("error" in data ? data.error : "Erro ao criar lead.");
      }

      setLeads((current) => [data, ...current]);
      setForm(initialForm);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao criar lead.");
    } finally {
      setSubmitting(false);
    }
  }

  async function removeLead(lead: Lead) {
    const confirmed = window.confirm(`Remover lead "${lead.name}"?`);
    if (!confirmed) return;

    const response = await fetch(`/api/admin/leads/${lead.id}`, { method: "DELETE" });
    if (!response.ok) return;
    setLeads((current) => current.filter((item) => item.id !== lead.id));
  }

  async function saveEdit() {
    if (!editingLead) return;
    setSavingEdit(true);
    setError(null);

    try {
      const response = await fetch(`/api/admin/leads/${editingLead.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editForm),
      });

      const data = (await response.json()) as Lead | { error: string };
      if (!response.ok || !("id" in data)) {
        throw new Error("error" in data ? data.error : "Erro ao atualizar lead.");
      }

      setLeads((current) => current.map((item) => (item.id === data.id ? data : item)));
      setEditingLead(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao atualizar lead.");
    } finally {
      setSavingEdit(false);
    }
  }

  async function persistStatus(leadId: string, status: LeadStatus) {
    await fetch(`/api/admin/leads/${leadId}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
  }

  async function onDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over) return;
    if (active.id === over.id) return;

    const activeLead = leads.find((lead) => lead.id === active.id);
    if (!activeLead) return;

    const overLead = leads.find((lead) => lead.id === over.id);
    const statusKeys = new Set(statusConfig.map((item) => item.key));
    const targetStatus = overLead?.status
      ? overLead.status
      : statusKeys.has(over.id as LeadStatus)
        ? (over.id as LeadStatus)
        : null;
    if (!targetStatus || activeLead.status === targetStatus) return;

    const activeIndex = leads.findIndex((lead) => lead.id === active.id);
    const overIndex = leads.findIndex((lead) => lead.id === over.id);

    const updatedLead = { ...activeLead, status: targetStatus };
    const next = leads.map((lead) => (lead.id === activeLead.id ? updatedLead : lead));

    setLeads(overIndex >= 0 ? arrayMove(next, activeIndex, overIndex) : next);

    await persistStatus(activeLead.id, targetStatus);
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[320px,1fr]">
      <Card>
        <CardHeader>
          <CardTitle>Novo Lead Manual</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={createLead} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="lead-name">Nome</Label>
              <Input
                id="lead-name"
                value={form.name}
                onChange={(event) =>
                  setForm((current) => ({ ...current, name: event.target.value }))
                }
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lead-whatsapp">WhatsApp</Label>
              <Input
                id="lead-whatsapp"
                value={form.whatsapp}
                onChange={(event) =>
                  setForm((current) => ({ ...current, whatsapp: event.target.value }))
                }
                placeholder="5582999999999"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lead-status">Status</Label>
              <select
                id="lead-status"
                value={form.status}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    status: event.target.value as LeadStatus,
                  }))
                }
                className="h-10 w-full rounded-full border border-zinc-300 bg-white px-4 text-sm"
              >
                {statusConfig.map((status) => (
                  <option key={status.key} value={status.key}>
                    {status.label}
                  </option>
                ))}
              </select>
            </div>
            <Button type="submit" className="w-full" disabled={submitting}>
              {submitting ? (
                <>
                  <LoaderCircle className="h-4 w-4 animate-spin" />
                  Salvando...
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4" />
                  Adicionar lead
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

      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragEnd={onDragEnd}
      >
        <div className="overflow-x-auto pb-2">
          <div className="flex gap-4 md:grid md:grid-cols-2 xl:grid-cols-4">
            {statusConfig.map((status) => (
              <section
                key={status.key}
                id={status.key}
                className="min-w-[280px] rounded-2xl border border-zinc-200 bg-zinc-50 p-3 sm:min-w-[320px] md:min-w-0"
              >
                <div className="mb-3 flex items-center justify-between">
                  <h2 className="text-sm font-black uppercase">{status.label}</h2>
                  <Badge variant="outline">{leadsByStatus[status.key].length}</Badge>
                </div>
                <KanbanColumn status={status.key}>
                  <SortableContext
                    id={status.key}
                    items={leadsByStatus[status.key].map((lead) => lead.id)}
                    strategy={rectSortingStrategy}
                  >
                    <div className="space-y-2">
                      {leadsByStatus[status.key].map((lead) => (
                        <LeadCard
                          key={lead.id}
                          lead={lead}
                          onEdit={(leadItem) => {
                            setEditingLead(leadItem);
                            setEditForm({
                              name: leadItem.name,
                              whatsapp: leadItem.whatsapp,
                              status: leadItem.status,
                            });
                          }}
                          onDelete={removeLead}
                        />
                      ))}
                    </div>
                  </SortableContext>
                </KanbanColumn>
              </section>
            ))}
          </div>
        </div>
      </DndContext>

      <Dialog
        open={Boolean(editingLead)}
        onOpenChange={(open) => {
          if (!open) setEditingLead(null);
        }}
      >
        <DialogContent className="max-w-md">
          <DialogTitle>Editar Lead</DialogTitle>
          <div className="space-y-3">
            <div className="space-y-2">
              <Label htmlFor="edit-lead-name">Nome</Label>
              <Input
                id="edit-lead-name"
                value={editForm.name}
                onChange={(event) =>
                  setEditForm((current) => ({ ...current, name: event.target.value }))
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-lead-whatsapp">WhatsApp</Label>
              <Input
                id="edit-lead-whatsapp"
                value={editForm.whatsapp}
                onChange={(event) =>
                  setEditForm((current) => ({ ...current, whatsapp: event.target.value }))
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-lead-status">Status</Label>
              <select
                id="edit-lead-status"
                value={editForm.status}
                onChange={(event) =>
                  setEditForm((current) => ({
                    ...current,
                    status: event.target.value as LeadStatus,
                  }))
                }
                className="h-10 w-full rounded-full border border-zinc-300 bg-white px-4 text-sm"
              >
                {statusConfig.map((status) => (
                  <option key={status.key} value={status.key}>
                    {status.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setEditingLead(null)}
            >
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
