"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, useState } from "react";
import { useT } from "@/lib/i18n/LanguageContext";
import { useSiteContent } from "@/lib/i18n/ContentContext";
import { useCmsText } from "@/lib/i18n/useCmsText";
import { usePersistentVideoAutoplay } from "@/lib/use-persistent-video-autoplay";

interface HeroSectionProps {
  loaderDone?: boolean;
}

export default function HeroSection({ loaderDone = false }: HeroSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoReady, setVideoReady] = useState(false);
  const t = useT();
  const c = useSiteContent();
  const cmsText = useCmsText();

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  const mediaY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const textOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const textY = useTransform(scrollYProgress, [0, 0.5], ["0%", "20%"]);

  // Start during loader; keep alive through iOS Low Power / Android battery saver
  usePersistentVideoAutoplay(videoRef, {
    active: true,
    viewportRef: sectionRef,
    onPlaying: () => setVideoReady(true),
  });

  const luxuryEase = [0.16, 1, 0.3, 1] as const;

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="relative h-[100svh] w-full overflow-hidden bg-stone_"
    >
      <motion.div
        style={{ y: mediaY }}
        className="absolute inset-0 w-full h-[120%] -top-[10%]"
      >
        <video
          ref={videoRef}
          autoPlay
          muted
          defaultMuted
          loop
          playsInline
          preload="auto"
          controls={false}
          disablePictureInPicture
          disableRemotePlayback
          controlsList="nodownload noplaybackrate noremoteplayback"
          onPlaying={() => setVideoReady(true)}
          onCanPlayThrough={() => setVideoReady(true)}
          className="absolute inset-0 w-full h-full object-cover pointer-events-none"
          style={{ opacity: videoReady ? 1 : 0, transition: "opacity 1.5s ease" }}
        >
          <source src={c.hero_video_url || "/hero-video-web.mp4"} type="video/mp4" />
        </video>

        <div
          className="absolute inset-0 w-full h-full pointer-events-none"
          style={{ opacity: videoReady ? 0 : 1, transition: "opacity 1.5s ease" }}
        >
          <img
            src={c.hero_fallback_image_url || "/hero-image.jpg"}
            alt="Villa Serena estate"
            loading="eager"
            decoding="async"
            fetchPriority="high"
            className="w-full h-full object-cover"
          />
        </div>
      </motion.div>

      <div className="absolute inset-0 z-10 pointer-events-none">
        <div className="absolute inset-0 bg-stone_/[0.50]" />
        <div className="absolute inset-0 bg-gradient-to-t from-stone_/70 via-transparent to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-b from-stone_/40 via-transparent to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_35%,rgba(44,40,36,0.45)_100%)]" />
      </div>

      <motion.div
        style={{ opacity: textOpacity, y: textY }}
        className="relative z-20 h-full flex flex-col items-center justify-center text-center px-6"
      >
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
          {cmsText(c.hero_label, t.hero.label)}
        </motion.p>

        <div className="overflow-hidden mb-6">
          <motion.h1
            initial={{ opacity: 0 }}
            animate={loaderDone ? { opacity: 1 } : { opacity: 0 }}
            transition={{ delay: 0.5, duration: 1.2, ease: luxuryEase }}
            className="font-serif text-cream text-hero font-light tracking-tight"
          >
            {cmsText(c.hero_title, t.hero.title)}
          </motion.h1>
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={loaderDone ? { opacity: 1 } : { opacity: 0 }}
          transition={{ delay: 0.9, duration: 0.8, ease: luxuryEase }}
          className="font-serif text-gold text-subhead font-light italic mb-12 max-w-lg"
        >
          {cmsText(c.hero_subtitle, t.hero.subtitle)}
        </motion.p>

        <motion.div
          initial={{ width: 0, opacity: 0 }}
          animate={loaderDone ? { width: 60, opacity: 1 } : { width: 0, opacity: 0 }}
          transition={{ delay: 1.3, duration: 0.8, ease: luxuryEase }}
          className="h-px bg-gradient-to-r from-transparent via-gold to-transparent mb-12"
        />

        <motion.div
          initial={{ opacity: 0 }}
          animate={loaderDone ? { opacity: 1 } : { opacity: 0 }}
          transition={{ delay: 1.6, duration: 0.8, ease: luxuryEase }}
          className="flex flex-col sm:flex-row gap-4"
        >
          <a
            href="#booking"
            className="inline-flex items-center justify-center gap-2 px-6 sm:px-10 py-4 sm:py-[18px]
                       bg-gold text-stone_ text-label uppercase tracking-[0.2em] font-sans font-medium
                       border border-gold rounded-sm
                       transition-all duration-500 ease-luxury
                       hover:bg-transparent hover:text-gold cursor-hover"
          >
            {cmsText(c.hero_cta_primary, t.hero.ctaPrimary)}
          </a>
          <a
            href="#estate"
            className="inline-flex items-center justify-center gap-2 px-6 sm:px-10 py-4 sm:py-[18px]
                       bg-transparent text-cream text-label uppercase tracking-[0.2em] font-sans font-medium
                       border border-cream/30 rounded-sm
                       transition-all duration-500 ease-luxury
                       hover:border-cream hover:bg-cream/5 cursor-hover"
          >
            {cmsText(c.hero_cta_secondary, t.hero.ctaSecondary)}
            <span className="text-gold ml-1">&#8594;</span>
          </a>
        </motion.div>
      </motion.div>

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
