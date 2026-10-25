export type IndustryType =
  | "professional"
  | "beauty"
  | "real_estate"
  | "creative"
  | "local_business"
  | "creator";

export interface ProfileThemeConfig {
  primaryColor: string;
  accentColor: string;
  backgroundColor: string;
  textColor: string;
  fontFamily: "inter" | "outfit" | "serif" | "mono";
  cardStyle: "glass" | "solid" | "bordered" | "minimal";
  avatarShape: "circle" | "rounded" | "squircle";
}

export interface HeaderBlockData {
  avatarUrl?: string;
  coverUrl?: string;
  logoUrl?: string;
  name: string;
  title: string;
  company?: string;
  badge?: string;
}

export interface ContactActionsBlockData {
  phone?: string;
  email?: string;
  whatsapp?: string;
  websiteUrl?: string;
  location?: string;
}

export interface AboutBlockData {
  headline?: string;
  bio: string;
  highlights?: string[];
}

export interface SocialLinkItem {
  id: string;
  platform: "linkedin" | "instagram" | "twitter" | "github" | "youtube" | "facebook" | "whatsapp" | "tiktok";
  url: string;
  label?: string;
}

export interface ServiceItem {
  id: string;
  title: string;
  description?: string;
  price?: string;
  duration?: string;
}

export interface PortfolioItem {
  id: string;
  title: string;
  description?: string;
  imageUrl: string;
  linkUrl?: string;
}

export interface BeautyfolioBlockData {
  portfolioUrl?: string;
  handle?: string;
  headline?: string;
  featuredSpecialty?: string;
}

export interface LocationBlockData {
  address: string;
  city?: string;
  mapUrl?: string;
  hours?: Array<{ day: string; time: string }>;
}

export interface LeadFormConfigData {
  title: string;
  subtitle?: string;
  buttonLabel?: string;
  requireEmail?: boolean;
  services?: string[];
}

export interface ProfileBlockItem {
  id: string;
  type:
    | "identity_header"
    | "contact_actions"
    | "about"
    | "social_links"
    | "services"
    | "portfolio_gallery"
    | "beautyfolio"
    | "location"
    | "lead_form"
    | "primary_cta";
  isEnabled: boolean;
  sortOrder: number;
  blockData: Record<string, any>;
}

export interface FullProfileSnapshot {
  id: string;
  slug: string;
  name: string;
  title?: string;
  bio?: string;
  industry: IndustryType;
  templateId: string;
  themeConfig: ProfileThemeConfig;
  blocks: ProfileBlockItem[];
  searchIndexed: boolean;
}
