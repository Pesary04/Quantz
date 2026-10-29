import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link, useParams } from "wouter";
import { ArrowLeft, ArrowRight, CalendarDays, Clock, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Post } from "@/lib/admin-api";
import { ArticleBody, getHeadings, parseArticle } from "@/components/article/article-body";
import { ArticleSidebar } from "@/components/article/article-sidebar";

async function fetchArticle(slug: string): Promise<Post> {
  const res = await fetch(`/api/posts/${slug}`);
  if (res.status === 404) throw new Error("not-found");
  if (!res.ok) throw new Error("Failed to load article.");
  return (await res.json()).post as Post;
}

async function fetchPosts(): Promise<Post[]> {
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

function readingMinutes(content: string): number {
  return Math.max(1, Math.round(content.trim().split(/\s+/).length / 200));
}

function ReadingProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    function update() {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(max > 0 ? Math.min(100, (window.scrollY / max) * 100) : 0);
    }
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  return (
    <div className="absolute inset-x-0 bottom-0 h-1 bg-primary-foreground/10" aria-hidden="true">
      <div className="h-full bg-[#5B9BD5] transition-[width] duration-150" style={{ width: `${progress}%` }} />
    </div>
  );
}

function PublicHeader({ showProgress }: { showProgress: boolean }) {
  return (
    <header className="sticky top-0 z-40 bg-[#1E3F72]">
      <div className="mx-auto flex h-20 max-w-6xl items-center justify-between px-4">
        <a href="/" className="flex-shrink-0">
          <img src="/quantz-logo-white-text.png" alt="Quantz Financial Services" className="h-14 w-auto" />
        </a>
        <Link
          href="/news"
          className="flex items-center gap-2 text-sm font-medium text-primary-foreground/90 hover:text-primary-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          All news
        </Link>
      </div>
      {showProgress && <ReadingProgress />}
    </header>
  );
}

function ArticleHero({ post }: { post: Post }) {
  return (
    <section className="relative overflow-hidden bg-[#1E3F72] text-primary-foreground">
      <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 pb-28 pt-12 md:pt-16 lg:grid-cols-[1.1fr_1fr]">
        <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <span className="inline-flex w-fit items-center rounded-full bg-primary-foreground/10 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-primary-foreground/90 ring-1 ring-primary-foreground/20">
            Quantz Insights
          </span>
          <h1 className="text-balance text-3xl font-extrabold leading-tight md:text-5xl md:leading-tight">
            {post.title}
          </h1>
          {post.excerpt && (
            <p className="text-pretty text-lg leading-relaxed text-primary-foreground/80">{post.excerpt}</p>
          )}
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-primary-foreground/75">
            <span className="flex items-center gap-2">
              <CalendarDays aria-hidden="true" className="h-4 w-4" />
              {formatDate(post.publishedAt)}
            </span>
            <span className="flex items-center gap-2">
              <Clock aria-hidden="true" className="h-4 w-4" />
              {readingMinutes(post.content)} min read
            </span>
          </div>
        </div>

        {post.coverImageUrl && (
          <div className="relative animate-in fade-in zoom-in-95 duration-700">
            <div className="absolute -inset-3 rotate-2 rounded-3xl bg-[#2D6091]" aria-hidden="true" />
            <img
              src={post.coverImageUrl}
              alt=""
              className="relative aspect-[4/3] w-full rounded-3xl object-cover object-top shadow-2xl"
            />
          </div>
        )}
      </div>
    </section>
  );
}

function MoreInsights({ currentSlug }: { currentSlug: string }) {
  const { data: posts } = useQuery<Post[]>({ queryKey: ["/api/posts"], queryFn: fetchPosts });
  const others = (posts ?? []).filter((p) => p.slug !== currentSlug).slice(0, 3);

  return (
    <section className="mx-auto flex max-w-6xl flex-col gap-8 px-4 pb-20" aria-labelledby="more-insights-title">
      <div className="flex flex-col gap-6 overflow-hidden rounded-3xl bg-[#2D6091] p-8 text-primary-foreground md:flex-row md:items-center md:justify-between md:p-12">
        <div className="flex max-w-xl flex-col gap-3">
          <h2 className="text-balance text-2xl font-bold md:text-3xl">Close the gaps in your cover this month</h2>
          <p className="text-pretty leading-relaxed text-primary-foreground/80">
            A quick, honest review with a Quantz advisor shows you exactly where you stand — at no cost.
          </p>
        </div>
        <Link
          href="/insurance-review"
          className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-card px-6 py-3.5 font-semibold text-[#1E3F72] transition-transform hover:-translate-y-0.5"
        >
          Book a free review
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      {others.length > 0 && (
        <div className="flex flex-col gap-6">
          <h2 id="more-insights-title" className="text-2xl font-bold text-[#1E3F72]">
            More insights
          </h2>
          <ul className="grid gap-6 md:grid-cols-3">
            {others.map((p) => (
              <li key={p.id}>
                <Link
                  href={`/news/${p.slug}`}
                  className="group flex h-full flex-col overflow-hidden rounded-2xl bg-card shadow-sm transition-shadow hover:shadow-lg"
                >
                  {p.coverImageUrl && (
                    <img src={p.coverImageUrl} alt="" className="aspect-[16/9] w-full object-cover" />
                  )}
                  <div className="flex flex-1 flex-col gap-2 p-5">
                    <p className="text-xs font-bold uppercase tracking-widest text-[#2D6091]">
                      {formatDate(p.publishedAt)}
                    </p>
                    <p className="text-balance font-bold leading-snug text-[#1E3F72] group-hover:underline">{p.title}</p>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}

export default function ArticlePage() {
  const params = useParams();
  const slug = params.slug as string;

  const { data: post, isLoading, isError, error } = useQuery<Post>({
    queryKey: ["/api/posts", slug],
    queryFn: () => fetchArticle(slug),
  });

  const blocks = useMemo(() => (post ? parseArticle(post.content) : []), [post]);
  const headings = useMemo(() => getHeadings(blocks), [blocks]);
  const notFound = isError && (error as Error).message === "not-found";

  return (
    <div className="min-h-screen bg-background">
      <PublicHeader showProgress={Boolean(post)} />

      {isLoading && (
        <div className="flex items-center justify-center py-32">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      )}

      {isError && (
        <div className="flex flex-col items-center gap-4 px-4 py-32 text-center">
          <p className="text-lg font-medium text-foreground">
            {notFound ? "Article not found" : "Something went wrong"}
          </p>
          <p className="text-sm text-muted-foreground">
            {notFound ? "This article may have been moved or unpublished." : "Please try again in a moment."}
          </p>
          <Button asChild>
            <Link href="/news">Back to news</Link>
          </Button>
        </div>
      )}

      {post && (
        <main>
          <ArticleHero post={post} />

          <div className="relative mx-auto -mt-16 grid max-w-6xl gap-8 px-4 pb-16 lg:grid-cols-[minmax(0,1fr)_300px]">
            <article className="rounded-3xl bg-card p-6 shadow-xl md:p-12">
              <ArticleBody blocks={blocks} />
              <div className="mt-12 flex flex-wrap items-center justify-between gap-4 border-t border-border pt-6">
                <p className="text-sm text-muted-foreground">Written by the Quantz Financial Services team</p>
                <Button variant="outline" asChild className="gap-2">
                  <Link href="/news">
                    <ArrowLeft className="h-4 w-4" />
                    Back to news
                  </Link>
                </Button>
              </div>
            </article>

            <ArticleSidebar title={post.title} headings={headings} />
          </div>

          <MoreInsights currentSlug={post.slug} />
        </main>
      )}
    </div>
  );
}
