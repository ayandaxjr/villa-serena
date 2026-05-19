"use client";

import { motion } from "framer-motion";
import { useRef, useState, useEffect, useCallback } from "react";
import { useInView } from "react-intersection-observer";
import AnimatedSection from "@/components/AnimatedSection";
import { useT } from "@/lib/i18n/LanguageContext";

/* =========================================================
   DATA — Estate carousel card images
   ========================================================= */
const estateCardImages = [
  "/villa outside.jpg",     // The Villa — first
  "/pool side.jpg",         // Swimming Pool — second
  "/villa area chill.jpg",  // The Terrace
  "/vineyard.jpg",          // The Olive Grove
  "/estate far.jpg",        // The Valley View
  "/villa driveway.jpg",    // The Stone Courtyard
  "/villa sun shine.jpg",   // The Vineyard
];

/* =========================================================
   MAIN ESTATE SECTION
   ========================================================= */
export default function EstateSection() {
  const t = useT();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [visibleProgress, setVisibleProgress] = useState("01");
  const [progressPct, setProgressPct] = useState(0);

  // Feature video in-view detection
  const [videoRef, videoInView] = useInView({
    triggerOnce: true,
    threshold: 0.3,
  });

  const estateCards = t.estate.cards.map((card, i) => ({
    id: i + 1,
    title: card.title,
    description: card.description,
    image: estateCardImages[i],
  }));

  const total = estateCards.length;

  // Detect mobile
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  // Update scroll state — arrow visibility + visible-progress counter
  const updateScrollState = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const { scrollLeft, scrollWidth, clientWidth } = el;
    setCanScrollLeft(scrollLeft > 2);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 2);

    // Calculate how many cards have scrolled into / through the viewport
    const firstCard = el.firstElementChild as HTMLElement | null;
    if (!firstCard) return;
    const gap = parseFloat(getComputedStyle(el).gap || "0");
    const cardW = firstCard.offsetWidth + gap;

    const cardsScrolled = scrollLeft / cardW;
    const cardsVisible = clientWidth / cardW;
    const lastVisibleCard = Math.min(
      total,
      Math.ceil(cardsScrolled + cardsVisible)
    );

    setVisibleProgress(String(lastVisibleCard).padStart(2, "0"));
    setProgressPct((lastVisibleCard / total) * 100);
  }, [total]);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.addEventListener("scroll", updateScrollState, { passive: true });
    updateScrollState();
    window.addEventListener("resize", updateScrollState);
    return () => {
      el.removeEventListener("scroll", updateScrollState);
      window.removeEventListener("resize", updateScrollState);
    };
  }, [updateScrollState]);

  // Arrow navigation — scroll by the number of visible cards
  const scroll = useCallback((dir: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;
    const card = el.firstElementChild as HTMLElement | null;
    if (!card) return;
    const gap = parseFloat(getComputedStyle(el).gap || "0");
    const cardW = card.offsetWidth + gap;
    const visibleCount = Math.max(1, Math.floor(el.clientWidth / cardW));
    const step = visibleCount * cardW;
    el.scrollBy({ left: dir === "right" ? step : -step, behavior: "smooth" });
  }, []);

  return (
    <section id="estate" className="relative bg-cream overflow-hidden">
      {/* ==============================
          SECTION HEADER
          ============================== */}
      <div className="pt-section pb-3 md:pb-5">
        <div className="max-w-wide mx-auto px-6 md:px-10">
          <div className="max-w-content mx-auto text-center">
            <AnimatedSection>
              <p className="section-label mb-4">{t.estate.label}</p>
            </AnimatedSection>
            <AnimatedSection delay={0.15}>
              <h2 className="font-serif text-display text-stone_ font-light text-balance mb-6">
                {t.estate.headline}
              </h2>
            </AnimatedSection>
            <AnimatedSection delay={0.3}>
              <p className="font-sans text-body-lg text-warm-gray font-light max-w-xl mx-auto leading-relaxed">
                {t.estate.description}
              </p>
            </AnimatedSection>
          </div>
        </div>
      </div>

      {/* ==============================
          FEATURE VIDEO — Estate Tour
          ============================== */}
      <div className="w-full px-6 md:px-10 mb-5 md:mb-8">
        <video
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          style={{ width: "100%", display: "block", borderRadius: "16px" }}
        >
          <source src="/video/estate-tour.mp4" type="video/mp4" />
        </video>
      </div>

      {/* ==============================
          EXPLORE THE GROUNDS — Inline Carousel
          Desktop: arrows only (overflow hidden)
          Mobile: native swipe (overflow auto), no arrows
          ============================== */}
      <div className="pb-section">
        {/* Carousel header — arrows + progress (no title per client request) */}
        <div className="max-w-wide mx-auto px-6 md:px-10 mb-10">
          <AnimatedSection delay={0.1}>
            <div className="flex items-center justify-end">
              {/* Desktop: arrows + visible-progress counter */}
              <div className="hidden md:flex items-center gap-4">
                <span className="text-[11px] font-sans tracking-[0.15em] text-warm-gray font-medium tabular-nums">
                  {visibleProgress}
                </span>
                <div className="w-24 h-px bg-stone_/10 relative overflow-hidden">
                  <motion.div
                    className="absolute top-0 left-0 h-full bg-gold"
                    animate={{ width: `${progressPct}%` }}
                    transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
                  />
                </div>
                <span className="text-[11px] font-sans tracking-[0.15em] text-warm-gray/40 font-medium tabular-nums">
                  {String(total).padStart(2, "0")}
                </span>

                {/* Arrow buttons — desktop only */}
                <div className="flex gap-2 ml-4">
                  <button
                    onClick={() => scroll("left")}
                    disabled={!canScrollLeft}
                    aria-label="Previous"
                    className="w-11 h-11 rounded-full border border-stone_/15 flex items-center justify-center
                               hover:border-stone_/40 active:scale-95 transition-all duration-300
                               disabled:opacity-20 disabled:pointer-events-none"
                  >
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="text-stone_">
                      <path d="M10 3L5 8L10 13" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>
                  <button
                    onClick={() => scroll("right")}
                    disabled={!canScrollRight}
                    aria-label="Next"
                    className="w-11 h-11 rounded-full border border-stone_/15 flex items-center justify-center
                               hover:border-stone_/40 active:scale-95 transition-all duration-300
                               disabled:opacity-20 disabled:pointer-events-none"
                  >
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="text-stone_">
                      <path d="M6 3L11 8L6 13" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </AnimatedSection>
        </div>

        {/* Carousel track */}
        <div
          ref={scrollRef}
          className="estate-track flex gap-4 md:gap-6
                     snap-x snap-mandatory scrollbar-hide"
          style={{
            WebkitOverflowScrolling: "touch",
            overflowX: isMobile ? "auto" : "hidden",
            overflowY: "hidden",
          } as React.CSSProperties}
        >
          {estateCards.map((card, idx) => (
            <div
              key={card.id}
              className={`flex-shrink-0 snap-start
                         w-[85vw] sm:w-[70vw] md:w-[calc((100vw-80px-24px)/2)]
                         min-w-0 relative group
                         ${idx === 0 ? 'ml-6 md:ml-10' : ''}
                         ${idx === estateCards.length - 1 ? 'mr-6 md:mr-10' : ''}`}
            >
              <div className="relative overflow-hidden rounded-xl md:rounded-2xl">
                <div className="aspect-[3/4] relative overflow-hidden bg-stone_/5">
                  <img
                    src={card.image}
                    alt={card.title}
                    loading="lazy"
                    decoding="async"
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out
                               group-hover:scale-105"
                  />

                  {/* Card number */}
                  <div className="absolute top-4 left-4 z-10">
                    <span className="text-[10px] font-sans uppercase tracking-[0.3em] text-cream/60 font-medium
                                     bg-stone_/40 backdrop-blur-sm px-3 py-1.5 rounded-full">
                      {String(card.id).padStart(2, "0")}
                    </span>
                  </div>

                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-gold/0 group-hover:bg-gold/[0.06] transition-colors duration-700" />
                </div>

                {/* Caption overlay */}
                <div className="absolute bottom-0 inset-x-0 p-5 md:p-6 bg-gradient-to-t from-stone_/80 via-stone_/40 to-transparent">
                  <h3 className="font-serif text-cream text-lg md:text-xl font-light mb-0.5">
                    {card.title}
                  </h3>
                  <p className="font-sans text-cream/55 text-xs font-light leading-relaxed">
                    {card.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Instruction hint */}
        <div className="max-w-wide mx-auto px-6 md:px-10 mt-6 md:mt-8">
          {/* Mobile only */}
          <div className="flex md:hidden items-center gap-3">
            <motion.div
              animate={{ x: [0, 10, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="w-5 h-px bg-gold/50"
            />
            <span className="text-[10px] font-sans uppercase tracking-[0.25em] text-warm-gray/40">
              {t.estate.dragHint}
            </span>
          </div>

          {/* Desktop only */}
          <div className="hidden md:flex items-center gap-3">
            <span className="text-[10px] font-sans uppercase tracking-[0.25em] text-warm-gray/40">
              {t.estate.arrowHint}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
