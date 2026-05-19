"use client";

import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import AnimatedSection from "@/components/AnimatedSection";
import { useT } from "@/lib/i18n/LanguageContext";

/* =========================================================
   WINE SECTION — Premium showcase of estate wines
   Images: /public/images/wine/wine-1.jpg ... wine-4.jpg
   ========================================================= */

const wineStaticData = [
  { id: 1, year: "2023", image: "/wine 1.jpg" },
  { id: 2, year: "2022", image: "/wine 2.jpg" },
  { id: 3, year: "2023", image: "/wine 3.jpg" },
];

interface Wine {
  id: number;
  name: string;
  type: string;
  year: string;
  description: string;
  image: string;
}

function WineCard({
  wine,
  index,
}: {
  wine: Wine;
  index: number;
}) {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.2 });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
      transition={{
        delay: index * 0.15,
        duration: 0.8,
        ease: [0.25, 0.1, 0.25, 1],
      }}
      className="group relative"
    >
      <div className="flex flex-col md:flex-row gap-6 md:gap-10 items-start">
        {/* Image */}
        <div className="w-full md:w-[280px] flex-shrink-0">
          <div className="relative aspect-[3/4] rounded-xl overflow-hidden bg-stone_/5">
            <img
              src={wine.image}
              alt={wine.name}
              loading="lazy"
              decoding="async"
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            />

            {/* Year badge */}
            <div className="absolute top-4 left-4">
              <span className="text-[10px] font-sans uppercase tracking-[0.3em] text-cream/50 font-medium bg-stone_/40 backdrop-blur-sm px-3 py-1.5 rounded-full">
                {wine.year}
              </span>
            </div>

            {/* Hover overlay */}
            <div className="absolute inset-0 bg-gold/0 group-hover:bg-gold/[0.04] transition-colors duration-700" />
          </div>
        </div>

        {/* Details */}
        <div className="flex-1 py-2 md:py-4">
          <p className="text-[10px] font-sans uppercase tracking-[0.3em] text-gold/60 font-medium mb-3">
            {wine.type}
          </p>
          <h3 className="font-serif text-headline text-stone_ font-light mb-4">
            {wine.name}
          </h3>
          <div className="w-8 h-px bg-gold/30 mb-5" />
          <p className="font-sans text-body text-warm-gray font-light leading-relaxed max-w-md">
            {wine.description}
          </p>
        </div>
      </div>
    </motion.div>
  );
}

export default function WineSection() {
  const t = useT();

  const wines = wineStaticData.map((s, i) => ({
    ...s,
    name: t.wine.wines[i].name,
    type: t.wine.wines[i].type,
    description: t.wine.wines[i].description,
  }));

  return (
    <section id="wine" className="py-section bg-light-cream relative overflow-hidden">
      {/* Subtle background texture */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_20%,rgba(184,151,90,0.04)_0%,transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_80%_70%,rgba(107,123,76,0.03)_0%,transparent_40%)]" />

      <div className="relative max-w-wide mx-auto px-6 md:px-10">
        {/* Header */}
        <div className="max-w-content mx-auto text-center mb-16 md:mb-24">
          <AnimatedSection>
            <p className="section-label mb-4">{t.wine.label}</p>
          </AnimatedSection>
          <AnimatedSection delay={0.15}>
            <h2 className="font-serif text-display text-stone_ font-light text-balance mb-6">
              {t.wine.headline}
            </h2>
          </AnimatedSection>
          <AnimatedSection delay={0.3}>
            <div className="gold-line mx-auto mb-8" />
          </AnimatedSection>
          <AnimatedSection delay={0.4}>
            <p className="text-body-lg font-light text-warm-gray max-w-xl mx-auto leading-relaxed">
              {t.wine.description}
            </p>
          </AnimatedSection>
        </div>

        {/* Wine Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 max-w-6xl mx-auto">
          {wines.map((wine, i) => (
            <WineCard key={wine.id} wine={wine} index={i} />
          ))}
        </div>

        {/* Bottom note */}
        <AnimatedSection delay={0.3}>
          <div className="max-w-content mx-auto text-center mt-16 md:mt-24">
            <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full border border-stone_/8 bg-cream/50">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="text-gold">
                <path d="M8 1L10 6H15L11 9.5L12.5 15L8 11.5L3.5 15L5 9.5L1 6H6L8 1Z" fill="currentColor" />
              </svg>
              <p className="text-caption text-warm-gray font-light">
                {t.wine.tasting}
              </p>
            </div>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}
