import { Link } from "wouter";
import { motion } from "framer-motion";
import { ArrowRight, ShieldCheck } from "lucide-react";
import { useSiteSettings } from "@/lib/site-content";

const NAVY = "#1C3F6E";
const BLUE = "#2D6FA3";
const MIST = "#E8F0F8";

function parseIssue(raw: string) {
  const parts = raw
    .split(/\s*[|\u2013\u2014]\s*|\s+-\s+/)
    .map((p) => p.trim())
    .filter(Boolean);
  const label = parts.find((p) => /^issue\b/i.test(p)) ?? "";
  const date = parts.find((p) => p !== label && /\b(19|20)\d{2}\b/.test(p)) ?? "";
  const title = parts.filter((p) => p !== label && p !== date).join(": ");
  return { label, date, title };
}

function IssueCover({ label, date, title }: { label: string; date: string; title: string }) {
  return (
    <div className="flex h-full w-full flex-col justify-between gap-6 bg-white p-7 sm:p-9">
      <div className="flex items-center justify-between gap-3 border-b pb-4" style={{ borderColor: MIST }}>
        <span className="text-sm font-bold uppercase tracking-[0.2em]" style={{ color: NAVY }}>
          Quantz Insights
        </span>
        {label && (
          <span className="rounded-full px-3 py-1 text-xs font-bold text-white" style={{ background: BLUE }}>
            {label}
          </span>
        )}
      </div>

      <div className="flex flex-col gap-4">
        {date && (
          <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: BLUE }}>
            {date}
          </span>
        )}
        <p className="text-3xl font-bold leading-tight text-balance sm:text-4xl" style={{ color: NAVY }}>
          {title || "Practical guidance for protecting what matters"}
        </p>
        <div className="h-1 w-16 rounded-full" style={{ background: BLUE }} aria-hidden="true" />
      </div>

      <div className="flex flex-col gap-3">
        {["Where cover gaps usually hide", "Simple checks you can do today", "When to ask for a review"].map((line) => (
          <div key={line} className="flex items-center gap-3 text-sm text-gray-600">
            <ShieldCheck className="h-4 w-4 shrink-0" style={{ color: BLUE }} aria-hidden="true" />
            <span>{line}</span>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between border-t pt-4 text-xs text-gray-500" style={{ borderColor: MIST }}>
        <span>Quantz Financial Services</span>
        <span>Namibia</span>
      </div>
    </div>
  );
}

export function NewsletterSection() {
  const settings = useSiteSettings();
  const issue = parseIssue(settings.newsletterIssue || "");
  const hasImage = Boolean(settings.newsletterImageUrl);

  return (
    <section id="newsletter" className="px-4 py-16 md:px-8" data-testid="newsletter-section">
      <div
        className="mx-auto flex max-w-6xl flex-col items-center gap-12 overflow-hidden rounded-3xl px-6 py-12 md:flex-row md:gap-10 md:px-12 md:py-16"
        style={{ background: NAVY }}
      >
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.5 }}
          className="flex w-full flex-col gap-5 md:w-1/2"
        >
          <span className="text-xs font-bold uppercase tracking-widest" style={{ color: "#9EC3E6" }}>
            Quantz Insights newsletter
          </span>
          <h2 className="text-3xl font-bold leading-tight text-balance text-white md:text-5xl">
            Our latest newsletter
          </h2>
          <p className="text-base leading-relaxed text-pretty" style={{ color: "#D5E3F1" }}>
            Practical guidance to help you protect what matters and make smarter financial decisions.
          </p>

          {(issue.label || issue.date || issue.title) && (
            <div className="flex flex-col gap-1 rounded-2xl p-4" style={{ background: "rgba(255,255,255,0.08)" }}>
              <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: "#9EC3E6" }}>
                {[issue.label, issue.date].filter(Boolean).join(" · ") || "This issue"}
              </span>
              {issue.title && <span className="text-lg font-semibold text-white">{issue.title}</span>}
            </div>
          )}

          <div className="flex flex-col gap-3 pt-2 sm:items-start">
            <Link
              href="/insurance-review"
              className="newsletter-cta inline-flex items-center justify-center gap-2 rounded-xl bg-white px-6 py-4 text-center text-base font-bold shadow-lg transition-transform hover:-translate-y-0.5"
              style={{ color: NAVY }}
              data-testid="button-newsletter-cta"
            >
              {settings.newsletterCtaLabel}
              <ArrowRight className="h-5 w-5 shrink-0" aria-hidden="true" />
            </Link>
            <p className="text-sm" style={{ color: "#D5E3F1" }}>
              Not sure if you&apos;re properly covered? Let&apos;s check together.
            </p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24, rotate: 0 }}
          whileInView={{ opacity: 1, y: 0, rotate: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="relative flex w-full justify-center md:w-1/2"
        >
          <div className="relative w-full max-w-sm">
            <div
              className="absolute inset-0 translate-x-5 translate-y-3 rotate-6 rounded-2xl"
              style={{ background: BLUE }}
              aria-hidden="true"
            />
            <div
              className="absolute inset-0 translate-x-2 translate-y-1 rotate-3 rounded-2xl"
              style={{ background: MIST }}
              aria-hidden="true"
            />
            <div className="relative aspect-[3/4] w-full -rotate-1 overflow-hidden rounded-2xl shadow-2xl transition-transform duration-300 hover:rotate-0">
              {hasImage ? (
                <img
                  src={settings.newsletterImageUrl}
                  alt={settings.newsletterIssue || "Current Quantz Insights newsletter"}
                  className="h-full w-full bg-white object-cover"
                />
              ) : (
                <IssueCover {...issue} />
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
