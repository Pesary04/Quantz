import { useState } from "react";
import {
  Shield, Car, HeartPulse, TrendingUp, PiggyBank, Banknote,
  CheckCircle2, Phone, Mail, MapPin, Menu, X, ArrowRight, Star,
  Users, Award, Globe, ChevronRight, ShieldCheck
} from "lucide-react";
import { SiFacebook, SiX, SiInstagram, SiLinkedin } from "react-icons/si";

const BLUE = "#1e7bc4";
const DARK = "#0d2e52";


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
    <header className="sticky top-0 z-50 bg-white/97 backdrop-blur-sm shadow-sm border-b border-gray-100" data-testid="navbar">
      <div className="max-w-7xl mx-auto px-4 md:px-8 flex items-center justify-between h-16">
        <a href="#home" className="flex-shrink-0" data-testid="logo">
          <img src="/quantz-logo.png" alt="Quantz Financial Services" className="h-10 w-auto" />
        </a>
        <nav className="hidden md:flex items-center gap-8" role="navigation" aria-label="Main navigation" data-testid="nav-links">
          {links.map((l) => (
            <a key={l.href} href={l.href}
              className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors relative group"
              data-testid={`link-${l.label.toLowerCase().replace(" ", "-")}`}
            >
              {l.label}
              <span className="absolute -bottom-0.5 left-0 w-0 h-0.5 bg-blue-500 group-hover:w-full transition-all duration-300"/>
            </a>
          ))}
        </nav>
        <div className="hidden md:flex items-center gap-3">
          <a href="tel:+264818201522" className="flex items-center gap-1.5 text-sm text-gray-600 hover:text-blue-600 transition-colors" data-testid="link-phone">
            <Phone className="w-3.5 h-3.5" aria-hidden="true"/>
            <span>+264 81 820 1522</span>
          </a>
          <a href="#contact"
            className="px-5 py-2 rounded-lg text-sm font-semibold text-white transition-all hover:opacity-90 hover:shadow-md"
            style={{ background: `linear-gradient(135deg, ${BLUE}, ${DARK})` }}
            data-testid="button-nav-cta"
          >Get a Quote</a>
        </div>
        <button className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100" onClick={() => setOpen(!open)} aria-label="Toggle menu" data-testid="button-mobile-menu">
          {open ? <X className="w-5 h-5"/> : <Menu className="w-5 h-5"/>}
        </button>
      </div>
      {open && (
        <div className="md:hidden bg-white border-t border-gray-100 px-4 py-4 space-y-3">
          {links.map((l) => (
            <a key={l.href} href={l.href} className="block text-sm font-medium text-gray-700 hover:text-blue-600 py-2" onClick={() => setOpen(false)}>{l.label}</a>
          ))}
          <a href="#contact" className="block w-full text-center px-5 py-2.5 rounded-lg text-sm font-semibold text-white" style={{ background: `linear-gradient(135deg, ${BLUE}, ${DARK})` }}>Get a Quote</a>
        </div>
      )}
    </header>
  );
}

function HeroSection() {
  return (
    <section id="home" className="relative overflow-hidden min-h-[600px] flex items-center" data-testid="hero-section">
      <div className="absolute inset-0">
        <img src="/images/hero-family.png" alt="Happy Namibian family" className="w-full h-full object-cover object-center" />
        <div className="absolute inset-0" style={{ background: "linear-gradient(100deg, rgba(10,37,64,0.92) 0%, rgba(13,46,82,0.88) 45%, rgba(13,46,82,0.55) 70%, rgba(13,46,82,0.25) 100%)" }}/>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 md:px-8 py-24 md:py-32 w-full">
        <div className="max-w-2xl">
          <h1 className="text-white text-3xl md:text-4xl lg:text-5xl font-bold leading-snug mb-5" data-testid="hero-title">
            A Comprehensive<br />
            <span className="text-blue-300 font-extrabold">Protection</span> for<br />
            Individuals &amp; Businesses
          </h1>
          <p className="text-blue-100/90 text-base md:text-lg leading-relaxed mb-8 max-w-xl" data-testid="hero-description">
            Quantz Financial Services provides tailored insurance and financial protection solutions
            designed to safeguard your life, assets, and future.
          </p>
          <div className="flex flex-wrap gap-4" data-testid="hero-cta">
            <a href="#contact"
              className="flex items-center gap-2 px-7 py-3.5 bg-white text-blue-800 font-bold rounded-xl hover:bg-blue-50 transition-all shadow-lg hover:shadow-xl text-sm"
              data-testid="button-get-quote-hero"
            >Get a Free Quote <ArrowRight className="w-4 h-4" aria-hidden="true"/></a>
            <a href="#services"
              className="flex items-center gap-2 px-7 py-3.5 border-2 border-white/50 text-white font-semibold rounded-xl hover:bg-white/10 transition-all text-sm"
              data-testid="button-our-services"
            >Explore Services</a>
          </div>
          <div className="flex flex-wrap gap-8 mt-10 pt-10 border-t border-white/15">
            {[
              { icon: Users, label: "500+ Clients Served" },
              { icon: Award, label: "Trusted Since 2015" },
              { icon: Globe, label: "Nationwide Coverage" },
            ].map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-2.5 text-white/85 text-sm">
                <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
                  <Icon className="w-4 h-4 text-blue-200" aria-hidden="true"/>
                </div>
                <span>{label}</span>
              </div>
            ))}
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
    image: "/images/life-insurance.png",
    color: "from-blue-500 to-blue-700",
    iconColor: "text-blue-600",
    bg: "bg-blue-100",
    items: ["Life Cover", "Critical Illness Cover", "Disability Protection", "Death Benefits for Family Security"],
  },
  {
    id: "pension-fund",
    icon: PiggyBank,
    title: "Group Pension",
    subtitle: "Secure Your Retirement",
    image: "/images/retirement.png",
    color: "from-indigo-500 to-indigo-700",
    iconColor: "text-indigo-600",
    bg: "bg-indigo-100",
    items: ["Retirement Savings Solutions", "Tax-Efficient Wealth Building"],
  },
  {
    id: "medical-aid",
    icon: HeartPulse,
    title: "Medical Aid Gap Cover",
    subtitle: "Comprehensive Health Cover",
    image: "/images/medical-aid.png",
    color: "from-sky-500 to-sky-700",
    iconColor: "text-sky-600",
    bg: "bg-sky-100",
    items: ["Fill Gaps in Existing Medical Cover", "Flexible Gap Options for Peace of Mind"],
  },
  {
    id: "short-term-insurance",
    icon: Car,
    title: "Short-term Insurance",
    subtitle: "Protect Your Assets",
    image: "/images/short-term-insurance.png",
    color: "from-cyan-500 to-cyan-700",
    iconColor: "text-cyan-600",
    bg: "bg-cyan-100",
    items: ["Cover for Business Assets and Property", "Cover for Vehicles, Gadgets & Household Items"],
  },
  {
    id: "retirement-annuity",
    icon: TrendingUp,
    title: "Retirement Annuity",
    subtitle: "Plan for the Long Term",
    image: "/images/retirement.png",
    color: "from-blue-600 to-indigo-700",
    iconColor: "text-blue-700",
    bg: "bg-blue-100",
    items: ["Long-Term Retirement Planning", "Secure Income for Retirement"],
  },
  {
    id: "savings-investment",
    icon: Banknote,
    title: "Savings & Investment",
    subtitle: "Grow Your Wealth",
    image: "/images/savings-investment.png",
    color: "from-teal-500 to-blue-600",
    iconColor: "text-teal-600",
    bg: "bg-teal-100",
    items: ["Structured Savings Plans", "Guaranteed Growth Opportunities"],
  },
];

function ServicesSection() {
  return (
    <section id="services" className="py-20 md:py-28 bg-gray-50" data-testid="services-section">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="text-center mb-14">
          <div className="inline-block px-4 py-1.5 rounded-full bg-blue-100 text-blue-700 text-xs font-semibold uppercase tracking-wide mb-4">What We Offer</div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4" data-testid="services-title">
            Comprehensive Financial Protection
          </h2>
          <p className="text-gray-500 max-w-xl mx-auto text-base">
            Tailored solutions for individuals and businesses — from protection to growth.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
          {services.map((svc) => (
            <a
              key={svc.id}
              href={`/services/${svc.id}`}
              className="group bg-white rounded-2xl border border-gray-100 hover:border-blue-200 hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col"
              data-testid={`card-service-${svc.id}`}
            >
              <div className="relative h-44 overflow-hidden">
                <img
                  src={svc.image}
                  alt={svc.title}
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"/>
                <div className="absolute bottom-0 left-0 right-0 p-4 flex items-end gap-3">
                  <div className={`w-10 h-10 rounded-xl ${svc.bg} flex items-center justify-center flex-shrink-0`}>
                    <svc.icon className={`w-5 h-5 ${svc.iconColor}`} aria-hidden="true"/>
                  </div>
                  <div>
                    <p className="text-white font-bold text-sm leading-tight">{svc.title}</p>
                    <p className="text-blue-200 text-xs">{svc.subtitle}</p>
                  </div>
                </div>
                <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${svc.color}`}/>
              </div>
              <div className="p-5 flex-1 flex flex-col">
                <ul className="space-y-2.5 flex-1">
                  {svc.items.map((item) => (
                    <li key={item} className="flex items-start gap-2.5 text-sm text-gray-600">
                      <ChevronRight className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" aria-hidden="true"/>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
                  <span className="text-xs font-semibold text-blue-600">Learn more</span>
                  <ArrowRight className="w-4 h-4 text-blue-400 group-hover:translate-x-1 transition-transform" aria-hidden="true"/>
                </div>
              </div>
            </a>
          ))}
        </div>
        <div className="text-center mt-12">
          <a href="#contact"
            className="inline-flex items-center gap-2 px-8 py-4 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all text-sm"
            style={{ background: `linear-gradient(135deg, ${BLUE}, ${DARK})` }}
            data-testid="button-services-cta"
          >Speak to an Advisor <ArrowRight className="w-4 h-4" aria-hidden="true"/></a>
        </div>
      </div>
    </section>
  );
}

const whyPoints = [
  { icon: ShieldCheck, title: "Independent Advice", desc: "We work for you, not the insurer. We source the best policy from multiple providers to suit your unique needs." },
  { icon: Users, title: "Tailored Insurance Solutions", desc: "Every client is different. We craft customised cover that fits your personal and business circumstances." },
  { icon: Award, title: "Trusted Insurer Partnership", desc: "We partner with Namibia's top insurers to ensure you receive reputable, reliable cover and fast claims." },
];

function WhyUsSection() {
  return (
    <section id="why-us" className="py-20 md:py-28 bg-white overflow-hidden" data-testid="why-us-section">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="relative">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl h-[500px]">
              <img src="/images/why-quantz.png" alt="Quantz team and clients" className="w-full h-full object-cover object-center"/>
              <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(10,37,64,0.7) 0%, transparent 60%)" }}/>
              <div className="absolute bottom-0 left-0 right-0 p-8">
                <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-5">
                  <p className="text-white font-bold text-xl italic mb-1">"Protect what matters most"</p>
                  <p className="text-blue-200 text-sm">Speak to a Quantz Financial Advisor today</p>
                  <a href="tel:+264818201522" className="inline-flex items-center gap-2 mt-3 text-white font-bold text-lg hover:text-blue-200 transition-colors" data-testid="button-call-hero">
                    <Phone className="w-5 h-5" aria-hidden="true"/> +264 81 820 1522
                  </a>
                </div>
              </div>
            </div>
            <div className="absolute -top-6 -right-6 w-24 h-24 rounded-2xl bg-blue-600 opacity-10 rotate-12" aria-hidden="true"/>
            <div className="absolute -bottom-6 -left-6 w-32 h-32 rounded-full bg-indigo-400 opacity-10" aria-hidden="true"/>
          </div>

          <div>
            <div className="inline-block px-4 py-1.5 rounded-full bg-blue-100 text-blue-700 text-xs font-semibold uppercase tracking-wide mb-5">Our Promise</div>
            <p className="text-gray-600 text-base leading-relaxed mb-6" data-testid="about-description">
              Quantz Financial Services provides tailored insurance and financial protection solutions
              designed to safeguard your life, assets, and future.
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8" data-testid="why-us-title">
              Why Choose Quantz?
            </h2>
            <div className="space-y-6">
              {whyPoints.map((p, i) => (
                <div key={i} className="flex gap-4 p-5 rounded-2xl bg-gray-50 hover:bg-blue-50 hover:border-blue-100 border border-transparent transition-all" data-testid={`why-point-${i + 1}`}>
                  <div className="flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: `linear-gradient(135deg, ${BLUE}, ${DARK})` }}>
                    <p.icon className="w-6 h-6 text-white" aria-hidden="true"/>
                  </div>
                  <div>
                    <h3 className="text-gray-900 font-semibold text-base mb-1">{p.title}</h3>
                    <p className="text-gray-500 text-sm leading-relaxed">{p.desc}</p>
                  </div>
                </div>
              ))}
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
    <section id="partners" className="py-16 md:py-20 bg-gray-50 border-y border-gray-100" data-testid="partners-section">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="text-center mb-10">
          <p className="text-gray-400 text-xs font-semibold uppercase tracking-widest mb-2">In Partnership With</p>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800" data-testid="partners-title">Namibia's Leading Insurers</h2>
        </div>
        <div className="flex flex-wrap justify-center gap-4 md:gap-5">
          {partners.map((p) => (
            <div
              key={p.name}
              className="flex items-center gap-3 px-5 py-3 rounded-xl border border-gray-200 bg-white hover:shadow-md hover:border-blue-100 transition-all cursor-default"
              data-testid={`partner-${p.name.toLowerCase().replace(/[\s|]/g, "-")}`}
            >
              <div className="w-9 h-9 rounded-lg flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0" style={{ backgroundColor: p.color }}>{p.abbr}</div>
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
    { n: "01", title: "Tell Us Your Needs", desc: "Share your personal or business insurance requirements with our expert advisors.", img: "/images/get-quote.png" },
    { n: "02", title: "We Compare Quotes", desc: "We search across all our insurer partners to find you the best rates and coverage.", img: "/images/savings-investment.png" },
    { n: "03", title: "You Choose", desc: "Review your tailored options and select the plan that gives you complete peace of mind.", img: "/images/hero-family.png" },
  ];
  return (
    <section className="py-20 md:py-28 bg-white" data-testid="how-it-works-section">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="text-center mb-14">
          <div className="inline-block px-4 py-1.5 rounded-full bg-blue-100 text-blue-700 text-xs font-semibold uppercase tracking-wide mb-4">Simple Process</div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4" data-testid="how-it-works-title">How It Works</h2>
          <p className="text-gray-500 text-base max-w-md mx-auto">Getting the right cover is simple — we guide you every step of the way.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step, i) => (
            <div key={i} className="group rounded-2xl overflow-hidden border border-gray-100 hover:shadow-xl transition-all" data-testid={`step-${i + 1}`}>
              <div className="relative h-48 overflow-hidden">
                <img src={step.img} alt={step.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"/>
                <div className="absolute inset-0 bg-black/40"/>
                <div className="absolute top-4 left-4">
                  <div className="w-12 h-12 rounded-xl text-white font-black text-xl flex items-center justify-center shadow-lg" style={{ background: `linear-gradient(135deg, ${BLUE}, ${DARK})` }}>
                    {step.n}
                  </div>
                </div>
              </div>
              <div className="p-6 bg-white">
                <h3 className="font-bold text-gray-900 text-lg mb-2">{step.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function TestimonialsSection() {
  const testimonials = [
    { name: "Maria S.", location: "Windhoek", quote: "Quantz helped me find the perfect life insurance for my family at a price I could afford. Their advice was independent and honest — I felt truly looked after.", stars: 5 },
    { name: "David K.", location: "Swakopmund", quote: "As a business owner, I needed comprehensive short-term insurance. Quantz compared quotes from multiple insurers and saved me significantly. Excellent service!", stars: 5 },
    { name: "Annelise P.", location: "Oshakati", quote: "Their retirement annuity advice was clear and straightforward. I now have peace of mind knowing my future is secured. Highly recommend Quantz Financial Services.", stars: 5 },
  ];
  return (
    <section className="py-20 md:py-28 bg-gray-50" data-testid="testimonials-section">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="text-center mb-14">
          <div className="inline-block px-4 py-1.5 rounded-full bg-blue-100 text-blue-700 text-xs font-semibold uppercase tracking-wide mb-4">Client Stories</div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4" data-testid="testimonials-title">What Our Clients Say</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-7">
          {testimonials.map((t, i) => (
            <div key={i} className="bg-white rounded-2xl p-7 border border-gray-100 hover:shadow-lg transition-shadow" data-testid={`testimonial-card-${i + 1}`}>
              <div className="flex gap-1 mb-4" aria-label={`${t.stars} stars`}>
                {Array.from({ length: t.stars }).map((_, s) => (
                  <Star key={s} className="w-4 h-4 fill-yellow-400 text-yellow-400" aria-hidden="true"/>
                ))}
              </div>
              <p className="text-gray-700 text-sm leading-relaxed italic mb-5">"{t.quote}"</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full text-white font-bold text-sm flex items-center justify-center" style={{ background: `linear-gradient(135deg, ${BLUE}, ${DARK})` }}>
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
    <section id="contact" className="relative overflow-hidden" data-testid="contact-section">
      <div className="absolute inset-0">
        <img src="/images/get-quote.png" alt="" className="w-full h-full object-cover" aria-hidden="true"/>
        <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, rgba(10,37,64,0.97) 0%, rgba(13,59,110,0.95) 40%, rgba(30,123,196,0.88) 100%)" }}/>
      </div>
      <div className="relative max-w-7xl mx-auto px-4 md:px-8 py-20 md:py-28">
        <div className="grid md:grid-cols-2 gap-16 items-start">
          <div>
            <div className="inline-block px-4 py-1.5 rounded-full bg-white/10 border border-white/20 text-white/80 text-xs font-semibold uppercase tracking-wide mb-6">Get In Touch</div>
            <h2 className="text-white text-3xl md:text-4xl font-bold mb-4" data-testid="contact-title">Ready for Proper Protection?</h2>
            <p className="text-blue-200 text-base mb-10">
              Speak to one of our expert advisors today. We'll find the right cover for you —
              at the right price, with complete peace of mind.
            </p>
            <div className="space-y-5">
              <a href="tel:+264818201522" className="flex items-center gap-4 group" data-testid="contact-phone">
                <div className="w-12 h-12 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center group-hover:bg-white/20 transition-colors">
                  <Phone className="w-5 h-5 text-blue-200" aria-hidden="true"/>
                </div>
                <div>
                  <p className="text-blue-300 text-xs font-medium uppercase tracking-wide">Call Us</p>
                  <p className="text-white font-bold text-lg">+264 81 820 1522</p>
                </div>
              </a>
              <a href="mailto:info@quantz.com.na" className="flex items-center gap-4 group" data-testid="contact-email">
                <div className="w-12 h-12 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center group-hover:bg-white/20 transition-colors">
                  <Mail className="w-5 h-5 text-blue-200" aria-hidden="true"/>
                </div>
                <div>
                  <p className="text-blue-300 text-xs font-medium uppercase tracking-wide">Email Us</p>
                  <p className="text-white font-semibold">info@quantz.com.na</p>
                </div>
              </a>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-blue-200" aria-hidden="true"/>
                </div>
                <div>
                  <p className="text-blue-300 text-xs font-medium uppercase tracking-wide">Location</p>
                  <p className="text-white font-semibold">Windhoek, Namibia</p>
                </div>
              </div>
            </div>
            <div className="mt-10 p-6 rounded-2xl bg-white/5 border border-white/10">
              <div className="flex items-center gap-3 mb-3">
                <CheckCircle2 className="w-5 h-5 text-green-400" aria-hidden="true"/>
                <span className="text-white text-sm font-medium">Free, no-obligation quote</span>
              </div>
              <div className="flex items-center gap-3 mb-3">
                <CheckCircle2 className="w-5 h-5 text-green-400" aria-hidden="true"/>
                <span className="text-white text-sm font-medium">Expert independent advice</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-400" aria-hidden="true"/>
                <span className="text-white text-sm font-medium">Trusted Namibian insurer partners</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-8 shadow-2xl" data-testid="contact-form">
            <div className="flex items-center gap-3 mb-6">
              <img src="/quantz-logo.png" alt="Quantz" className="h-10 w-auto"/>
              <div>
                <h3 className="text-gray-900 font-bold text-lg leading-tight">Request a Free Quote</h3>
                <p className="text-gray-400 text-xs">We'll get back to you within 24 hours</p>
              </div>
            </div>
            <form className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1.5">First Name</label>
                  <input type="text" placeholder="John" className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all" data-testid="input-first-name"/>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1.5">Last Name</label>
                  <input type="text" placeholder="Smith" className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all" data-testid="input-last-name"/>
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1.5">Phone Number</label>
                <input type="tel" placeholder="+264 XX XXX XXXX" className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all" data-testid="input-phone"/>
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1.5">Insurance Type</label>
                <select className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all text-gray-700 bg-white" data-testid="select-insurance-type">
                  <option value="">Select an insurance type</option>
                  <option>Life Insurance</option>
                  <option>Group Pension</option>
                  <option>Medical Aid Gap Cover</option>
                  <option>Short-term Insurance</option>
                  <option>Retirement Annuity</option>
                  <option>Savings &amp; Investment</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1.5">Message (Optional)</label>
                <textarea placeholder="Tell us more about what you're looking for…" rows={3} className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all resize-none" data-testid="input-message"/>
              </div>
              <button type="submit" className="w-full py-4 rounded-xl text-white font-bold text-sm shadow-lg hover:shadow-xl transition-all hover:opacity-95" style={{ background: `linear-gradient(135deg, ${BLUE}, ${DARK})` }} data-testid="button-submit-quote">
                Request My Free Quote
              </button>
              <p className="text-center text-xs text-gray-400">By submitting, you agree to be contacted by Quantz Financial Services.</p>
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
            <img src="/quantz-logo.png" alt="Quantz Financial Services" className="h-12 w-auto mb-4"/>
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
                <a key={label} href="#" aria-label={label}
                  className="w-9 h-9 rounded-lg bg-gray-800 hover:bg-blue-600 flex items-center justify-center transition-colors"
                  data-testid={`link-${label.toLowerCase()}`}
                >
                  <Icon className="w-4 h-4" aria-hidden="true"/>
                </a>
              ))}
            </div>
          </div>
          <div>
            <h4 className="text-white font-semibold text-sm mb-5 uppercase tracking-widest">Services</h4>
            <ul className="space-y-3 text-sm">
              {["Life Insurance", "Group Pension", "Medical Aid Gap Cover", "Short-term Insurance", "Retirement Annuity", "Savings & Investment"].map((s) => (
                <li key={s}><a href="#services" className="hover:text-white transition-colors">{s}</a></li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold text-sm mb-5 uppercase tracking-widest">Contact</h4>
            <ul className="space-y-4 text-sm">
              <li className="flex gap-3">
                <Phone className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" aria-hidden="true"/>
                <a href="tel:+264818201522" className="hover:text-white transition-colors" data-testid="footer-phone">+264 81 820 1522</a>
              </li>
              <li className="flex gap-3">
                <Mail className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" aria-hidden="true"/>
                <a href="mailto:info@quantz.com.na" className="hover:text-white transition-colors" data-testid="footer-email">info@quantz.com.na</a>
              </li>
              <li className="flex gap-3">
                <MapPin className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" aria-hidden="true"/>
                <span>Windhoek, Namibia</span>
              </li>
            </ul>
          </div>
        </div>
        <div className="py-6 flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="text-xs text-gray-600" data-testid="text-copyright">© 2025 Quantz Financial Services (CC). All rights reserved.</p>
          <p className="text-xs text-gray-600">Regulated insurance broker in Namibia</p>
        </div>
      </div>
    </footer>
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
