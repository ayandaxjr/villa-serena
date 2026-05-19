"use client";

import AnimatedSection from "@/components/AnimatedSection";
import { StaggerContainer, StaggerItem } from "@/components/AnimatedSection";
import { useT } from "@/lib/i18n/LanguageContext";

const seasonImages = [
  "/villa sun.jpg",
  "/pool sode top.jpg",
  "/villa night.jpg",
];

const seasonTones = [
  "from-olive/10 via-cream to-olive/5",
  "from-gold/15 via-cream to-terracotta/5",
  "from-terracotta/10 via-cream to-warm-gray/5",
];

export default function SeasonsSection() {
  const t = useT();

  const seasons = t.seasons.seasons.map((s, i) => ({
    ...s,
    image: seasonImages[i],
    tone: seasonTones[i],
  }));

  return (
    <section id="seasons" className="py-section bg-cream">
      <div className="max-w-wide mx-auto px-6 md:px-10">
        {/* Header */}
        <div className="max-w-content mx-auto text-center mb-16 md:mb-24">
          <AnimatedSection>
            <p className="section-label mb-4">{t.seasons.label}</p>
          </AnimatedSection>
          <AnimatedSection delay={0.15}>
            <h2 className="font-serif text-display text-stone_ font-light text-balance">
              {t.seasons.headline}
            </h2>
          </AnimatedSection>
        </div>

        {/* Season Cards */}
        <StaggerContainer
          className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10"
          staggerDelay={0.2}
        >
          {seasons.map((season) => (
            <StaggerItem key={season.name}>
              <div className="group card-lift h-full">
                <div
                  className="aspect-[3/4] mb-8 relative overflow-hidden transition-transform duration-700 ease-luxury group-hover:scale-[1.02]"
                >
                  <img
                    src={season.image}
                    alt={season.name}
                    loading="lazy"
                    decoding="async"
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  
                  {/* Season label on image */}
                  <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-stone_/60 to-transparent">
                    <p className="text-label uppercase tracking-[0.2em] text-cream/80">
                      {season.months}
                    </p>
                  </div>
                </div>

                {/* Content */}
                <h3 className="font-serif text-headline text-stone_ font-medium mb-2">
                  {season.name}
                </h3>
                <p className="text-caption uppercase tracking-[0.1em] text-gold mb-4">
                  {season.months}
                </p>
                <p className="text-body font-light text-stone_/70 leading-relaxed">
                  {season.description}
                </p>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>

        {/* Pricing note */}
        <AnimatedSection delay={0.3} className="mt-14 text-center">
          <p className="text-caption text-warm-gray/50 max-w-md mx-auto">
            {t.seasons.note}
          </p>
        </AnimatedSection>
      </div>
    </section>
  );
}
