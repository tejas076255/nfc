"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowRight,
  ExternalLink,
  Layers
} from "lucide-react";

interface Template {
  id: string;
  category: string;
  name: string;
  role: string;
  company: string;
  description: string;
  badge: string;
  accent: string;
  gradient: string;
  features: string[];
  blockCount: number;
}

const TEMPLATES: Template[] = [
  {
    id: "executive",
    category: "Corporate",
    name: "Alexander Vance",
    role: "Managing Director",
    company: "Apex Global Capital",
    description: "Designed for C-suite executives, venture capitalists, and private equity partners needing discreet luxury and instant calendar booking.",
    badge: "Executive Tier",
    accent: "#f59e0b",
    gradient: "from-amber-500/20 via-zinc-900 to-black",
    features: ["Instant vCard sync", "Cal.com / Calendly sync", "Executive bio", "LinkedIn VIP link"],
    blockCount: 7,
  },
  {
    id: "tech-founder",
    category: "Technology",
    name: "Dr. Elena Rostova",
    role: "Co-Founder & CTO",
    company: "TensorMatrix AI",
    description: "Tailored for software founders, AI researchers, and engineers showcasing code repositories, live demo URLs, and GitHub activity.",
    badge: "Tech & AI",
    accent: "#3b82f6",
    gradient: "from-blue-600/20 via-zinc-900 to-black",
    features: ["GitHub repo pins", "Product Hunt badge", "Discord direct join", "Tech stack chips"],
    blockCount: 8,
  },
  {
    id: "real-estate",
    category: "Real Estate",
    name: "Marcus Sterling",
    role: "Luxury Property Broker",
    company: "Sotheby's Prime",
    description: "Built for luxury real estate consultants and developers featuring active property carousels, 3D tour links, and WhatsApp direct chat.",
    badge: "Luxury Living",
    accent: "#10b981",
    gradient: "from-emerald-600/20 via-zinc-900 to-black",
    features: ["Property catalog", "WhatsApp tap-to-chat", "Google Maps pin", "High-res gallery"],
    blockCount: 6,
  },
  {
    id: "creative-director",
    category: "Creative",
    name: "Maya Chen",
    role: "Principal Brand Designer",
    company: "Studio Monochrome",
    description: "Curated for creative directors, architects, and artists with portfolio showreels, Behance embeds, and interactive media lookbooks.",
    badge: "Design & Arts",
    accent: "#a855f7",
    gradient: "from-purple-600/20 via-zinc-900 to-black",
    features: ["Media showreel", "Behance / Dribbble sync", "Download PDF lookbook", "Spotify playlist"],
    blockCount: 9,
  },
  {
    id: "medical-specialist",
    category: "Healthcare",
    name: "Dr. Rohan Patel, MD",
    role: "Chief Orthopedic Surgeon",
    company: "Apollo Health Group",
    description: "Compliant, trustworthy layout for doctors, dentists, and clinics with direct patient appointment slots and verified credentials.",
    badge: "Medical & Dental",
    accent: "#06b6d4",
    gradient: "from-cyan-600/20 via-zinc-900 to-black",
    features: ["Appointment booking", "Clinic emergency line", "Medical council license", "Location directions"],
    blockCount: 5,
  },
  {
    id: "creator-speaker",
    category: "Media",
    name: "Sophia Laurent",
    role: "Keynote Speaker & Author",
    company: "Future Horizons Media",
    description: "Engineered for podcast hosts, authors, and conference keynotes with press kit downloads, YouTube embeds, and sponsor inquiries.",
    badge: "Creator & Press",
    accent: "#ec4899",
    gradient: "from-pink-600/20 via-zinc-900 to-black",
    features: ["Speaker press kit", "YouTube video embed", "Substack newsletter", "Sponsor inquiry form"],
    blockCount: 8,
  },
];

const CATEGORIES = ["All", "Corporate", "Technology", "Real Estate", "Creative", "Healthcare", "Media"];

export function TemplatesShowcase() {
  const [selectedCategory, setSelectedCategory] = useState("All");

  const filteredTemplates = selectedCategory === "All"
    ? TEMPLATES
    : TEMPLATES.filter((t) => t.category === selectedCategory);

  return (
    <section id="templates" className="relative py-28 px-4 sm:px-6 lg:px-8 border-t border-white/[0.06] bg-[#030508] overflow-hidden">
      {/* Background ambient lighting */}
      <motion.div 
        className="absolute top-1/4 right-0 w-[500px] h-[500px] bg-amber-500/5 rounded-full blur-[140px] pointer-events-none"
        animate={{ scale: [1, 1.15, 1], opacity: [0.05, 0.1, 0.05] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div 
        className="absolute bottom-10 left-10 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[140px] pointer-events-none"
        animate={{ scale: [1, 1.2, 1], opacity: [0.05, 0.1, 0.05] }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut", delay: 1 }}
      />

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Section Header with Scroll Reveal */}
        <motion.div 
          className="text-center max-w-3xl mx-auto mb-14"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-white/[0.08] bg-white/[0.03] text-slate-300 text-xs font-medium uppercase tracking-widest mb-4">
            <Layers className="w-3.5 h-3.5 text-amber-400" />
            <span>Curated Persona Blueprints</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-white mb-5">
            Designed for leaders across <br />
            <span className="bg-gradient-to-r from-amber-200 via-white to-slate-400 bg-clip-text text-transparent">
              every major industry
            </span>
          </h2>
          <p className="text-slate-400 text-base sm:text-lg leading-relaxed">
            Choose from battle-tested profile layouts optimized for conversion, credibility, and immediate lead capture. Swap elements anytime from your dashboard.
          </p>
        </motion.div>

        {/* Category Filters with layoutId animation */}
        <div className="flex items-center justify-center gap-2 overflow-x-auto pb-4 mb-12 scrollbar-none">
          {CATEGORIES.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-full text-xs font-medium transition-all shrink-0 relative ${
                selectedCategory === category
                  ? "text-black font-semibold"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <span className="relative z-10">{category}</span>
              {selectedCategory === category && (
                <motion.div
                  layoutId="templateCategoryPill"
                  className="absolute inset-0 bg-white rounded-full shadow-lg shadow-white/10"
                  transition={{ type: "spring", stiffness: 350, damping: 30 }}
                />
              )}
            </button>
          ))}
        </div>

        {/* Templates Grid with layout & AnimatePresence */}
        <motion.div 
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          <AnimatePresence>
            {filteredTemplates.map((template) => (
              <motion.div
                key={template.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                whileHover={{ y: -6, transition: { duration: 0.2 } }}
                className="relative rounded-3xl border border-white/[0.08] bg-gradient-to-b from-white/[0.03] to-[#04060a] p-7 flex flex-col justify-between hover:border-white/20 transition-all duration-300 group hover:shadow-2xl hover:shadow-amber-500/5"
              >
                <div>
                  {/* Header Badge */}
                  <div className="flex items-center justify-between mb-5">
                    <span 
                      className="text-xs px-2.5 py-1 rounded-full font-medium border"
                      style={{
                        borderColor: `${template.accent}40`,
                        backgroundColor: `${template.accent}15`,
                        color: template.accent
                      }}
                    >
                      {template.badge}
                    </span>
                    <span className="text-[11px] font-mono text-slate-500">
                      {template.blockCount} Interactive Blocks
                    </span>
                  </div>

                  {/* Persona Preview Mockup */}
                  <div 
                    className={`w-full rounded-2xl p-5 mb-6 border border-white/[0.08] bg-gradient-to-b ${template.gradient} relative overflow-hidden`}
                  >
                    <div className="flex items-center gap-3.5 mb-3">
                      <div 
                        className="w-12 h-12 rounded-xl flex items-center justify-center font-bold text-white text-base shadow-inner border border-white/20"
                        style={{ backgroundColor: `${template.accent}30` }}
                      >
                        {template.name.split(" ").map((n) => n[0]).join("")}
                      </div>
                      <div>
                        <h4 className="text-white font-semibold text-base leading-tight">{template.name}</h4>
                        <p className="text-xs text-slate-400 mt-0.5">{template.role}</p>
                        <p className="text-[11px] text-amber-400 font-medium">{template.company}</p>
                      </div>
                    </div>

                    {/* Feature Pills */}
                    <div className="flex flex-wrap gap-1.5 mt-3 pt-3 border-t border-white/[0.08]">
                      {template.features.slice(0, 3).map((feat, i) => (
                        <span 
                          key={i} 
                          className="text-[10px] px-2 py-0.5 rounded bg-black/40 text-slate-300 border border-white/[0.06] font-mono"
                        >
                          {feat}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-slate-400 text-xs sm:text-sm leading-relaxed mb-6">
                    {template.description}
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="pt-4 border-t border-white/[0.06] flex items-center justify-between">
                  <Link
                    href={`/register?template=${template.id}`}
                    className="inline-flex items-center gap-2 text-xs font-semibold text-white group-hover:text-amber-400 transition-colors"
                  >
                    <span>Use This Blueprint</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                  <Link
                    href={`/register?template=${template.id}`}
                    className="inline-flex items-center gap-1 text-[11px] text-slate-400 hover:text-slate-200 transition-colors"
                  >
                    <span>Preview</span>
                    <ExternalLink className="w-3 h-3" />
                  </Link>
                </div>

              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Bottom Callout */}
        <div className="mt-14 text-center">
          <p className="text-xs sm:text-sm text-slate-400">
            Need a custom design for your corporate sales team or enterprise enterprise?{" "}
            <Link href="/contact" className="text-amber-400 underline underline-offset-4 hover:text-amber-300 font-medium">
              Talk to our design architects
            </Link>
          </p>
        </div>

      </div>
    </section>
  );
}
