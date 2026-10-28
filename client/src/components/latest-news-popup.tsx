import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Newspaper, X } from "lucide-react";
import type { Post } from "@/lib/admin-api";

const DISMISS_KEY = "quantz-news-popup-dismissed";
const SHOW_DELAY_MS = 1200;

async function fetchPublicPosts(): Promise<Post[]> {
  const res = await fetch("/api/posts");
  if (!res.ok) throw new Error("Failed to load news.");
  return (await res.json()).posts as Post[];
}

function formatDate(value: string | null): string {
  if (!value) return "";
  return new Date(value).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
}

export function LatestNewsPopup() {
  const { data: posts } = useQuery<Post[]>({ queryKey: ["/api/posts"], queryFn: fetchPublicPosts });
  const latest = posts?.[0];
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!latest) return;
    if (sessionStorage.getItem(DISMISS_KEY) === String(latest.id)) return;
    const timer = window.setTimeout(() => setVisible(true), SHOW_DELAY_MS);
    return () => window.clearTimeout(timer);
  }, [latest]);

  const dismiss = () => {
    if (latest) sessionStorage.setItem(DISMISS_KEY, String(latest.id));
    setVisible(false);
  };

  return (
    <AnimatePresence>
      {visible && latest && (
        <motion.aside
          key={latest.id}
          role="dialog"
          aria-label="Latest news from Quantz"
          initial={{ opacity: 0, y: -40, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -24, scale: 0.97 }}
          transition={{ type: "spring", stiffness: 260, damping: 24 }}
          className="fixed inset-x-3 top-24 z-[60] mx-auto max-w-md sm:inset-x-auto sm:right-6 sm:mx-0"
          data-testid="latest-news-popup"
        >
          <div className="relative overflow-hidden rounded-2xl bg-white shadow-2xl ring-1 ring-black/5">
            <motion.div
              aria-hidden="true"
              className="absolute inset-x-0 top-0 h-1 origin-left"
              style={{ backgroundColor: "#2D6FA3" }}
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            />

            <div className="flex items-center justify-between gap-3 px-4 pt-4">
              <div className="flex items-center gap-2">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-75" style={{ backgroundColor: "#2D6FA3" }} />
                  <span className="relative inline-flex h-2.5 w-2.5 rounded-full" style={{ backgroundColor: "#2D6FA3" }} />
                </span>
                <span className="text-xs font-bold uppercase tracking-widest" style={{ color: "#1C3F6E" }}>
                  Just published
                </span>
                <span className="text-xs text-gray-500">{formatDate(latest.publishedAt)}</span>
              </div>
              <button
                type="button"
                onClick={dismiss}
                className="rounded-full p-1.5 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-800"
                aria-label="Dismiss latest news"
                data-testid="latest-news-popup-close"
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>

            <div className="flex gap-4 p-4">
              {latest.coverImageUrl ? (
                <img
                  src={latest.coverImageUrl}
                  alt=""
                  className="h-24 w-24 shrink-0 rounded-xl object-cover object-top"
                />
              ) : (
                <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-xl bg-gray-100">
                  <Newspaper className="h-6 w-6 text-gray-400" aria-hidden="true" />
                </div>
              )}
              <div className="flex min-w-0 flex-col gap-1.5">
                <h2 className="line-clamp-2 font-bold leading-snug text-pretty" style={{ color: "#1C3F6E" }}>
                  {latest.title}
                </h2>
                <p className="line-clamp-2 text-sm leading-relaxed text-gray-600">{latest.excerpt}</p>
              </div>
            </div>

            <div className="flex items-center justify-between gap-3 border-t border-gray-100 px-4 py-3">
              <Link href="/news" onClick={dismiss} className="text-sm font-medium text-gray-600 hover:underline">
                All news &amp; insights
              </Link>
              <Link
                href={`/news/${latest.slug}`}
                onClick={dismiss}
                className="inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-90"
                style={{ backgroundColor: "#1C3F6E" }}
                data-testid="latest-news-popup-read"
              >
                Read article
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
}
