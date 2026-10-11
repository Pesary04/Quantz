import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { ArrowRight, Newspaper } from "lucide-react";
import type { Post } from "@/lib/admin-api";

async function fetchPublicPosts(): Promise<Post[]> {
  const res = await fetch("/api/posts");
  if (!res.ok) throw new Error("Failed to load news.");
  return (await res.json()).posts as Post[];
}

function formatDate(value: string | null): string {
  if (!value) return "";
  return new Date(value).toLocaleDateString("en-GB", { day: "2-digit", month: "long", year: "numeric" });
}

export function LatestNewsSection() {
  const { data: posts } = useQuery<Post[]>({ queryKey: ["/api/posts"], queryFn: fetchPublicPosts });
  const latest = (posts ?? []).slice(0, 3);

  if (latest.length === 0) return null;

  const [featured, ...rest] = latest;

  return (
    <section id="news" className="px-4 py-16 md:px-8" data-testid="latest-news-section">
      <div className="mx-auto flex max-w-6xl flex-col gap-8">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex flex-col gap-2">
            <span className="text-xs font-bold uppercase tracking-widest" style={{ color: "#2D6FA3" }}>
              News &amp; Insights
            </span>
            <h2 className="text-3xl font-bold text-balance md:text-4xl" style={{ color: "#1C3F6E" }}>
              Latest from Quantz
            </h2>
          </div>
          <Link href="/news" className="inline-flex items-center gap-1 text-sm font-semibold" style={{ color: "#2D6FA3" }}>
            View all articles
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>

        <div className="grid gap-6 lg:grid-cols-5">
          <Link
            href={`/news/${featured.slug}`}
            className="group flex flex-col overflow-hidden rounded-2xl bg-white shadow-md transition-shadow hover:shadow-xl lg:col-span-3"
            data-testid={`home-post-${featured.id}`}
          >
            {featured.coverImageUrl ? (
              <img src={featured.coverImageUrl} alt={featured.title} className="h-64 w-full object-cover" />
            ) : (
              <div className="flex h-64 w-full items-center justify-center bg-gray-100">
                <Newspaper className="h-10 w-10 text-gray-400" aria-hidden="true" />
              </div>
            )}
            <div className="flex flex-1 flex-col gap-2 p-6">
              <p className="text-xs font-semibold uppercase tracking-wide" style={{ color: "#2D6FA3" }}>
                {formatDate(featured.publishedAt)}
              </p>
              <h3 className="text-2xl font-bold text-pretty" style={{ color: "#1C3F6E" }}>{featured.title}</h3>
              <p className="line-clamp-3 leading-relaxed text-gray-600">{featured.excerpt}</p>
            </div>
          </Link>

          {rest.length > 0 && (
            <div className="flex flex-col gap-6 lg:col-span-2">
              {rest.map((post) => (
                <Link
                  key={post.id}
                  href={`/news/${post.slug}`}
                  className="group flex flex-1 gap-4 overflow-hidden rounded-2xl bg-white p-4 shadow-md transition-shadow hover:shadow-xl"
                  data-testid={`home-post-${post.id}`}
                >
                  {post.coverImageUrl ? (
                    <img src={post.coverImageUrl} alt="" className="h-24 w-24 shrink-0 rounded-xl object-cover" />
                  ) : (
                    <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-xl bg-gray-100">
                      <Newspaper className="h-6 w-6 text-gray-400" aria-hidden="true" />
                    </div>
                  )}
                  <div className="flex flex-col gap-1">
                    <p className="text-xs font-semibold uppercase tracking-wide" style={{ color: "#2D6FA3" }}>
                      {formatDate(post.publishedAt)}
                    </p>
                    <h3 className="font-bold text-pretty" style={{ color: "#1C3F6E" }}>{post.title}</h3>
                    <p className="line-clamp-2 text-sm text-gray-600">{post.excerpt}</p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
