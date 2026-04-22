import { useState, useEffect, useRef, useCallback } from "react";
import {
  Shield, Car, HeartPulse, TrendingUp, PiggyBank, Banknote,
  CheckCircle2, Phone, Mail, MapPin, Menu, X, ArrowRight, Star,
  Users, Award, Globe, ChevronRight, ChevronLeft, ShieldCheck,
  Scroll, FileDown, UserCircle, BarChart2, Briefcase
} from "lucide-react";
import { SiFacebook, SiInstagram, SiWhatsapp } from "react-icons/si";

const SOCIAL_LINKS = [
  { Icon: SiFacebook, label: "Facebook", href: "https://www.facebook.com/profile.php?id=61583774184552", bgStyle: { backgroundColor: "#1877F2" } },
  { Icon: SiInstagram, label: "Instagram", href: "https://www.instagram.com/quantz_financial_/", bgStyle: { background: "radial-gradient(circle at 30% 107%, #fdf497 0%, #fdf497 5%, #fd5949 45%, #d6249f 60%, #285AEB 90%)" } },
  { Icon: SiWhatsapp, label: "WhatsApp", href: "https://whatsapp.com/channel/0029VbCRTzjB4hdVbtBM1V3s", bgStyle: { backgroundColor: "#25D366" } },
];

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
    <header className="sticky top-0 z-50 shadow-lg" style={{ background: "#003087" }} data-testid="navbar">
      <div className="max-w-7xl mx-auto px-4 md:px-8 flex items-center justify-between h-24">
        <a href="#home" className="flex-shrink-0" data-testid="logo">
          <img src="/quantz-logo.png" alt="Quantz Financial Services" className="h-20 w-auto drop-shadow-lg" />
        </a>
        <nav className="hidden md:flex items-center gap-8" role="navigation" aria-label="Main navigation" data-testid="nav-links">
          {links.map((l) => (
            <a key={l.href} href={l.href}
              className="text-sm font-semibold text-white/90 hover:text-white transition-colors relative group"
              data-testid={`link-${l.label.toLowerCase().replace(" ", "-")}`}
            >
              {l.label}
              <span className="absolute -bottom-0.5 left-0 w-0 h-0.5 bg-white group-hover:w-full transition-all duration-300"/>
            </a>
          ))}
        </nav>
        <div className="hidden md:flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            {SOCIAL_LINKS.map(({ Icon, label, href, bgStyle }) => (
              <a key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={label}
                className="w-7 h-7 rounded-lg text-white flex items-center justify-center transition-all hover:opacity-80 hover:shadow-md"
                style={bgStyle}
                data-testid={`link-social-${label.toLowerCase()}`}
              >
                <Icon className="w-3.5 h-3.5" aria-hidden="true"/>
              </a>
            ))}
          </div>
          <div className="w-px h-5 bg-white/30"/>
          <a href="tel:+264818201522" className="flex items-center gap-1.5 text-sm text-white/90 hover:text-white transition-colors" data-testid="link-phone">
            <Phone className="w-3.5 h-3.5" aria-hidden="true"/>
            <span>+264 81 820 1522</span>
          </a>
          <a href="#contact"
            className="px-5 py-2 rounded-lg text-sm font-bold transition-all hover:shadow-lg hover:scale-105"
            style={{ background: "white", color: "#003087" }}
            data-testid="button-nav-cta"
          >Get a Quote</a>
        </div>
        <button className="md:hidden p-2 rounded-lg text-white hover:bg-white/10" onClick={() => setOpen(!open)} aria-label="Toggle menu" data-testid="button-mobile-menu">
          {open ? <X className="w-5 h-5"/> : <Menu className="w-5 h-5"/>}
        </button>
      </div>
      {open && (
        <div className="md:hidden border-t border-white/20 px-4 py-4 space-y-3" style={{ background: "#002070" }}>
          {links.map((l) => (
            <a key={l.href} href={l.href} className="block text-sm font-semibold text-white/90 hover:text-white py-2" onClick={() => setOpen(false)}>{l.label}</a>
          ))}
          <div className="flex items-center gap-2 pt-1">
            {SOCIAL_LINKS.map(({ Icon, label, href, bgStyle }) => (
              <a key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={label}
                className="w-9 h-9 rounded-lg text-white flex items-center justify-center transition-all hover:opacity-80"
                style={bgStyle}
                data-testid={`link-social-mobile-${label.toLowerCase()}`}
              >
                <Icon className="w-4 h-4" aria-hidden="true"/>
              </a>
            ))}
          </div>
          <a href="#contact" className="block w-full text-center px-5 py-2.5 rounded-lg text-sm font-bold" style={{ background: "white", color: "#003087" }}>Get a Quote</a>
        </div>
      )}
    </header>
  );
}

function HeroSection() {
  return (
    <section id="home" className="relative overflow-hidden min-h-[600px] flex items-center" data-testid="hero-section">
      <div className="absolute inset-0">
        <img src="/images/hero-light.png" alt="Happy Namibian family" className="w-full h-full object-cover object-center" />
        <div className="absolute inset-0" style={{ background: "linear-gradient(100deg, rgba(0,48,135,0.82) 0%, rgba(0,48,135,0.70) 45%, rgba(0,48,135,0.35) 70%, rgba(0,48,135,0.10) 100%)" }}/>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 md:px-8 py-24 md:py-32 w-full">
        <div className="max-w-2xl">
          <h1 className="text-white text-3xl md:text-4xl lg:text-5xl font-bold leading-snug mb-5" data-testid="hero-title">
            Your Partner in<br />
            <span className="text-blue-300 font-extrabold">Financial Confidence</span>
          </h1>
          <p className="text-blue-100/90 text-base md:text-lg leading-relaxed mb-8 max-w-xl" data-testid="hero-description">
            From protecting your loved ones and assets to building wealth and planning for retirement,
            Quantz Financial Services supports you with solutions tailored to your evolving needs.
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
              { icon: Award, label: "Trusted Since 2007" },
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
    id: "pension-fund-individuals",
    icon: PiggyBank,
    title: "Pension Fund for Individuals",
    subtitle: "Secure Your Personal Retirement",
    image: "/images/retirement.png",
    color: "from-indigo-500 to-indigo-700",
    iconColor: "text-indigo-600",
    bg: "bg-indigo-100",
    items: ["Flexible Contribution Options", "Tax-Efficient Retirement Savings", "Guaranteed Income in Retirement", "Easy Access to Your Funds When Needed"],
  },
  {
    id: "pension-fund-groups",
    icon: Briefcase,
    title: "Pension Fund for Groups",
    subtitle: "Employee Pension Fund Solutions",
    image: "/images/why-quantz.png",
    color: "from-violet-500 to-violet-700",
    iconColor: "text-violet-600",
    bg: "bg-violet-100",
    items: ["Group Pension Fund Administration", "Customised Fund Rules for Your Company", "Competitive Investment Options", "Full Compliance and Regulatory Support"],
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
    items: ["Cover for Business Assets and Property", "Cover for Vehicles, Gadgets and Household Items"],
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
  {
    id: "wills-estates",
    icon: Scroll,
    title: "Wills & Estates",
    subtitle: "Secure Your Legacy",
    image: "/images/pension-fund-groups.png",
    color: "from-[#003087] to-[#00A896]",
    iconColor: "text-[#003087]",
    bg: "bg-teal-50",
    items: ["Drafting and Updating of Wills", "Estate Planning and Administration", "Trust Formation", "Inheritance and Succession Planning"],
  },
];

function ServicesSection() {
  return (
    <section id="services" className="py-20 md:py-28 bg-white" data-testid="services-section">
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
          <button
            onClick={() => document.dispatchEvent(new CustomEvent("openAdvisorModal"))}
            className="inline-flex items-center gap-2 px-8 py-4 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all text-sm"
            style={{ background: `linear-gradient(135deg, #003087, #00A896)` }}
            data-testid="button-services-cta"
          >Speak to an Advisor <ArrowRight className="w-4 h-4" aria-hidden="true"/></button>
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
    <section id="why-us" className="py-20 md:py-28 bg-[#f2f2f2] overflow-hidden" data-testid="why-us-section">
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
  { name: "Sanlam | Allianz", logo: "/images/partners/sanlam.svg", bg: "bg-white", pad: "p-3" },
  { name: "Santam", logo: "/images/partners/santam.svg", bg: "bg-white", pad: "p-3" },
  { name: "Old Mutual", logo: "/images/partners/old-mutual.svg", bg: "bg-white", pad: "p-3" },
  { name: "Hollard", logo: "/images/partners/hollard.png", bg: "bg-white", pad: "p-0" },
  { name: "PPS", logo: "/images/partners/pps.png", bg: "bg-[#0d2447]", pad: "p-0" },
  { name: "SISEDI", logo: "/images/partners/sisedi.png", bg: "bg-white", pad: "p-2" },
  { name: "Capricorn Asset Management", logo: "/images/partners/capricorn.png", bg: "bg-white", pad: "p-2" },
];

function PartnersSection() {
  const doubled = [...partners, ...partners];
  return (
    <section id="partners" className="py-16 md:py-20 bg-white border-y border-gray-200" data-testid="partners-section">
      <div className="text-center mb-10 px-4">
        <p className="text-gray-400 text-xs font-semibold uppercase tracking-widest mb-2">In Partnership With</p>
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800" data-testid="partners-title">Namibia's Leading Insurers</h2>
      </div>
      <div className="overflow-hidden relative">
        <div className="absolute left-0 top-0 bottom-0 w-16 z-10 pointer-events-none" style={{ background: "linear-gradient(to right, white, transparent)" }}/>
        <div className="absolute right-0 top-0 bottom-0 w-16 z-10 pointer-events-none" style={{ background: "linear-gradient(to left, white, transparent)" }}/>
        <div className="flex animate-marquee gap-8 w-max px-8">
          {doubled.map((p, i) => (
            <div
              key={i}
              className="flex flex-col items-center gap-3 flex-shrink-0 group cursor-default"
              data-testid={i < partners.length ? `partner-${p.name.toLowerCase().replace(/[\s|]/g, "-")}` : undefined}
            >
              <div className={`w-36 h-20 rounded-2xl border-2 border-gray-200 group-hover:border-blue-300 flex items-center justify-center overflow-hidden shadow-md group-hover:shadow-xl transition-all duration-300 ${p.bg} ${p.pad}`}>
                <img src={p.logo} alt={`${p.name} logo`} className="max-w-full max-h-full object-contain" />
              </div>
              <span className="text-xs font-semibold text-gray-500 text-center max-w-[9rem] leading-tight">{p.name}</span>
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
    <section className="py-20 md:py-28 bg-[#f2f2f2]" data-testid="how-it-works-section">
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

function FormsSection() {
  const forms = [
    { name: "Life Insurance Application Form", icon: Shield, color: "text-blue-600", bg: "bg-blue-50" },
    { name: "Short-Term Insurance Claim Form", icon: Car, color: "text-cyan-600", bg: "bg-cyan-50" },
    { name: "Pension Fund Membership Application", icon: PiggyBank, color: "text-indigo-600", bg: "bg-indigo-50" },
    { name: "Beneficiary Nomination Form", icon: Users, color: "text-violet-600", bg: "bg-violet-50" },
    { name: "Will Questionnaire", icon: Scroll, color: "text-amber-600", bg: "bg-amber-50" },
    { name: "Medical Aid Gap Cover Application", icon: HeartPulse, color: "text-sky-600", bg: "bg-sky-50" },
    { name: "Retirement Annuity Application", icon: TrendingUp, color: "text-blue-700", bg: "bg-blue-50" },
  ];
  return (
    <section className="py-20 md:py-24 bg-white border-t border-gray-200" data-testid="forms-section">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="text-center mb-12">
          <div className="inline-block px-4 py-1.5 rounded-full bg-blue-100 text-blue-700 text-xs font-semibold uppercase tracking-wide mb-4">Quick Access</div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4" data-testid="forms-title">Downloadable Forms &amp; Documents</h2>
          <p className="text-gray-500 max-w-xl mx-auto text-base">Access all the forms you need in one place — quickly and securely.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {forms.map((form, i) => (
            <div key={i} className="flex items-center gap-4 p-5 rounded-2xl border border-gray-100 bg-gray-50 hover:border-blue-200 hover:shadow-md transition-all group" data-testid={`form-card-${i + 1}`}>
              <div className={`w-11 h-11 rounded-xl ${form.bg} flex items-center justify-center flex-shrink-0`}>
                <form.icon className={`w-5 h-5 ${form.color}`} aria-hidden="true"/>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-800 leading-tight">{form.name}</p>
              </div>
              <a
                href="#contact"
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold text-white flex-shrink-0 hover:opacity-90 transition-all"
                style={{ background: `linear-gradient(135deg, ${BLUE}, ${DARK})` }}
                data-testid={`button-form-${i + 1}`}
                title="Contact us to receive this form"
              >
                <FileDown className="w-3.5 h-3.5" aria-hidden="true"/> Request
              </a>
            </div>
          ))}
        </div>
        <p className="text-center text-xs text-gray-400 mt-6">Contact us at <a href="mailto:info@quantz.com.na" className="text-blue-500 hover:underline">info@quantz.com.na</a> or call <a href="tel:+264818201522" className="text-blue-500 hover:underline">+264 81 820 1522</a> to receive any form directly.</p>
      </div>
    </section>
  );
}

function MarketWatchSection() {
  return (
    <section className="py-16 md:py-20 bg-white border-t border-gray-100" data-testid="market-watch-section">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="text-center mb-10">
          <div className="inline-block px-4 py-1.5 rounded-full bg-blue-100 text-blue-700 text-xs font-semibold uppercase tracking-wide mb-4">Live Data</div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4" data-testid="market-watch-title">Market Watch – Live Indices</h2>
          <p className="text-gray-500 max-w-lg mx-auto text-base">Stay informed with live market data from the Namibian and South African stock exchanges.</p>
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="rounded-2xl border border-gray-100 overflow-hidden shadow-sm" data-testid="market-nsx">
            <div className="px-5 py-3 border-b border-gray-100 flex items-center gap-2" style={{ background: `linear-gradient(135deg, ${BLUE}, ${DARK})` }}>
              <BarChart2 className="w-4 h-4 text-white" aria-hidden="true"/>
              <span className="text-white font-semibold text-sm">Namibian Stock Exchange (NSX)</span>
            </div>
            <div className="bg-white p-2">
              <iframe
                src="https://sslefp.tradingview.com/embed-widget/single-quote/?locale=en#%7B%22symbol%22%3A%22XNAM%3AFNB%22%2C%22width%22%3A%22100%25%22%2C%22height%22%3A%22120%22%2C%22colorTheme%22%3A%22light%22%2C%22isTransparent%22%3Afalse%7D"
                title="NSX Market Data"
                className="w-full"
                style={{ height: 160, border: "none" }}
                loading="lazy"
              />
              <div className="px-3 pb-3">
                <iframe
                  src="https://www.investing.com/instruments/Widgets/investingWidgetPanel/?widgetType=investingTicker&investingId=11271&theme=light&showSymbol=true"
                  title="FTSE NSX Overall Index"
                  className="w-full"
                  style={{ height: 80, border: "none" }}
                  loading="lazy"
                />
              </div>
            </div>
          </div>
          <div className="rounded-2xl border border-gray-100 overflow-hidden shadow-sm" data-testid="market-jse">
            <div className="px-5 py-3 border-b border-gray-100 flex items-center gap-2" style={{ background: `linear-gradient(135deg, #1a6830, #0f4020)` }}>
              <BarChart2 className="w-4 h-4 text-white" aria-hidden="true"/>
              <span className="text-white font-semibold text-sm">Johannesburg Stock Exchange (JSE)</span>
            </div>
            <div className="bg-white p-3">
              <iframe
                src="https://sslefp.tradingview.com/embed-widget/single-quote/?locale=en#%7B%22symbol%22%3A%22JSEJ15%22%2C%22width%22%3A%22100%25%22%2C%22height%22%3A%22120%22%2C%22colorTheme%22%3A%22light%22%2C%22isTransparent%22%3Afalse%7D"
                title="JSE All Share Index"
                className="w-full"
                style={{ height: 160, border: "none" }}
                loading="lazy"
              />
            </div>
          </div>
        </div>
        <p className="text-center text-xs text-gray-400 mt-4">Market data provided for informational purposes only. Not financial advice.</p>
      </div>
    </section>
  );
}

function AdvisorSection() {
  return (
    <section className="py-20 md:py-24 bg-[#f2f2f2] border-t border-gray-200" data-testid="advisor-section">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="text-center mb-12">
          <div className="inline-block px-4 py-1.5 rounded-full bg-blue-100 text-blue-700 text-xs font-semibold uppercase tracking-wide mb-4">Meet Your Advisor</div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4" data-testid="advisor-title">Know Your Financial Advisor</h2>
        </div>
        <div className="grid md:grid-cols-2 gap-12 items-center max-w-5xl mx-auto">
          <div className="relative rounded-3xl overflow-hidden shadow-xl h-96">
            <img src="/images/advisor-portrait.png" alt="Quantz Managing Director" className="w-full h-full object-cover object-center"/>
            <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(10,37,64,0.6) 0%, transparent 60%)" }}/>
          </div>
          <div>
            <div className="flex items-center gap-4 mb-6">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center" style={{ background: `linear-gradient(135deg, ${BLUE}, ${DARK})` }}>
                <UserCircle className="w-7 h-7 text-white" aria-hidden="true"/>
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900" data-testid="advisor-name">Managing Director</h3>
                <p className="text-blue-600 text-sm font-medium">Principal Financial Advisor</p>
              </div>
            </div>
            <div className="space-y-4 mb-6">
              {[
                { label: "Position", value: "Managing Director / Principal Financial Advisor" },
                { label: "Experience", value: "18+ Years in Financial Services" },
                { label: "Specialisation", value: "Life, Retirement and Short-Term Insurance" },
              ].map((item) => (
                <div key={item.label} className="flex gap-3 p-4 rounded-xl bg-white border border-gray-100">
                  <div className="w-1.5 rounded-full flex-shrink-0" style={{ background: `linear-gradient(to bottom, ${BLUE}, ${DARK})` }}/>
                  <div>
                    <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">{item.label}</p>
                    <p className="text-gray-800 font-semibold text-sm">{item.value}</p>
                  </div>
                </div>
              ))}
            </div>
            <p className="text-gray-500 text-sm leading-relaxed mb-6">
              With nearly two decades of experience in the Namibian financial services industry, our advisor is committed to providing independent, honest guidance that puts clients first. Every recommendation is made with your long-term wellbeing in mind.
            </p>
            <button
              onClick={() => document.dispatchEvent(new CustomEvent("openAdvisorModal"))}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-white font-semibold text-sm shadow-md hover:opacity-90 transition-all"
              style={{ background: `linear-gradient(135deg, #003087, #00A896)` }}
              data-testid="button-advisor-contact"
            >
              Book a Consultation <ArrowRight className="w-4 h-4" aria-hidden="true"/>
            </button>
          </div>
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
    <section className="py-20 md:py-28 bg-white" data-testid="testimonials-section">
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
              Speak to one of our expert advisors today. We will find the right cover for you —
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
              <img src="/quantz-logo.png" alt="Quantz" className="h-12 w-auto"/>
              <div>
                <h3 className="text-gray-900 font-bold text-lg leading-tight">Request a Free Quote</h3>
                <p className="text-gray-400 text-xs">We will get back to you within 24 hours</p>
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
                  <option>Pension Fund for Individuals</option>
                  <option>Pension Fund for Groups (Corporate)</option>
                  <option>Medical Aid Gap Cover</option>
                  <option>Short-term Insurance</option>
                  <option>Retirement Annuity</option>
                  <option>Savings &amp; Investment</option>
                  <option>Wills &amp; Estates</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1.5">Message (Optional)</label>
                <textarea placeholder="Tell us more about what you are looking for…" rows={3} className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all resize-none" data-testid="input-message"/>
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
    <footer className="bg-[#404040] text-gray-400" data-testid="footer">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="py-12 grid grid-cols-1 md:grid-cols-3 gap-10 border-b border-gray-800">
          <div>
            <img src="/quantz-logo.png" alt="Quantz Financial Services" className="h-24 w-auto mb-4"/>
            <p className="text-sm text-gray-500 leading-relaxed max-w-xs">
              Providing tailored insurance and financial protection solutions to safeguard your life, assets, and future.
            </p>
            <div className="flex gap-3 mt-5">
              {SOCIAL_LINKS.map(({ Icon, label, href, bgStyle }) => (
                <a key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={label}
                  className="w-9 h-9 rounded-lg text-white flex items-center justify-center transition-all hover:opacity-80 hover:shadow-lg"
                  style={bgStyle}
                  data-testid={`link-footer-${label.toLowerCase()}`}
                >
                  <Icon className="w-4 h-4" aria-hidden="true"/>
                </a>
              ))}
            </div>
          </div>
          <div>
            <h4 className="text-white font-semibold text-sm mb-5 uppercase tracking-widest">Services</h4>
            <ul className="space-y-3 text-sm">
              {["Life Insurance", "Pension Fund for Individuals", "Pension Fund for Groups", "Medical Aid Gap Cover", "Short-term Insurance", "Retirement Annuity", "Savings & Investment", "Wills & Estates"].map((s) => (
                <li key={s}><a href="#services" className="font-semibold hover:text-white transition-colors">{s}</a></li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold text-sm mb-5 uppercase tracking-widest">Contact</h4>
            <ul className="space-y-4 text-sm">
              <li className="flex gap-3">
                <Phone className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" aria-hidden="true"/>
                <a href="tel:+264818201522" className="font-semibold hover:text-white transition-colors" data-testid="footer-phone">+264 81 820 1522</a>
              </li>
              <li className="flex gap-3">
                <Mail className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" aria-hidden="true"/>
                <a href="mailto:info@quantz.com.na" className="font-semibold hover:text-white transition-colors" data-testid="footer-email">info@quantz.com.na</a>
              </li>
              <li className="flex gap-3">
                <MapPin className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" aria-hidden="true"/>
                <span className="font-semibold">Windhoek, Namibia</span>
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

function AdvisorModal() {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);

  useEffect(() => {
    const handler = () => { setOpen(true); setSent(false); setMessage(""); };
    document.addEventListener("openAdvisorModal", handler);
    return () => document.removeEventListener("openAdvisorModal", handler);
  }, []);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" role="dialog" aria-modal="true" data-testid="advisor-modal">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setOpen(false)}/>
      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden">
        <div className="px-6 py-5 flex items-center justify-between border-b border-gray-100" style={{ background: "linear-gradient(135deg, #003087, #00A896)" }}>
          <h2 className="text-white font-bold text-lg">Speak Directly to an Advisor</h2>
          <button onClick={() => setOpen(false)} className="text-white/70 hover:text-white transition-colors" aria-label="Close" data-testid="button-close-modal">
            <X className="w-5 h-5"/>
          </button>
        </div>
        <div className="p-6">
          <div className="flex items-center gap-4 mb-6 p-4 rounded-2xl bg-gray-50 border border-gray-100">
            <img src="/images/advisor-portrait.png" alt="Financial Advisor" className="w-16 h-16 rounded-xl object-cover flex-shrink-0"/>
            <div>
              <p className="font-bold text-gray-900">Managing Director</p>
              <p className="text-sm font-medium" style={{ color: "#00A896" }}>Principal Financial Advisor</p>
              <p className="text-xs text-gray-500 mt-0.5">18+ Years in Financial Services</p>
            </div>
          </div>
          <div className="space-y-3 mb-5">
            <a href="tel:+264818201522" className="flex items-center gap-3 p-3 rounded-xl border border-gray-100 hover:border-teal-200 hover:bg-teal-50 transition-all group" data-testid="modal-phone">
              <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: "linear-gradient(135deg, #003087, #00A896)" }}>
                <Phone className="w-4 h-4 text-white"/>
              </div>
              <div>
                <p className="text-xs text-gray-400 font-medium">Call us directly</p>
                <p className="text-sm font-semibold text-gray-800 group-hover:text-[#003087]">+264 81 820 1522</p>
              </div>
            </a>
            <a href="mailto:info@quantz.com.na" className="flex items-center gap-3 p-3 rounded-xl border border-gray-100 hover:border-teal-200 hover:bg-teal-50 transition-all group" data-testid="modal-email">
              <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: "linear-gradient(135deg, #003087, #00A896)" }}>
                <Mail className="w-4 h-4 text-white"/>
              </div>
              <div>
                <p className="text-xs text-gray-400 font-medium">Send an email</p>
                <p className="text-sm font-semibold text-gray-800 group-hover:text-[#003087]">info@quantz.com.na</p>
              </div>
            </a>
          </div>
          {!sent ? (
            <div className="space-y-3">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Or leave a message</p>
              <textarea
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent resize-none"
                rows={3}
                placeholder="What would you like to discuss?"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                data-testid="input-advisor-message"
              />
              <button
                onClick={() => { if (message.trim()) { setSent(true); } }}
                className="w-full py-3 rounded-xl text-white font-semibold text-sm hover:opacity-90 transition-all"
                style={{ background: "linear-gradient(135deg, #003087, #00A896)" }}
                data-testid="button-send-message"
              >Send Message</button>
            </div>
          ) : (
            <div className="text-center py-4">
              <div className="w-12 h-12 rounded-full bg-teal-100 flex items-center justify-center mx-auto mb-3">
                <CheckCircle2 className="w-6 h-6 text-teal-600"/>
              </div>
              <p className="font-semibold text-gray-900">Message sent!</p>
              <p className="text-sm text-gray-500 mt-1">Our advisor will be in touch with you shortly.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function CarInsuranceAdSection() {
  return (
    <section className="py-16 md:py-20 bg-[#f2f2f2] border-t border-gray-200" data-testid="car-insurance-ad-section">
      <div className="max-w-5xl mx-auto px-4 md:px-8">
        <div className="text-center mb-8">
          <div className="inline-block px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wide mb-4" style={{ background: "#e8f5f3", color: "#00A896" }}>Featured Coverage</div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">Car Insurance</h2>
          <p className="text-gray-500 max-w-xl mx-auto text-base">We compare quotes from all major insurers in Namibia to get you the best cover at a competitive price.</p>
        </div>

        <div className="rounded-3xl overflow-hidden shadow-2xl border border-gray-100">
          <img
            src="/images/car-insurance-ad.jpg"
            alt="Quantz Car Insurance — Do You Need Car Insurance? We compare quotes from all major insurers in Namibia."
            className="w-full h-auto block"
            data-testid="img-car-insurance-ad"
          />
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8">
          <a
            href="#contact"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-bold text-sm shadow-lg hover:shadow-xl transition-all"
            style={{ background: "linear-gradient(135deg, #003087, #00A896)", color: "white" }}
            data-testid="button-car-insurance-quote"
          >Get Your Free Quote Today <ArrowRight className="w-4 h-4"/></a>
          <a
            href="tel:+264818201522"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl border-2 font-semibold text-sm hover:bg-blue-50 transition-all"
            style={{ borderColor: "#003087", color: "#003087" }}
            data-testid="button-car-insurance-call"
          ><Phone className="w-4 h-4"/> +264 81 820 1522</a>
        </div>
      </div>
    </section>
  );
}

const BANNERS = [
  { src: "/images/banners/life-cover.jpg",        alt: "Life Insurance — Protects You Today and Your Family Tomorrow" },
  { src: "/images/banners/car-insurance.jpg",     alt: "Car Insurance — Compare Quotes from All Major Insurers in Namibia" },
  { src: "/images/banners/funeral-cover.jpg",     alt: "Funeral Cover — Give Your Family Dignity When It Matters Most" },
  { src: "/images/banners/gap-cover.jpg",         alt: "Medical Aid Gap Cover — Your Medical Aid Does Not Cover Everything" },
  { src: "/images/banners/insurance-review.jpg",  alt: "Insurance Review — Protect What Matters Most" },
  { src: "/images/banners/bundle-and-save.jpg",   alt: "Bundle and Save — Insure Your Home, Car, Gadgets & Electronics Together" },
  { src: "/images/banners/wills-estates.jpg",     alt: "Wills & Estates — Love Your Family Enough to Plan Ahead" },
];

function BannerSlideshow() {
  const [current, setCurrent] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const touchStartX = useRef<number | null>(null);

  const goTo = useCallback((idx: number) => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrent((idx + BANNERS.length) % BANNERS.length);
    setTimeout(() => setIsTransitioning(false), 500);
  }, [isTransitioning]);

  const next = useCallback(() => goTo(current + 1), [current, goTo]);
  const prev = useCallback(() => goTo(current - 1), [current, goTo]);

  const resetTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(next, 5500);
  }, [next]);

  useEffect(() => {
    timerRef.current = setInterval(next, 5500);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [next]);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) { diff > 0 ? next() : prev(); resetTimer(); }
    touchStartX.current = null;
  };

  return (
    <section className="w-full bg-black" data-testid="banner-slideshow">
      <div
        className="relative w-full overflow-hidden"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <div
          className="flex transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${current * 100}%)` }}
        >
          {BANNERS.map((b, i) => (
            <div key={i} className="w-full flex-shrink-0">
              <img
                src={b.src}
                alt={b.alt}
                className="w-full h-auto block max-h-[520px] object-cover object-center"
                loading={i === 0 ? "eager" : "lazy"}
              />
            </div>
          ))}
        </div>

        <button
          onClick={() => { prev(); resetTimer(); }}
          className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/40 hover:bg-black/65 text-white flex items-center justify-center transition-all z-10"
          aria-label="Previous banner"
          data-testid="banner-prev"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button
          onClick={() => { next(); resetTimer(); }}
          className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/40 hover:bg-black/65 text-white flex items-center justify-center transition-all z-10"
          aria-label="Next banner"
          data-testid="banner-next"
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2 z-10">
          {BANNERS.map((_, i) => (
            <button
              key={i}
              onClick={() => { goTo(i); resetTimer(); }}
              className={`rounded-full transition-all duration-300 ${i === current ? "w-6 h-2.5 bg-white" : "w-2.5 h-2.5 bg-white/50 hover:bg-white/75"}`}
              aria-label={`Go to banner ${i + 1}`}
              data-testid={`banner-dot-${i}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <div className="min-h-screen bg-[#f2f2f2]" data-testid="home-page">
      <Navbar />
      <BannerSlideshow />
      <HeroSection />
      <ServicesSection />
      <FormsSection />
      <WhyUsSection />
      <PartnersSection />
      <CarInsuranceAdSection />
      <HowItWorksSection />
      <TestimonialsSection />
      <AdvisorSection />
      <ContactSection />
      <Footer />
      <AdvisorModal />
    </div>
  );
}
