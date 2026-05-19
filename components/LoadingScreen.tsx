"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState, useCallback } from "react";
import { useT } from "@/lib/i18n/LanguageContext";

/* =========================================================
   MULTI-STAGE LOADING SEQUENCE
   Word sequence from translations → slide away
   ========================================================= */

const FADE_IN = 250;
const HOLD = 350;
const FADE_OUT = 200;
const WORD_CYCLE = FADE_IN + HOLD + FADE_OUT; // ~800ms per word
const EXIT_DELAY = 100; // pause before slide-up
const EXIT_DURATION = 500; // slide-up speed (ms)

// Total: 2 words × 800ms + 100ms + 500ms ≈ 2.2s

interface LoadingScreenProps {
  onComplete?: () => void;
}

export default function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const t = useT();
  const WORDS = t.loading.words;
  const TOTAL_WORDS = WORDS.length;
  const [isVisible, setIsVisible] = useState(true);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [wordPhase, setWordPhase] = useState<"in" | "hold" | "out">("in");
  const [sequenceDone, setSequenceDone] = useState(false);

  // Cycle through words
  useEffect(() => {
    if (sequenceDone) return;

    const phases = [
      { phase: "hold" as const, delay: FADE_IN },
      { phase: "out" as const, delay: FADE_IN + HOLD },
    ];

    const timers = phases.map(({ phase, delay }) =>
      setTimeout(() => setWordPhase(phase), delay)
    );

    // Move to next word or mark sequence done
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
  }, [currentWordIndex, sequenceDone]);

  // After sequence → slide-up exit
  useEffect(() => {
    if (!sequenceDone) return;
    const timer = setTimeout(() => {
      setIsVisible(false);
      // Fire callback after exit animation completes
      setTimeout(() => onComplete?.(), EXIT_DURATION);
    }, EXIT_DELAY);
    return () => clearTimeout(timer);
  }, [sequenceDone, onComplete]);

  // Word opacity based on phase
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
            ease: [0.76, 0, 0.24, 1], // strong ease-out for cinematic slide
          }}
        >
          {/* Ambient glow — subtle gold center light */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(184,151,90,0.05)_0%,transparent_60%)]" />

          {/* Content container */}
          <div className="relative flex flex-col items-center justify-center">
            {/* Gold decorative line — top */}
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 40, opacity: 0.4 }}
              transition={{ delay: 0.3, duration: 0.8, ease: [0.25, 0.1, 0.25, 1.0] }}
              className="h-px bg-gradient-to-r from-transparent via-gold to-transparent mb-10"
            />

            {/* Word display area — fixed height to prevent layout shift */}
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
                    ease: [0.25, 0.1, 0.25, 1.0],
                  },
                  y: {
                    duration: 0.5,
                    ease: [0.25, 0.1, 0.25, 1.0],
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

            {/* Gold decorative line — bottom */}
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 40, opacity: 0.4 }}
              transition={{ delay: 0.5, duration: 0.8, ease: [0.25, 0.1, 0.25, 1.0] }}
              className="h-px bg-gradient-to-r from-transparent via-gold to-transparent mt-10"
            />

            {/* Progress dots */}
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
                  transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1.0] }}
                  className="w-1.5 h-1.5 rounded-full"
                />
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
