import { Shield, Car, Cross, PiggyBank, ShieldCheck, Building2, Zap, Users, Phone, Quote } from "lucide-react";
import { SiFacebook, SiX, SiInstagram, SiYoutube } from "react-icons/si";

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
    <svg width="60" height="40" viewBox={`0 0 ${W} ${H}`} aria-hidden="true" style={{ borderRadius: 3, display: "block", boxShadow: "0 1px 4px rgba(0,0,0,0.4)" }}>
      <defs>
        <clipPath id="flagClip">
          <rect width={W} height={H} rx="2"/>
        </clipPath>
      </defs>
      <g clipPath="url(#flagClip)">
        <rect width={W} height={H} fill="#003580"/>
        <polygon points={`0,${H} ${W},${H} ${W},0`} fill="#009A44"/>
        <line x1="0" y1={H} x2={W} y2="0" stroke="white" strokeWidth="13"/>
        <line x1="0" y1={H} x2={W} y2="0" stroke="#D21034" strokeWidth="7"/>
        {rays.map((d, i) => (
          <path key={i} d={d} fill="#FFCC00"/>
        ))}
        <circle cx={sunCx} cy={sunCy} r={sunR * 0.58} fill="#FFCC00"/>
      </g>
    </svg>
  );
}

function Navbar() {
  return (
    <nav className="w-full flex items-center justify-between px-6 md:px-12 py-4 bg-[#0a2e3a]" role="navigation" aria-label="Main navigation" data-testid="navbar">
      <div className="flex items-center gap-2" data-testid="logo">
        <div className="w-8 h-8 rounded-full border-2 border-white flex items-center justify-center">
          <span className="text-white font-bold text-sm">Q</span>
        </div>
        <span className="text-white font-semibold text-lg tracking-wide">Quantz</span>
      </div>
      <div className="hidden md:flex items-center gap-8" data-testid="nav-links">
        <a href="#home" className="text-white text-sm hover:text-teal-300 transition-colors" data-testid="link-home">Home</a>
        <a href="#services" className="text-white text-sm hover:text-teal-300 transition-colors" data-testid="link-services">Services</a>
        <a href="#about" className="text-white text-sm hover:text-teal-300 transition-colors" data-testid="link-about">About</a>
        <a href="#contact" className="text-white text-sm hover:text-teal-300 transition-colors" data-testid="link-contact">Contact</a>
      </div>
    </nav>
  );
}

function HeroSection() {
  return (
    <section
      id="home"
      className="relative w-full py-16 md:py-24 flex flex-col items-center text-center px-6"
      style={{
        background: "linear-gradient(135deg, #0a2e3a 0%, #0d3d4a 30%, #145a5e 60%, #1a7a6d 100%)",
      }}
      data-testid="hero-section"
    >
      <div className="mb-6" data-testid="flag-icon">
        <NamibianFlag />
      </div>

      <h1 className="text-white text-3xl md:text-5xl font-bold leading-tight max-w-2xl mb-4" data-testid="hero-title">
        Expert Insurance<br />
        Broking You Can Trust
      </h1>

      <p className="text-gray-300 text-sm md:text-base max-w-lg mb-2" data-testid="hero-subtitle">
        Life • Short-term • Medical • Retirement • Investments.
      </p>
      <p className="text-gray-300 text-sm md:text-base max-w-lg mb-8" data-testid="hero-description">
        We compare the best policies so you get the right cover at the<br className="hidden md:block" />
        right price – with peace of mind.
      </p>

      <div className="flex flex-col sm:flex-row gap-4" data-testid="hero-cta">
        <a
          href="#contact"
          className="px-6 py-3 bg-teal-500 hover:bg-teal-600 text-white font-semibold rounded-md transition-colors text-sm"
          data-testid="button-get-quote-hero"
        >
          Get a Free Quote
        </a>
        <a
          href="#contact"
          className="px-6 py-3 border border-white text-white font-semibold rounded-md hover:bg-white/10 transition-colors text-sm"
          data-testid="button-speak-advisor"
        >
          Speak to an Advisor
        </a>
      </div>
    </section>
  );
}

const insuranceSolutions = [
  {
    icon: Shield,
    title: "Life Insurance",
    id: "life-insurance",
  },
  {
    icon: Car,
    title: "Short-term Insurance",
    id: "short-term-insurance",
  },
  {
    icon: Cross,
    title: "Medical Aid",
    id: "medical-aid",
  },
  {
    icon: PiggyBank,
    title: "Retirement & Investments",
    id: "retirement-investments",
  },
];

function InsuranceSolutionsSection() {
  return (
    <section id="services" className="w-full py-16 md:py-20 bg-[#eef1f4] px-6" data-testid="solutions-section">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold text-center text-[#1a2e3a] mb-12" data-testid="solutions-title">
          Our Insurance Solutions
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {insuranceSolutions.map((solution) => (
            <div
              key={solution.id}
              className="bg-white rounded-xl p-6 flex flex-col items-center text-center shadow-sm hover:shadow-md transition-shadow"
              data-testid={`card-solution-${solution.id}`}
            >
              <div className="w-16 h-16 flex items-center justify-center mb-4">
                <solution.icon className="w-10 h-10 text-teal-600" aria-hidden="true" />
              </div>
              <h3 className="text-sm font-semibold text-[#1a2e3a]">{solution.title}</h3>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

const whyChooseReasons = [
  {
    icon: ShieldCheck,
    title: "Independent Advice",
    id: "independent-advice",
  },
  {
    icon: Building2,
    title: "Best Rates from All Insurers",
    id: "best-rates",
  },
  {
    icon: Zap,
    title: "Fast & Fair Claims",
    id: "fast-claims",
  },
  {
    icon: Users,
    title: "Personal Service in Namibia",
    id: "personal-service",
  },
];

function WhyChooseSection() {
  return (
    <section id="about" className="w-full py-16 md:py-20 bg-white px-6" data-testid="why-choose-section">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold text-center text-[#1a2e3a] mb-12" data-testid="why-choose-title">
          Why Choose Quantz Brokers?
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {whyChooseReasons.map((reason) => (
            <div
              key={reason.id}
              className="bg-[#f3f5f7] rounded-xl p-6 flex flex-col items-center text-center"
              data-testid={`card-reason-${reason.id}`}
            >
              <div className="w-14 h-14 flex items-center justify-center mb-4">
                <reason.icon className="w-8 h-8 text-teal-600" aria-hidden="true" />
              </div>
              <h3 className="text-sm font-semibold text-[#1a2e3a]">{reason.title}</h3>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

const steps = [
  { number: "1", title: "Tell Us\nWhat You Need" },
  { number: "2", title: "We Compare\nQuotes" },
  { number: "3", title: "You Choose & We\nHandle the Rest" },
];

function HowItWorksSection() {
  return (
    <section className="w-full py-16 md:py-20 bg-[#eef1f4] px-6" data-testid="how-it-works-section">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold text-center text-[#1a2e3a] mb-12" data-testid="how-it-works-title">
          How It Works
        </h2>
        <div className="relative flex items-start justify-between">
          <div className="absolute top-5 left-[15%] right-[15%] h-0.5 bg-teal-400" aria-hidden="true" />
          {steps.map((step, index) => (
            <div key={index} className="relative flex flex-col items-center text-center flex-1" data-testid={`step-${step.number}`}>
              <div className="w-10 h-10 rounded-full bg-teal-500 text-white font-bold flex items-center justify-center text-sm z-10 mb-4">
                {step.number}
              </div>
              <p className="text-xs md:text-sm text-[#1a2e3a] font-medium whitespace-pre-line">{step.title}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function TestimonialSection() {
  return (
    <section className="w-full py-10 md:py-12 bg-white px-6" data-testid="testimonial-section">
      <div className="max-w-4xl mx-auto">
        <div className="bg-[#f3f5f7] rounded-lg px-6 py-5 flex flex-col sm:flex-row items-start gap-4">
          <h3 className="text-base font-bold text-[#1a2e3a] flex-shrink-0 pt-1">Testimonial</h3>
          <div className="flex-1">
            <div className="flex items-start gap-2">
              <Quote className="w-4 h-4 text-teal-500 mt-0.5 flex-shrink-0" aria-hidden="true" />
              <p className="text-sm text-gray-600 italic leading-relaxed" data-testid="text-testimonial">
                "We are grateful to Quantz Financial Services for their exceptional assistance. They helped us find 
                the best insurance plan to meet our family's needs at a price we could afford. Their customer service 
                is outstanding and they truly care about helping their clients."
              </p>
            </div>
            <p className="text-sm font-semibold text-[#1a2e3a] mt-2 ml-6">— Maria S., Windhoek</p>
          </div>
        </div>
      </div>
    </section>
  );
}

function CTASection() {
  return (
    <section id="contact" className="w-full py-12 md:py-16 bg-[#0a2e3a] px-6" data-testid="cta-section">
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <h2 className="text-xl md:text-2xl font-bold text-white" data-testid="cta-title">
          Ready for proper<br />protection?
        </h2>
        <div className="flex flex-col sm:flex-row items-center gap-6">
          <div className="flex items-center gap-3 text-white">
            <Phone className="w-5 h-5 text-teal-400" aria-hidden="true" />
            <div>
              <p className="text-xs text-gray-300">Write to/call us:</p>
              <p className="text-lg font-bold" data-testid="text-phone">081 122 2290</p>
            </div>
          </div>
          <a
            href="#contact"
            className="px-8 py-3 bg-teal-500 hover:bg-teal-600 text-white font-semibold rounded-md transition-colors text-sm"
            data-testid="button-get-quote-cta"
          >
            Get a Quote
          </a>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="w-full py-6 bg-[#071e28] px-6" data-testid="footer">
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2" data-testid="footer-logo">
          <div className="w-6 h-6 rounded-full border-2 border-white flex items-center justify-center">
            <span className="text-white font-bold text-xs">Q</span>
          </div>
          <span className="text-white font-semibold text-sm">Quantz</span>
        </div>
        <p className="text-gray-400 text-xs" data-testid="text-copyright">
          © Quantz Financial Services Namibia
        </p>
        <div className="flex items-center gap-4" data-testid="social-links">
          <a href="#" className="text-gray-400 hover:text-white transition-colors" data-testid="link-facebook" aria-label="Facebook">
            <SiFacebook className="w-4 h-4" aria-hidden="true" />
          </a>
          <a href="#" className="text-gray-400 hover:text-white transition-colors" data-testid="link-twitter" aria-label="Twitter">
            <SiX className="w-4 h-4" aria-hidden="true" />
          </a>
          <a href="#" className="text-gray-400 hover:text-white transition-colors" data-testid="link-instagram" aria-label="Instagram">
            <SiInstagram className="w-4 h-4" aria-hidden="true" />
          </a>
          <a href="#" className="text-gray-400 hover:text-white transition-colors" data-testid="link-youtube" aria-label="YouTube">
            <SiYoutube className="w-4 h-4" aria-hidden="true" />
          </a>
        </div>
      </div>
    </footer>
  );
}

export default function Home() {
  return (
    <div className="min-h-screen bg-[#eef1f4]" data-testid="home-page">
      <Navbar />
      <HeroSection />
      <InsuranceSolutionsSection />
      <WhyChooseSection />
      <HowItWorksSection />
      <TestimonialSection />
      <CTASection />
      <Footer />
    </div>
  );
}
