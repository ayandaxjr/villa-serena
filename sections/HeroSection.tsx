"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { useT } from "@/lib/i18n/LanguageContext";

/* =========================================================
   HERO SECTION
   - Background video: /hero-video.mp4 (preloaded during loader)
   - Dark gradient overlay for text readability
   - Text animations fire after loader completes (loaderDone prop)
   ========================================================= */

interface HeroSectionProps {
  loaderDone?: boolean;
}

export default function HeroSection({ loaderDone = false }: HeroSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoReady, setVideoReady] = useState(false);
  const t = useT();

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  // Parallax
  const mediaY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const textOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const textY = useTransform(scrollYProgress, [0, 0.5], ["0%", "20%"]);

  // Start video immediately so it's buffered during loader
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    video.play().catch(() => {});
  }, []);

  // Elegant ease for all hero text entrances
  const luxuryEase = [0.16, 1, 0.3, 1] as const;

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="relative h-[100svh] w-full overflow-hidden bg-stone_"
    >
      {/* ======= BACKGROUND VIDEO ======= */}
      <motion.div
        style={{ y: mediaY }}
        className="absolute inset-0 w-full h-[120%] -top-[10%]"
      >
        {/* 
          VIDEO: /hero-video.mp4
          Place your file at: /public/hero-video.mp4
          Served at: /hero-video.mp4
        */}
        <video
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          onCanPlayThrough={() => setVideoReady(true)}
          className="absolute inset-0 w-full h-full object-cover"
          style={{
            opacity: videoReady ? 1 : 0,
            transition: "opacity 1.5s ease",
          }}
        >
          <source src="/hero-video.mp4" type="video/mp4" />
        </video>

        {/* IMAGE FALLBACK — shown while video loads or if it fails */}
        <div
          className="absolute inset-0 w-full h-full"
          style={{
            opacity: videoReady ? 0 : 1,
            transition: "opacity 1.5s ease",
          }}
        >
          <img
            src="/hero-image.jpg"
            alt="Villa Serena estate"
            className="w-full h-full object-cover"
          />
        </div>
      </motion.div>

      {/* ======= DARK GRADIENT OVERLAY ======= */}
      <div className="absolute inset-0 z-10 pointer-events-none">
        {/* Primary overlay — controls video brightness (0.4–0.6 range) */}
        <div className="absolute inset-0 bg-stone_/[0.50]" />
        {/* Bottom gradient for text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-stone_/70 via-transparent to-transparent" />
        {/* Top vignette */}
        <div className="absolute inset-0 bg-gradient-to-b from-stone_/40 via-transparent to-transparent" />
        {/* Radial vignette for depth */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_35%,rgba(44,40,36,0.45)_100%)]" />
      </div>

      {/* ======= HERO CONTENT — animations wait for loaderDone ======= */}
      <motion.div
        style={{ opacity: textOpacity, y: textY }}
        className="relative z-20 h-full flex flex-col items-center justify-center text-center px-6"
      >
        {/* Label */}
        <motion.p
          initial={{ opacity: 0, letterSpacing: "0.15em" }}
          animate={
            loaderDone
              ? { opacity: 1, letterSpacing: "0.3em" }
              : { opacity: 0, letterSpacing: "0.15em" }
          }
          transition={{ delay: 0.3, duration: 1.2, ease: luxuryEase }}
          className="text-label uppercase text-gold/80 mb-8"
        >
          {t.hero.label}
        </motion.p>

        {/* Title — Villa Serena */}
        <div className="overflow-hidden mb-6">
          <motion.h1
            initial={{ opacity: 0 }}
            animate={
              loaderDone ? { opacity: 1 } : { opacity: 0 }
            }
            transition={{ delay: 0.5, duration: 1.2, ease: luxuryEase }}
            className="font-serif text-cream text-hero font-light tracking-tight"
          >
            {t.hero.title}
          </motion.h1>
        </div>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={
            loaderDone ? { opacity: 1 } : { opacity: 0 }
          }
          transition={{ delay: 0.9, duration: 0.8, ease: luxuryEase }}
          className="font-serif text-gold text-subhead font-light italic mb-12 max-w-lg"
        >
          {t.hero.subtitle}
        </motion.p>

        {/* Gold divider */}
        <motion.div
          initial={{ width: 0, opacity: 0 }}
          animate={
            loaderDone
              ? { width: 60, opacity: 1 }
              : { width: 0, opacity: 0 }
          }
          transition={{ delay: 1.3, duration: 0.8, ease: luxuryEase }}
          className="h-px bg-gradient-to-r from-transparent via-gold to-transparent mb-12"
        />

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={
            loaderDone ? { opacity: 1 } : { opacity: 0 }
          }
          transition={{ delay: 1.6, duration: 0.8, ease: luxuryEase }}
          className="flex flex-col sm:flex-row gap-4"
        >
          {/* PRIMARY — Filled, strong visual weight */}
          <a
            href="#booking"
            className="inline-flex items-center justify-center gap-2 px-6 sm:px-10 py-4 sm:py-[18px]
                       bg-gold text-stone_ text-label uppercase tracking-[0.2em] font-sans font-medium
                       border border-gold rounded-sm
                       transition-all duration-500 ease-luxury
                       hover:bg-transparent hover:text-gold cursor-hover"
          >
            {t.hero.ctaPrimary}
          </a>
          {/* SECONDARY — Ghost / outline, no fill */}
          <a
            href="#estate"
            className="inline-flex items-center justify-center gap-2 px-6 sm:px-10 py-4 sm:py-[18px]
                       bg-transparent text-cream text-label uppercase tracking-[0.2em] font-sans font-medium
                       border border-cream/30 rounded-sm
                       transition-all duration-500 ease-luxury
                       hover:border-cream hover:bg-cream/5 cursor-hover"
          >
            {t.hero.ctaSecondary}
            <span className="text-gold ml-1">&#8594;</span>
          </a>
        </motion.div>
      </motion.div>

      {/* ======= SCROLL INDICATOR ======= */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={loaderDone ? { opacity: 1 } : { opacity: 0 }}
        transition={{ delay: 2.2, duration: 0.8 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-3"
      >
        <span className="text-label uppercase tracking-[0.2em] text-warm-gray/50 text-[9px]">
          {t.hero.scroll}
        </span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="w-px h-8 bg-gradient-to-b from-gold/60 to-transparent"
        />
      </motion.div>
    </section>
  );
}
