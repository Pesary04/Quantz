import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import {
  Newspaper, LayoutGrid, Building2, Landmark, Images, Users, Inbox, Settings,
  ChevronRight, type LucideIcon,
} from "lucide-react";
import { AdminHeader } from "@/components/admin/admin-header";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { fetchEnquiries, type Enquiry } from "@/lib/admin-api";

interface Section {
  title: string;
  description: string;
  href: string;
  icon: LucideIcon;
}

const SECTIONS: Section[] = [
  { title: "News & Articles", description: "Write, edit and publish news posts.", href: "/admin/news", icon: Newspaper },
  { title: "Services", description: "Edit the insurance & financial product cards.", href: "/admin/content/services", icon: LayoutGrid },
  { title: "Leading Insurers", description: "Manage insurer partner logos.", href: "/admin/content/insurers", icon: Building2 },
  { title: "Asset Management Partners", description: "Manage asset management partner logos.", href: "/admin/content/asset_managers", icon: Landmark },
  { title: "Featured Slideshow", description: "Edit the rotating banner slides.", href: "/admin/content/slides", icon: Images },
  { title: "Team Members", description: "Add and edit staff profiles.", href: "/admin/content/team", icon: Users },
  { title: "Enquiries", description: "Review website form submissions.", href: "/admin/enquiries", icon: Inbox },
  { title: "Site Settings", description: "Contact details, office hours and social links.", href: "/admin/settings", icon: Settings },
];

export default function AdminDashboard() {
  const [, navigate] = useLocation();

  const { data: enquiries } = useQuery<Enquiry[]>({
    queryKey: ["/api/admin/enquiries"],
    queryFn: fetchEnquiries,
  });
  const unread = enquiries?.filter((e) => !e.isRead).length ?? 0;

  return (
    <div className="min-h-screen bg-background">
      <AdminHeader />
      <main className="mx-auto max-w-6xl px-4 py-8">
        <div className="mb-8">
          <h1 className="font-sans text-2xl font-bold text-foreground">Content Studio</h1>
          <p className="text-sm text-muted-foreground">Manage everything shown on the Quantz website.</p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {SECTIONS.map((section) => (
            <button
              key={section.href}
              type="button"
              onClick={() => navigate(section.href)}
              className="text-left"
              data-testid={`card-${section.href.split("/").pop()}`}
            >
              <Card className="group flex h-full items-start gap-4 p-5 transition-colors hover:border-primary/40 hover:bg-accent/40">
                <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <section.icon className="h-5 w-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <h2 className="font-medium text-foreground">{section.title}</h2>
                    {section.href === "/admin/enquiries" && unread > 0 && (
                      <Badge data-testid="badge-unread">{unread} new</Badge>
                    )}
                  </div>
                  <p className="mt-0.5 text-sm text-muted-foreground">{section.description}</p>
                </div>
                <ChevronRight className="h-4 w-4 flex-shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
              </Card>
            </button>
          ))}
        </div>
      </main>
    </div>
  );
}
