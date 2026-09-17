import type { ContentCollection } from "@/lib/admin-api";
import { ICON_OPTIONS, THEME_OPTIONS } from "@/lib/site-content";

export type FieldType = "text" | "textarea" | "image" | "url" | "list" | "boolean" | "select";

export interface FieldConfig {
  key: string;
  label: string;
  type: FieldType;
  options?: string[];
  placeholder?: string;
  help?: string;
  default?: unknown;
}

export interface CollectionConfig {
  collection: ContentCollection;
  title: string;
  singular: string;
  description: string;
  /** Field whose value labels each row in the list. */
  primaryKey: string;
  /** Field holding an image URL, shown as a thumbnail. */
  imageKey?: string;
  fields: FieldConfig[];
}

export const COLLECTION_CONFIGS: Record<ContentCollection, CollectionConfig> = {
  services: {
    collection: "services",
    title: "Services",
    singular: "Service",
    description: "The insurance and financial product cards shown on the homepage.",
    primaryKey: "title",
    imageKey: "image",
    fields: [
      { key: "title", label: "Title", type: "text", placeholder: "Life Insurance" },
      { key: "subtitle", label: "Subtitle", type: "text", placeholder: "Protect Your Family's Future" },
      { key: "image", label: "Card image", type: "image" },
      { key: "icon", label: "Icon", type: "select", options: ICON_OPTIONS, default: "Shield" },
      { key: "theme", label: "Colour theme", type: "select", options: THEME_OPTIONS, default: "blue" },
      { key: "href", label: "Link (URL path)", type: "text", placeholder: "/services/life-insurance", help: "Where the card links to when clicked." },
      { key: "items", label: "Bullet points", type: "list", help: "One point per line." },
    ],
  },
  insurers: {
    collection: "insurers",
    title: "Leading Insurers",
    singular: "Insurer",
    description: "Insurer partner logos shown under \u201CNamibia's Leading Insurers\u201D.",
    primaryKey: "name",
    imageKey: "logo",
    fields: [
      { key: "name", label: "Name", type: "text", placeholder: "Santam" },
      { key: "logo", label: "Logo", type: "image" },
      { key: "url", label: "Website", type: "url", placeholder: "https://…" },
      { key: "darkBg", label: "Dark background (for light logos)", type: "boolean" },
    ],
  },
  asset_managers: {
    collection: "asset_managers",
    title: "Asset Management Partners",
    singular: "Partner",
    description: "Asset management partner logos shown under \u201CAlso Partnering With\u201D.",
    primaryKey: "name",
    imageKey: "logo",
    fields: [
      { key: "name", label: "Name", type: "text", placeholder: "Capricorn Asset Management" },
      { key: "logo", label: "Logo", type: "image" },
      { key: "url", label: "Website", type: "url", placeholder: "https://…" },
      { key: "darkBg", label: "Dark background (for light logos)", type: "boolean" },
    ],
  },
  slides: {
    collection: "slides",
    title: "Featured Solutions Slideshow",
    singular: "Slide",
    description: "The rotating banner slideshow in the \u201CFeatured Solutions\u201D strip.",
    primaryKey: "label",
    imageKey: "image",
    fields: [
      { key: "image", label: "Banner image", type: "image" },
      { key: "label", label: "Label", type: "text", placeholder: "Life Insurance" },
      { key: "alt", label: "Image description (accessibility)", type: "textarea" },
      { key: "cta", label: "Button text", type: "text", placeholder: "Get a Quote Today" },
      { key: "href", label: "Button link", type: "text", placeholder: "/get-a-quote/life" },
      { key: "external", label: "Opens in a new tab (external link)", type: "boolean" },
    ],
  },
  team: {
    collection: "team",
    title: "Team Members",
    singular: "Team member",
    description: "Staff profiles shown in the \u201CMeet the Team\u201D section on the homepage.",
    primaryKey: "name",
    imageKey: "image",
    fields: [
      { key: "name", label: "Full name", type: "text", placeholder: "Selma Hiskia Mwatotele" },
      { key: "role", label: "Role / title", type: "text", placeholder: "Managing Director" },
      { key: "image", label: "Photo", type: "image" },
      { key: "bio", label: "Short bio", type: "textarea" },
    ],
  },
};

/** Build an empty data object for a new item from its field defaults. */
export function emptyData(config: CollectionConfig): Record<string, unknown> {
  const data: Record<string, unknown> = {};
  for (const f of config.fields) {
    if (f.default !== undefined) data[f.key] = f.default;
    else if (f.type === "list") data[f.key] = [];
    else if (f.type === "boolean") data[f.key] = false;
    else data[f.key] = "";
  }
  return data;
}
