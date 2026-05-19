"use client";

import AnimatedSection from "@/components/AnimatedSection";
import { useT } from "@/lib/i18n/LanguageContext";

export default function PromiseSection() {
  const t = useT();

  return (
    <section id="promise" className="py-section bg-light-cream">
      <div className="max-w-content mx-auto px-6 md:px-10 text-center">
        {/* Section Label */}
        <AnimatedSection>
          <p className="section-label mb-4">{t.promise.label}</p>
        </AnimatedSection>

        {/* Headline */}
        <AnimatedSection delay={0.15}>
          <h2 className="font-serif text-display text-stone_ font-light mb-8 text-balance">
            {t.promise.headline}
            <br />
            <em className="text-gold">{t.promise.headlineEm}</em>
          </h2>
        </AnimatedSection>

        {/* Gold line */}
        <AnimatedSection delay={0.3}>
          <div className="gold-line mx-auto mb-10" />
        </AnimatedSection>

        {/* Body */}
        <AnimatedSection delay={0.4}>
          <p className="text-body-lg font-light text-stone_/80 max-w-[640px] mx-auto leading-relaxed">
            {t.promise.body}
          </p>
        </AnimatedSection>
      </div>
    </section>
  );
}
