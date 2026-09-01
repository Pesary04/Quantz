import { useState } from "react";
import { Link } from "wouter";
import { ArrowLeft, ArrowRight, Phone, Mail, CheckCircle2, Loader2 } from "lucide-react";
import { FormDisclaimer } from "@/components/legal-disclaimer";
import {
  ACTION_PAGES, type ActionPageConfig, type EnquiryField,
  EMPTY_VEHICLE, VEHICLE_CLIENT_FIELDS, VEHICLE_DETAIL_FIELDS, type VehicleField,
  CONTACT_PHONE, CONTACT_PHONE_TEL, CONTACT_EMAIL, PAGE_FOOTER_LINE,
} from "@/lib/quote-config";

const NAVY = "#0B1F3A";
const BLUE = "#1E3F72";

type Status = "idle" | "loading" | "success" | "error";

/* ------------------------------- Shared shell ------------------------------- */

function ActionShell({
  label, headline, body, image, children,
}: {
  label: string; headline: string; body: string; image: string; children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#f2f2f2] flex flex-col" data-testid="action-page">
      {/* Top bar */}
      <header className="w-full sticky top-0 z-30 shadow-sm" style={{ background: NAVY }}>
        <div className="max-w-6xl mx-auto px-4 md:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2" data-testid="link-home-logo">
            <img src="/quantz-logo-white-text.png" alt="Quantz Financial Services" className="h-9 w-auto" />
          </Link>
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-white/85 hover:text-white text-sm font-medium transition-colors"
            data-testid="link-back-home"
          >
            <ArrowLeft className="w-4 h-4" aria-hidden="true" /> Back to Home
          </Link>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero image */}
        <section className="w-full" style={{ background: BLUE }}>
          <div className="max-w-5xl mx-auto px-4 md:px-8 py-5">
            <img
              src={image}
              alt={headline}
              className="w-full h-auto block rounded-xl shadow-2xl"
              loading="eager"
            />
          </div>
        </section>

        {/* Copy + form */}
        <section className="max-w-3xl mx-auto px-4 md:px-8 py-10 md:py-14">
          <div className="mb-8 text-center">
            <span
              className="inline-block px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wide mb-4"
              style={{ background: "#e8eefb", color: BLUE }}
            >
              {label}
            </span>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-5 text-balance" data-testid="action-headline">
              {headline}
            </h1>
            <div className="text-gray-600 text-base leading-relaxed space-y-3 max-w-2xl mx-auto text-left sm:text-center">
              {body.split("\n\n").map((para, i) => (
                <p key={i} className="whitespace-pre-line">{para}</p>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 md:p-8 shadow-xl border border-gray-100">
            {children}
          </div>

          <p className="text-center text-sm text-gray-500 mt-6">
            {PAGE_FOOTER_LINE.split(CONTACT_PHONE)[0]}
            <a href={CONTACT_PHONE_TEL} className="font-semibold text-gray-700 hover:underline">{CONTACT_PHONE}</a>
            {" or email "}
            <a href={`mailto:${CONTACT_EMAIL}`} className="font-semibold text-gray-700 hover:underline">{CONTACT_EMAIL}</a>
          </p>
        </section>
      </main>

      {/* Footer */}
      <footer style={{ background: NAVY, borderTop: `3px solid ${BLUE}` }}>
        <div className="max-w-6xl mx-auto px-4 md:px-8 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <img src="/quantz-logo-white-text.png" alt="Quantz Financial Services" className="h-10 w-auto" />
          <p className="text-white/70 text-xs text-center sm:text-right">
            © {new Date().getFullYear()} Quantz Financial Services CC. Authorised financial services provider, regulated by NAMFISA.
          </p>
        </div>
      </footer>
    </div>
  );
}

function SuccessCard({ message }: { message: string }) {
  return (
    <div className="text-center py-8" data-testid="action-success">
      <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-5">
        <CheckCircle2 className="w-8 h-8 text-green-500" aria-hidden="true" />
      </div>
      <h2 className="text-xl font-bold text-gray-900 mb-2">Thank You!</h2>
      <p className="text-gray-600 text-sm max-w-md mx-auto mb-6">{message}</p>
      <Link
        href="/"
        className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm text-white transition-all hover:opacity-90"
        style={{ background: BLUE }}
        data-testid="link-success-home"
      >
        Back to Home <ArrowRight className="w-4 h-4" />
      </Link>
    </div>
  );
}

const labelCls = "block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5";
const inputCls =
  "w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#1E3F72]/30 focus:border-[#1E3F72] transition-colors";

/* ------------------------------ Enquiry page ------------------------------ */

export function ActionPage({ config }: { config: ActionPageConfig }) {
  const initial: Record<string, string | string[]> = {};
  config.fields.forEach((f) => { initial[f.name] = f.type === "checkboxes" ? [] : ""; });

  const [values, setValues] = useState<Record<string, string | string[]>>(initial);
  const [status, setStatus] = useState<Status>("idle");
  const [feedback, setFeedback] = useState("");

  const setField = (name: string, value: string | string[]) =>
    setValues((prev) => ({ ...prev, [name]: value }));

  const toggleCheckbox = (name: string, option: string) => {
    setValues((prev) => {
      const arr = Array.isArray(prev[name]) ? (prev[name] as string[]) : [];
      return { ...prev, [name]: arr.includes(option) ? arr.filter((o) => o !== option) : [...arr, option] };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setFeedback("");
    try {
      const extra = config.fields
        .filter((f) => !["fullName", "phone", "email"].includes(f.name))
        .map((f) => {
          const v = values[f.name];
          return { label: f.label, value: Array.isArray(v) ? v.join(", ") : v };
        });

      const payload = {
        category: config.category,
        fullName: values.fullName,
        phone: values.phone,
        email: values.email,
        fields: extra,
      };

      const res = await fetch("/api/enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (res.ok) {
        setStatus("success");
        setFeedback(data.message);
      } else {
        setStatus("error");
        setFeedback(data.error || "Something went wrong. Please try again.");
      }
    } catch {
      setStatus("error");
      setFeedback(`Could not send your enquiry. Please call us on ${CONTACT_PHONE}.`);
    }
  };

  return (
    <ActionShell label={config.label} headline={config.headline} body={config.body} image={config.image}>
      {status === "success" ? (
        <SuccessCard message={feedback} />
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5" data-testid="enquiry-form" noValidate>
          <div className="grid sm:grid-cols-2 gap-4">
            {config.fields.map((f) => (
              <EnquiryFieldControl
                key={f.name}
                field={f}
                value={values[f.name]}
                onChange={(v) => setField(f.name, v)}
                onToggle={(opt) => toggleCheckbox(f.name, opt)}
              />
            ))}
          </div>

          <FormDisclaimer />

          {status === "error" && (
            <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl px-4 py-3" role="alert" data-testid="enquiry-error">
              {feedback}
            </p>
          )}

          <button
            type="submit"
            disabled={status === "loading"}
            className="w-full inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl font-bold text-sm text-white shadow-lg transition-all hover:opacity-90 disabled:opacity-60"
            style={{ background: `linear-gradient(135deg, ${BLUE}, #2D6FA3)` }}
            data-testid="button-submit-enquiry"
          >
            {status === "loading" ? (
              <><Loader2 className="w-4 h-4 animate-spin" /> Sending...</>
            ) : (
              <>{config.submitLabel} <ArrowRight className="w-4 h-4" /></>
            )}
          </button>
        </form>
      )}
    </ActionShell>
  );
}

function EnquiryFieldControl({
  field, value, onChange, onToggle,
}: {
  field: EnquiryField;
  value: string | string[];
  onChange: (v: string) => void;
  onToggle: (option: string) => void;
}) {
  const full = field.type === "textarea" || field.type === "checkboxes" || field.name === "email";
  const req = field.required;
  const strVal = typeof value === "string" ? value : "";

  return (
    <div className={full ? "sm:col-span-2" : ""}>
      <label className={labelCls} htmlFor={field.name}>
        {field.label} {req && <span className="text-red-500">*</span>}
      </label>

      {field.type === "textarea" ? (
        <textarea
          id={field.name}
          name={field.name}
          rows={4}
          required={req}
          placeholder={field.placeholder}
          value={strVal}
          onChange={(e) => onChange(e.target.value)}
          className={inputCls + " resize-none"}
        />
      ) : field.type === "select" ? (
        <select
          id={field.name}
          name={field.name}
          required={req}
          value={strVal}
          onChange={(e) => onChange(e.target.value)}
          className={inputCls + " bg-white"}
        >
          <option value="" disabled>Please select...</option>
          {field.options?.map((o) => <option key={o} value={o}>{o}</option>)}
        </select>
      ) : field.type === "checkboxes" ? (
        <div className="flex flex-wrap gap-2">
          {field.options?.map((o) => {
            const checked = Array.isArray(value) && value.includes(o);
            return (
              <button
                type="button"
                key={o}
                onClick={() => onToggle(o)}
                className={`px-4 py-2 rounded-xl text-sm font-medium border transition-all ${
                  checked
                    ? "text-white border-transparent"
                    : "text-gray-600 border-gray-200 bg-white hover:border-gray-300"
                }`}
                style={checked ? { background: BLUE } : undefined}
                aria-pressed={checked}
                data-testid={`checkbox-${field.name}-${o}`}
              >
                {o}
              </button>
            );
          })}
        </div>
      ) : (
        <input
          id={field.name}
          name={field.name}
          type={field.type}
          required={req}
          placeholder={field.placeholder}
          value={strVal}
          onChange={(e) => onChange(e.target.value)}
          className={inputCls}
        />
      )}
    </div>
  );
}

/* ------------------------------ Vehicle page ------------------------------ */

const VEHICLE_COPY = {
  label: "Vehicle Insurance",
  headline: "Car Insurance That Keeps You Moving",
  body:
    "Protect against theft, fire, accidents and more with cover designed for everyday driving.\n\nWhat you can expect:\n• Affordable premiums\n• Support when you need to claim\n• Cover options tailored to your vehicle and use\n\nComplete the form below and we will get back to you with a competitive quote.",
  image: "/images/banners/car.jpg",
};

export function VehicleQuotePage() {
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [vehicle, setVehicle] = useState(EMPTY_VEHICLE);
  const [status, setStatus] = useState<Status>("idle");
  const [feedback, setFeedback] = useState("");

  const onVehicle = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setVehicle((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setFeedback("");
    try {
      const payload = { ...vehicle, fullName: fullName.trim(), phone, insuranceType: "Vehicle Insurance" };
      const res = await fetch("/api/vehicle-quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (res.ok) {
        setStatus("success");
        setFeedback(data.message);
      } else {
        setStatus("error");
        setFeedback(data.error || "Something went wrong. Please try again.");
      }
    } catch {
      setStatus("error");
      setFeedback(`Could not send your application. Please call us on ${CONTACT_PHONE}.`);
    }
  };

  const renderField = (f: VehicleField) => (
    <div key={f.name} className={f.full ? "sm:col-span-2" : ""}>
      <label className={labelCls} htmlFor={f.name}>
        {f.label} {f.required && <span className="text-red-500">*</span>}
      </label>
      {f.options ? (
        <select id={f.name} name={f.name} value={vehicle[f.name]} onChange={onVehicle} required={f.required} className={inputCls + " bg-white"}>
          <option value="" disabled>Please select...</option>
          {f.options.map((o) => <option key={o} value={o}>{o}</option>)}
        </select>
      ) : f.textarea ? (
        <textarea id={f.name} name={f.name} rows={3} value={vehicle[f.name]} onChange={onVehicle} placeholder={f.placeholder} className={inputCls + " resize-none"} />
      ) : (
        <input id={f.name} name={f.name} type={f.type || "text"} value={vehicle[f.name]} onChange={onVehicle} placeholder={f.placeholder} required={f.required} className={inputCls} />
      )}
    </div>
  );

  return (
    <ActionShell label={VEHICLE_COPY.label} headline={VEHICLE_COPY.headline} body={VEHICLE_COPY.body} image={VEHICLE_COPY.image}>
      {status === "success" ? (
        <SuccessCard message={feedback} />
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6" data-testid="vehicle-form" noValidate>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className={labelCls} htmlFor="fullName">Full Name <span className="text-red-500">*</span></label>
              <input id="fullName" name="fullName" value={fullName} onChange={(e) => setFullName(e.target.value)} required placeholder="Your full name" className={inputCls} />
            </div>
            <div>
              <label className={labelCls} htmlFor="phone">Contact Number <span className="text-red-500">*</span></label>
              <input id="phone" name="phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} required placeholder="+264 ..." className={inputCls} />
            </div>
            {VEHICLE_CLIENT_FIELDS.map(renderField)}
          </div>

          <div>
            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide mb-4 pb-2 border-b border-gray-100">Vehicle Details</h3>
            <div className="grid sm:grid-cols-2 gap-4">
              {VEHICLE_DETAIL_FIELDS.map(renderField)}
            </div>
          </div>

          <FormDisclaimer />

          {status === "error" && (
            <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl px-4 py-3" role="alert" data-testid="vehicle-error">
              {feedback}
            </p>
          )}

          <button
            type="submit"
            disabled={status === "loading"}
            className="w-full inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl font-bold text-sm text-white shadow-lg transition-all hover:opacity-90 disabled:opacity-60"
            style={{ background: `linear-gradient(135deg, ${BLUE}, #2D6FA3)` }}
            data-testid="button-submit-vehicle"
          >
            {status === "loading" ? (
              <><Loader2 className="w-4 h-4 animate-spin" /> Sending...</>
            ) : (
              <>Get a Quote Today <ArrowRight className="w-4 h-4" /></>
            )}
          </button>
        </form>
      )}
    </ActionShell>
  );
}

/* --------------------------- Route wrapper helpers --------------------------- */

export const LifePage = () => <ActionPage config={ACTION_PAGES.life} />;
export const GapCoverPage = () => <ActionPage config={ACTION_PAGES["gap-cover"]} />;
export const FuneralPage = () => <ActionPage config={ACTION_PAGES.funeral} />;
export const BundlePage = () => <ActionPage config={ACTION_PAGES.bundle} />;
export const WillsEstatePage = () => <ActionPage config={ACTION_PAGES["wills-estate"]} />;
export const InvestmentsPage = () => <ActionPage config={ACTION_PAGES.investments} />;
