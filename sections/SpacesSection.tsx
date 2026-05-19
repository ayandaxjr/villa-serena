"use client";

import AnimatedSection from "@/components/AnimatedSection";
import { StaggerContainer, StaggerItem } from "@/components/AnimatedSection";
import { useT } from "@/lib/i18n/LanguageContext";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";

const capacities = [8, 2, 4];

function CountUp({ target, inView }: { target: number; inView: boolean }) {
  return (
    <motion.span
      initial={{ opacity: 0 }}
      animate={inView ? { opacity: 1 } : { opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="font-serif text-[4rem] md:text-[5rem] text-gold font-light leading-none"
    >
      {inView ? target : 0}
    </motion.span>
  );
}

export default function SpacesSection() {
  const t = useT();
  const [numRef, numInView] = useInView({ triggerOnce: true, threshold: 0.5 });

  return (
    <section id="spaces" className="py-section bg-light-cream">
      <div className="max-w-wide mx-auto px-6 md:px-10">
        {/* Header */}
        <div className="max-w-content mx-auto text-center mb-16 md:mb-24">
          <AnimatedSection>
            <p className="section-label mb-4">{t.spaces.label}</p>
          </AnimatedSection>
          <AnimatedSection delay={0.15}>
            <h2 className="font-serif text-display text-stone_ font-light text-balance">
              {t.spaces.headline}
            </h2>
          </AnimatedSection>
        </div>

        {/* The Big Number — 14 */}
        <AnimatedSection className="text-center mb-20 md:mb-28">
          <div ref={numRef} className="flex items-baseline justify-center gap-4">
            <motion.span
              initial={{ scale: 0.8, opacity: 0 }}
              animate={numInView ? { scale: 1, opacity: 1 } : {}}
              transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1.0] }}
              className="font-serif text-[clamp(5rem,15vw,12rem)] text-gold/20 font-light leading-none"
            >
              14
            </motion.span>
            <motion.span
              initial={{ opacity: 0, x: -20 }}
              animate={numInView ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="text-label uppercase tracking-[0.2em] text-warm-gray"
            >
              {t.spaces.guestsLabel}
            </motion.span>
          </div>
        </AnimatedSection>

        {/* Space Cards */}
        <StaggerContainer
          className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10"
          staggerDelay={0.2}
        >
          {t.spaces.spaces.map((space, i) => (
            <StaggerItem key={space.name}>
              <div className="group card-lift bg-white border border-stone_/8 p-8 md:p-10 h-full">
                <div className="aspect-[4/3] mb-8 overflow-hidden rounded-lg">
                  <img
                    src={["/villa main interior.jpg", "/bed apatment.jpg", "/villa couche.jpg"][i]}
                    alt={space.name}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover transition-transform duration-700 ease-luxury group-hover:scale-[1.02]"
                  />
                </div>

                {/* Capacity */}
                <div className="flex items-baseline gap-3 mb-4">
                  <CountUp target={capacities[i]} inView={numInView} />
                  <span className="text-label uppercase tracking-[0.15em] text-warm-gray">
                    {t.spaces.guestsLower}
                  </span>
                </div>

                {/* Name */}
                <h3 className="font-serif text-headline text-stone_ font-medium mb-4">
                  {space.name}
                </h3>

                {/* Description */}
                <p className="text-body font-light text-stone_/70 leading-relaxed">
                  {space.description}
                </p>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>

        {/* Note */}
        <AnimatedSection delay={0.3} className="mt-12 text-center">
          <p className="text-caption text-warm-gray/60 max-w-lg mx-auto">
            {t.spaces.note}
          </p>
        </AnimatedSection>
      </div>
    </section>
  );
}
