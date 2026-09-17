import { db } from "../server/db.js";
import { contentItems, siteSettings, type ContentCollection } from "../shared/schema.js";
import { eq } from "drizzle-orm";

/**
 * Seeds the editable site content (services, partners, banner slides) and the
 * site settings with the values the website originally shipped with, so the
 * public pages look identical until an admin edits them. Safe to re-run: each
 * collection is only seeded when it is currently empty.
 */

const WHATSAPP_URL = "https://whatsapp.com/channel/0029VbCRTzjB4hdVbtBM1V3s";

const services = [
  { title: "Life Insurance", subtitle: "Protect Your Family's Future", image: "/images/life-insurance.png", icon: "Shield", theme: "blue", href: "/services/life-insurance", items: ["Life Cover", "Critical Illness Cover", "Disability Protection", "Death Benefits for Family Security"] },
  { title: "Pension Fund for Individuals", subtitle: "Secure Your Personal Retirement", image: "/images/retirement.png", icon: "PiggyBank", theme: "indigo", href: "/services/pension-fund-individuals", items: ["Flexible Contribution Options", "Tax-Efficient Retirement Savings", "Guaranteed Income in Retirement", "Easy Access to Your Funds When Needed"] },
  { title: "Pension Fund for Groups", subtitle: "Employee Pension Fund Solutions", image: "/images/pension-fund-groups.jpg", icon: "Briefcase", theme: "violet", href: "/services/pension-fund-groups", items: ["Group Pension Fund Administration", "Customised Fund Rules for Your Company", "Competitive Investment Options", "Full Compliance and Regulatory Support"] },
  { title: "Medical Aid Gap Cover", subtitle: "Comprehensive Health Cover", image: "/images/medical-aid.png", icon: "HeartPulse", theme: "sky", href: "/services/medical-aid", items: ["Fill Gaps in Existing Medical Cover", "Flexible Gap Options for Peace of Mind"] },
  { title: "Short-term Insurance", subtitle: "Protect Your Assets", image: "/images/short-term-insurance.png", icon: "Car", theme: "cyan", href: "/services/short-term-insurance", items: ["Cover for Business Assets and Property", "Cover for Vehicles, Gadgets and Household Items"] },
  { title: "Retirement Annuity", subtitle: "Plan for the Long Term", image: "/images/retirement.png", icon: "TrendingUp", theme: "blue", href: "/services/retirement-annuity", items: ["Long-Term Retirement Planning", "Secure Income for Retirement"] },
  { title: "Savings & Investment", subtitle: "Grow Your Wealth", image: "/images/savings-investment.png", icon: "Banknote", theme: "teal", href: "/services/savings-investment", items: ["Structured Savings Plans", "Guaranteed Growth Opportunities"] },
  { title: "Wills & Estates", subtitle: "Secure Your Legacy", image: "/images/wills-estates.jpg", icon: "Scroll", theme: "teal", href: "/services/wills-estates", items: ["Drafting and Updating of Wills", "Estate Planning and Administration", "Trust Formation", "Inheritance and Succession Planning"] },
];

const insurers = [
  { name: "Sanlam | Allianz", logo: "/images/partners/sanlam.svg", url: "https://www.sanlamallianz.com/en", darkBg: false },
  { name: "Santam", logo: "/images/partners/santam.svg", url: "https://www.santam.na/", darkBg: false },
  { name: "Old Mutual", logo: "/images/partners/old-mutual.svg", url: "https://www.oldmutual.com.na/", darkBg: false },
  { name: "Hollard", logo: "/images/partners/hollard.png", url: "https://www.hollard.com.na/", darkBg: false },
  { name: "PPS", logo: "/images/partners/pps.png", url: "https://www.pps.com.na/", darkBg: true },
];

const assetManagers = [
  { name: "SISEDI", logo: "/images/partners/sisedi.png", url: "https://sisedi.com.na/", darkBg: false },
  { name: "Capricorn Asset Management", logo: "/images/partners/capricorn.png", url: "https://www.cam.com.na/Pages/default.aspx", darkBg: false },
];

const slides = [
  { image: "/images/banners/life.jpg", label: "Life Insurance", alt: "Life Cover That Helps Protect What Matters Most from N$303 per month, up to N$3 million in cover", cta: "GET A QUOTE TODAY.", href: "/get-a-quote/life", external: false },
  { image: "/images/banners/car.jpg", label: "Car Insurance", alt: "Car Insurance That Keeps You Moving affordable premiums, 24/7 support and fast claims processing", cta: "Get a Quote Today", href: "/get-a-quote/vehicle", external: false },
  { image: "/images/banners/funeral.jpg", label: "Funeral Cover", alt: "Protect Your Family When It Matters Most funeral cover eases financial pressure for your loved ones", cta: "GET A QUOTE TODAY", href: "/get-a-quote/funeral", external: false },
  { image: "/images/banners/gap.jpg", label: "Medical Aid Gap Cover", alt: "Your Medical Aid Does Not Cover Everything Gap Cover helps pay hospital and specialist shortfalls", cta: "Find the right option for your needs. Talk to us today.", href: "/get-a-quote/gap-cover", external: false },
  { image: "/images/banners/investments.jpg", label: "Savings & Investments", alt: "Make Your Money Work smart savings and thoughtful investments designed for long-term goals", cta: "Let's Build Your Future", href: "/investments-enquiry", external: false },
  { image: "/images/banners/bundle.jpg", label: "Bundle & Save", alt: "Bundle Your Cover and Save More insure your home, car, gadgets and electronics together", cta: "GET YOUR QUOTE TODAY", href: "/get-a-quote/bundle", external: false },
  { image: "/images/banners/wills.jpg", label: "Wills & Estates", alt: "Plan Ahead for the People You Love a well-prepared Will and estate plan protects your family", cta: "Secure Your Legacy Today | Start Your Estate Plan", href: "/wills-estate-enquiry", external: false },
  { image: "/images/banners/whatsapp.jpg", label: "WhatsApp Channel", alt: "Smarter Insights Stronger Results stay ahead with fresh perspectives from Quantz Financial Services", cta: "Join Our WhatsApp Group", href: WHATSAPP_URL, external: true },
];

const settings = {
  phone: "+264 81 820 1522",
  email: "info@quantz.com.na",
  location: "Windhoek, Namibia",
  officeHours: "",
  whatsappUrl: WHATSAPP_URL,
  facebookUrl: "https://www.facebook.com/profile.php?id=61583774184552",
  instagramUrl: "https://www.instagram.com/quantz_financial_/",
  linkedinUrl: "",
};

async function seedCollection(collection: ContentCollection, rows: Record<string, unknown>[]) {
  const existing = await db
    .select({ id: contentItems.id })
    .from(contentItems)
    .where(eq(contentItems.collection, collection))
    .limit(1);
  if (existing[0]) {
    console.log(`[v0] ${collection}: already has data, skipping`);
    return;
  }
  await db.insert(contentItems).values(
    rows.map((data, index) => ({ collection, data, sortOrder: index, isActive: true })),
  );
  console.log(`[v0] ${collection}: seeded ${rows.length} items`);
}

async function main() {
  await seedCollection("services", services);
  await seedCollection("insurers", insurers);
  await seedCollection("asset_managers", assetManagers);
  await seedCollection("slides", slides);
  // Team starts empty — admins add staff profiles from the dashboard.

  const existingSettings = await db
    .select({ id: siteSettings.id })
    .from(siteSettings)
    .where(eq(siteSettings.id, "main"))
    .limit(1);
  if (!existingSettings[0]) {
    await db.insert(siteSettings).values({ id: "main", data: settings });
    console.log("[v0] site settings: seeded");
  } else {
    console.log("[v0] site settings: already set, skipping");
  }

  console.log("[v0] content seed complete");
  process.exit(0);
}

main().catch((err) => {
  console.error("[v0] content seed failed:", err);
  process.exit(1);
});
