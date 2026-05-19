"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import AnimatedSection from "@/components/AnimatedSection";
import { useT } from "@/lib/i18n/LanguageContext";

export default function LandSection() {
  const t = useT();
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  // Subtle parallax on background
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "15%"]);
  const overlayOpacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0.85, 0.7, 0.7, 0.85]);

  return (
    <section
      ref={sectionRef}
      id="land"
      className="relative min-h-[100svh] flex items-center overflow-hidden"
    >
      {/* Parallax Background */}
      <motion.div
        style={{ y: bgY }}
        className="absolute inset-0 w-full h-[130%] -top-[15%]"
      >
        <img
          src="/estate far.jpg"
          alt="The full estate viewed from the surrounding countryside"
          className="w-full h-full object-cover"
        />
      </motion.div>

      {/* Dark overlay */}
      <motion.div
        style={{ opacity: overlayOpacity }}
        className="absolute inset-0 bg-stone_ z-10"
      />

      {/* Grain texture */}
      <div className="absolute inset-0 z-15 opacity-[0.03] bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJhIj48ZmVUdXJidWxlbmNlIHR5cGU9ImZyYWN0YWxOb2lzZSIgYmFzZUZyZXF1ZW5jeT0iLjc1IiBzdGl0Y2hUaWxlcz0ic3RpdGNoIi8+PC9maWx0ZXI+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsdGVyPSJ1cmwoI2EpIi8+PC9zdmc+')]" />

      {/* Content */}
      <div className="relative z-20 max-w-content mx-auto px-6 md:px-10 py-section">
        <AnimatedSection>
          <p className="section-label mb-4 text-gold/80">{t.land.label}</p>
        </AnimatedSection>

        <AnimatedSection delay={0.15}>
          <h2 className="font-serif text-display text-cream font-light mb-10 text-balance">
            {t.land.headline}
            <br />
            <em className="text-gold">{t.land.headlineEm}</em>
          </h2>
        </AnimatedSection>

        <AnimatedSection delay={0.3}>
          <div className="gold-line mb-10" />
        </AnimatedSection>

        <AnimatedSection delay={0.4}>
          <p className="text-body-lg font-light text-cream/80 leading-relaxed mb-8">
            {t.land.body1}
          </p>
        </AnimatedSection>

        <AnimatedSection delay={0.55}>
          <p className="text-body-lg font-light text-cream/70 leading-relaxed">
            {t.land.body2}
          </p>
        </AnimatedSection>

        {/* Goodies */}
        <AnimatedSection delay={0.7} className="mt-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
            {t.land.goodies.map((item) => (
              <div key={item.label} className="text-center md:text-left">
                <p className="text-caption uppercase tracking-[0.15em] text-gold mb-1">
                  {item.label}
                </p>
                <p className="text-caption text-cream/40">{item.detail}</p>
              </div>
            ))}
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}
