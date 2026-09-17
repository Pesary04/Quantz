import { useRef, useState, type FormEvent } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  ArrowDown, ArrowUp, ImagePlus, Loader2, Pencil, Plus, Trash2, X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import {
  createContent, deleteContent, fetchContent, reorderContent, updateContent,
  uploadImage, type ContentCollection, type ContentItem,
} from "@/lib/admin-api";
import {
  COLLECTION_CONFIGS, emptyData, type CollectionConfig, type FieldConfig,
} from "@/lib/collection-config";

function ImageField({
  value, onChange, testId,
}: {
  value: string;
  onChange: (url: string) => void;
  testId: string;
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      onChange(await uploadImage(file));
    } catch (err) {
      toast({ variant: "destructive", title: "Upload failed", description: (err as Error).message });
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  return (
    <div className="flex flex-col gap-2">
      {value ? (
        <div className="relative w-fit overflow-hidden rounded-md border border-border bg-muted/40 p-2">
          <img src={value || "/placeholder.svg"} alt="Preview" className="max-h-28 w-auto object-contain" />
          <Button
            type="button" variant="secondary" size="icon"
            onClick={() => onChange("")}
            className="absolute right-1 top-1 h-6 w-6"
            data-testid={`${testId}-remove`}
          >
            <X className="h-3.5 w-3.5" />
          </Button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          disabled={uploading}
          className="flex flex-col items-center justify-center gap-2 rounded-md border border-dashed border-input py-8 text-muted-foreground transition-colors hover:border-primary hover:text-primary"
          data-testid={`${testId}-upload`}
        >
          {uploading ? <Loader2 className="h-5 w-5 animate-spin" /> : <ImagePlus className="h-5 w-5" />}
          <span className="text-sm">{uploading ? "Uploading…" : "Upload image"}</span>
        </button>
      )}
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="…or paste an image URL / path"
        data-testid={`${testId}-url`}
      />
      <input
        ref={fileRef}
        type="file"
        accept="image/png,image/jpeg,image/webp,image/gif,image/svg+xml"
        className="hidden"
        onChange={handleFile}
      />
    </div>
  );
}

function FieldInput({
  field, value, onChange,
}: {
  field: FieldConfig;
  value: unknown;
  onChange: (v: unknown) => void;
}) {
  const id = `field-${field.key}`;
  const testId = `input-${field.key}`;

  if (field.type === "image") {
    return <ImageField value={String(value ?? "")} onChange={onChange} testId={testId} />;
  }
  if (field.type === "textarea") {
    return (
      <Textarea id={id} value={String(value ?? "")} rows={3}
        onChange={(e) => onChange(e.target.value)} placeholder={field.placeholder} data-testid={testId} />
    );
  }
  if (field.type === "list") {
    const text = Array.isArray(value) ? (value as string[]).join("\n") : "";
    return (
      <Textarea id={id} value={text} rows={5} placeholder={field.placeholder}
        onChange={(e) => onChange(e.target.value.split("\n").map((l) => l.trim()).filter(Boolean))}
        data-testid={testId} />
    );
  }
  if (field.type === "boolean") {
    return (
      <div className="flex items-center gap-2">
        <Switch id={id} checked={value === true} onCheckedChange={(c) => onChange(c)} data-testid={testId} />
        <span className="text-sm text-muted-foreground">{value === true ? "Yes" : "No"}</span>
      </div>
    );
  }
  if (field.type === "select") {
    return (
      <Select value={String(value ?? "")} onValueChange={(v) => onChange(v)}>
        <SelectTrigger id={id} data-testid={testId}><SelectValue placeholder="Select…" /></SelectTrigger>
        <SelectContent>
          {(field.options ?? []).map((o) => <SelectItem key={o} value={o}>{o}</SelectItem>)}
        </SelectContent>
      </Select>
    );
  }
  return (
    <Input id={id} value={String(value ?? "")} type={field.type === "url" ? "url" : "text"}
      onChange={(e) => onChange(e.target.value)} placeholder={field.placeholder} data-testid={testId} />
  );
}

export function CollectionManager({ collection }: { collection: ContentCollection }) {
  const config: CollectionConfig = COLLECTION_CONFIGS[collection];
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const queryKey = ["/api/admin/content", collection];

  const { data: items, isLoading, isError, error } = useQuery<ContentItem[]>({
    queryKey,
    queryFn: () => fetchContent(collection),
  });

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<Record<string, unknown>>({});
  const [saving, setSaving] = useState(false);
  const [pendingDelete, setPendingDelete] = useState<ContentItem | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [busyId, setBusyId] = useState<string | null>(null);

  function openNew() {
    setEditingId(null);
    setForm(emptyData(config));
    setDialogOpen(true);
  }

  function openEdit(item: ContentItem) {
    setEditingId(item.id);
    setForm({ ...emptyData(config), ...item.data });
    setDialogOpen(true);
  }

  async function invalidate() {
    await queryClient.invalidateQueries({ queryKey });
    await queryClient.invalidateQueries({ queryKey: ["/api/content"] });
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      if (editingId) {
        await updateContent(collection, editingId, { data: form });
        toast({ title: `${config.singular} updated` });
      } else {
        await createContent(collection, form);
        toast({ title: `${config.singular} added` });
      }
      await invalidate();
      setDialogOpen(false);
    } catch (err) {
      toast({ variant: "destructive", title: "Save failed", description: (err as Error).message });
    } finally {
      setSaving(false);
    }
  }

  async function toggleActive(item: ContentItem) {
    setBusyId(item.id);
    try {
      await updateContent(collection, item.id, { isActive: !item.isActive });
      await invalidate();
    } catch (err) {
      toast({ variant: "destructive", title: "Update failed", description: (err as Error).message });
    } finally {
      setBusyId(null);
    }
  }

  async function move(index: number, dir: -1 | 1) {
    if (!items) return;
    const target = index + dir;
    if (target < 0 || target >= items.length) return;
    const ids = items.map((i) => i.id);
    [ids[index], ids[target]] = [ids[target], ids[index]];
    setBusyId(items[index].id);
    try {
      await reorderContent(collection, ids);
      await invalidate();
    } catch (err) {
      toast({ variant: "destructive", title: "Reorder failed", description: (err as Error).message });
    } finally {
      setBusyId(null);
    }
  }

  async function confirmDelete() {
    if (!pendingDelete) return;
    setDeleting(true);
    try {
      await deleteContent(collection, pendingDelete.id);
      await invalidate();
      toast({ title: `${config.singular} deleted` });
      setPendingDelete(null);
    } catch (err) {
      toast({ variant: "destructive", title: "Delete failed", description: (err as Error).message });
    } finally {
      setDeleting(false);
    }
  }

  const label = (item: ContentItem) =>
    String(item.data[config.primaryKey] ?? "") || `Untitled ${config.singular.toLowerCase()}`;

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-sans text-2xl font-bold text-foreground">{config.title}</h1>
          <p className="max-w-2xl text-sm text-muted-foreground">{config.description}</p>
        </div>
        <Button onClick={openNew} className="gap-2" data-testid="button-add-item">
          <Plus className="h-4 w-4" />
          Add {config.singular.toLowerCase()}
        </Button>
      </div>

      {isLoading && (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      )}
      {isError && <p className="py-20 text-center text-sm text-destructive">{(error as Error).message}</p>}

      {!isLoading && !isError && items && items.length === 0 && (
        <Card className="flex flex-col items-center gap-3 py-16 text-center">
          <p className="font-medium text-foreground">Nothing here yet</p>
          <p className="text-sm text-muted-foreground">Add your first {config.singular.toLowerCase()}.</p>
          <Button onClick={openNew} className="gap-2"><Plus className="h-4 w-4" />Add {config.singular.toLowerCase()}</Button>
        </Card>
      )}

      {!isLoading && !isError && items && items.length > 0 && (
        <Card className="divide-y divide-border">
          {items.map((item, index) => (
            <div key={item.id} className="flex flex-wrap items-center gap-4 p-4" data-testid={`row-${item.id}`}>
              <div className="flex flex-col gap-0.5">
                <Button variant="ghost" size="icon" className="h-6 w-6" disabled={index === 0 || busyId === item.id}
                  onClick={() => move(index, -1)} title="Move up" data-testid={`button-up-${item.id}`}>
                  <ArrowUp className="h-3.5 w-3.5" />
                </Button>
                <Button variant="ghost" size="icon" className="h-6 w-6" disabled={index === items.length - 1 || busyId === item.id}
                  onClick={() => move(index, 1)} title="Move down" data-testid={`button-down-${item.id}`}>
                  <ArrowDown className="h-3.5 w-3.5" />
                </Button>
              </div>

              {config.imageKey && (
                <div className="flex h-12 w-16 items-center justify-center overflow-hidden rounded-md border border-border bg-muted/40">
                  {item.data[config.imageKey] ? (
                    <img src={String(item.data[config.imageKey]) || "/placeholder.svg"} alt="" className="max-h-full max-w-full object-contain" />
                  ) : (
                    <ImagePlus className="h-4 w-4 text-muted-foreground" />
                  )}
                </div>
              )}

              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <h2 className="truncate font-medium text-foreground">{label(item)}</h2>
                  {!item.isActive && <Badge variant="secondary">Hidden</Badge>}
                </div>
                {typeof item.data.subtitle === "string" && item.data.subtitle && (
                  <p className="truncate text-sm text-muted-foreground">{item.data.subtitle}</p>
                )}
              </div>

              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2" title={item.isActive ? "Visible on site" : "Hidden"}>
                  <Switch checked={item.isActive} disabled={busyId === item.id}
                    onCheckedChange={() => toggleActive(item)} data-testid={`switch-active-${item.id}`} />
                </div>
                <Button variant="ghost" size="icon" onClick={() => openEdit(item)} title="Edit" data-testid={`button-edit-${item.id}`}>
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => setPendingDelete(item)} title="Delete" data-testid={`button-delete-${item.id}`}>
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            </div>
          ))}
        </Card>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{editingId ? `Edit ${config.singular.toLowerCase()}` : `Add ${config.singular.toLowerCase()}`}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {config.fields.map((field) => (
              <div key={field.key} className="flex flex-col gap-1.5">
                <Label htmlFor={`field-${field.key}`}>{field.label}</Label>
                <FieldInput field={field} value={form[field.key]}
                  onChange={(v) => setForm((f) => ({ ...f, [field.key]: v }))} />
                {field.help && <p className="text-xs text-muted-foreground">{field.help}</p>}
              </div>
            ))}
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)} disabled={saving}>Cancel</Button>
              <Button type="submit" disabled={saving} className="gap-2" data-testid="button-save-item">
                {saving && <Loader2 className="h-4 w-4 animate-spin" />}
                {editingId ? "Save changes" : "Add"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <AlertDialog open={pendingDelete !== null} onOpenChange={(open) => !open && setPendingDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this {config.singular.toLowerCase()}?</AlertDialogTitle>
            <AlertDialogDescription>
              “{pendingDelete ? label(pendingDelete) : ""}” will be permanently removed. This cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={(e) => { e.preventDefault(); confirmDelete(); }} disabled={deleting} className="gap-2">
              {deleting && <Loader2 className="h-4 w-4 animate-spin" />}
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
