"use client";

import { useRef, useState } from "react";
import AnimatedSection from "@/components/AnimatedSection";
import { useT } from "@/lib/i18n/LanguageContext";
import { useSiteContent } from "@/lib/i18n/ContentContext";
import { useCmsText } from "@/lib/i18n/useCmsText";
import { PHOTOS, PROMISE_VIDEO } from "@/lib/site-assets";

export default function PromiseSection() {
  const t = useT();
  const c = useSiteContent();
  const cmsText = useCmsText();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const handlePlay = () => {
    const video = videoRef.current;
    if (!video) return;
    setIsPlaying(true);
    video.play().catch(() => {});
  };

  return (
    <section id="promise" className="py-section bg-light-cream">
      <div className="max-w-content mx-auto px-6 md:px-10 text-center">
        <AnimatedSection>
          <p className="section-label mb-4">{t.promise.label}</p>
        </AnimatedSection>
        <AnimatedSection delay={0.15}>
          <h2 className="font-serif text-display text-stone_ font-light mb-8 text-balance">
            {cmsText(c.promise_headline, t.promise.headline)}
            <br />
            <em className="text-gold">{cmsText(c.promise_headline_em, t.promise.headlineEm)}</em>
          </h2>
        </AnimatedSection>
        <AnimatedSection delay={0.3}>
          <div className="gold-line mx-auto mb-10" />
        </AnimatedSection>
        <AnimatedSection delay={0.4}>
          <p className="text-body-lg font-light text-stone_/80 max-w-[640px] mx-auto leading-relaxed">
            {cmsText(c.promise_body, t.promise.body)}
          </p>
        </AnimatedSection>

        <AnimatedSection delay={0.55}>
          <div className="mt-12 md:mt-16 max-w-4xl mx-auto">
            <p className="text-caption uppercase tracking-[0.2em] text-gold mb-4">
              {t.promise.videoLabel}
            </p>

            <div className="relative overflow-hidden rounded-2xl shadow-lg bg-stone_ aspect-video group">
              <video
                ref={videoRef}
                controls={isPlaying}
                playsInline
                preload="auto"
                poster={PHOTOS.estate3}
                onPlay={() => setIsPlaying(true)}
                onPause={() => {
                  if (videoRef.current?.currentTime === 0) setIsPlaying(false);
                }}
                className="absolute inset-0 w-full h-full object-cover"
              >
                <source src={PROMISE_VIDEO} type="video/mp4" />
              </video>

              {!isPlaying && (
                <button
                  type="button"
                  onClick={handlePlay}
                  aria-label={t.promise.videoPlay}
                  className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-5 bg-stone_/25 backdrop-blur-[2px] transition-colors duration-500 hover:bg-stone_/35 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-stone_"
                >
                  <span className="relative flex items-center justify-center">
                    <span className="absolute w-20 h-20 md:w-24 md:h-24 rounded-full border border-cream/30 animate-ping opacity-30" />
                    <span className="relative flex items-center justify-center w-16 h-16 md:w-20 md:h-20 rounded-full bg-cream/95 text-stone_ shadow-xl transition-transform duration-300 group-hover:scale-105">
                      <svg viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7 md:w-8 md:h-8 ml-1">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </span>
                  </span>

                  <span className="font-serif text-xl md:text-2xl text-cream font-light tracking-tight drop-shadow-md">
                    {t.promise.videoPlay}
                  </span>
                  <span className="text-caption uppercase tracking-[0.18em] text-cream/75">
                    {t.promise.videoHint}
                  </span>
                </button>
              )}
            </div>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}
