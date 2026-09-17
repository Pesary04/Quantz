import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { ArrowLeft, ArrowRight, Loader2, Newspaper } from "lucide-react";
import { Card } from "@/components/ui/card";
import type { Post } from "@/lib/admin-api";

async function fetchPublicPosts(): Promise<Post[]> {
  const res = await fetch("/api/posts");
  if (!res.ok) throw new Error("Failed to load news.");
  return (await res.json()).posts as Post[];
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
      <div className="mx-auto flex h-20 max-w-5xl items-center justify-between px-4">
        <a href="/" className="flex-shrink-0">
          <img src="/quantz-logo-white-text.png" alt="Quantz Financial Services" className="h-14 w-auto" />
        </a>
        <a href="/" className="flex items-center gap-2 text-sm font-medium text-white/90 hover:text-white">
          <ArrowLeft className="h-4 w-4" />
          Back to site
        </a>
      </div>
    </header>
  );
}

export default function NewsPage() {
  const { data: posts, isLoading, isError } = useQuery<Post[]>({
    queryKey: ["/api/posts"],
    queryFn: fetchPublicPosts,
  });

  return (
    <div className="min-h-screen bg-background">
      <PublicHeader />

      <section className="px-4 py-12" style={{ background: "#1E3F72" }}>
        <div className="mx-auto max-w-5xl">
          <h1 className="font-sans text-3xl font-bold text-white text-balance md:text-4xl">
            News &amp; Insights
          </h1>
          <p className="mt-2 max-w-2xl text-white/80">
            Updates, announcements and financial insights from Quantz Financial Services.
          </p>
        </div>
      </section>

      <main className="mx-auto max-w-5xl px-4 py-10">
        {isLoading && (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        )}

        {isError && (
          <p className="py-20 text-center text-sm text-destructive">
            We couldn&apos;t load the news right now. Please try again later.
          </p>
        )}

        {!isLoading && !isError && posts && posts.length === 0 && (
          <div className="flex flex-col items-center gap-3 py-20 text-center">
            <Newspaper className="h-10 w-10 text-muted-foreground" />
            <p className="text-muted-foreground">No articles have been published yet. Check back soon.</p>
          </div>
        )}

        {!isLoading && !isError && posts && posts.length > 0 && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <Link key={post.id} href={`/news/${post.slug}`} data-testid={`card-post-${post.id}`}>
                <Card className="group flex h-full cursor-pointer flex-col overflow-hidden transition-shadow hover:shadow-lg">
                  {post.coverImageUrl ? (
                    <img
                      src={post.coverImageUrl}
                      alt={post.title}
                      className="h-44 w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-44 w-full items-center justify-center bg-secondary">
                      <Newspaper className="h-8 w-8 text-muted-foreground" />
                    </div>
                  )}
                  <div className="flex flex-1 flex-col gap-2 p-5">
                    <p className="text-xs font-medium uppercase tracking-wide text-primary">
                      {formatDate(post.publishedAt)}
                    </p>
                    <h2 className="font-sans text-lg font-semibold text-foreground text-pretty">
                      {post.title}
                    </h2>
                    <p className="line-clamp-3 flex-1 text-sm text-muted-foreground">{post.excerpt}</p>
                    <span className="mt-1 inline-flex items-center gap-1 text-sm font-medium text-primary">
                      Read more
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </span>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
