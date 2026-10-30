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
  category?: string;
  tagline?: string;
}

export interface ContactActionsBlockData {
  phone?: string;
  email?: string;
  whatsapp?: string;
  websiteUrl?: string;
  bookingUrl?: string;
  location?: string;
}

export interface HighlightStatItem {
  id: string;
  label: string;
  value: string;
  icon?: "trophy" | "users" | "calendar" | "award" | "star" | "clock" | "briefcase" | string;
}

export interface HighlightsBlockData {
  stats: HighlightStatItem[];
}

export interface AboutBlockData {
  headline?: string;
  bio: string;
  highlights?: string[];
  imageUrl?: string;
}

export interface SocialLinkItem {
  id: string;
  platform:
    | "linkedin"
    | "instagram"
    | "twitter"
    | "github"
    | "youtube"
    | "facebook"
    | "whatsapp"
    | "tiktok"
    | "google_review"
    | "telegram"
    | "website"
    | string;
  url: string;
  label?: string;
}

export interface ServiceItem {
  id: string;
  title: string;
  description?: string;
  price?: string;
  duration?: string;
  imageUrl?: string;
  category?: string;
}

export interface PortfolioItem {
  id: string;
  title: string;
  description?: string;
  imageUrl: string;
  projectUrl?: string;
  linkUrl?: string;
  category?: string;
  videoUrl?: string;
}

export interface TestimonialItem {
  id: string;
  clientName: string;
  clientTitle?: string;
  avatarUrl?: string;
  rating: number; // 1 to 5
  content: string;
}

export interface TestimonialsBlockData {
  items: TestimonialItem[];
}

export interface CertificationItem {
  id: string;
  title: string;
  issuer: string;
  year?: string;
  credentialUrl?: string;
  badgeUrl?: string;
}

export interface CertificationsBlockData {
  items: CertificationItem[];
}

export interface IntroVideoBlockData {
  videoUrl?: string;
  title?: string;
  thumbnailUrl?: string;
  description?: string;
}

export interface DownloadResourceItem {
  id: string;
  title: string;
  fileUrl: string;
  fileType: "pdf" | "doc" | "image" | "zip" | string;
  fileSize?: string;
  description?: string;
}

export interface DownloadsBlockData {
  items: DownloadResourceItem[];
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

export interface FaqBlockData {
  items: FaqItem[];
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
    | "highlights"
    | "about"
    | "social_links"
    | "services"
    | "portfolio_gallery"
    | "testimonials"
    | "certifications"
    | "intro_video"
    | "downloads"
    | "faq"
    | "beautyfolio"
    | "location"
    | "lead_form"
    | "primary_cta"
    | string;
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
