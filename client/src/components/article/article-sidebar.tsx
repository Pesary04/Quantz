import { useState } from "react";
import { Link } from "wouter";
import { ArrowRight, Check, Link2, MessageCircle, ShieldCheck } from "lucide-react";
import type { ArticleHeading } from "./article-body";

function ShareLinks({ title }: { title: string }) {
  const [copied, setCopied] = useState(false);
  const url = typeof window !== "undefined" ? window.location.href : "";
  const encodedUrl = encodeURIComponent(url);
  const encodedText = encodeURIComponent(`${title} — ${url}`);

  const linkClass =
    "flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card text-[#1E3F72] transition-colors hover:bg-[#1E3F72] hover:text-primary-foreground";

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }

  return (
    <div className="flex items-center gap-2">
      <a
        href={`https://wa.me/?text=${encodedText}`}
        target="_blank"
        rel="noopener noreferrer"
        className={linkClass}
        aria-label="Share on WhatsApp"
      >
        <MessageCircle className="h-4 w-4" />
      </a>
      <a
        href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`}
        target="_blank"
        rel="noopener noreferrer"
        className={`${linkClass} text-xs font-bold`}
        aria-label="Share on LinkedIn"
      >
        in
      </a>
      <a
        href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`}
        target="_blank"
        rel="noopener noreferrer"
        className={`${linkClass} text-sm font-bold`}
        aria-label="Share on Facebook"
      >
        f
      </a>
      <button type="button" onClick={copyLink} className={linkClass} aria-label={copied ? "Link copied" : "Copy link"}>
        {copied ? <Check className="h-4 w-4" /> : <Link2 className="h-4 w-4" />}
      </button>
    </div>
  );
}

export function ArticleSidebar({ title, headings }: { title: string; headings: ArticleHeading[] }) {
  return (
    <aside className="flex flex-col gap-6 lg:sticky lg:top-28">
      {headings.length > 0 && (
        <nav aria-label="In this article" className="hidden flex-col gap-3 rounded-2xl bg-card p-6 shadow-sm lg:flex">
          <p className="text-xs font-bold uppercase tracking-widest text-[#2D6091]">In this article</p>
          <ul className="flex flex-col gap-1">
            {headings.map((heading) => (
              <li key={heading.id}>
                <a
                  href={`#${heading.id}`}
                  className="block rounded-md px-2 py-1.5 text-sm text-foreground/75 transition-colors hover:bg-background hover:text-[#1E3F72]"
                >
                  {heading.text}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      )}

      <div className="flex flex-col gap-4 overflow-hidden rounded-2xl bg-[#1E3F72] p-6 text-primary-foreground shadow-lg">
        <ShieldCheck aria-hidden="true" className="h-8 w-8 text-primary-foreground/80" />
        <p className="text-balance text-xl font-bold leading-snug">Not sure if you&apos;re fully covered?</p>
        <p className="text-sm leading-relaxed text-primary-foreground/80">
          Book a free, no-obligation insurance review with a Quantz advisor.
        </p>
        <Link
          href="/insurance-review"
          className="mt-1 inline-flex items-center justify-center gap-2 rounded-full bg-card px-5 py-3 text-sm font-semibold text-[#1E3F72] transition-transform hover:-translate-y-0.5"
        >
          Get my free review
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      <div className="flex flex-col gap-3 rounded-2xl bg-card p-6 shadow-sm">
        <p className="text-xs font-bold uppercase tracking-widest text-[#2D6091]">Share this article</p>
        <ShareLinks title={title} />
      </div>
    </aside>
  );
}
