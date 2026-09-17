import { useEffect, useRef, useState, type FormEvent } from "react";
import { useLocation, useParams } from "wouter";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, ImagePlus, Loader2, X } from "lucide-react";
import { AdminHeader } from "@/components/admin/admin-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { fetchAdminPost, savePost, uploadImage, type Post, type PostInput } from "@/lib/admin-api";

export default function AdminEditor() {
  const params = useParams();
  const id = params.id;
  const isEditing = Boolean(id);
  const [, navigate] = useLocation();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [coverImageUrl, setCoverImageUrl] = useState<string | null>(null);
  const [status, setStatus] = useState<"draft" | "published">("draft");
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const { data: existing, isLoading } = useQuery<Post>({
    queryKey: ["/api/admin/posts", id],
    queryFn: () => fetchAdminPost(id as string),
    enabled: isEditing,
  });

  useEffect(() => {
    if (existing) {
      setTitle(existing.title);
      setSlug(existing.slug);
      setExcerpt(existing.excerpt);
      setContent(existing.content);
      setCoverImageUrl(existing.coverImageUrl);
      setStatus(existing.status);
    }
  }, [existing]);

  async function handleFile(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const url = await uploadImage(file);
      setCoverImageUrl(url);
      toast({ title: "Image uploaded" });
    } catch (err) {
      toast({ variant: "destructive", title: "Upload failed", description: (err as Error).message });
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setSaving(true);
    try {
      const input: PostInput = {
        title: title.trim(),
        slug: slug.trim() || undefined,
        excerpt: excerpt.trim(),
        content,
        coverImageUrl: coverImageUrl,
        status,
      };
      await savePost(input, id);
      await queryClient.invalidateQueries({ queryKey: ["/api/admin/posts"] });
      toast({ title: isEditing ? "Article updated" : "Article created" });
      navigate("/admin");
    } catch (err) {
      toast({ variant: "destructive", title: "Save failed", description: (err as Error).message });
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <AdminHeader />
      <main className="mx-auto max-w-3xl px-4 py-8">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate("/admin")}
          className="mb-4 gap-2"
          data-testid="button-back"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to articles
        </Button>

        <h1 className="mb-6 font-sans text-2xl font-bold text-foreground">
          {isEditing ? "Edit article" : "New article"}
        </h1>

        {isEditing && isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <Card>
              <CardContent className="flex flex-col gap-5 pt-6">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Article headline"
                    data-testid="input-title"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <Label htmlFor="slug">
                    URL slug <span className="text-muted-foreground">(optional)</span>
                  </Label>
                  <Input
                    id="slug"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    placeholder="auto-generated-from-title"
                    data-testid="input-slug"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <Label htmlFor="excerpt">Excerpt</Label>
                  <Textarea
                    id="excerpt"
                    value={excerpt}
                    onChange={(e) => setExcerpt(e.target.value)}
                    placeholder="Short summary shown on the news listing."
                    rows={2}
                    data-testid="input-excerpt"
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="flex flex-col gap-3 pt-6">
                <Label>Cover image</Label>
                {coverImageUrl ? (
                  <div className="relative overflow-hidden rounded-md border border-border">
                    <img src={coverImageUrl} alt="Cover preview" className="max-h-64 w-full object-cover" />
                    <Button
                      type="button"
                      variant="secondary"
                      size="icon"
                      onClick={() => setCoverImageUrl(null)}
                      className="absolute right-2 top-2"
                      data-testid="button-remove-image"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploading}
                    className="flex flex-col items-center justify-center gap-2 rounded-md border border-dashed border-input py-10 text-muted-foreground transition-colors hover:border-primary hover:text-primary"
                    data-testid="button-upload-image"
                  >
                    {uploading ? (
                      <Loader2 className="h-6 w-6 animate-spin" />
                    ) : (
                      <ImagePlus className="h-6 w-6" />
                    )}
                    <span className="text-sm">{uploading ? "Uploading…" : "Upload an image"}</span>
                  </button>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/png,image/jpeg,image/webp,image/gif,image/svg+xml"
                  className="hidden"
                  onChange={handleFile}
                />
              </CardContent>
            </Card>

            <Card>
              <CardContent className="flex flex-col gap-2 pt-6">
                <Label htmlFor="content">Content</Label>
                <Textarea
                  id="content"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Write the full article here. Blank lines separate paragraphs."
                  rows={16}
                  data-testid="input-content"
                />
              </CardContent>
            </Card>

            <div className="flex flex-wrap items-end justify-between gap-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="status">Status</Label>
                <Select value={status} onValueChange={(v) => setStatus(v as "draft" | "published")}>
                  <SelectTrigger id="status" className="w-44" data-testid="select-status">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="published">Published</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button type="submit" disabled={saving || uploading} className="gap-2" data-testid="button-save">
                {saving && <Loader2 className="h-4 w-4 animate-spin" />}
                {isEditing ? "Save changes" : "Create article"}
              </Button>
            </div>
          </form>
        )}
      </main>
    </div>
  );
}
