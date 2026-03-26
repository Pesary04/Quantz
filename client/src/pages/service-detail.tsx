import { useParams, useLocation } from "wouter";
import { ArrowLeft, ArrowRight, CheckCircle2, ChevronRight, Phone, Mail, Shield, Car, HeartPulse, TrendingUp, PiggyBank, Banknote, HelpCircle, Users, Star } from "lucide-react";

const BLUE = "#1e7bc4";
const DARK = "#0d2e52";

const serviceData: Record<string, {
  id: string;
  icon: React.ElementType;
  title: string;
  subtitle: string;
  tagline: string;
  image: string;
  color: string;
  gradientFrom: string;
  gradientTo: string;
  what: string;
  whatInside: string[];
  benefits: string[];
  whoFor: string[];
  steps: { title: string; desc: string }[];
  faq: { q: string; a: string }[];
}> = {
  "life-insurance": {
    id: "life-insurance",
    icon: Shield,
    title: "Life Insurance",
    subtitle: "Protect Your Family's Future",
    tagline: "Insurance that pays a lump sum if you pass away or become seriously ill — so your family is never left without.",
    image: "/images/life-insurance.png",
    color: "from-blue-500 to-blue-700",
    gradientFrom: "#1e7bc4",
    gradientTo: "#0d2e52",
    what: "Life Insurance is a policy that pays out a tax-free lump sum to your beneficiaries if you pass away, or to you if you become critically ill or disabled. It ensures that even when the worst happens, your family's financial future remains secure — covering debts, education, living costs and more.",
    whatInside: [
      "Life Cover – a lump sum paid to your family on death",
      "Disability Cover – income or lump sum if you can no longer work",
      "Critical Illness Cover – payout on diagnosis of serious illness",
      "Family Protection – death benefits ensuring loved ones are provided for",
      "Estate planning add-ons and beneficiary nomination support",
    ],
    benefits: [
      "Tax-free lump sum payout to beneficiaries",
      "Critical illness cover included in most plans",
      "Legacy and estate planning integration",
      "Flexible premium options to suit your budget",
      "Cover for breadwinners and business owners",
      "Fast claims process through trusted insurers",
    ],
    whoFor: [
      "Breadwinners supporting a family",
      "Business owners with financial obligations",
      "Anyone with outstanding debt (home loan, car, etc.)",
      "Parents wanting to secure their children's education",
      "Individuals wanting critical illness financial safety nets",
    ],
    steps: [
      { title: "Tell Us Your Needs", desc: "Share your family structure, income, debts and goals with our advisor." },
      { title: "We Compare Insurers", desc: "We search Sanlam, Old Mutual, Hollard and more to find your best match." },
      { title: "Choose Your Plan", desc: "We present your options clearly — no jargon, no pressure." },
      { title: "You're Covered", desc: "Policy is activated, and we support you through every claim." },
    ],
    faq: [
      { q: "What does life insurance pay out?", a: "A tax-free lump sum paid to your nominated beneficiaries upon your death, or to you upon critical illness or disability diagnosis." },
      { q: "Can I get cover if I have a pre-existing condition?", a: "Yes, in many cases. Our advisors will identify the right insurer and plan that offers the most comprehensive cover for your situation." },
      { q: "How much life cover do I need?", a: "A rule of thumb is 10× your annual income, but your actual need depends on debts, dependants, and goals. We calculate the right amount for you." },
    ],
  },
  "pension-fund": {
    id: "pension-fund",
    icon: PiggyBank,
    title: "Group Pension",
    subtitle: "Secure Your Retirement",
    tagline: "A workplace or personal retirement savings solution that grows your wealth with tax advantages and employer contributions.",
    image: "/images/retirement.png",
    color: "from-indigo-500 to-indigo-700",
    gradientFrom: "#4f46e5",
    gradientTo: "#312e81",
    what: "A Group Pension is a structured, tax-efficient retirement savings plan — often provided through an employer — that builds wealth over your working life so you have a steady, reliable income when you retire. Quantz helps you navigate, join or supplement your group pension effectively.",
    whatInside: [
      "Employer-linked pension fund membership and advice",
      "Preservation funds when you change jobs",
      "Retirement savings solutions tailored to your timeline",
      "Tax-efficient contribution strategies",
      "Investment portfolio selection within the fund",
    ],
    benefits: [
      "Tax-deductible contributions (up to 27.5% of income)",
      "Employer contributions boost your savings",
      "Preserves your retirement capital when changing jobs",
      "Compounding growth over your working years",
      "Guaranteed income stream options at retirement",
      "Regulated and protected under Namibian pension law",
    ],
    whoFor: [
      "Employed individuals with employer pension schemes",
      "Business owners setting up staff pension benefits",
      "Individuals who recently changed jobs (preservation)",
      "Anyone approaching retirement wanting consolidation",
      "Those wanting to maximise tax savings while building wealth",
    ],
    steps: [
      { title: "Assess Your Current Position", desc: "We review your existing pension arrangements and retirement goals." },
      { title: "Identify the Right Fund", desc: "We match you with the right pension fund or preservation solution." },
      { title: "Optimise Contributions", desc: "We structure contributions for maximum tax benefit and growth." },
      { title: "Monitor & Review", desc: "We regularly review your fund performance and adjust your strategy." },
    ],
    faq: [
      { q: "What happens to my pension if I change jobs?", a: "Your pension can be transferred to a preservation fund to protect your savings and avoid penalties. We guide you through this process." },
      { q: "Can I access my pension early?", a: "Typically, pension funds are accessible from age 55-60. Early withdrawal usually attracts significant tax penalties." },
      { q: "How is my pension invested?", a: "Funds are invested across equities, bonds and cash. We help you select an investment strategy matching your risk appetite and time horizon." },
    ],
  },
  "medical-aid": {
    id: "medical-aid",
    icon: HeartPulse,
    title: "Medical Aid Gap Cover",
    subtitle: "Comprehensive Health Cover",
    tagline: "Fill the gaps in your existing medical cover and ensure you're protected for every healthcare event — without the financial shock.",
    image: "/images/medical-aid.png",
    color: "from-sky-500 to-sky-700",
    gradientFrom: "#0ea5e9",
    gradientTo: "#0369a1",
    what: "Medical Aid Gap Cover ensures that when you need healthcare, you are not left with unexpected bills. Quantz helps you find the right gap cover product to fill shortfalls between what your medical aid pays and what providers actually charge — covering doctor visits, hospitalisations, chronic medication and specialist consultations.",
    whatInside: [
      "Medical aid plan comparison and selection",
      "Gap cover to top up shortfalls from your medical aid",
      "Chronic illness and ongoing medication cover",
      "Hospitalisation and surgical procedure cover",
      "Specialist consultation cover and referral support",
    ],
    benefits: [
      "No unexpected medical bills left unpaid",
      "Gap cover fills the difference between what your aid pays and actual costs",
      "Flexible plans for individuals, families and employees",
      "Peace of mind for hospital and specialist visits",
      "Chronic illness medication covered",
      "Namibia's top medical aid administrators compared for you",
    ],
    whoFor: [
      "Individuals without employer-provided medical aid",
      "Families wanting comprehensive healthcare protection",
      "Those with existing medical aid needing gap cover",
      "Self-employed professionals",
      "Employees wanting to supplement basic employer medical benefits",
    ],
    steps: [
      { title: "Review Your Current Cover", desc: "We assess any existing medical aid and identify gaps or shortfalls." },
      { title: "Compare Options", desc: "We compare medical aid administrators and gap cover products." },
      { title: "Select Your Plan", desc: "Choose a plan that fits your health needs and monthly budget." },
      { title: "Enrol & Claim with Confidence", desc: "We support you through the enrolment and claims process." },
    ],
    faq: [
      { q: "What is gap cover and why do I need it?", a: "Gap cover pays the difference between what your medical aid pays and what a doctor actually charges. Without it, you could face large out-of-pocket expenses." },
      { q: "Can I join medical aid if I have a chronic condition?", a: "Yes. Most medical aid schemes accept members with chronic conditions, though waiting periods and exclusions may apply. We find the best fit for your health profile." },
      { q: "How is the monthly premium calculated?", a: "Premiums are based on your age, chosen plan level, number of dependants, and any applicable late-joiner penalties." },
    ],
  },
  "short-term-insurance": {
    id: "short-term-insurance",
    icon: Car,
    title: "Short-term Insurance",
    subtitle: "Protect Your Assets",
    tagline: "Cover your car, home, business and valuables against accidents, theft, fire and unexpected disasters.",
    image: "/images/short-term-insurance.png",
    color: "from-cyan-500 to-cyan-700",
    gradientFrom: "#06b6d4",
    gradientTo: "#0e7490",
    what: "Short-term Insurance provides cover for physical assets — your car, home, household contents, business equipment and property — against damage, theft, fire and natural disasters. Unlike life insurance which pays out on life events, short-term policies are renewed annually and protect you against everyday risks.",
    whatInside: [
      "Vehicle Insurance – comprehensive, third party and fire/theft cover",
      "Home & Contents Insurance – structure and possessions cover",
      "Business Assets & Property Insurance",
      "Electronic Equipment and gadgets cover",
      "Liability cover for businesses and homeowners",
    ],
    benefits: [
      "Comprehensive cover for cars, homes and business property",
      "Covers vehicles, gadgets and household items",
      "Fast and fair claims handling",
      "Multi-asset discounts when bundling policies",
      "Business interruption cover available",
      "Competitive premiums across top Namibian insurers",
    ],
    whoFor: [
      "Car and vehicle owners",
      "Homeowners and tenants",
      "Small and medium business owners",
      "Anyone with high-value electronics or equipment",
      "Business owners with commercial property",
    ],
    steps: [
      { title: "List Your Assets", desc: "Tell us what you need to cover — vehicle, home, contents, or business." },
      { title: "We Source Quotes", desc: "We compare rates from Santam, Sanlam, Hollard and more." },
      { title: "Choose Your Cover", desc: "Select the right policy and excess levels for your needs." },
      { title: "You're Protected", desc: "Your assets are covered and we handle your claims when needed." },
    ],
    faq: [
      { q: "What is the difference between comprehensive and third-party vehicle cover?", a: "Comprehensive covers your vehicle for any damage including accidents, theft and weather. Third-party only covers damage you cause to others' property." },
      { q: "Can I insure my home contents separately from the building?", a: "Yes. Building insurance covers the structure; contents insurance covers your furniture, appliances and possessions. Both can be done together or separately." },
      { q: "How are my premiums calculated?", a: "Premiums are based on the value of your assets, their risk profile (area, security, vehicle type), and your claims history." },
    ],
  },
  "retirement-annuity": {
    id: "retirement-annuity",
    icon: TrendingUp,
    title: "Retirement Annuity",
    subtitle: "Plan for the Long Term",
    tagline: "A personal, flexible and tax-efficient savings vehicle that builds your retirement income — independent of your employer.",
    image: "/images/retirement.png",
    color: "from-blue-600 to-indigo-700",
    gradientFrom: "#2563eb",
    gradientTo: "#4338ca",
    what: "A Retirement Annuity (RA) is an individual retirement savings plan that allows you to save for retirement in a tax-efficient way, outside of your employer's pension fund. It gives you control over how much you save, where your money is invested, and when you retire — while reducing your taxable income.",
    whatInside: [
      "Retirement Annuity (RA) plans from top insurers",
      "Preservation Fund solutions when leaving employment",
      "Flexible contribution amounts (monthly or lump sum)",
      "Choice of investment portfolios (low to high risk)",
      "Retirement income and annuity structuring at maturity",
    ],
    benefits: [
      "Contributions are tax-deductible (up to 27.5% of income)",
      "Flexible contributions — increase, decrease or pause anytime",
      "Investment growth is tax-free inside the fund",
      "Protects savings from creditors",
      "Can be used alongside employer pension fund",
      "Provides a guaranteed income stream at retirement",
    ],
    whoFor: [
      "Self-employed individuals without employer pension",
      "Employees wanting to top up their employer pension",
      "Business owners planning for retirement",
      "Individuals aged 30+ serious about long-term planning",
      "Anyone wanting more control over retirement savings",
    ],
    steps: [
      { title: "Set Your Retirement Goal", desc: "We work out how much income you need at retirement and by when." },
      { title: "Design Your Contribution Plan", desc: "We calculate the monthly or lump sum contribution required." },
      { title: "Select Your Investment Strategy", desc: "Choose from conservative to aggressive investment portfolios." },
      { title: "Grow & Retire Confidently", desc: "We review your RA annually and adjust your strategy as you approach retirement." },
    ],
    faq: [
      { q: "When can I access my retirement annuity?", a: "You can access your RA from age 55. At retirement, you take up to one-third as a lump sum and use the rest to buy an annuity (monthly income)." },
      { q: "How much tax will I save with an RA?", a: "Contributions up to 27.5% of your taxable income are tax-deductible, meaning if you earn N$30,000/month you could save significant tax each year." },
      { q: "What if I need to stop contributing?", a: "RAs are flexible. You can reduce, pause or stop contributions without penalty, though your retirement income will adjust accordingly." },
    ],
  },
  "savings-investment": {
    id: "savings-investment",
    icon: Banknote,
    title: "Savings & Investment",
    subtitle: "Grow Your Wealth",
    tagline: "Structured savings and investment solutions that help your money grow — safely, strategically and with meaningful returns.",
    image: "/images/savings-investment.png",
    color: "from-teal-500 to-blue-600",
    gradientFrom: "#14b8a6",
    gradientTo: "#1e7bc4",
    what: "Savings and Investment products help you grow wealth beyond your day-to-day needs. Whether you're saving for a short-term goal, building an emergency fund or growing long-term wealth, Quantz connects you with unit trusts, balanced funds and structured savings plans that match your goals and risk appetite.",
    whatInside: [
      "Unit Trusts – pooled investment funds with diversified exposure",
      "Balanced Funds – mix of equities, bonds and cash",
      "Goal-based savings plans (education, home, holiday)",
      "Fixed-term investment accounts with guaranteed returns",
      "Offshore and local investment options",
    ],
    benefits: [
      "Competitive interest rates and investment returns",
      "Tax-efficient savings vehicles where applicable",
      "Goal-based planning (education, property, emergency fund)",
      "Low minimum investment amounts available",
      "Professional fund management by top asset managers",
      "Flexible access — from locked-in to liquid products",
    ],
    whoFor: [
      "Individuals saving for a specific goal",
      "Anyone wanting to grow wealth beyond a savings account",
      "Self-employed individuals without employer benefits",
      "Parents saving for children's education",
      "Young professionals starting their wealth journey",
    ],
    steps: [
      { title: "Define Your Goals", desc: "We identify what you're saving for and your time horizon." },
      { title: "Assess Your Risk Appetite", desc: "We match your comfort level with the right investment strategy." },
      { title: "Select Your Product", desc: "From unit trusts to goal-based savings, we recommend the best fit." },
      { title: "Track & Grow", desc: "We monitor performance and rebalance your portfolio as needed." },
    ],
    faq: [
      { q: "What is the difference between saving and investing?", a: "Saving is putting money aside safely with low risk and low return. Investing puts money into assets that can grow significantly over time but carry some risk." },
      { q: "How much do I need to start investing?", a: "Many unit trusts and savings products start from as little as N$500/month. There's no perfect amount — starting early matters more than starting big." },
      { q: "Are my investments safe?", a: "Investments are managed by regulated asset managers and protected under Namibian financial law. Market investments can fluctuate, but diversification reduces risk." },
    ],
  },
};

const serviceOrder = ["life-insurance", "pension-fund", "medical-aid", "short-term-insurance", "retirement-annuity", "savings-investment"];

function Navbar({ currentService }: { currentService: string }) {
  return (
    <header className="sticky top-0 z-50 bg-white/97 backdrop-blur-sm shadow-sm border-b border-gray-100" data-testid="service-navbar">
      <div className="max-w-7xl mx-auto px-4 md:px-8 flex items-center justify-between h-16">
        <a href="/" className="flex-shrink-0" data-testid="logo">
          <img src="/quantz-logo.png" alt="Quantz Financial Services" className="h-10 w-auto"/>
        </a>
        <nav className="hidden md:flex items-center gap-6" aria-label="Main navigation">
          <a href="/" className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors">Home</a>
          <a href="/#services" className="text-sm font-medium text-blue-600 font-semibold">Services</a>
          <a href="/#why-us" className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors">Why Us</a>
          <a href="/#partners" className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors">Partners</a>
          <a href="/#contact" className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors">Contact</a>
        </nav>
        <a href="/#contact"
          className="px-5 py-2 rounded-lg text-sm font-semibold text-white transition-all hover:opacity-90 hover:shadow-md"
          style={{ background: `linear-gradient(135deg, ${BLUE}, ${DARK})` }}
          data-testid="button-nav-cta"
        >Get a Quote</a>
      </div>
    </header>
  );
}

export default function ServiceDetail() {
  const { id } = useParams<{ id: string }>();
  const [, setLocation] = useLocation();
  const svc = id ? serviceData[id] : null;

  if (!svc) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="text-gray-500 text-lg">Service not found.</p>
        <a href="/#services" className="text-blue-600 hover:underline font-medium">← Back to Services</a>
      </div>
    );
  }

  const currentIndex = serviceOrder.indexOf(svc.id);
  const prevService = currentIndex > 0 ? serviceData[serviceOrder[currentIndex - 1]] : null;
  const nextService = currentIndex < serviceOrder.length - 1 ? serviceData[serviceOrder[currentIndex + 1]] : null;

  return (
    <div className="min-h-screen bg-white" data-testid="service-detail-page">
      <Navbar currentService={svc.id} />

      <section
        className="relative overflow-hidden"
        style={{ background: `linear-gradient(135deg, #0a2540 0%, #0d3b6e 45%, ${svc.gradientFrom} 100%)` }}
        data-testid="service-hero"
      >
        <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
          <div className="absolute right-0 top-0 w-1/2 h-full">
            <img src={svc.image} alt="" className="w-full h-full object-cover object-center opacity-20"/>
          </div>
          <div className="absolute inset-0" style={{ background: `linear-gradient(to right, #0a2540 40%, transparent 100%)` }}/>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 md:px-8 py-16 md:py-24">
          <a href="/#services" className="inline-flex items-center gap-2 text-blue-200 hover:text-white text-sm font-medium mb-8 transition-colors" data-testid="link-back">
            <ArrowLeft className="w-4 h-4" aria-hidden="true"/> Back to All Services
          </a>
          <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/20 text-white/90 text-xs font-medium mb-5`}>
            <svc.icon className="w-3.5 h-3.5" aria-hidden="true"/>
            <span>{svc.subtitle}</span>
          </div>
          <h1 className="text-white text-4xl md:text-5xl font-extrabold leading-tight mb-4" data-testid="service-title">
            {svc.title}
          </h1>
          <p className="text-blue-100/90 text-base md:text-xl max-w-2xl leading-relaxed mb-8" data-testid="service-tagline">
            {svc.tagline}
          </p>
          <a href="/#contact"
            className="inline-flex items-center gap-2 px-7 py-3.5 bg-white text-blue-800 font-bold rounded-xl hover:bg-blue-50 transition-all shadow-lg text-sm"
            data-testid="button-hero-quote"
          >
            Get a Free Quote <ArrowRight className="w-4 h-4" aria-hidden="true"/>
          </a>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 md:px-8 py-16 md:py-20">
        <div className="grid lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-14">

            <div data-testid="section-what-is-it">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `linear-gradient(135deg, ${svc.gradientFrom}, ${svc.gradientTo})` }}>
                  <svc.icon className="w-5 h-5 text-white" aria-hidden="true"/>
                </div>
                <h2 className="text-2xl font-bold text-gray-900">What Is {svc.title}?</h2>
              </div>
              <div className="relative rounded-2xl overflow-hidden mb-6 h-64">
                <img src={svc.image} alt={svc.title} className="w-full h-full object-cover object-center"/>
                <div className="absolute inset-0" style={{ background: `linear-gradient(to top, rgba(10,37,64,0.5) 0%, transparent 60%)` }}/>
              </div>
              <p className="text-gray-600 text-base leading-relaxed" data-testid="service-description">
                {svc.what}
              </p>
            </div>

            <div data-testid="section-what-inside">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">What You'll Find Inside</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                {svc.whatInside.map((item, i) => (
                  <div key={i} className="flex items-start gap-3 p-4 rounded-xl bg-gray-50 border border-gray-100 hover:border-blue-100 hover:bg-blue-50/40 transition-all">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5" style={{ background: `linear-gradient(135deg, ${svc.gradientFrom}, ${svc.gradientTo})` }}>
                      <ChevronRight className="w-4 h-4 text-white" aria-hidden="true"/>
                    </div>
                    <span className="text-sm text-gray-700 leading-relaxed">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div data-testid="section-how-it-works">
              <h2 className="text-2xl font-bold text-gray-900 mb-8">How It Works</h2>
              <div className="relative">
                <div className="hidden md:block absolute left-5 top-8 bottom-8 w-0.5 bg-gradient-to-b from-blue-300 to-transparent" aria-hidden="true"/>
                <div className="space-y-6">
                  {svc.steps.map((step, i) => (
                    <div key={i} className="flex gap-5" data-testid={`how-step-${i + 1}`}>
                      <div className="flex-shrink-0 w-10 h-10 rounded-full text-white font-bold text-sm flex items-center justify-center z-10" style={{ background: `linear-gradient(135deg, ${svc.gradientFrom}, ${svc.gradientTo})` }}>
                        {i + 1}
                      </div>
                      <div className="flex-1 pb-6">
                        <h3 className="font-semibold text-gray-900 text-base mb-1">{step.title}</h3>
                        <p className="text-gray-500 text-sm leading-relaxed">{step.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div data-testid="section-faq">
              <div className="flex items-center gap-2 mb-6">
                <HelpCircle className="w-5 h-5 text-blue-500" aria-hidden="true"/>
                <h2 className="text-2xl font-bold text-gray-900">Frequently Asked Questions</h2>
              </div>
              <div className="space-y-4">
                {svc.faq.map((item, i) => (
                  <div key={i} className="rounded-2xl border border-gray-100 bg-gray-50 p-6" data-testid={`faq-${i + 1}`}>
                    <h3 className="font-semibold text-gray-900 text-sm mb-2">{item.q}</h3>
                    <p className="text-gray-500 text-sm leading-relaxed">{item.a}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-2xl overflow-hidden border border-gray-100 shadow-sm sticky top-24">
              <div className="p-6" style={{ background: `linear-gradient(135deg, ${svc.gradientFrom}, ${svc.gradientTo})` }}>
                <img src="/quantz-logo.png" alt="Quantz" className="h-10 w-auto mb-4"/>
                <p className="text-white font-bold text-lg leading-tight mb-1">Ready to get covered?</p>
                <p className="text-blue-100 text-sm">Get a free, no-obligation quote today.</p>
              </div>
              <div className="p-6 bg-white space-y-3">
                <a href="/#contact"
                  className="flex items-center justify-center gap-2 w-full py-3.5 text-white font-bold rounded-xl text-sm shadow-md hover:opacity-90 transition-all"
                  style={{ background: `linear-gradient(135deg, ${svc.gradientFrom}, ${svc.gradientTo})` }}
                  data-testid="sidebar-quote-button"
                >
                  <span>Get a Free Quote</span> <ArrowRight className="w-4 h-4" aria-hidden="true"/>
                </a>
                <a href="tel:+264818201522"
                  className="flex items-center justify-center gap-2 w-full py-3 border-2 border-gray-200 text-gray-700 font-medium rounded-xl text-sm hover:border-blue-300 hover:text-blue-600 transition-all"
                  data-testid="sidebar-phone-button"
                >
                  <Phone className="w-4 h-4" aria-hidden="true"/> +264 81 820 1522
                </a>
                <a href="mailto:info@quantz.com.na"
                  className="flex items-center justify-center gap-2 w-full py-3 border-2 border-gray-200 text-gray-700 font-medium rounded-xl text-sm hover:border-blue-300 hover:text-blue-600 transition-all"
                  data-testid="sidebar-email-button"
                >
                  <Mail className="w-4 h-4" aria-hidden="true"/> Email Us
                </a>
              </div>

              <div className="px-6 pb-6 bg-white">
                <div className="pt-4 border-t border-gray-100">
                  <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4">Key Benefits</h4>
                  <ul className="space-y-2.5" data-testid="sidebar-benefits">
                    {svc.benefits.map((b, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-xs text-gray-600">
                        <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" aria-hidden="true"/>
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="px-6 pb-6 bg-white">
                <div className="pt-4 border-t border-gray-100">
                  <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4">Who It's For</h4>
                  <ul className="space-y-2" data-testid="sidebar-who-for">
                    {svc.whoFor.map((w, i) => (
                      <li key={i} className="flex items-start gap-2 text-xs text-gray-600">
                        <Users className="w-3.5 h-3.5 text-blue-400 flex-shrink-0 mt-0.5" aria-hidden="true"/>
                        <span>{w}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-gray-50 border-t border-gray-100 py-12" data-testid="other-services-section">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <h2 className="text-xl font-bold text-gray-900 mb-8 text-center">Explore More Services</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {serviceOrder.filter((s) => s !== svc.id).map((sid) => {
              const s = serviceData[sid];
              return (
                <a
                  key={sid}
                  href={`/services/${sid}`}
                  className="flex flex-col items-center gap-3 p-4 rounded-xl bg-white border border-gray-100 hover:border-blue-200 hover:shadow-md transition-all text-center group"
                  data-testid={`related-service-${sid}`}
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center bg-gradient-to-br ${s.color} group-hover:scale-110 transition-transform`}>
                    <s.icon className="w-5 h-5 text-white" aria-hidden="true"/>
                  </div>
                  <span className="text-xs font-semibold text-gray-700 leading-tight">{s.title}</span>
                </a>
              );
            })}
          </div>
        </div>
      </div>

      <div className="flex border-t border-gray-100" data-testid="service-nav">
        {prevService && (
          <a href={`/services/${prevService.id}`}
            className="flex-1 flex items-center gap-3 p-6 hover:bg-gray-50 transition-colors border-r border-gray-100 group"
            data-testid="link-prev-service"
          >
            <ArrowLeft className="w-5 h-5 text-gray-400 group-hover:text-blue-500 transition-colors" aria-hidden="true"/>
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-wide">Previous</p>
              <p className="text-sm font-semibold text-gray-900">{prevService.title}</p>
            </div>
          </a>
        )}
        {!prevService && <div className="flex-1"/>}
        {nextService && (
          <a href={`/services/${nextService.id}`}
            className="flex-1 flex items-center justify-end gap-3 p-6 hover:bg-gray-50 transition-colors group"
            data-testid="link-next-service"
          >
            <div className="text-right">
              <p className="text-xs text-gray-400 uppercase tracking-wide">Next</p>
              <p className="text-sm font-semibold text-gray-900">{nextService.title}</p>
            </div>
            <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-blue-500 transition-colors" aria-hidden="true"/>
          </a>
        )}
      </div>

      <footer className="bg-[#060f1e] text-gray-400 py-6">
        <div className="max-w-7xl mx-auto px-4 md:px-8 flex flex-col md:flex-row items-center justify-between gap-3">
          <img src="/quantz-logo.png" alt="Quantz Financial Services" className="h-8 w-auto"/>
          <p className="text-xs text-gray-600" data-testid="text-copyright">© 2025 Quantz Financial Services (CC). All rights reserved.</p>
          <div className="flex gap-4 text-xs">
            <a href="tel:+264818201522" className="hover:text-white transition-colors">+264 81 820 1522</a>
            <a href="mailto:info@quantz.com.na" className="hover:text-white transition-colors">info@quantz.com.na</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
