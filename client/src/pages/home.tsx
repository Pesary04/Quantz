import { useState } from "react";
import {
  Shield, Car, HeartPulse, TrendingUp, PiggyBank, Banknote,
  CheckCircle2, Phone, Mail, MapPin, Menu, X, ArrowRight, Star,
  Users, Award, Globe, ChevronRight
} from "lucide-react";
import { SiFacebook, SiX, SiInstagram, SiLinkedin } from "react-icons/si";

const BLUE = "#1e7bc4";
const DARK = "#1e3d5c";
const CHARCOAL = "#4a5568";

function QuantzLogo({ size = 48, showText = true }: { size?: number; showText?: boolean }) {
  return (
    <div className="flex items-center gap-2">
      <img src="/quantz-logo.png" alt="Quantz Financial Services" style={{ height: size, width: "auto" }} />
      {!showText && null}
    </div>
  );
}

function Navbar() {
  const [open, setOpen] = useState(false);
  const links = [
    { label: "Home", href: "#home" },
    { label: "Services", href: "#services" },
    { label: "Why Us", href: "#why-us" },
    { label: "Partners", href: "#partners" },
    { label: "Contact", href: "#contact" },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm shadow-sm border-b border-gray-100" data-testid="navbar">
      <div className="max-w-7xl mx-auto px-4 md:px-8 flex items-center justify-between h-16">
        <a href="#home" className="flex-shrink-0" data-testid="logo">
          <img src="/quantz-logo.png" alt="Quantz Financial Services" className="h-10 w-auto" />
        </a>

        <nav className="hidden md:flex items-center gap-8" role="navigation" aria-label="Main navigation" data-testid="nav-links">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors relative group"
              data-testid={`link-${l.label.toLowerCase().replace(" ", "-")}`}
            >
              {l.label}
              <span className="absolute -bottom-0.5 left-0 w-0 h-0.5 bg-blue-500 group-hover:w-full transition-all duration-300" />
            </a>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          <a
            href="tel:+264818201522"
            className="flex items-center gap-1.5 text-sm text-gray-600 hover:text-blue-600 transition-colors"
            data-testid="link-phone"
          >
            <Phone className="w-3.5 h-3.5" aria-hidden="true" />
            <span>+264 81 820 1522</span>
          </a>
          <a
            href="#contact"
            className="px-5 py-2 rounded-lg text-sm font-semibold text-white transition-all hover:opacity-90 hover:shadow-md"
            style={{ background: `linear-gradient(135deg, ${BLUE}, ${DARK})` }}
            data-testid="button-nav-cta"
          >
            Get a Quote
          </a>
        </div>

        <button
          className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
          data-testid="button-mobile-menu"
        >
          {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {open && (
        <div className="md:hidden bg-white border-t border-gray-100 px-4 py-4 space-y-3">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="block text-sm font-medium text-gray-700 hover:text-blue-600 py-2"
              onClick={() => setOpen(false)}
            >
              {l.label}
            </a>
          ))}
          <a
            href="#contact"
            className="block w-full text-center px-5 py-2.5 rounded-lg text-sm font-semibold text-white"
            style={{ background: `linear-gradient(135deg, ${BLUE}, ${DARK})` }}
          >
            Get a Quote
          </a>
        </div>
      )}
    </header>
  );
}

function HeroSection() {
  return (
    <section
      id="home"
      className="relative overflow-hidden"
      style={{ background: `linear-gradient(145deg, #0a2540 0%, #0d3b6e 40%, #1e6fad 80%, #3a9bd5 100%)` }}
      data-testid="hero-section"
    >
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        <div className="absolute top-0 right-0 w-1/2 h-full opacity-10">
          <svg viewBox="0 0 400 600" fill="none" className="w-full h-full">
            <polygon points="200,0 400,600 0,600" fill="white" opacity="0.15"/>
            <polygon points="250,0 400,400 100,400" fill="white" opacity="0.1"/>
            <polygon points="300,50 400,300 200,300" fill="white" opacity="0.08"/>
          </svg>
        </div>
        <div className="absolute -bottom-20 -left-20 w-80 h-80 rounded-full bg-blue-400/10 blur-3xl"/>
        <div className="absolute top-20 right-40 w-60 h-60 rounded-full bg-blue-300/10 blur-2xl"/>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 md:px-8 py-20 md:py-32">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/20 text-white/90 text-xs font-medium mb-6" data-testid="hero-badge">
              <NamibianFlag />
              <span>Trusted Insurance Brokers in Namibia</span>
            </div>
            <h1 className="text-white text-3xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6" data-testid="hero-title">
              A Comprehensive<br />
              <span className="text-blue-300">Protection</span> for<br />
              Individuals &amp; Businesses
            </h1>
            <p className="text-blue-100 text-base md:text-lg leading-relaxed mb-8 max-w-lg" data-testid="hero-description">
              Quantz Financial Services provides tailored insurance and financial protection solutions
              designed to safeguard your life, assets, and future.
            </p>
            <div className="flex flex-wrap gap-4" data-testid="hero-cta">
              <a
                href="#contact"
                className="flex items-center gap-2 px-7 py-3.5 bg-white text-blue-700 font-bold rounded-xl hover:bg-blue-50 transition-all shadow-lg hover:shadow-xl"
                data-testid="button-get-quote-hero"
              >
                Get a Free Quote <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </a>
              <a
                href="#services"
                className="flex items-center gap-2 px-7 py-3.5 border-2 border-white/40 text-white font-semibold rounded-xl hover:bg-white/10 transition-all"
                data-testid="button-our-services"
              >
                Our Services
              </a>
            </div>
            <div className="flex flex-wrap gap-6 mt-10">
              {[
                { icon: Users, label: "500+ Clients Served" },
                { icon: Award, label: "Trusted Since 2015" },
                { icon: Globe, label: "Nationwide Coverage" },
              ].map(({ icon: Icon, label }) => (
                <div key={label} className="flex items-center gap-2 text-white/80 text-sm">
                  <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
                    <Icon className="w-4 h-4 text-blue-200" aria-hidden="true" />
                  </div>
                  <span>{label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="hidden md:flex justify-center items-center">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-400/30 to-blue-900/30 rounded-3xl blur-xl transform scale-110" aria-hidden="true" />
              <div className="relative bg-white/10 border border-white/20 backdrop-blur-sm rounded-3xl p-8 max-w-sm">
                <img src="/quantz-logo.png" alt="Quantz Financial Services" className="w-48 mx-auto mb-6 drop-shadow-lg" />
                <div className="space-y-3">
                  {["Life Insurance", "Pension Fund", "Medical Aid", "Short-term Insurance"].map((s) => (
                    <div key={s} className="flex items-center gap-3 text-white/90 text-sm">
                      <CheckCircle2 className="w-4 h-4 text-blue-300 flex-shrink-0" aria-hidden="true" />
                      <span>{s}</span>
                    </div>
                  ))}
                  <div className="flex items-center gap-3 text-white/60 text-sm italic">
                    <span>+ more comprehensive solutions</span>
                  </div>
                </div>
                <div className="mt-6 pt-5 border-t border-white/15 text-center">
                  <p className="text-white/70 text-xs">Contact us today</p>
                  <a href="tel:+264818201522" className="text-white font-bold text-lg hover:text-blue-200 transition-colors">
                    +264 81 820 1522
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

const services = [
  {
    id: "life-insurance",
    icon: Shield,
    title: "Life Insurance",
    subtitle: "Protect Your Family's Future",
    color: "from-blue-500 to-blue-700",
    bg: "bg-blue-50",
    iconColor: "text-blue-600",
    items: [
      "Life Cover",
      "Critical Illness Cover",
      "Disability Protection",
      "Death Benefits for Family Security",
    ],
  },
  {
    id: "pension-fund",
    icon: PiggyBank,
    title: "Pension Fund",
    subtitle: "Secure Your Retirement",
    color: "from-indigo-500 to-indigo-700",
    bg: "bg-indigo-50",
    iconColor: "text-indigo-600",
    items: [
      "Retirement Savings Solutions",
      "Tax-Efficient Wealth Building",
    ],
  },
  {
    id: "medical-aid",
    icon: HeartPulse,
    title: "Medical Aid",
    subtitle: "Comprehensive Health Cover",
    color: "from-sky-500 to-sky-700",
    bg: "bg-sky-50",
    iconColor: "text-sky-600",
    items: [
      "Fill Gaps in Existing Medical Cover",
      "Flexible Gap Options for Peace of Mind",
    ],
  },
  {
    id: "short-term-insurance",
    icon: Car,
    title: "Short-term Insurance",
    subtitle: "Protect Your Assets",
    color: "from-cyan-500 to-cyan-700",
    bg: "bg-cyan-50",
    iconColor: "text-cyan-600",
    items: [
      "Cover for Business Assets and Property",
      "Cover for Vehicles, Gadgets & Household Items",
    ],
  },
  {
    id: "retirement-annuity",
    icon: TrendingUp,
    title: "Retirement Annuity",
    subtitle: "Plan for the Long Term",
    color: "from-blue-600 to-indigo-700",
    bg: "bg-blue-50",
    iconColor: "text-blue-700",
    items: [
      "Long-Term Retirement Planning",
      "Secure Income for Retirement",
    ],
  },
  {
    id: "savings-investment",
    icon: Banknote,
    title: "Savings & Investment",
    subtitle: "Grow Your Wealth",
    color: "from-teal-500 to-blue-600",
    bg: "bg-teal-50",
    iconColor: "text-teal-600",
    items: [
      "Structured Savings Plans",
      "Guaranteed Growth Opportunities",
    ],
  },
];

function ServicesSection() {
  return (
    <section id="services" className="py-20 md:py-28 bg-gray-50" data-testid="services-section">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="text-center mb-14">
          <div className="inline-block px-4 py-1.5 rounded-full bg-blue-100 text-blue-700 text-xs font-semibold uppercase tracking-wide mb-4">
            What We Offer
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4" data-testid="services-title">
            Comprehensive Financial Protection
          </h2>
          <p className="text-gray-500 max-w-xl mx-auto text-base">
            Tailored solutions for individuals and businesses — from protection to growth.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
          {services.map((svc) => (
            <div
              key={svc.id}
              className="group bg-white rounded-2xl border border-gray-100 hover:border-blue-200 hover:shadow-xl transition-all duration-300 overflow-hidden"
              data-testid={`card-service-${svc.id}`}
            >
              <div className={`h-1.5 w-full bg-gradient-to-r ${svc.color}`} />
              <div className="p-7">
                <div className={`w-14 h-14 rounded-2xl ${svc.bg} flex items-center justify-center mb-5 group-hover:scale-105 transition-transform`}>
                  <svc.icon className={`w-7 h-7 ${svc.iconColor}`} aria-hidden="true" />
                </div>
                <h3 className="font-bold text-gray-900 text-lg mb-1">{svc.title}</h3>
                <p className="text-sm text-blue-600 font-medium mb-4">{svc.subtitle}</p>
                <ul className="space-y-2.5">
                  {svc.items.map((item) => (
                    <li key={item} className="flex items-start gap-2.5 text-sm text-gray-600">
                      <ChevronRight className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" aria-hidden="true" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <a
            href="#contact"
            className="inline-flex items-center gap-2 px-8 py-4 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all"
            style={{ background: `linear-gradient(135deg, ${BLUE}, ${DARK})` }}
            data-testid="button-services-cta"
          >
            Speak to an Advisor <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </a>
        </div>
      </div>
    </section>
  );
}

const whyPoints = [
  { title: "Independent Advice", desc: "We work for you, not the insurer. We source the best policy from multiple providers to suit your needs." },
  { title: "Tailored Insurance Solutions", desc: "Every client is different. We craft customised cover that fits your personal and business circumstances." },
  { title: "Trusted Insurer Partnership", desc: "We partner with Namibia's top insurers to ensure you receive reputable, reliable cover and fast claims." },
];

function WhyUsSection() {
  return (
    <section
      id="why-us"
      className="py-20 md:py-28 relative overflow-hidden"
      style={{ background: `linear-gradient(160deg, #0a2540 0%, #0d3b6e 50%, #1e6fad 100%)` }}
      data-testid="why-us-section"
    >
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute right-0 top-0 w-1/2 h-full opacity-5">
          <svg viewBox="0 0 400 400" fill="white" className="w-full h-full">
            <polygon points="200,0 400,400 0,400"/>
          </svg>
        </div>
        <div className="absolute bottom-0 left-1/4 w-96 h-96 rounded-full bg-blue-400/10 blur-3xl"/>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 md:px-8">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div>
            <div className="inline-block px-4 py-1.5 rounded-full bg-white/10 border border-white/20 text-white/80 text-xs font-semibold uppercase tracking-wide mb-6">
              Our Promise
            </div>
            <p className="text-blue-200 text-base md:text-lg leading-relaxed mb-8" data-testid="about-description">
              Quantz Financial Services provides tailored insurance and financial protection solutions
              designed to safeguard your life, assets, and future.
            </p>
            <h2 className="text-white text-3xl md:text-4xl font-bold mb-10" data-testid="why-us-title">
              Why Choose Quantz?
            </h2>
            <div className="space-y-6">
              {whyPoints.map((p, i) => (
                <div key={i} className="flex gap-4" data-testid={`why-point-${i + 1}`}>
                  <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center">
                    <Star className="w-5 h-5 text-yellow-300" aria-hidden="true" />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold text-base mb-1">{p.title}</h3>
                    <p className="text-blue-200/80 text-sm leading-relaxed">{p.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-center">
            <div className="relative">
              <div className="absolute inset-0 bg-blue-400/20 rounded-3xl blur-2xl transform scale-105" aria-hidden="true" />
              <div className="relative bg-white/10 border border-white/20 backdrop-blur-sm rounded-3xl p-10 text-center max-w-sm">
                <img src="/quantz-logo.png" alt="Quantz Financial Services" className="w-40 mx-auto mb-6" />
                <p className="text-white/90 text-lg font-semibold italic mb-3">
                  "Protect what matters most"
                </p>
                <p className="text-blue-200/80 text-sm mb-6">
                  Speak to a Quantz Financial Advisor today
                </p>
                <a
                  href="tel:+264818201522"
                  className="flex items-center justify-center gap-2 w-full py-3 bg-white text-blue-700 font-bold rounded-xl hover:bg-blue-50 transition-colors"
                  data-testid="button-call-now"
                >
                  <Phone className="w-4 h-4" aria-hidden="true" />
                  +264 81 820 1522
                </a>
                <a
                  href="mailto:info@quantz.com.na"
                  className="flex items-center justify-center gap-2 w-full mt-3 py-3 border-2 border-white/30 text-white font-medium rounded-xl hover:bg-white/10 transition-colors text-sm"
                  data-testid="button-email"
                >
                  <Mail className="w-4 h-4" aria-hidden="true" />
                  info@quantz.com.na
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

const partners = [
  { name: "Sanlam | Allianz", abbr: "S|A", color: "#e60000" },
  { name: "Santam", abbr: "ST", color: "#005baa" },
  { name: "Old Mutual", abbr: "OM", color: "#006b3f" },
  { name: "Hollard", abbr: "HO", color: "#f7941d" },
  { name: "PPS", abbr: "PPS", color: "#003478" },
  { name: "NISEDI", abbr: "NS", color: "#3a3a3a" },
  { name: "Capricorn Asset Management", abbr: "CAM", color: "#0073a8" },
];

function PartnersSection() {
  return (
    <section id="partners" className="py-16 md:py-20 bg-white" data-testid="partners-section">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="text-center mb-12">
          <p className="text-gray-500 text-sm font-medium uppercase tracking-widest mb-3">In Partnership With</p>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800" data-testid="partners-title">
            Namibia's Leading Insurers
          </h2>
        </div>

        <div className="flex flex-wrap justify-center gap-4 md:gap-6">
          {partners.map((p) => (
            <div
              key={p.name}
              className="flex items-center gap-3 px-5 py-3 rounded-xl border border-gray-100 bg-gray-50 hover:bg-white hover:border-gray-200 hover:shadow-md transition-all"
              data-testid={`partner-${p.name.toLowerCase().replace(/[\s|]/g, "-")}`}
            >
              <div
                className="w-9 h-9 rounded-lg flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                style={{ backgroundColor: p.color }}
              >
                {p.abbr}
              </div>
              <span className="text-sm font-semibold text-gray-700">{p.name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function HowItWorksSection() {
  const steps = [
    { n: "01", title: "Tell Us Your Needs", desc: "Share your personal or business insurance requirements with our expert advisors." },
    { n: "02", title: "We Compare Quotes", desc: "We search across all our insurer partners to find you the best rates and coverage." },
    { n: "03", title: "You Choose", desc: "Review your tailored options and select the plan that gives you complete peace of mind." },
  ];
  return (
    <section className="py-20 md:py-28 bg-gray-50" data-testid="how-it-works-section">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="text-center mb-14">
          <div className="inline-block px-4 py-1.5 rounded-full bg-blue-100 text-blue-700 text-xs font-semibold uppercase tracking-wide mb-4">
            Simple Process
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4" data-testid="how-it-works-title">
            How It Works
          </h2>
          <p className="text-gray-500 text-base max-w-md mx-auto">
            Getting the right cover is simple — we guide you every step of the way.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 relative">
          <div className="hidden md:block absolute top-12 left-[18%] right-[18%] h-0.5 bg-gradient-to-r from-blue-200 via-blue-400 to-blue-200" aria-hidden="true" />
          {steps.map((step, i) => (
            <div key={i} className="flex flex-col items-center text-center relative" data-testid={`step-${i + 1}`}>
              <div
                className="w-20 h-20 rounded-2xl flex items-center justify-center text-white text-2xl font-black mb-6 shadow-lg z-10"
                style={{ background: `linear-gradient(135deg, ${BLUE}, ${DARK})` }}
              >
                {step.n}
              </div>
              <h3 className="font-bold text-gray-900 text-lg mb-3">{step.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed max-w-xs">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function TestimonialsSection() {
  const testimonials = [
    {
      name: "Maria S.",
      location: "Windhoek",
      quote: "Quantz helped me find the perfect life insurance for my family at a price I could afford. Their advice was independent and honest — I felt truly looked after.",
      stars: 5,
    },
    {
      name: "David K.",
      location: "Swakopmund",
      quote: "As a business owner, I needed comprehensive short-term insurance. Quantz compared quotes from multiple insurers and saved me significantly. Excellent service!",
      stars: 5,
    },
    {
      name: "Annelise P.",
      location: "Oshakati",
      quote: "Their retirement annuity advice was clear and straightforward. I now have peace of mind knowing my future is secured. Highly recommend Quantz Financial Services.",
      stars: 5,
    },
  ];

  return (
    <section className="py-20 md:py-28 bg-white" data-testid="testimonials-section">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="text-center mb-14">
          <div className="inline-block px-4 py-1.5 rounded-full bg-blue-100 text-blue-700 text-xs font-semibold uppercase tracking-wide mb-4">
            Client Stories
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4" data-testid="testimonials-title">
            What Our Clients Say
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((t, i) => (
            <div
              key={i}
              className="bg-gray-50 rounded-2xl p-7 border border-gray-100 hover:shadow-lg transition-shadow"
              data-testid={`testimonial-${i + 1}`}
            >
              <div className="flex gap-1 mb-4">
                {Array.from({ length: t.stars }).map((_, s) => (
                  <Star key={s} className="w-4 h-4 fill-yellow-400 text-yellow-400" aria-hidden="true" />
                ))}
              </div>
              <p className="text-gray-700 text-sm leading-relaxed italic mb-5">"{t.quote}"</p>
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-full text-white font-bold text-sm flex items-center justify-center"
                  style={{ background: `linear-gradient(135deg, ${BLUE}, ${DARK})` }}
                >
                  {t.name.charAt(0)}
                </div>
                <div>
                  <p className="font-semibold text-gray-900 text-sm">{t.name}</p>
                  <p className="text-xs text-gray-500">{t.location}, Namibia</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ContactSection() {
  return (
    <section
      id="contact"
      className="py-20 md:py-28"
      style={{ background: `linear-gradient(160deg, #0a2540 0%, #0d3b6e 50%, #1e6fad 100%)` }}
      data-testid="contact-section"
    >
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="grid md:grid-cols-2 gap-16 items-start">
          <div>
            <div className="inline-block px-4 py-1.5 rounded-full bg-white/10 border border-white/20 text-white/80 text-xs font-semibold uppercase tracking-wide mb-6">
              Get In Touch
            </div>
            <h2 className="text-white text-3xl md:text-4xl font-bold mb-4" data-testid="contact-title">
              Ready for Proper Protection?
            </h2>
            <p className="text-blue-200 text-base mb-10">
              Speak to one of our expert advisors today. We'll find the right cover for you —
              at the right price, with complete peace of mind.
            </p>

            <div className="space-y-5">
              <a
                href="tel:+264818201522"
                className="flex items-center gap-4 group"
                data-testid="contact-phone"
              >
                <div className="w-12 h-12 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center group-hover:bg-white/20 transition-colors">
                  <Phone className="w-5 h-5 text-blue-200" aria-hidden="true" />
                </div>
                <div>
                  <p className="text-blue-300 text-xs font-medium uppercase tracking-wide">Call Us</p>
                  <p className="text-white font-bold text-lg">+264 81 820 1522</p>
                </div>
              </a>
              <a
                href="mailto:info@quantz.com.na"
                className="flex items-center gap-4 group"
                data-testid="contact-email"
              >
                <div className="w-12 h-12 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center group-hover:bg-white/20 transition-colors">
                  <Mail className="w-5 h-5 text-blue-200" aria-hidden="true" />
                </div>
                <div>
                  <p className="text-blue-300 text-xs font-medium uppercase tracking-wide">Email Us</p>
                  <p className="text-white font-semibold">info@quantz.com.na</p>
                </div>
              </a>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-blue-200" aria-hidden="true" />
                </div>
                <div>
                  <p className="text-blue-300 text-xs font-medium uppercase tracking-wide">Location</p>
                  <p className="text-white font-semibold">Windhoek, Namibia</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-8 shadow-2xl" data-testid="contact-form">
            <h3 className="text-gray-900 font-bold text-xl mb-6">Request a Free Quote</h3>
            <form className="space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide block mb-2">
                    First Name
                  </label>
                  <input
                    type="text"
                    placeholder="John"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all"
                    data-testid="input-first-name"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide block mb-2">
                    Last Name
                  </label>
                  <input
                    type="text"
                    placeholder="Smith"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all"
                    data-testid="input-last-name"
                  />
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide block mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  placeholder="+264 XX XXX XXXX"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all"
                  data-testid="input-phone"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide block mb-2">
                  Insurance Type
                </label>
                <select
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all text-gray-700 bg-white"
                  data-testid="select-insurance-type"
                >
                  <option value="">Select an insurance type</option>
                  <option>Life Insurance</option>
                  <option>Pension Fund</option>
                  <option>Medical Aid</option>
                  <option>Short-term Insurance</option>
                  <option>Retirement Annuity</option>
                  <option>Savings &amp; Investment</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide block mb-2">
                  Message (Optional)
                </label>
                <textarea
                  placeholder="Tell us more about what you're looking for…"
                  rows={3}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all resize-none"
                  data-testid="input-message"
                />
              </div>
              <button
                type="submit"
                className="w-full py-4 rounded-xl text-white font-bold text-sm shadow-lg hover:shadow-xl transition-all hover:opacity-95"
                style={{ background: `linear-gradient(135deg, ${BLUE}, ${DARK})` }}
                data-testid="button-submit-quote"
              >
                Request My Free Quote
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="bg-[#060f1e] text-gray-400" data-testid="footer">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="py-12 grid grid-cols-1 md:grid-cols-3 gap-10 border-b border-gray-800">
          <div>
            <img src="/quantz-logo.png" alt="Quantz Financial Services" className="h-12 w-auto mb-4" />
            <p className="text-sm text-gray-500 leading-relaxed max-w-xs">
              Providing tailored insurance and financial protection solutions to safeguard your life, assets, and future.
            </p>
            <div className="flex gap-3 mt-5">
              {[
                { Icon: SiFacebook, label: "Facebook" },
                { Icon: SiX, label: "Twitter" },
                { Icon: SiInstagram, label: "Instagram" },
                { Icon: SiLinkedin, label: "LinkedIn" },
              ].map(({ Icon, label }) => (
                <a
                  key={label}
                  href="#"
                  aria-label={label}
                  className="w-9 h-9 rounded-lg bg-gray-800 hover:bg-blue-600 flex items-center justify-center transition-colors"
                  data-testid={`link-${label.toLowerCase()}`}
                >
                  <Icon className="w-4 h-4 text-gray-400 hover:text-white" aria-hidden="true" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-white font-semibold text-sm mb-5 uppercase tracking-widest">Services</h4>
            <ul className="space-y-3 text-sm">
              {["Life Insurance", "Pension Fund", "Medical Aid", "Short-term Insurance", "Retirement Annuity", "Savings & Investment"].map((s) => (
                <li key={s}>
                  <a href="#services" className="hover:text-white transition-colors">{s}</a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold text-sm mb-5 uppercase tracking-widest">Contact</h4>
            <ul className="space-y-4 text-sm">
              <li className="flex gap-3">
                <Phone className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" aria-hidden="true" />
                <a href="tel:+264818201522" className="hover:text-white transition-colors" data-testid="footer-phone">+264 81 820 1522</a>
              </li>
              <li className="flex gap-3">
                <Mail className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" aria-hidden="true" />
                <a href="mailto:info@quantz.com.na" className="hover:text-white transition-colors" data-testid="footer-email">info@quantz.com.na</a>
              </li>
              <li className="flex gap-3">
                <MapPin className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" aria-hidden="true" />
                <span>Windhoek, Namibia</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="py-6 flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="text-xs text-gray-600" data-testid="text-copyright">
            © 2025 Quantz Financial Services (CC). All rights reserved.
          </p>
          <p className="text-xs text-gray-600">Regulated insurance broker in Namibia</p>
        </div>
      </div>
    </footer>
  );
}

function NamibianFlag() {
  const W = 90, H = 60;
  const sunCx = 19, sunCy = 16, sunR = 6.5, rayOuter = 11;
  const rayCount = 12;
  const rays: string[] = [];
  for (let i = 0; i < rayCount; i++) {
    const a = (i * 360) / rayCount;
    const tipAngle = (a * Math.PI) / 180 - Math.PI / 2;
    const lAngle = ((a - 14) * Math.PI) / 180 - Math.PI / 2;
    const rAngle = ((a + 14) * Math.PI) / 180 - Math.PI / 2;
    const tx = sunCx + rayOuter * Math.cos(tipAngle);
    const ty = sunCy + rayOuter * Math.sin(tipAngle);
    const lx = sunCx + sunR * Math.cos(lAngle);
    const ly = sunCy + sunR * Math.sin(lAngle);
    const rx = sunCx + sunR * Math.cos(rAngle);
    const ry = sunCy + sunR * Math.sin(rAngle);
    rays.push(`M ${lx.toFixed(2)},${ly.toFixed(2)} L ${tx.toFixed(2)},${ty.toFixed(2)} L ${rx.toFixed(2)},${ry.toFixed(2)} Z`);
  }
  return (
    <svg width="24" height="16" viewBox={`0 0 ${W} ${H}`} aria-hidden="true" style={{ borderRadius: 2 }}>
      <defs><clipPath id="fc2"><rect width={W} height={H} rx="2"/></clipPath></defs>
      <g clipPath="url(#fc2)">
        <rect width={W} height={H} fill="#003580"/>
        <polygon points={`0,${H} ${W},${H} ${W},0`} fill="#009A44"/>
        <line x1="0" y1={H} x2={W} y2="0" stroke="white" strokeWidth="13"/>
        <line x1="0" y1={H} x2={W} y2="0" stroke="#D21034" strokeWidth="7"/>
        {rays.map((d, i) => <path key={i} d={d} fill="#FFCC00"/>)}
        <circle cx={sunCx} cy={sunCy} r={sunR * 0.58} fill="#FFCC00"/>
      </g>
    </svg>
  );
}

export default function Home() {
  return (
    <div className="min-h-screen bg-white" data-testid="home-page">
      <Navbar />
      <HeroSection />
      <ServicesSection />
      <WhyUsSection />
      <PartnersSection />
      <HowItWorksSection />
      <TestimonialsSection />
      <ContactSection />
      <Footer />
    </div>
  );
}
