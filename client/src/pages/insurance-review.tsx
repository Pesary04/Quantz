import { useState, type FormEvent } from "react";
import { ArrowLeft, CheckCircle2, Loader2 } from "lucide-react";
import { HoneypotField, useBotProtection } from "@/components/bot-protection";
import { CONTACT_TIME_OPTIONS, fieldErrors, insuranceReviewSchema } from "@shared/enquiry-validation";

const EMPTY = { fullName: "", phone: "", email: "", contactTime: "", focus: "" };
type FormState = typeof EMPTY;

const inputClass =
  "w-full rounded-xl border bg-white px-4 py-3 text-base text-gray-900 outline-none transition focus:border-[#2D6FA3] focus:ring-2 focus:ring-[#2D6FA3]/20";

export default function InsuranceReviewPage() {
  const [form, setForm] = useState<FormState>(EMPTY);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle");
  const [serverError, setServerError] = useState("");
  const bot = useBotProtection();

  const update = (key: keyof FormState, value: string) => {
    setForm((f) => ({ ...f, [key]: value }));
    setErrors((e) => ({ ...e, [key]: "" }));
  };

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setServerError("");
    const parsed = insuranceReviewSchema.safeParse(form);
    if (!parsed.success) {
      setErrors(fieldErrors(parsed.error));
      return;
    }
    setStatus("sending");
    try {
      const res = await fetch("/api/insurance-review", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...parsed.data, ...bot.fields }),
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) {
        if (body.errors) setErrors(body.errors);
        setServerError(body.message ?? "Something went wrong. Please try again.");
        setStatus("idle");
        bot.reset();
        return;
      }
      setStatus("sent");
    } catch {
      setServerError("We couldn't send your request. Please check your connection and try again.");
      setStatus("idle");
      bot.reset();
    }
  }

  const field = (key: keyof FormState) => ({
    id: key,
    value: form[key],
    "aria-invalid": Boolean(errors[key]),
    "aria-describedby": errors[key] ? `${key}-error` : undefined,
    className: `${inputClass} ${errors[key] ? "border-red-500" : "border-gray-200"}`,
  });

  const errorText = (key: keyof FormState) =>
    errors[key] ? (
      <p id={`${key}-error`} className="text-sm text-red-600">{errors[key]}</p>
    ) : null;

  return (
    <div className="min-h-screen bg-[#f2f2f2]">
      <header className="sticky top-0 z-40" style={{ background: "#1E3F72" }}>
        <div className="mx-auto flex h-20 max-w-5xl items-center justify-between px-4">
          <a href="/" className="flex-shrink-0">
            <img src="/quantz-logo-white-text.png" alt="Quantz Financial Services" className="h-14 w-auto" />
          </a>
          <a href="/" className="flex items-center gap-2 text-sm font-medium text-white/90 hover:text-white">
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Back to site
          </a>
        </div>
      </header>

      <main className="mx-auto flex max-w-2xl flex-col gap-8 px-4 py-12">
        <div className="flex flex-col gap-3">
          <h1 className="text-3xl font-bold text-balance md:text-4xl" style={{ color: "#1C3F6E" }}>
            Book Your Insurance Review
          </h1>
          <p className="text-base leading-relaxed text-gray-600 text-pretty">
            Most people only discover gaps in their cover when it&apos;s too late. Let us take a quick look at
            what you have and make sure you&apos;re properly protected.
          </p>
        </div>

        {status === "sent" ? (
          <div className="flex flex-col items-center gap-3 rounded-2xl bg-white p-10 text-center shadow-md" role="status">
            <CheckCircle2 className="h-12 w-12" style={{ color: "#2D6FA3" }} aria-hidden="true" />
            <h2 className="text-xl font-bold" style={{ color: "#1C3F6E" }}>Request received</h2>
            <p className="text-gray-600">Thank you. One of our advisors will contact you shortly.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5 rounded-2xl bg-white p-6 shadow-md md:p-8">
            <HoneypotField {...bot.honeypotProps} />

            <div className="flex flex-col gap-2">
              <label htmlFor="fullName" className="text-sm font-semibold text-gray-700">Full Name</label>
              <input type="text" autoComplete="name" {...field("fullName")} onChange={(e) => update("fullName", e.target.value)} />
              {errorText("fullName")}
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="phone" className="text-sm font-semibold text-gray-700">Phone Number (WhatsApp preferred)</label>
              <input type="tel" autoComplete="tel" {...field("phone")} onChange={(e) => update("phone", e.target.value)} />
              {errorText("phone")}
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="email" className="text-sm font-semibold text-gray-700">Email Address</label>
              <input type="email" autoComplete="email" {...field("email")} onChange={(e) => update("email", e.target.value)} />
              {errorText("email")}
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="contactTime" className="text-sm font-semibold text-gray-700">Preferred Contact Time</label>
              <select {...field("contactTime")} onChange={(e) => update("contactTime", e.target.value)}>
                <option value="">Select a time</option>
                {CONTACT_TIME_OPTIONS.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
              {errorText("contactTime")}
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="focus" className="text-sm font-semibold text-gray-700">
                What would you like us to focus on? <span className="font-normal text-gray-500">(optional)</span>
              </label>
              <textarea rows={4} {...field("focus")} onChange={(e) => update("focus", e.target.value)} />
              {errorText("focus")}
            </div>

            {serverError && <p className="text-sm text-red-600" role="alert">{serverError}</p>}

            <button
              type="submit"
              disabled={status === "sending"}
              className="flex items-center justify-center gap-2 rounded-xl px-6 py-4 text-base font-bold text-white shadow-lg transition disabled:opacity-70"
              style={{ background: "linear-gradient(135deg, #2D6FA3, #1C3F6E)" }}
              data-testid="button-insurance-review-submit"
            >
              {status === "sending" && <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />}
              Book My Review
            </button>

            <p className="text-center text-sm text-gray-500">We&apos;ll contact you within 24 hours.</p>
          </form>
        )}
      </main>
    </div>
  );
}
