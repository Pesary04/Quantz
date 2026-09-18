import { useLocation, useParams } from "wouter";
import { ArrowLeft } from "lucide-react";
import { AdminHeader } from "@/components/admin/admin-header";
import { Button } from "@/components/ui/button";
import { CollectionManager } from "@/components/admin/collection-manager";
import { COLLECTION_CONFIGS } from "@/lib/collection-config";
import type { ContentCollection } from "@/lib/admin-api";

function isContentCollection(value: string): value is ContentCollection {
  return Object.prototype.hasOwnProperty.call(COLLECTION_CONFIGS, value);
}

export default function AdminCollection() {
  const [, navigate] = useLocation();
  const params = useParams();
  const collection = params.collection ?? "";

  return (
    <div className="min-h-screen bg-background">
      <AdminHeader />
      <main className="mx-auto max-w-6xl px-4 py-8">
        <Button variant="ghost" size="sm" onClick={() => navigate("/admin")} className="mb-4 gap-2" data-testid="button-back-hub">
          <ArrowLeft className="h-4 w-4" />
          Dashboard
        </Button>
        {isContentCollection(collection) ? (
          <CollectionManager collection={collection} />
        ) : (
          <p className="py-20 text-center text-sm text-destructive">Unknown content type “{collection}”.</p>
        )}
      </main>
    </div>
  );
}
