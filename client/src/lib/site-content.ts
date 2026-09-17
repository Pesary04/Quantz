import { useQuery } from "@tanstack/react-query";
import {
  Shield, ShieldCheck, PiggyBank, Briefcase, HeartPulse, Car, TrendingUp,
  Banknote, Scroll, Users, Award, Globe, Home, Heart, Umbrella, Wallet,
  type LucideIcon,
} from "lucide-react";

/* --------------------------- Shared field maps --------------------------- */

export const SERVICE_ICONS: Record<string, LucideIcon> = {
  Shield, ShieldCheck, PiggyBank, Briefcase, HeartPulse, Car, TrendingUp,
  Banknote, Scroll, Users, Award, Globe, Home, Heart, Umbrella, Wallet,
};

export const ICON_OPTIONS = Object.keys(SERVICE_ICONS);

export function serviceIcon(name?: string): LucideIcon {
  return SERVICE_ICONS[name ?? ""] ?? Shield;
}

export interface ServiceTheme {
  color: string; // gradient bar
  iconColor: string;
  bg: string;
}

export const SERVICE_THEMES: Record<string, ServiceTheme> = {
  blue: { color: "from-blue-500 to-blue-700", iconColor: "text-blue-600", bg: "bg-blue-100" },
  indigo: { color: "from-indigo-500 to-indigo-700", iconColor: "text-indigo-600", bg: "bg-indigo-100" },
  violet: { color: "from-violet-500 to-violet-700", iconColor: "text-violet-600", bg: "bg-violet-100" },
  sky: { color: "from-sky-500 to-sky-700", iconColor: "text-sky-600", bg: "bg-sky-100" },
  cyan: { color: "from-cyan-500 to-cyan-700", iconColor: "text-cyan-600", bg: "bg-cyan-100" },
  teal: { color: "from-teal-500 to-blue-600", iconColor: "text-teal-600", bg: "bg-teal-100" },
};

export const THEME_OPTIONS = Object.keys(SERVICE_THEMES);

export function serviceTheme(name?: string): ServiceTheme {
  return SERVICE_THEMES[name ?? ""] ?? SERVICE_THEMES.blue;
}

/* ------------------------------ Data shapes ------------------------------ */

export interface ServiceData {
  title: string;
  subtitle: string;
  image: string;
  icon: string;
  theme: string;
  href: string;
  items: string[];
}

export interface PartnerData {
  name: string;
  logo: string;
  url: string;
  darkBg: boolean;
}

export interface SlideData {
  image: string;
  label: string;
  alt: string;
  cta: string;
  href: string;
  external: boolean;
}

export interface TeamData {
  name: string;
  role: string;
  image: string;
  bio: string;
}

export interface SiteSettingsData {
  phone: string;
  email: string;
  location: string;
  officeHours: string;
  whatsappUrl: string;
  facebookUrl: string;
  instagramUrl: string;
  linkedinUrl: string;
}

interface RawItem {
  data: Record<string, unknown>;
}

/* ------------------------------- Fallbacks ------------------------------- */

const WHATSAPP_URL = "https://whatsapp.com/channel/0029VbCRTzjB4hdVbtBM1V3s";

export const FALLBACK_SERVICES: ServiceData[] = [
  { title: "Life Insurance", subtitle: "Protect Your Family's Future", image: "/images/life-insurance.png", icon: "Shield", theme: "blue", href: "/services/life-insurance", items: ["Life Cover", "Critical Illness Cover", "Disability Protection", "Death Benefits for Family Security"] },
  { title: "Pension Fund for Individuals", subtitle: "Secure Your Personal Retirement", image: "/images/retirement.png", icon: "PiggyBank", theme: "indigo", href: "/services/pension-fund-individuals", items: ["Flexible Contribution Options", "Tax-Efficient Retirement Savings", "Guaranteed Income in Retirement", "Easy Access to Your Funds When Needed"] },
  { title: "Pension Fund for Groups", subtitle: "Employee Pension Fund Solutions", image: "/images/pension-fund-groups.jpg", icon: "Briefcase", theme: "violet", href: "/services/pension-fund-groups", items: ["Group Pension Fund Administration", "Customised Fund Rules for Your Company", "Competitive Investment Options", "Full Compliance and Regulatory Support"] },
  { title: "Medical Aid Gap Cover", subtitle: "Comprehensive Health Cover", image: "/images/medical-aid.png", icon: "HeartPulse", theme: "sky", href: "/services/medical-aid", items: ["Fill Gaps in Existing Medical Cover", "Flexible Gap Options for Peace of Mind"] },
  { title: "Short-term Insurance", subtitle: "Protect Your Assets", image: "/images/short-term-insurance.png", icon: "Car", theme: "cyan", href: "/services/short-term-insurance", items: ["Cover for Business Assets and Property", "Cover for Vehicles, Gadgets and Household Items"] },
  { title: "Retirement Annuity", subtitle: "Plan for the Long Term", image: "/images/retirement.png", icon: "TrendingUp", theme: "blue", href: "/services/retirement-annuity", items: ["Long-Term Retirement Planning", "Secure Income for Retirement"] },
  { title: "Savings & Investment", subtitle: "Grow Your Wealth", image: "/images/savings-investment.png", icon: "Banknote", theme: "teal", href: "/services/savings-investment", items: ["Structured Savings Plans", "Guaranteed Growth Opportunities"] },
  { title: "Wills & Estates", subtitle: "Secure Your Legacy", image: "/images/wills-estates.jpg", icon: "Scroll", theme: "teal", href: "/services/wills-estates", items: ["Drafting and Updating of Wills", "Estate Planning and Administration", "Trust Formation", "Inheritance and Succession Planning"] },
];

export const FALLBACK_INSURERS: PartnerData[] = [
  { name: "Sanlam | Allianz", logo: "/images/partners/sanlam.svg", url: "https://www.sanlamallianz.com/en", darkBg: false },
  { name: "Santam", logo: "/images/partners/santam.svg", url: "https://www.santam.na/", darkBg: false },
  { name: "Old Mutual", logo: "/images/partners/old-mutual.svg", url: "https://www.oldmutual.com.na/", darkBg: false },
  { name: "Hollard", logo: "/images/partners/hollard.png", url: "https://www.hollard.com.na/", darkBg: false },
  { name: "PPS", logo: "/images/partners/pps.png", url: "https://www.pps.com.na/", darkBg: true },
];

export const FALLBACK_ASSET_MANAGERS: PartnerData[] = [
  { name: "SISEDI", logo: "/images/partners/sisedi.png", url: "https://sisedi.com.na/", darkBg: false },
  { name: "Capricorn Asset Management", logo: "/images/partners/capricorn.png", url: "https://www.cam.com.na/Pages/default.aspx", darkBg: false },
];

export const FALLBACK_SLIDES: SlideData[] = [
  { image: "/images/banners/life.jpg", label: "Life Insurance", alt: "Life Cover That Helps Protect What Matters Most", cta: "GET A QUOTE TODAY.", href: "/get-a-quote/life", external: false },
  { image: "/images/banners/car.jpg", label: "Car Insurance", alt: "Car Insurance That Keeps You Moving", cta: "Get a Quote Today", href: "/get-a-quote/vehicle", external: false },
  { image: "/images/banners/funeral.jpg", label: "Funeral Cover", alt: "Protect Your Family When It Matters Most", cta: "GET A QUOTE TODAY", href: "/get-a-quote/funeral", external: false },
  { image: "/images/banners/gap.jpg", label: "Medical Aid Gap Cover", alt: "Your Medical Aid Does Not Cover Everything", cta: "Find the right option for your needs. Talk to us today.", href: "/get-a-quote/gap-cover", external: false },
  { image: "/images/banners/investments.jpg", label: "Savings & Investments", alt: "Make Your Money Work", cta: "Let's Build Your Future", href: "/investments-enquiry", external: false },
  { image: "/images/banners/bundle.jpg", label: "Bundle & Save", alt: "Bundle Your Cover and Save More", cta: "GET YOUR QUOTE TODAY", href: "/get-a-quote/bundle", external: false },
  { image: "/images/banners/wills.jpg", label: "Wills & Estates", alt: "Plan Ahead for the People You Love", cta: "Secure Your Legacy Today | Start Your Estate Plan", href: "/wills-estate-enquiry", external: false },
  { image: "/images/banners/whatsapp.jpg", label: "WhatsApp Channel", alt: "Smarter Insights Stronger Results", cta: "Join Our WhatsApp Group", href: WHATSAPP_URL, external: true },
];

export const DEFAULT_SETTINGS: SiteSettingsData = {
  phone: "+264 81 820 1522",
  email: "info@quantz.com.na",
  location: "Windhoek, Namibia",
  officeHours: "",
  whatsappUrl: WHATSAPP_URL,
  facebookUrl: "https://www.facebook.com/profile.php?id=61583774184552",
  instagramUrl: "https://www.instagram.com/quantz_financial_/",
  linkedinUrl: "",
};

/* --------------------------- Coercion helpers ---------------------------- */

const str = (v: unknown, fallback = ""): string => (typeof v === "string" ? v : fallback);
const bool = (v: unknown): boolean => v === true;
const strArr = (v: unknown): string[] =>
  Array.isArray(v) ? v.filter((x): x is string => typeof x === "string") : [];

function toService(d: Record<string, unknown>): ServiceData {
  return {
    title: str(d.title), subtitle: str(d.subtitle), image: str(d.image),
    icon: str(d.icon, "Shield"), theme: str(d.theme, "blue"), href: str(d.href),
    items: strArr(d.items),
  };
}
function toPartner(d: Record<string, unknown>): PartnerData {
  return { name: str(d.name), logo: str(d.logo), url: str(d.url), darkBg: bool(d.darkBg) };
}
function toSlide(d: Record<string, unknown>): SlideData {
  return {
    image: str(d.image), label: str(d.label), alt: str(d.alt),
    cta: str(d.cta), href: str(d.href), external: bool(d.external),
  };
}
function toTeam(d: Record<string, unknown>): TeamData {
  return { name: str(d.name), role: str(d.role), image: str(d.image), bio: str(d.bio) };
}

/* -------------------------------- Hooks ---------------------------------- */

export interface SiteContent {
  services: ServiceData[];
  insurers: PartnerData[];
  assetManagers: PartnerData[];
  slides: SlideData[];
  team: TeamData[];
}

async function fetchPublicContent(): Promise<SiteContent> {
  const res = await fetch("/api/content");
  if (!res.ok) throw new Error("content");
  const body = (await res.json()) as { content: Record<string, RawItem[]> };
  const c = body.content ?? {};
  return {
    services: (c.services ?? []).map((i) => toService(i.data)),
    insurers: (c.insurers ?? []).map((i) => toPartner(i.data)),
    assetManagers: (c.asset_managers ?? []).map((i) => toPartner(i.data)),
    slides: (c.slides ?? []).map((i) => toSlide(i.data)),
    team: (c.team ?? []).map((i) => toTeam(i.data)),
  };
}

const FALLBACK_CONTENT: SiteContent = {
  services: FALLBACK_SERVICES,
  insurers: FALLBACK_INSURERS,
  assetManagers: FALLBACK_ASSET_MANAGERS,
  slides: FALLBACK_SLIDES,
  team: [],
};

/**
 * Returns editable site content. Falls back to the values the site shipped
 * with if the request fails, so the public pages never break.
 */
export function useSiteContent(): SiteContent {
  const { data, isError } = useQuery<SiteContent>({
    queryKey: ["/api/content"],
    queryFn: fetchPublicContent,
    staleTime: 60_000,
  });
  if (isError || !data) return FALLBACK_CONTENT;
  // Guard against an empty database wiping a core section.
  return {
    services: data.services.length ? data.services : FALLBACK_SERVICES,
    insurers: data.insurers.length ? data.insurers : FALLBACK_INSURERS,
    assetManagers: data.assetManagers.length ? data.assetManagers : FALLBACK_ASSET_MANAGERS,
    slides: data.slides.length ? data.slides : FALLBACK_SLIDES,
    team: data.team,
  };
}

async function fetchPublicSettings(): Promise<SiteSettingsData> {
  const res = await fetch("/api/site-settings");
  if (!res.ok) throw new Error("settings");
  const body = (await res.json()) as { settings: Partial<SiteSettingsData> };
  return { ...DEFAULT_SETTINGS, ...(body.settings ?? {}) };
}

export function useSiteSettings(): SiteSettingsData {
  const { data, isError } = useQuery<SiteSettingsData>({
    queryKey: ["/api/site-settings"],
    queryFn: fetchPublicSettings,
    staleTime: 60_000,
  });
  if (isError || !data) return DEFAULT_SETTINGS;
  return data;
}

/** Strip spaces from a phone number for a tel: href. */
export function telHref(phone: string): string {
  return `tel:${phone.replace(/\s+/g, "")}`;
}
