import { useEffect, useState, type FormEvent } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Loader2 } from "lucide-react";
import { AdminHeader } from "@/components/admin/admin-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { fetchSettings, saveSettings, type SiteSettings } from "@/lib/admin-api";

interface FieldDef {
  key: keyof SiteSettings;
  label: string;
  placeholder?: string;
  help?: string;
}

const GROUPS: { heading: string; fields: FieldDef[] }[] = [
  {
    heading: "Contact details",
    fields: [
      { key: "phone", label: "Phone number", placeholder: "+264 81 820 1522" },
      { key: "email", label: "Email address", placeholder: "info@quantz.com.na" },
      { key: "location", label: "Location", placeholder: "Windhoek, Namibia" },
      { key: "officeHours", label: "Office hours", placeholder: "Mon–Fri, 08:00–17:00", help: "Shown in the footer when set." },
    ],
  },
  {
    heading: "Social & channels",
    fields: [
      { key: "whatsappUrl", label: "WhatsApp channel URL", placeholder: "https://whatsapp.com/channel/…" },
      { key: "facebookUrl", label: "Facebook URL", placeholder: "https://facebook.com/…" },
      { key: "instagramUrl", label: "Instagram URL", placeholder: "https://instagram.com/…" },
      { key: "linkedinUrl", label: "LinkedIn URL", placeholder: "https://linkedin.com/…" },
    ],
  },
];

export default function AdminSettings() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [form, setForm] = useState<SiteSettings>({});
  const [saving, setSaving] = useState(false);

  const { data, isLoading, isError, error } = useQuery<SiteSettings>({
    queryKey: ["/api/admin/settings"],
    queryFn: fetchSettings,
  });

  useEffect(() => {
    if (data) setForm(data);
  }, [data]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      await saveSettings(form);
      toast({ title: "Settings saved" });
    } catch (err) {
      toast({ variant: "destructive", title: "Save failed", description: (err as Error).message });
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <AdminHeader />
      <main className="mx-auto max-w-2xl px-4 py-8">
        <Button variant="ghost" size="sm" onClick={() => navigate("/admin")} className="mb-4 gap-2" data-testid="button-back-hub">
          <ArrowLeft className="h-4 w-4" />
          Dashboard
        </Button>
        <div className="mb-6">
          <h1 className="font-sans text-2xl font-bold text-foreground">Site Settings</h1>
          <p className="text-sm text-muted-foreground">Contact details and social links used across the website.</p>
        </div>

        {isLoading && (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        )}
        {isError && <p className="py-20 text-center text-sm text-destructive">{(error as Error).message}</p>}

        {!isLoading && !isError && (
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            {GROUPS.map((group) => (
              <Card key={group.heading}>
                <CardContent className="flex flex-col gap-5 pt-6">
                  <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">{group.heading}</h2>
                  {group.fields.map((field) => (
                    <div key={field.key} className="flex flex-col gap-1.5">
                      <Label htmlFor={field.key}>{field.label}</Label>
                      <Input
                        id={field.key}
                        value={form[field.key] ?? ""}
                        onChange={(e) => setForm((f) => ({ ...f, [field.key]: e.target.value }))}
                        placeholder={field.placeholder}
                        data-testid={`input-${field.key}`}
                      />
                      {field.help && <p className="text-xs text-muted-foreground">{field.help}</p>}
                    </div>
                  ))}
                </CardContent>
              </Card>
            ))}
            <div className="flex justify-end">
              <Button type="submit" disabled={saving} className="gap-2" data-testid="button-save-settings">
                {saving && <Loader2 className="h-4 w-4 animate-spin" />}
                Save settings
              </Button>
            </div>
          </form>
        )}
      </main>
    </div>
  );
}
