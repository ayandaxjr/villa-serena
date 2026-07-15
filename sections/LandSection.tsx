"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import AnimatedSection from "@/components/AnimatedSection";
import { useT } from "@/lib/i18n/LanguageContext";
import { useSiteContent } from "@/lib/i18n/ContentContext";
import { useCmsText } from "@/lib/i18n/useCmsText";

export default function LandSection() {
  const t = useT();
  const c = useSiteContent();
  const cmsText = useCmsText();
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "15%"]);
  const overlayOpacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0.85, 0.7, 0.7, 0.85]);

  const goodies = [
    { label: cmsText(c.land_goodie_1_label, t.land.goodies[0]?.label ?? ''), detail: cmsText(c.land_goodie_1_detail, t.land.goodies[0]?.detail ?? '') },
    { label: cmsText(c.land_goodie_2_label, t.land.goodies[1]?.label ?? ''), detail: cmsText(c.land_goodie_2_detail, t.land.goodies[1]?.detail ?? '') },
    { label: cmsText(c.land_goodie_3_label, t.land.goodies[2]?.label ?? ''), detail: cmsText(c.land_goodie_3_detail, t.land.goodies[2]?.detail ?? '') },
    { label: cmsText(c.land_goodie_4_label, t.land.goodies[3]?.label ?? ''), detail: cmsText(c.land_goodie_4_detail, t.land.goodies[3]?.detail ?? '') },
  ];

  return (
    <section
      ref={sectionRef}
      id="land"
      className="relative min-h-[100svh] flex items-center overflow-hidden"
    >
      <motion.div
        style={{ y: bgY }}
        className="absolute inset-0 w-full h-[130%] -top-[15%]"
      >
        <img
          src={c.land_background_image || "/estate far.jpg"}
          alt="The full estate viewed from the surrounding countryside"
          loading="eager"
          decoding="async"
          fetchPriority="high"
          className="w-full h-full object-cover"
        />
      </motion.div>

      <motion.div
        style={{ opacity: overlayOpacity }}
        className="absolute inset-0 bg-stone_ z-10"
      />

      <div className="absolute inset-0 z-15 opacity-[0.03] bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJhIj48ZmVUdXJidWxlbmNlIHR5cGU9ImZyYWN0YWxOb2lzZSIgYmFzZUZyZXF1ZW5jeT0iLjc1IiBzdGl0Y2hUaWxlcz0ic3RpdGNoIi8+PC9maWx0ZXI+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsdGVyPSJ1cmwoI2EpIi8+PC9zdmc+')]" />

      <div className="relative z-20 max-w-content mx-auto px-6 md:px-10 py-section">
        <AnimatedSection>
          <p className="section-label mb-4 text-gold/80">{t.land.label}</p>
        </AnimatedSection>

        <AnimatedSection delay={0.15}>
          <h2 className="font-serif text-display text-cream font-light mb-10 text-balance">
            {cmsText(c.land_headline, t.land.headline)}
            <br />
            <em className="text-gold">{cmsText(c.land_headline_em, t.land.headlineEm)}</em>
          </h2>
        </AnimatedSection>

        <AnimatedSection delay={0.3}>
          <div className="gold-line mb-10" />
        </AnimatedSection>

        <AnimatedSection delay={0.4}>
          <p className="text-body-lg font-light text-cream/80 leading-relaxed mb-8">
            {cmsText(c.land_body1, t.land.body1)}
          </p>
        </AnimatedSection>

        <AnimatedSection delay={0.55}>
          <p className="text-body-lg font-light text-cream/70 leading-relaxed">
            {cmsText(c.land_body2, t.land.body2)}
          </p>
        </AnimatedSection>

        <AnimatedSection delay={0.7} className="mt-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
            {goodies.map((item) => (
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
