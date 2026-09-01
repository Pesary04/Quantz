// Shared configuration for quote/enquiry forms and action pages.
// Single source of truth reused by the homepage vehicle form and the
// dedicated /get-a-quote/* action pages.

export const CONTACT_PHONE = "+264 81 820 1522";
export const CONTACT_PHONE_TEL = "tel:+264818201522";
export const CONTACT_EMAIL = "info@quantz.com.na";
export const WHATSAPP_URL = "https://whatsapp.com/channel/0029VbCRTzjB4hdVbtBM1V3s";
export const PAGE_FOOTER_LINE = `Prefer to talk? Call ${CONTACT_PHONE} or email ${CONTACT_EMAIL}`;

/* ----------------------------- Vehicle form ----------------------------- */

export type VehicleField = {
  name: keyof typeof EMPTY_VEHICLE;
  label: string;
  type?: string;
  placeholder?: string;
  options?: string[];
  textarea?: boolean;
  full?: boolean;
  required?: boolean;
};

export const EMPTY_VEHICLE = {
  dateOfBirth: "", idNumber: "", nationality: "", gender: "", maritalStatus: "",
  licenceYear: "", licenceCode: "", occupation: "", postalAddress: "", residentialAddress: "",
  email: "", makeModel: "", vehicleYear: "", vehicleDescription: "", engineCapacity: "",
  mmCode: "", vehicleValue: "", carHire: "", insuranceHistory: "", claimHistory: "",
};

export const VEHICLE_CLIENT_FIELDS: VehicleField[] = [
  { name: "dateOfBirth", label: "Date of Birth", type: "date" },
  { name: "idNumber", label: "ID Number", placeholder: "ID / Passport number", required: true },
  { name: "nationality", label: "Nationality", placeholder: "Namibian" },
  { name: "gender", label: "Gender", options: ["Male", "Female", "Other", "Prefer not to say"] },
  { name: "maritalStatus", label: "Marital Status", options: ["Single", "Married", "Divorced", "Widowed"] },
  { name: "licenceYear", label: "Licence Obtained (Year)", placeholder: "e.g. 2014" },
  { name: "licenceCode", label: "Licence Code", options: ["A", "A1", "B", "BE", "C", "C1", "CE", "C1E", "EB", "EC"] },
  { name: "occupation", label: "Occupation", placeholder: "e.g. Teacher" },
  { name: "email", label: "Email Address", type: "email", placeholder: "you@example.com", full: true },
  { name: "postalAddress", label: "Postal Address", placeholder: "P.O. Box 1234, Windhoek", full: true },
  { name: "residentialAddress", label: "Residential Address", placeholder: "Street, suburb, town", full: true },
];

export const VEHICLE_DETAIL_FIELDS: VehicleField[] = [
  { name: "makeModel", label: "Make & Model", placeholder: "e.g. Toyota Hilux 2.4 GD-6", full: true, required: true },
  { name: "vehicleYear", label: "Year", placeholder: "e.g. 2019" },
  { name: "engineCapacity", label: "Engine Capacity", placeholder: "e.g. 2400cc" },
  { name: "mmCode", label: "MM Code (if known)", placeholder: "Optional" },
  { name: "vehicleValue", label: "Value (Approximate)", placeholder: "e.g. N$ 350 000" },
  { name: "carHire", label: "Car Hire (if required)", options: ["Yes", "No"] },
  { name: "vehicleDescription", label: "Vehicle Description", placeholder: "Colour, condition, modifications, usage", textarea: true, full: true },
  { name: "insuranceHistory", label: "Insurance History", placeholder: "Current or previous insurer, years insured", textarea: true, full: true },
  { name: "claimHistory", label: "Claim History", placeholder: "Any claims in the last 5 years (or state 'None')", textarea: true, full: true },
];

/* --------------------------- Enquiry action pages --------------------------- */

export type EnquiryFieldType =
  | "text" | "tel" | "email" | "date" | "number" | "textarea" | "select" | "checkboxes";

export type EnquiryField = {
  name: string;
  label: string;
  type: EnquiryFieldType;
  required?: boolean;
  placeholder?: string;
  options?: string[];
};

export type ActionPageConfig = {
  slug: string;          // route path
  category: string;      // used in the email subject
  label: string;         // short chip label
  headline: string;
  body: string;          // supports \n line breaks and "• " bullets
  submitLabel: string;   // exact CTA/button text from the brief
  image: string;
  fields: EnquiryField[];
};

// Common lead fields required on every enquiry form.
const BASE_LEAD_FIELDS: EnquiryField[] = [
  { name: "fullName", label: "Full Name", type: "text", required: true, placeholder: "Your full name" },
  { name: "phone", label: "Phone Number", type: "tel", required: true, placeholder: "+264 ..." },
  { name: "email", label: "Email Address", type: "email", required: true, placeholder: "you@example.com" },
];

export const ACTION_PAGES: Record<string, ActionPageConfig> = {
  life: {
    slug: "/get-a-quote/life",
    category: "Life Cover",
    label: "Life Cover",
    headline: "Life Cover That Helps Protect What Matters Most",
    body:
      "Life cover can help provide for the people who depend on you.\n\nFrom competitive monthly premiums, you can explore cover options subject to underwriting and terms.\n\nTell us a little about what you need and we will get in touch with suitable options.",
    submitLabel: "Get a Quote Today",
    image: "/images/banners/life.jpg",
    fields: [
      ...BASE_LEAD_FIELDS,
      { name: "dateOfBirth", label: "Date of Birth", type: "date" },
      { name: "coverAmount", label: "Cover amount interested in", type: "text", placeholder: "e.g. N$500,000 / N$1m / not sure" },
      { name: "dependents", label: "Number of dependents", type: "number", placeholder: "e.g. 3" },
      { name: "message", label: "Message / notes", type: "textarea", placeholder: "Anything else we should know?" },
    ],
  },
  "gap-cover": {
    slug: "/get-a-quote/gap-cover",
    category: "Gap Cover",
    label: "Gap Cover",
    headline: "Your Medical Aid Does Not Cover Everything",
    body:
      "Gap Cover helps pay the shortfall when hospital and specialist bills exceed what your medical aid covers.\n\nShare your details below and we will help you find an option that fits your medical aid and needs.\n\nAccepted schemes include (among others): NHP, NMC, RMA, NAPOTEL, Nammed, GemHealth.",
    submitLabel: "Talk to us today",
    image: "/images/banners/gap.jpg",
    fields: [
      ...BASE_LEAD_FIELDS,
      { name: "medicalScheme", label: "Current Medical Aid Scheme", type: "select", required: true, options: ["NHP", "NMC", "RMA", "NAPOTEL", "Nammed", "GemHealth", "Other"] },
      { name: "message", label: "Message / notes", type: "textarea", placeholder: "Anything else we should know?" },
    ],
  },
  funeral: {
    slug: "/get-a-quote/funeral",
    category: "Funeral Cover",
    label: "Funeral Cover",
    headline: "Protect Your Family When It Matters Most",
    body:
      "Funeral cover can help ease financial pressure and give your loved ones one less thing to worry about.\n\nComplete the form below and we will contact you with suitable funeral cover options.",
    submitLabel: "Get a Quote Today",
    image: "/images/banners/funeral.jpg",
    fields: [
      ...BASE_LEAD_FIELDS,
      { name: "whoCovered", label: "Who should be covered", type: "text", placeholder: "Self / family members" },
      { name: "message", label: "Message / notes", type: "textarea", placeholder: "Anything else we should know?" },
    ],
  },
  bundle: {
    slug: "/get-a-quote/bundle",
    category: "Bundle & Save",
    label: "Bundle & Save",
    headline: "Bundle Your Cover and Save More",
    body:
      "Insure your home, car, gadgets and electronics together to help lower your premiums.\n\nTell us what you would like to bundle and we will come back with options.",
    submitLabel: "Get Your Quote Today",
    image: "/images/banners/bundle.jpg",
    fields: [
      ...BASE_LEAD_FIELDS,
      { name: "bundleItems", label: "What do you want to bundle?", type: "checkboxes", required: true, options: ["Home", "Car", "Gadgets", "Electronics", "Other"] },
      { name: "message", label: "Message / notes", type: "textarea", placeholder: "Anything else we should know?" },
    ],
  },
  "wills-estate": {
    slug: "/wills-estate-enquiry",
    category: "Wills & Estate",
    label: "Wills & Estate",
    headline: "Plan Ahead for the People You Love",
    body:
      "A well-prepared Will and estate plan helps ensure your assets are distributed smoothly, with less stress for your family.\n\nLeave your details below and we will get in touch to guide you on the next steps.",
    submitLabel: "Start Your Estate Plan",
    image: "/images/banners/wills.jpg",
    fields: [
      ...BASE_LEAD_FIELDS,
      { name: "preferredTime", label: "Preferred contact time", type: "text", placeholder: "e.g. Weekday mornings" },
      { name: "message", label: "Message / notes", type: "textarea", placeholder: "Anything else we should know?" },
    ],
  },
  investments: {
    slug: "/investments-enquiry",
    category: "Investments",
    label: "Investments",
    headline: "Make Your Money Work",
    body:
      "Smart savings. Thoughtful investments. Designed for long-term goals.\n\nShare your details and we will contact you to discuss options that fit your goals.",
    submitLabel: "Let's Build Your Future",
    image: "/images/banners/investments.jpg",
    fields: [
      ...BASE_LEAD_FIELDS,
      { name: "goal", label: "Goal (optional)", type: "text", placeholder: "e.g. retirement, savings, wealth" },
      { name: "message", label: "Message / notes", type: "textarea", placeholder: "Anything else we should know?" },
    ],
  },
};
