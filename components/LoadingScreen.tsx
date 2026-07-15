"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { useT } from "@/lib/i18n/LanguageContext";
import { preloadSiteAssets } from "@/lib/preload-assets";

const FADE_IN = 250;
const HOLD = 350;
const FADE_OUT = 200;
const WORD_CYCLE = FADE_IN + HOLD + FADE_OUT;
const EXIT_DELAY = 100;
const EXIT_DURATION = 500;
const PHASE_CROSSFADE = 400;

type LoaderPhase = "assets" | "brand";

interface LoadingScreenProps {
  assets: string[];
  onComplete?: () => void;
}

export default function LoadingScreen({ assets, onComplete }: LoadingScreenProps) {
  const t = useT();
  const WORDS = t.loading.words;
  const TOTAL_WORDS = WORDS.length;

  const [phase, setPhase] = useState<LoaderPhase>("assets");
  const [isVisible, setIsVisible] = useState(true);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [wordPhase, setWordPhase] = useState<"in" | "hold" | "out">("in");
  const [sequenceDone, setSequenceDone] = useState(false);

  useEffect(() => {
    let cancelled = false;
    preloadSiteAssets(assets).finally(() => {
      if (!cancelled) {
        setTimeout(() => {
          if (!cancelled) setPhase("brand");
        }, PHASE_CROSSFADE);
      }
    });
    return () => {
      cancelled = true;
    };
  }, [assets]);

  useEffect(() => {
    if (phase !== "brand" || sequenceDone) return;

    const phases = [
      { phase: "hold" as const, delay: FADE_IN },
      { phase: "out" as const, delay: FADE_IN + HOLD },
    ];

    const timers = phases.map(({ phase: p, delay }) =>
      setTimeout(() => setWordPhase(p), delay),
    );

    const nextTimer = setTimeout(() => {
      if (currentWordIndex < TOTAL_WORDS - 1) {
        setCurrentWordIndex((i) => i + 1);
        setWordPhase("in");
      } else {
        setSequenceDone(true);
      }
    }, WORD_CYCLE);

    return () => {
      timers.forEach(clearTimeout);
      clearTimeout(nextTimer);
    };
  }, [phase, currentWordIndex, sequenceDone, TOTAL_WORDS]);

  useEffect(() => {
    if (phase !== "brand" || !sequenceDone) return;
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(() => onComplete?.(), EXIT_DURATION);
    }, EXIT_DELAY);
    return () => clearTimeout(timer);
  }, [phase, sequenceDone, onComplete]);

  const wordOpacity = wordPhase === "out" ? 0 : 1;
  const wordY = wordPhase === "in" ? 12 : wordPhase === "out" ? -8 : 0;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-stone_"
          exit={{ y: "-100%" }}
          transition={{
            duration: EXIT_DURATION / 1000,
            ease: [0.76, 0, 0.24, 1],
          }}
        >
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(184,151,90,0.05)_0%,transparent_60%)]" />

          <AnimatePresence mode="wait">
            {phase === "assets" ? (
              <motion.div
                key="assets"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.35, ease: [0.25, 0.1, 0.25, 1] }}
                className="relative flex flex-col items-center justify-center px-6"
              >
                <motion.div
                  initial={{ width: 0, opacity: 0 }}
                  animate={{ width: 48, opacity: 0.4 }}
                  transition={{ delay: 0.15, duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
                  className="h-px bg-gradient-to-r from-transparent via-gold to-transparent mb-8"
                />

                <p className="font-serif text-[clamp(1.25rem,3vw,1.75rem)] text-cream/90 font-light tracking-wide text-center">
                  {t.loading.assets}
                </p>

                <div className="flex gap-1.5 mt-6">
                  {[0, 1, 2].map((i) => (
                    <motion.span
                      key={i}
                      className="w-1.5 h-1.5 rounded-full bg-gold/70"
                      animate={{ opacity: [0.25, 1, 0.25] }}
                      transition={{
                        duration: 1.2,
                        repeat: Infinity,
                        delay: i * 0.2,
                        ease: "easeInOut",
                      }}
                    />
                  ))}
                </div>

                <motion.div
                  initial={{ width: 0, opacity: 0 }}
                  animate={{ width: 48, opacity: 0.4 }}
                  transition={{ delay: 0.3, duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
                  className="h-px bg-gradient-to-r from-transparent via-gold to-transparent mt-8"
                />
              </motion.div>
            ) : (
              <motion.div
                key="brand"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, ease: [0.25, 0.1, 0.25, 1] }}
                className="relative flex flex-col items-center justify-center"
              >
                <motion.div
                  initial={{ width: 0, opacity: 0 }}
                  animate={{ width: 40, opacity: 0.4 }}
                  transition={{ delay: 0.1, duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
                  className="h-px bg-gradient-to-r from-transparent via-gold to-transparent mb-10"
                />

                <div className="h-[80px] flex items-center justify-center overflow-hidden">
                  <motion.span
                    key={currentWordIndex}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: wordOpacity, y: wordY }}
                    transition={{
                      opacity: {
                        duration:
                          wordPhase === "in"
                            ? FADE_IN / 1000
                            : wordPhase === "out"
                              ? FADE_OUT / 1000
                              : 0.1,
                        ease: [0.25, 0.1, 0.25, 1],
                      },
                      y: {
                        duration: 0.5,
                        ease: [0.25, 0.1, 0.25, 1],
                      },
                    }}
                    className={`block font-serif font-light tracking-tight text-center ${
                      currentWordIndex === 0
                        ? "text-cream text-[clamp(2.5rem,6vw,4.5rem)]"
                        : "text-gold/80 text-[clamp(1.5rem,3.5vw,2.25rem)] italic"
                    }`}
                  >
                    {WORDS[currentWordIndex]}
                  </motion.span>
                </div>

                <motion.div
                  initial={{ width: 0, opacity: 0 }}
                  animate={{ width: 40, opacity: 0.4 }}
                  transition={{ delay: 0.25, duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
                  className="h-px bg-gradient-to-r from-transparent via-gold to-transparent mt-10"
                />

                <div className="flex gap-2 mt-8">
                  {WORDS.map((_, i) => (
                    <motion.div
                      key={i}
                      animate={{
                        scale: i === currentWordIndex ? 1 : 0.6,
                        opacity: i <= currentWordIndex ? 0.8 : 0.15,
                        backgroundColor:
                          i === currentWordIndex
                            ? "rgba(184,151,90,0.8)"
                            : i < currentWordIndex
                              ? "rgba(184,151,90,0.3)"
                              : "rgba(140,130,121,0.2)",
                      }}
                      transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
                      className="w-1.5 h-1.5 rounded-full"
                    />
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
