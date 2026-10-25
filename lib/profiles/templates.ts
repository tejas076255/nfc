import { IndustryType, ProfileThemeConfig, ProfileBlockItem } from "./types";

export interface TemplateDefinition {
  id: string;
  industry: IndustryType;
  name: string;
  tagline: string;
  description: string;
  defaultTheme: ProfileThemeConfig;
  defaultBlocks: ProfileBlockItem[];
}

export const INDUSTRY_TEMPLATES: Record<IndustryType, TemplateDefinition> = {
  professional: {
    id: "corporate_slate",
    industry: "professional",
    name: "Executive Suite",
    tagline: "Corporate, Legal & Advisory",
    description: "Tailored for consultants, lawyers, executives, and financial advisors.",
    defaultTheme: {
      primaryColor: "#0f172a", // Slate 900
      accentColor: "#2563eb", // Royal Blue
      backgroundColor: "#090d16",
      textColor: "#f8fafc",
      fontFamily: "outfit",
      cardStyle: "glass",
      avatarShape: "rounded",
    },
    defaultBlocks: [
      {
        id: "b_head",
        type: "identity_header",
        isEnabled: true,
        sortOrder: 0,
        blockData: {
          name: "Siddharth Mehta",
          title: "Senior Corporate Counsel",
          company: "Vertex Legal Advisory",
          badge: "Verified Practitioner",
          avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80",
          coverUrl: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&auto=format&fit=crop&q=80",
        },
      },
      {
        id: "b_contact",
        type: "contact_actions",
        isEnabled: true,
        sortOrder: 1,
        blockData: {
          phone: "+91 98201 12345",
          email: "siddharth@vertexlegal.in",
          whatsapp: "+919820112345",
          websiteUrl: "https://vertexlegal.in",
          location: "Nariman Point, Mumbai",
        },
      },
      {
        id: "b_about",
        type: "about",
        isEnabled: true,
        sortOrder: 2,
        blockData: {
          headline: "Specializing in Cross-Border M&A and Strategic Regulatory Compliance",
          bio: "14+ years advising tier-1 tech firms and private equity groups through capital restructuring, commercial contracts, and institutional dispute resolution.",
          highlights: ["Bar Council of Maharashtra & Goa", "M&A Advisor of the Year 2025", "150+ Closed Transactions"],
        },
      },
      {
        id: "b_services",
        type: "services",
        isEnabled: true,
        sortOrder: 3,
        blockData: {
          items: [
            { id: "s1", title: "M&A Due Diligence", description: "Comprehensive regulatory risk audit and risk mitigation strategy.", price: "₹50,000" },
            { id: "s2", title: "Commercial Contract Review", description: "Full draft and negotiation markup within 48 business hours.", price: "₹25,000" },
            { id: "s3", title: "Retainer Advisory", description: "Continuous on-call counsel for startups & growing enterprises.", price: "Custom" },
          ],
        },
      },
      {
        id: "b_socials",
        type: "social_links",
        isEnabled: true,
        sortOrder: 4,
        blockData: {
          links: [
            { id: "soc1", platform: "linkedin", url: "https://linkedin.com" },
            { id: "soc2", platform: "twitter", url: "https://x.com" },
          ],
        },
      },
      {
        id: "b_lead",
        type: "lead_form",
        isEnabled: true,
        sortOrder: 5,
        blockData: {
          title: "Book a Confidential Consultation",
          subtitle: "Leave your contact details and I will reach out within 2 business hours.",
          buttonLabel: "Request Callback",
          requireEmail: true,
          services: ["M&A Due Diligence", "Contract Review", "General Advisory"],
        },
      },
    ],
  },

  beauty: {
    id: "luxury_rose",
    industry: "beauty",
    name: "Luxury Atelier",
    tagline: "Bridal, Makeup, Hair & Wellness",
    description: "Designed for celebrity makeup artists, salon directors, and estheticians.",
    defaultTheme: {
      primaryColor: "#1c1417",
      accentColor: "#e11d48", // Rose Red
      backgroundColor: "#0d090a",
      textColor: "#fff1f2",
      fontFamily: "serif",
      cardStyle: "glass",
      avatarShape: "circle",
    },
    defaultBlocks: [
      {
        id: "b_head",
        type: "identity_header",
        isEnabled: true,
        sortOrder: 0,
        blockData: {
          name: "Aanya Sen",
          title: "Celebrity Bridal & Editorial Artist",
          company: "Aanya Sen Beauty Atelier",
          badge: "Featured in Vogue India",
          avatarUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&auto=format&fit=crop&q=80",
          coverUrl: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=1200&auto=format&fit=crop&q=80",
        },
      },
      {
        id: "b_contact",
        type: "contact_actions",
        isEnabled: true,
        sortOrder: 1,
        blockData: {
          phone: "+91 97110 56789",
          email: "bookings@aanyasenbeauty.com",
          whatsapp: "+919711056789",
          websiteUrl: "https://aanyasenbeauty.com",
          location: "Bandra West, Mumbai",
        },
      },
      {
        id: "b_beautyfolio",
        type: "beautyfolio",
        isEnabled: true,
        sortOrder: 2,
        blockData: {
          portfolioUrl: "https://beautyfolio.in/aanyasen",
          handle: "@aanyasen",
          headline: "Explore 40+ Verified Bridal & Editorial Transformations",
          featuredSpecialty: "HD Airbrush & Royal Bridal Glamour",
        },
      },
      {
        id: "b_portfolio",
        type: "portfolio_gallery",
        isEnabled: true,
        sortOrder: 3,
        blockData: {
          items: [
            { id: "p1", title: "Royal Udaipur Wedding", imageUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=80" },
            { id: "p2", title: "Vogue India Couture Shoot", imageUrl: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=500&auto=format&fit=crop&q=80" },
            { id: "p3", title: "Glass Skin Editorial", imageUrl: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=500&auto=format&fit=crop&q=80" },
          ],
        },
      },
      {
        id: "b_services",
        type: "services",
        isEnabled: true,
        sortOrder: 4,
        blockData: {
          items: [
            { id: "s1", title: "Bridal Signature Package", description: "Includes trials, HD airbrush, draping, and customized lashes.", price: "₹45,000" },
            { id: "s2", title: "Sangeet & Cocktail Glam", description: "Long-wear waterproof glam with sculpted contouring.", price: "₹20,000" },
          ],
        },
      },
      {
        id: "b_lead",
        type: "lead_form",
        isEnabled: true,
        sortOrder: 5,
        blockData: {
          title: "Reserve Wedding Date",
          subtitle: "Dates for wedding season 2026-2027 are limited. Check availability instantly.",
          buttonLabel: "Check Availability",
          requireEmail: true,
          services: ["Bridal Signature Package", "Sangeet & Cocktail Glam", "Editorial / Fashion Campaign"],
        },
      },
    ],
  },

  real_estate: {
    id: "modern_emerald",
    industry: "real_estate",
    name: "Architectural Horizon",
    tagline: "Luxury Properties & Developments",
    description: "Built for real estate brokers, developers, and premium property consultants.",
    defaultTheme: {
      primaryColor: "#064e3b", // Emerald 900
      accentColor: "#10b981", // Emerald 500
      backgroundColor: "#022c22",
      textColor: "#ecfdf5",
      fontFamily: "outfit",
      cardStyle: "bordered",
      avatarShape: "squircle",
    },
    defaultBlocks: [
      {
        id: "b_head",
        type: "identity_header",
        isEnabled: true,
        sortOrder: 0,
        blockData: {
          name: "Rohan Varma",
          title: "Principal Luxury Property Advisor",
          company: "Varma Estates & Investments",
          badge: "RERA Registered: A51900028192",
          avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80",
          coverUrl: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&auto=format&fit=crop&q=80",
        },
      },
      {
        id: "b_contact",
        type: "contact_actions",
        isEnabled: true,
        sortOrder: 1,
        blockData: {
          phone: "+91 98800 33445",
          email: "rohan@varmaestates.com",
          whatsapp: "+919880033445",
          websiteUrl: "https://varmaestates.com",
          location: "Indiranagar, Bengaluru",
        },
      },
      {
        id: "b_about",
        type: "about",
        isEnabled: true,
        sortOrder: 2,
        blockData: {
          headline: "Direct Access to Bengaluru's Most Exclusive Penthouses & Villas",
          bio: "Specializing in prime residential acquisitions, high-yield commercial REIT assets, and bespoke off-market private estates across North Bangalore & Central CBD.",
          highlights: ["₹400 Cr+ Transaction Volume", "Exclusive Developer Mandates", "Full Legal Title Due Diligence"],
        },
      },
      {
        id: "b_portfolio",
        type: "portfolio_gallery",
        isEnabled: true,
        sortOrder: 3,
        blockData: {
          items: [
            { id: "p1", title: "The Sky Villa, Koramangala", description: "5BHK Penthouse with private infinity pool. ₹14.5 Cr", imageUrl: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=500&auto=format&fit=crop&q=80" },
            { id: "p2", title: "Botanical Estates, North Blr", description: "Gated 1-acre landscaped villa. ₹8.2 Cr", imageUrl: "https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=500&auto=format&fit=crop&q=80" },
          ],
        },
      },
      {
        id: "b_lead",
        type: "lead_form",
        isEnabled: true,
        sortOrder: 4,
        blockData: {
          title: "Request Private Brochure & Site Visit",
          subtitle: "Get floor plans, price breakdowns, and private viewing schedules.",
          buttonLabel: "Request Brochure",
          requireEmail: true,
          services: ["Penthouse Viewing", "Gated Villa", "Commercial Investment"],
        },
      },
    ],
  },

  creative: {
    id: "neo_monochrome",
    industry: "creative",
    name: "Neo Gallery",
    tagline: "Design, Photography & Art Direction",
    description: "High-contrast visual portfolio for designers, photographers, and studios.",
    defaultTheme: {
      primaryColor: "#000000",
      accentColor: "#6366f1", // Indigo
      backgroundColor: "#09090b",
      textColor: "#fafafa",
      fontFamily: "outfit",
      cardStyle: "minimal",
      avatarShape: "rounded",
    },
    defaultBlocks: [
      {
        id: "b_head",
        type: "identity_header",
        isEnabled: true,
        sortOrder: 0,
        blockData: {
          name: "Kabir Nambiar",
          title: "Principal Brand Designer & 3D Artist",
          company: "Studio Monochrome",
          badge: "Awwwards Site of the Day Winner",
          avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80",
          coverUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&auto=format&fit=crop&q=80",
        },
      },
      {
        id: "b_contact",
        type: "contact_actions",
        isEnabled: true,
        sortOrder: 1,
        blockData: {
          email: "kabir@studiomonochrome.design",
          whatsapp: "+919900011223",
          websiteUrl: "https://studiomonochrome.design",
          location: "New Delhi & Remote",
        },
      },
      {
        id: "b_portfolio",
        type: "portfolio_gallery",
        isEnabled: true,
        sortOrder: 2,
        blockData: {
          items: [
            { id: "p1", title: "Fintech Rebrand 2026", imageUrl: "https://images.unsplash.com/photo-1558655146-d09347e92766?w=500&auto=format&fit=crop&q=80" },
            { id: "p2", title: "3D Spatial Audio Hardware", imageUrl: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=500&auto=format&fit=crop&q=80" },
            { id: "p3", title: "Luxury Electric Mobility UI", imageUrl: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=500&auto=format&fit=crop&q=80" },
          ],
        },
      },
      {
        id: "b_socials",
        type: "social_links",
        isEnabled: true,
        sortOrder: 3,
        blockData: {
          links: [
            { id: "soc1", platform: "github", url: "https://github.com" },
            { id: "soc2", platform: "instagram", url: "https://instagram.com" },
            { id: "soc3", platform: "twitter", url: "https://x.com" },
          ],
        },
      },
      {
        id: "b_lead",
        type: "lead_form",
        isEnabled: true,
        sortOrder: 4,
        blockData: {
          title: "Start a Project Discussion",
          subtitle: "Now booking client mandates for Q3 & Q4.",
          buttonLabel: "Send Brief",
          requireEmail: true,
          services: ["Visual Identity System", "Digital Product UI/UX", "3D Motion Design"],
        },
      },
    ],
  },

  local_business: {
    id: "warm_neighborhood",
    industry: "local_business",
    name: "Cornerstone Local",
    tagline: "Cafés, Clinics, Boutiques & Services",
    description: "Designed for storefronts, healthcare clinics, and local services.",
    defaultTheme: {
      primaryColor: "#78350f", // Amber 900
      accentColor: "#d97706", // Amber 600
      backgroundColor: "#1c1917",
      textColor: "#fef3c7",
      fontFamily: "outfit",
      cardStyle: "solid",
      avatarShape: "squircle",
    },
    defaultBlocks: [
      {
        id: "b_head",
        type: "identity_header",
        isEnabled: true,
        sortOrder: 0,
        blockData: {
          name: "Blue Tokai Speciality Roastery",
          title: "Artisanal Single-Origin Coffee & Bakery",
          company: "Blue Tokai Coffee Roasters",
          badge: "4.8 ★ Google Rating (1,240 Reviews)",
          avatarUrl: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=400&auto=format&fit=crop&q=80",
          coverUrl: "https://images.unsplash.com/photo-1442512595331-e89e73853f31?w=1200&auto=format&fit=crop&q=80",
        },
      },
      {
        id: "b_contact",
        type: "contact_actions",
        isEnabled: true,
        sortOrder: 1,
        blockData: {
          phone: "+91 80 4123 9988",
          email: "hello@bluetokai.com",
          whatsapp: "+918041239988",
          websiteUrl: "https://bluetokai.com",
          location: "12th Main Road, HAL 2nd Stage, Indiranagar",
        },
      },
      {
        id: "b_location",
        type: "location",
        isEnabled: true,
        sortOrder: 2,
        blockData: {
          address: "12th Main Road, HAL 2nd Stage, Indiranagar, Bengaluru, KA 560038",
          city: "Bengaluru",
          mapUrl: "https://maps.google.com",
          hours: [
            { day: "Mon - Fri", time: "7:30 AM - 10:30 PM" },
            { day: "Sat - Sun", time: "7:00 AM - 11:00 PM" },
          ],
        },
      },
      {
        id: "b_services",
        type: "services",
        isEnabled: true,
        sortOrder: 3,
        blockData: {
          items: [
            { id: "s1", title: "Single Origin Pourover", description: "Poursteady precision extraction with Attikan Estate beans.", price: "₹240" },
            { id: "s2", title: "Artisan Sourdough Croissant", description: "French laminated butter pastry baked fresh at 7 AM daily.", price: "₹180" },
            { id: "s3", title: "Coffee Brewing Workshop", description: "Hands-on AeroPress & V60 masterclass with head barista.", price: "₹1,499" },
          ],
        },
      },
      {
        id: "b_lead",
        type: "lead_form",
        isEnabled: true,
        sortOrder: 4,
        blockData: {
          title: "Book Table / Catering Inquiry",
          subtitle: "Drop your party size or catering requirement and our cafe manager will confirm.",
          buttonLabel: "Submit Request",
          requireEmail: false,
          services: ["Table Reservation (4+ guests)", "Corporate Coffee Catering", "Workshop Registration"],
        },
      },
    ],
  },

  creator: {
    id: "electric_gradient",
    industry: "creator",
    name: "Pulse Creator",
    tagline: "Influencers, Streamers & Podcasters",
    description: "Vibrant link hub for digital creators, YouTubers, and podcasters.",
    defaultTheme: {
      primaryColor: "#581c87", // Purple 900
      accentColor: "#a855f7", // Purple 500
      backgroundColor: "#0f0728",
      textColor: "#faf5ff",
      fontFamily: "outfit",
      cardStyle: "glass",
      avatarShape: "circle",
    },
    defaultBlocks: [
      {
        id: "b_head",
        type: "identity_header",
        isEnabled: true,
        sortOrder: 0,
        blockData: {
          name: "Devina Rao",
          title: "Tech Storyteller & Podcast Host",
          company: "@DevinaDecodes",
          badge: "850K+ Community Across Platforms",
          avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&auto=format&fit=crop&q=80",
          coverUrl: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=1200&auto=format&fit=crop&q=80",
        },
      },
      {
        id: "b_contact",
        type: "contact_actions",
        isEnabled: true,
        sortOrder: 1,
        blockData: {
          email: "collabs@devinadecodes.com",
          whatsapp: "+919810099887",
          websiteUrl: "https://devinadecodes.com",
        },
      },
      {
        id: "b_socials",
        type: "social_links",
        isEnabled: true,
        sortOrder: 2,
        blockData: {
          links: [
            { id: "s1", platform: "youtube", url: "https://youtube.com", label: "Subscribe on YouTube (450K)" },
            { id: "s2", platform: "instagram", url: "https://instagram.com", label: "Follow on Instagram (@devina)" },
            { id: "s3", platform: "twitter", url: "https://x.com", label: "Tech Thoughts on X" },
          ],
        },
      },
      {
        id: "b_services",
        type: "services",
        isEnabled: true,
        sortOrder: 3,
        blockData: {
          items: [
            { id: "c1", title: "Dedicated YouTube Review", description: "In-depth testing, authentic user review, 4K b-roll integration.", price: "Rate Card" },
            { id: "c2", title: "Keynote Speaking & Panel", description: "Talks on AI tools, future of creator economy, and tech adoption.", price: "Enquire" },
          ],
        },
      },
      {
        id: "b_lead",
        type: "lead_form",
        isEnabled: true,
        sortOrder: 4,
        blockData: {
          title: "Brand Collaboration & Sponsorship",
          subtitle: "Please include brand name, deliverable timeline, and campaign budget.",
          buttonLabel: "Send Collaboration Pitch",
          requireEmail: true,
          services: ["YouTube Video Integration", "Instagram Reel Campaign", "Keynote / Event Appearance"],
        },
      },
    ],
  },
};
