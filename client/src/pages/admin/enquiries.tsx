import { useState } from "react";
import { useLocation } from "wouter";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Inbox, Loader2, Mail, Phone, Trash2 } from "lucide-react";
import { AdminHeader } from "@/components/admin/admin-header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import {
  deleteEnquiry, fetchEnquiries, setEnquiryRead, type Enquiry,
} from "@/lib/admin-api";

const TYPE_LABELS: Record<string, string> = {
  contact: "Quote Request",
  advisor: "Advisor Message",
  enquiry: "Enquiry",
  vehicle: "Vehicle Application",
};

function formatDate(value: string): string {
  return new Date(value).toLocaleString("en-GB", {
    day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit",
  });
}

const PRETTY: Record<string, string> = {
  firstName: "First Name", lastName: "Last Name", fullName: "Full Name", phone: "Phone",
  email: "Email", insuranceType: "Insurance Type", message: "Message", contact: "Contact",
  idNumber: "ID Number", dateOfBirth: "Date of Birth", nationality: "Nationality",
  gender: "Gender", maritalStatus: "Marital Status", licenceYear: "Licence Year",
  licenceCode: "Licence Code", occupation: "Occupation", postalAddress: "Postal Address",
  residentialAddress: "Residential Address", makeModel: "Make & Model", vehicleYear: "Vehicle Year",
  vehicleDescription: "Vehicle Description", engineCapacity: "Engine Capacity", mmCode: "MM Code",
  vehicleValue: "Vehicle Value", carHire: "Car Hire", insuranceHistory: "Insurance History",
  claimHistory: "Claim History", category: "Category",
};

function detailRows(payload: Record<string, unknown>): [string, string][] {
  const rows: [string, string][] = [];
  for (const [key, value] of Object.entries(payload)) {
    if (value == null || value === "") continue;
    if (key === "fields" && Array.isArray(value)) {
      for (const f of value as { label?: string; value?: unknown }[]) {
        if (f && f.label && f.value != null && f.value !== "") rows.push([String(f.label), String(f.value)]);
      }
      continue;
    }
    if (typeof value === "object") continue;
    rows.push([PRETTY[key] ?? key, String(value)]);
  }
  return rows;
}

export default function AdminEnquiries() {
  const [, navigate] = useLocation();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [selected, setSelected] = useState<Enquiry | null>(null);
  const [pendingDelete, setPendingDelete] = useState<Enquiry | null>(null);
  const [deleting, setDeleting] = useState(false);

  const queryKey = ["/api/admin/enquiries"];
  const { data: enquiries, isLoading, isError, error } = useQuery<Enquiry[]>({
    queryKey,
    queryFn: fetchEnquiries,
  });

  async function openEnquiry(enquiry: Enquiry) {
    setSelected(enquiry);
    if (!enquiry.isRead) {
      try {
        await setEnquiryRead(enquiry.id, true);
        await queryClient.invalidateQueries({ queryKey });
      } catch {
        /* non-critical */
      }
    }
  }

  async function toggleRead(enquiry: Enquiry) {
    try {
      await setEnquiryRead(enquiry.id, !enquiry.isRead);
      await queryClient.invalidateQueries({ queryKey });
    } catch (err) {
      toast({ variant: "destructive", title: "Update failed", description: (err as Error).message });
    }
  }

  async function confirmDelete() {
    if (!pendingDelete) return;
    setDeleting(true);
    try {
      await deleteEnquiry(pendingDelete.id);
      await queryClient.invalidateQueries({ queryKey });
      toast({ title: "Enquiry deleted" });
      setPendingDelete(null);
    } catch (err) {
      toast({ variant: "destructive", title: "Delete failed", description: (err as Error).message });
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <AdminHeader />
      <main className="mx-auto max-w-5xl px-4 py-8">
        <Button variant="ghost" size="sm" onClick={() => navigate("/admin")} className="mb-4 gap-2" data-testid="button-back-hub">
          <ArrowLeft className="h-4 w-4" />
          Dashboard
        </Button>
        <div className="mb-6">
          <h1 className="font-sans text-2xl font-bold text-foreground">Enquiries</h1>
          <p className="text-sm text-muted-foreground">Every form submitted on the website is stored here.</p>
        </div>

        {isLoading && (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        )}
        {isError && <p className="py-20 text-center text-sm text-destructive">{(error as Error).message}</p>}

        {!isLoading && !isError && enquiries && enquiries.length === 0 && (
          <Card className="flex flex-col items-center gap-3 py-16 text-center">
            <Inbox className="h-10 w-10 text-muted-foreground" />
            <p className="font-medium text-foreground">No enquiries yet</p>
            <p className="text-sm text-muted-foreground">Submissions from the website will appear here.</p>
          </Card>
        )}

        {!isLoading && !isError && enquiries && enquiries.length > 0 && (
          <Card className="divide-y divide-border">
            {enquiries.map((e) => (
              <div key={e.id} className="flex flex-wrap items-center gap-4 p-4" data-testid={`row-enquiry-${e.id}`}>
                <button type="button" onClick={() => openEnquiry(e)} className="flex min-w-0 flex-1 items-center gap-3 text-left">
                  {!e.isRead && <span className="h-2 w-2 flex-shrink-0 rounded-full bg-primary" aria-label="Unread" />}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className={`truncate ${e.isRead ? "font-medium" : "font-bold"} text-foreground`}>
                        {e.name || e.email || e.phone || "Unknown"}
                      </span>
                      <Badge variant="secondary">{TYPE_LABELS[e.type] ?? e.type}</Badge>
                    </div>
                    <p className="truncate text-sm text-muted-foreground">
                      {e.category ? `${e.category} · ` : ""}{formatDate(e.createdAt)}
                    </p>
                  </div>
                </button>
                <div className="flex items-center gap-1">
                  <Button variant="ghost" size="sm" onClick={() => toggleRead(e)} data-testid={`button-read-${e.id}`}>
                    {e.isRead ? "Mark unread" : "Mark read"}
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => setPendingDelete(e)} title="Delete" data-testid={`button-delete-${e.id}`}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </div>
            ))}
          </Card>
        )}
      </main>

      <Dialog open={selected !== null} onOpenChange={(open) => !open && setSelected(null)}>
        <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{selected ? (TYPE_LABELS[selected.type] ?? selected.type) : ""}</DialogTitle>
          </DialogHeader>
          {selected && (
            <div className="flex flex-col gap-4">
              <div className="flex flex-wrap gap-3">
                {selected.phone && (
                  <a href={`tel:${selected.phone.replace(/\s+/g, "")}`} className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline">
                    <Phone className="h-4 w-4" />{selected.phone}
                  </a>
                )}
                {selected.email && (
                  <a href={`mailto:${selected.email}`} className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline">
                    <Mail className="h-4 w-4" />{selected.email}
                  </a>
                )}
              </div>
              <dl className="divide-y divide-border rounded-md border border-border">
                {detailRows(selected.payload).map(([label, value], i) => (
                  <div key={i} className="flex gap-4 px-4 py-2.5">
                    <dt className="w-2/5 flex-shrink-0 text-sm text-muted-foreground">{label}</dt>
                    <dd className="min-w-0 flex-1 whitespace-pre-wrap break-words text-sm font-medium text-foreground">{value}</dd>
                  </div>
                ))}
              </dl>
              <p className="text-xs text-muted-foreground">Received {formatDate(selected.createdAt)}</p>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <AlertDialog open={pendingDelete !== null} onOpenChange={(open) => !open && setPendingDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this enquiry?</AlertDialogTitle>
            <AlertDialogDescription>This submission will be permanently removed. This cannot be undone.</AlertDialogDescription>
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
