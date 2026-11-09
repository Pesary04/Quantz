import { useState } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { ArrowRight, Expand } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { useSiteSettings } from "@/lib/site-content";

function FallbackCover({ issue }: { issue: string }) {
  return (
    <div
      className="flex h-full w-full flex-col justify-between p-3 text-left"
      style={{ background: "linear-gradient(160deg, #2D6FA3, #1C3F6E)" }}
    >
      <span className="text-[10px] font-bold uppercase tracking-widest text-white/80">Quantz</span>
      <div className="flex flex-col gap-1">
        <span className="text-sm font-bold leading-tight text-white">Insights</span>
        <span className="line-clamp-3 text-[10px] leading-snug text-white/80">{issue}</span>
      </div>
    </div>
  );
}

export function NewsletterSpotlight() {
  const settings = useSiteSettings();
  const [open, setOpen] = useState(false);
  const issue = settings.newsletterIssue || "Our latest newsletter is out now";
  const hasImage = Boolean(settings.newsletterImageUrl);

  const cover = hasImage ? (
    <img src={settings.newsletterImageUrl} alt={`Cover of ${issue}`} className="h-full w-full object-cover object-top" />
  ) : (
    <FallbackCover issue={issue} />
  );

  return (
    <section
      id="newsletter"
      aria-labelledby="newsletter-spotlight-title"
      className="relative border-b border-gray-200 bg-white"
      data-testid="newsletter-spotlight"
    >
      <div className="absolute inset-x-0 top-0 h-1" style={{ backgroundColor: "#2D6FA3" }} aria-hidden="true" />

      <div className="mx-auto flex max-w-7xl flex-col items-center gap-6 px-4 py-8 sm:flex-row sm:gap-10 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24, rotate: -10 }}
          animate={{ opacity: 1, y: 0, rotate: -5 }}
          transition={{ type: "spring", stiffness: 160, damping: 16, delay: 0.15 }}
          whileHover={{ rotate: 0, scale: 1.04 }}
          className="relative shrink-0"
        >
          <span
            className="absolute -right-3 -top-3 z-10 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white shadow-md"
            style={{ backgroundColor: "#1C3F6E" }}
          >
            New issue
          </span>
          {hasImage ? (
            <button
              type="button"
              onClick={() => setOpen(true)}
              className="group relative block h-40 w-32 overflow-hidden rounded-lg shadow-xl ring-1 ring-black/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2D6FA3]"
              aria-label="View the full newsletter"
              data-testid="button-newsletter-cover"
            >
              {cover}
              <span className="absolute inset-0 flex items-center justify-center bg-black/0 transition-colors group-hover:bg-black/30">
                <Expand className="h-5 w-5 text-white opacity-0 transition-opacity group-hover:opacity-100" aria-hidden="true" />
              </span>
            </button>
          ) : (
            <div className="h-40 w-32 overflow-hidden rounded-lg shadow-xl ring-1 ring-black/10">{cover}</div>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: -16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex min-w-0 max-w-2xl flex-1 flex-col items-center gap-2 text-center sm:items-start sm:text-left"
        >
          <div className="flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5 shrink-0" aria-hidden="true">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-75" style={{ backgroundColor: "#2D6FA3" }} />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full" style={{ backgroundColor: "#2D6FA3" }} />
            </span>
            <span className="text-xs font-bold uppercase tracking-widest" style={{ color: "#2D6FA3" }}>
              Quantz Insights newsletter, out now
            </span>
          </div>
          <h2
            id="newsletter-spotlight-title"
            className="text-xl font-bold leading-snug text-balance md:text-2xl"
            style={{ color: "#1C3F6E" }}
          >
            {issue}
          </h2>
          <p className="text-sm leading-relaxed text-gray-600 text-pretty">
            Practical guidance to help you protect what matters and make smarter financial decisions.
          </p>

          <div className="flex w-full flex-col gap-2 pt-2 sm:w-auto sm:flex-row sm:flex-wrap">
            <Link
              href="/insurance-review"
              className="newsletter-cta inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-bold text-white shadow-lg transition-transform hover:-translate-y-0.5"
              style={{ background: "linear-gradient(135deg, #2D6FA3, #1C3F6E)" }}
              data-testid="button-newsletter-cta"
            >
              {settings.newsletterCtaLabel || "Book a free insurance review"}
              <ArrowRight className="h-4 w-4 shrink-0" aria-hidden="true" />
            </Link>
            {hasImage && (
              <button
                type="button"
                onClick={() => setOpen(true)}
                className="rounded-xl border border-gray-200 px-5 py-3 text-sm font-semibold transition-colors hover:bg-gray-50"
                style={{ color: "#1C3F6E" }}
                data-testid="button-newsletter-view"
              >
                Read the newsletter
              </button>
            )}
          </div>
        </motion.div>
      </div>

      {hasImage && (
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto p-4">
            <DialogTitle className="pr-8 text-base" style={{ color: "#1C3F6E" }}>
              {issue}
            </DialogTitle>
            <DialogDescription className="sr-only">The current Quantz Insights newsletter issue.</DialogDescription>
            <img src={settings.newsletterImageUrl} alt={`Full page of ${issue}`} className="w-full rounded-lg" />
          </DialogContent>
        </Dialog>
      )}
    </section>
  );
}
