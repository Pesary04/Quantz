import { useState } from "react";
import { useLocation } from "wouter";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, FileText, Loader2, Pencil, Plus, Trash2, ExternalLink } from "lucide-react";
import { AdminHeader } from "@/components/admin/admin-header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { deletePost, fetchAdminPosts, type Post } from "@/lib/admin-api";

function formatDate(value: string | null): string {
  if (!value) return "—";
  return new Date(value).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default function AdminNews() {
  const [, navigate] = useLocation();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [pendingDelete, setPendingDelete] = useState<Post | null>(null);
  const [deleting, setDeleting] = useState(false);

  const { data: posts, isLoading, isError, error } = useQuery<Post[]>({
    queryKey: ["/api/admin/posts"],
    queryFn: fetchAdminPosts,
  });

  async function confirmDelete() {
    if (!pendingDelete) return;
    setDeleting(true);
    try {
      await deletePost(pendingDelete.id);
      await queryClient.invalidateQueries({ queryKey: ["/api/admin/posts"] });
      toast({ title: "Article deleted", description: `“${pendingDelete.title}” was removed.` });
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
      <main className="mx-auto max-w-6xl px-4 py-8">
        <Button variant="ghost" size="sm" onClick={() => navigate("/admin")} className="mb-4 gap-2" data-testid="button-back-hub">
          <ArrowLeft className="h-4 w-4" />
          Dashboard
        </Button>
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="font-sans text-2xl font-bold text-foreground">News &amp; Articles</h1>
            <p className="text-sm text-muted-foreground">Create, edit and publish content for the website.</p>
          </div>
          <Button onClick={() => navigate("/admin/posts/new")} className="gap-2" data-testid="button-new-post">
            <Plus className="h-4 w-4" />
            New article
          </Button>
        </div>

        {isLoading && (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        )}

        {isError && (
          <p className="py-20 text-center text-sm text-destructive">{(error as Error).message}</p>
        )}

        {!isLoading && !isError && posts && posts.length === 0 && (
          <Card className="flex flex-col items-center gap-3 py-16 text-center">
            <FileText className="h-10 w-10 text-muted-foreground" />
            <div>
              <p className="font-medium text-foreground">No articles yet</p>
              <p className="text-sm text-muted-foreground">Create your first article to get started.</p>
            </div>
            <Button onClick={() => navigate("/admin/posts/new")} className="gap-2">
              <Plus className="h-4 w-4" />
              New article
            </Button>
          </Card>
        )}

        {!isLoading && !isError && posts && posts.length > 0 && (
          <Card className="divide-y divide-border">
            {posts.map((post) => (
              <div
                key={post.id}
                className="flex flex-wrap items-center gap-4 p-4"
                data-testid={`row-post-${post.id}`}
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <h2 className="truncate font-medium text-foreground">{post.title}</h2>
                    <Badge variant={post.status === "published" ? "default" : "secondary"}>
                      {post.status}
                    </Badge>
                  </div>
                  <p className="truncate text-sm text-muted-foreground">
                    /{post.slug} · Updated {formatDate(post.updatedAt)}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {post.status === "published" && (
                    <Button
                      variant="ghost"
                      size="icon"
                      asChild
                      title="View live article"
                      data-testid={`button-view-${post.id}`}
                    >
                      <a href={`/news/${post.slug}`} target="_blank" rel="noreferrer">
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => navigate(`/admin/posts/${post.id}/edit`)}
                    title="Edit"
                    data-testid={`button-edit-${post.id}`}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setPendingDelete(post)}
                    title="Delete"
                    data-testid={`button-delete-${post.id}`}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </div>
            ))}
          </Card>
        )}
      </main>

      <AlertDialog open={pendingDelete !== null} onOpenChange={(open) => !open && setPendingDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this article?</AlertDialogTitle>
            <AlertDialogDescription>
              “{pendingDelete?.title}” will be permanently removed. This cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();
                confirmDelete();
              }}
              disabled={deleting}
              className="gap-2"
            >
              {deleting && <Loader2 className="h-4 w-4 animate-spin" />}
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
