import { useQuery } from "@tanstack/react-query";
import { Link, useParams } from "wouter";
import { ArrowLeft, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Post } from "@/lib/admin-api";

async function fetchArticle(slug: string): Promise<Post> {
  const res = await fetch(`/api/posts/${slug}`);
  if (res.status === 404) throw new Error("not-found");
  if (!res.ok) throw new Error("Failed to load article.");
  return (await res.json()).post as Post;
}

function formatDate(value: string | null): string {
  if (!value) return "";
  return new Date(value).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

function PublicHeader() {
  return (
    <header className="sticky top-0 z-40" style={{ background: "#1E3F72" }}>
      <div className="mx-auto flex h-20 max-w-3xl items-center justify-between px-4">
        <a href="/" className="flex-shrink-0">
          <img src="/quantz-logo-white-text.png" alt="Quantz Financial Services" className="h-14 w-auto" />
        </a>
        <Link href="/news" className="flex items-center gap-2 text-sm font-medium text-white/90 hover:text-white">
          <ArrowLeft className="h-4 w-4" />
          All news
        </Link>
      </div>
    </header>
  );
}

export default function ArticlePage() {
  const params = useParams();
  const slug = params.slug as string;

  const { data: post, isLoading, isError, error } = useQuery<Post>({
    queryKey: ["/api/posts", slug],
    queryFn: () => fetchArticle(slug),
  });

  const notFound = isError && (error as Error).message === "not-found";

  return (
    <div className="min-h-screen bg-background">
      <PublicHeader />

      <main className="mx-auto max-w-3xl px-4 py-10">
        {isLoading && (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        )}

        {isError && (
          <div className="flex flex-col items-center gap-4 py-20 text-center">
            <p className="text-lg font-medium text-foreground">
              {notFound ? "Article not found" : "Something went wrong"}
            </p>
            <p className="text-sm text-muted-foreground">
              {notFound
                ? "This article may have been moved or unpublished."
                : "Please try again in a moment."}
            </p>
            <Button asChild>
              <Link href="/news">Back to news</Link>
            </Button>
          </div>
        )}

        {post && (
          <article>
            <p className="text-sm font-medium uppercase tracking-wide text-primary">
              {formatDate(post.publishedAt)}
            </p>
            <h1 className="mt-2 font-sans text-3xl font-bold text-foreground text-balance md:text-4xl">
              {post.title}
            </h1>
            {post.excerpt && (
              <p className="mt-4 text-lg text-muted-foreground text-pretty">{post.excerpt}</p>
            )}
            {post.coverImageUrl && (
              <img
                src={post.coverImageUrl}
                alt={post.title}
                className="mt-6 w-full rounded-lg border border-border object-cover"
              />
            )}
            <div className="mt-8 whitespace-pre-wrap text-base leading-relaxed text-foreground/90">
              {post.content}
            </div>
            <div className="mt-10 border-t border-border pt-6">
              <Button variant="outline" asChild className="gap-2">
                <Link href="/news">
                  <ArrowLeft className="h-4 w-4" />
                  Back to news
                </Link>
              </Button>
            </div>
          </article>
        )}
      </main>
    </div>
  );
}
