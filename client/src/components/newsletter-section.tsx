import { Link } from "wouter";
import { ArrowRight, Newspaper } from "lucide-react";
import { useSiteSettings } from "@/lib/site-content";

export function NewsletterSection() {
  const settings = useSiteSettings();

  return (
    <section id="newsletter" className="px-4 py-16 md:px-8" style={{ background: "#ffffff" }} data-testid="newsletter-section">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-10 md:flex-row md:items-center">
        <div className="flex w-full flex-col gap-4 md:w-1/2">
          <span className="text-xs font-bold uppercase tracking-widest" style={{ color: "#2D6FA3" }}>
            Quantz Insights
          </span>
          <h2 className="text-3xl font-bold text-balance md:text-4xl" style={{ color: "#1C3F6E" }}>
            Our latest newsletter
          </h2>
          <p className="text-base leading-relaxed text-gray-600 text-pretty">
            Practical guidance to help you protect what matters and make smarter financial decisions.
          </p>
          {settings.newsletterIssue && (
            <p className="text-base font-semibold" style={{ color: "#1C3F6E" }}>
              {settings.newsletterIssue}
            </p>
          )}
          <div className="flex flex-col gap-3 pt-2 sm:items-start">
            <Link
              href="/insurance-review"
              className="newsletter-cta inline-flex items-center justify-center gap-2 rounded-xl px-6 py-4 text-center text-base font-bold text-white shadow-lg transition-transform hover:-translate-y-0.5"
              style={{ background: "linear-gradient(135deg, #2D6FA3, #1C3F6E)" }}
              data-testid="button-newsletter-cta"
            >
              {settings.newsletterCtaLabel}
              <ArrowRight className="h-5 w-5 shrink-0" aria-hidden="true" />
            </Link>
            <p className="text-sm text-gray-500">Not sure if you&apos;re properly covered? Let&apos;s check together.</p>
          </div>
        </div>

        <div className="w-full md:w-1/2">
          {settings.newsletterImageUrl ? (
            <img
              src={settings.newsletterImageUrl}
              alt={settings.newsletterIssue || "Current Quantz Insights newsletter"}
              className="mx-auto w-full max-w-md rounded-2xl border border-gray-200 object-contain shadow-xl"
            />
          ) : (
            <div className="mx-auto flex aspect-[3/4] w-full max-w-md flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-gray-300 bg-gray-50 p-8 text-center">
              <Newspaper className="h-10 w-10 text-gray-400" aria-hidden="true" />
              <p className="text-sm text-gray-500">The current newsletter issue will appear here.</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
