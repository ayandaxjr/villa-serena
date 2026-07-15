"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useRef, useEffect, useCallback } from "react";
import { useT } from "@/lib/i18n/LanguageContext";
import { useSiteContent } from "@/lib/i18n/ContentContext";

/* =========================================================
   TYPEFORM-STYLE MULTI-STEP CONTACT FORM — V2 (Improved)
   One question per screen · smooth transitions · premium UX
   Better spacing, alignment, responsiveness, mobile UX
   ========================================================= */

interface FormData {
  name: string;
  email: string;
  phone: string;
  guests: string;
  preferredDate: string;
  message: string;
}

type FieldKey = keyof FormData;

interface Step {
  key: FieldKey;
  type: string;
  required: boolean;
  isTextArea?: boolean;
}

const steps: Step[] = [
  { key: "name", type: "text", required: true },
  { key: "email", type: "email", required: true },
  { key: "phone", type: "tel", required: false },
  { key: "guests", type: "text", required: false },
  { key: "preferredDate", type: "text", required: false },
  { key: "message", type: "text", required: false, isTextArea: true },
];

const TOTAL_STEPS = steps.length;

/* Slide direction variants — smoother cubic bezier */
const slideVariants = {
  enter: (dir: number) => ({
    y: dir > 0 ? 50 : -50,
    opacity: 0,
    filter: "blur(4px)",
  }),
  center: {
    y: 0,
    opacity: 1,
    filter: "blur(0px)",
  },
  exit: (dir: number) => ({
    y: dir > 0 ? -50 : 50,
    opacity: 0,
    filter: "blur(4px)",
  }),
};

export default function ContactSection() {
  const t = useT();
  const c = useSiteContent();
  const contactEmail = c.contact_email || c.footer_email || 'info@villa-serena.nl';
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    phone: "",
    guests: "",
    preferredDate: "",
    message: "",
  });
  const [currentStep, setCurrentStep] = useState(0);
  const [direction, setDirection] = useState(1);
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);

  // Auto-focus input on step change
  useEffect(() => {
    const timer = setTimeout(() => {
      inputRef.current?.focus();
    }, 450);
    return () => clearTimeout(timer);
  }, [currentStep]);

  const currentStepData = steps[currentStep];
  const currentStepText = t.contact.steps[currentStep];
  const progress = ((currentStep + 1) / TOTAL_STEPS) * 100;

  const canProceed = useCallback(() => {
    const val = formData[currentStepData.key].trim();
    if (currentStepData.required && !val) return false;
    if (currentStepData.key === "email" && val) {
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
    }
    return true;
  }, [formData, currentStepData]);

  const goNext = useCallback(() => {
    if (!canProceed()) return;
    if (currentStep < TOTAL_STEPS - 1) {
      setDirection(1);
      setCurrentStep((s) => s + 1);
    }
  }, [canProceed, currentStep]);

  const goBack = useCallback(() => {
    if (currentStep > 0) {
      setDirection(-1);
      setCurrentStep((s) => s - 1);
    }
  }, [currentStep]);

  // Enter key → next step or submit
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        if (currentStep === TOTAL_STEPS - 1) {
          handleSubmit();
        } else {
          goNext();
        }
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentStep, goNext]
  );

  const handleSubmit = async () => {
    if (!canProceed()) return;
    setStatus("sending");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setStatus("sent");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { value } = e.target;
    setFormData((prev) => ({ ...prev, [currentStepData.key]: value }));
  };

  /* ========================= SUCCESS STATE ========================= */
  if (status === "sent") {
    return (
      <section id="contact" className="relative min-h-[100svh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-stone_" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_30%,rgba(184,151,90,0.06)_0%,transparent_55%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_80%_80%,rgba(107,123,76,0.03)_0%,transparent_40%)]" />

        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 30 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1.0] }}
          className="relative z-10 text-center px-6 sm:px-10 max-w-lg mx-auto"
        >
          {/* Success icon */}
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.3, duration: 0.6, type: "spring", stiffness: 200 }}
            className="w-20 h-20 sm:w-24 sm:h-24 mx-auto mb-10 rounded-full border border-gold/30 flex items-center justify-center"
          >
            <svg className="w-8 h-8 sm:w-10 sm:h-10 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </motion.div>

          <h2 className="font-serif text-headline sm:text-display text-cream font-light mb-4">
            {t.contact.successTitle}
          </h2>
          <p className="text-body sm:text-body-lg font-light text-cream/60 mb-3 leading-relaxed">
            {t.contact.successBody}<br />
            {t.contact.successBody2}
          </p>
          <div className="gold-line mx-auto mt-8 mb-6" />
          <p className="text-caption text-cream/30 font-light">
            {t.contact.successNote}
          </p>
        </motion.div>
      </section>
    );
  }

  /* ========================= MULTI-STEP FORM ========================= */
  return (
    <section id="contact" className="relative min-h-[100svh] flex flex-col overflow-hidden">
      {/* Dark background */}
      <div className="absolute inset-0 bg-stone_" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_30%,rgba(184,151,90,0.06)_0%,transparent_55%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_80%_80%,rgba(107,123,76,0.03)_0%,transparent_40%)]" />

      {/* ===== PROGRESS BAR ===== */}
      <div className="relative z-20 w-full">
        <div className="h-[2px] bg-cream/[0.06] w-full">
          <motion.div
            className="h-full bg-gradient-to-r from-gold/80 to-gold"
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
          />
        </div>
      </div>

      {/* ===== SECTION HEADER (visible at top) ===== */}
      <div className="relative z-10 pt-14 sm:pt-16 pb-2 text-center">
        <p className="text-[10px] font-sans uppercase tracking-[0.35em] text-gold/40 font-medium">
          {t.contact.sectionLabel}
        </p>
      </div>

      {/* ===== MAIN CONTENT ===== */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-5 sm:px-8 md:px-10 py-10 sm:py-16">
        {/* Step counter */}
        <motion.div
          key={`counter-${currentStep}`}
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
          className="mb-8 sm:mb-10"
        >
          <span className="text-[11px] font-sans uppercase tracking-[0.3em] text-gold/50 font-medium">
            {String(currentStep + 1).padStart(2, "0")} / {String(TOTAL_STEPS).padStart(2, "0")}
          </span>
        </motion.div>

        {/* Animated step content */}
        <div className="w-full max-w-xl mx-auto" style={{ minHeight: "280px" }}>
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={currentStep}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
              className="flex flex-col items-center text-center"
            >
              {/* Question label */}
              <h2 className="font-serif text-[clamp(1.5rem,4vw,2.75rem)] text-cream font-light mb-3 sm:mb-4 text-balance leading-tight">
                {currentStepText.label}
              </h2>
              <p className="text-body font-light text-cream/35 mb-8 sm:mb-12 max-w-md leading-relaxed">
                {currentStepText.sublabel}
              </p>

              {/* Input field — improved styling */}
              <div className="w-full max-w-lg">
                {currentStepData.isTextArea ? (
                  <textarea
                    ref={inputRef as React.RefObject<HTMLTextAreaElement>}
                    value={formData[currentStepData.key]}
                    onChange={handleChange}
                    onKeyDown={handleKeyDown}
                    placeholder={currentStepText.placeholder}
                    rows={4}
                    className="w-full bg-transparent border-b-2 border-cream/10 py-4 sm:py-5 
                               text-[clamp(1.1rem,2.5vw,1.75rem)] font-serif font-light text-cream
                               placeholder:text-cream/15 focus:outline-none focus:border-gold/50 
                               transition-colors duration-500 resize-none text-center
                               caret-gold/60"
                  />
                ) : (
                  <input
                    ref={inputRef as React.RefObject<HTMLInputElement>}
                    type={currentStepData.type}
                    value={formData[currentStepData.key]}
                    onChange={handleChange}
                    onKeyDown={handleKeyDown}
                    placeholder={currentStepText.placeholder}
                    className="w-full bg-transparent border-b-2 border-cream/10 py-4 sm:py-5 
                               text-[clamp(1.1rem,2.5vw,1.75rem)] font-serif font-light text-cream
                               placeholder:text-cream/15 focus:outline-none focus:border-gold/50 
                               transition-colors duration-500 text-center
                               caret-gold/60"
                  />
                )}
              </div>

              {/* Enter hint — desktop only */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="hidden sm:block text-[11px] font-sans uppercase tracking-[0.2em] text-cream/15 mt-6"
              >
                {t.contact.enterHint} <span className="text-cream/30">{t.contact.enterKey}</span> {t.contact.enterContinue}
              </motion.p>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* ===== NAVIGATION BUTTONS ===== */}
        <div className="flex items-center gap-3 sm:gap-4 mt-8 sm:mt-12">
          {/* Back button */}
          <motion.button
            onClick={goBack}
            initial={false}
            animate={{ opacity: currentStep > 0 ? 1 : 0, scale: currentStep > 0 ? 1 : 0.8 }}
            transition={{ duration: 0.3 }}
            disabled={currentStep === 0}
            className="w-11 h-11 sm:w-12 sm:h-12 rounded-full border border-cream/12 flex items-center justify-center
                       hover:border-cream/30 active:scale-95 transition-all duration-300 disabled:pointer-events-none"
            aria-label="Previous step"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="text-cream/40 rotate-180">
              <path d="M6 3L11 8L6 13" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </motion.button>

          {/* Next / Submit button */}
          {currentStep === TOTAL_STEPS - 1 ? (
            <motion.button
              onClick={handleSubmit}
              disabled={status === "sending" || !canProceed()}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              className="px-8 sm:px-10 py-3.5 sm:py-4 bg-gold text-stone_ text-[11px] sm:text-label uppercase tracking-[0.2em] font-sans font-medium
                         border border-gold rounded-sm transition-all duration-500 ease-luxury
                         hover:bg-transparent hover:text-gold
                         disabled:opacity-40 disabled:pointer-events-none"
            >
              {status === "sending" ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  {t.contact.sending}
                </span>
              ) : (
                t.contact.submit
              )}
            </motion.button>
          ) : (
            <motion.button
              onClick={goNext}
              disabled={!canProceed()}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              className="px-8 sm:px-10 py-3.5 sm:py-4 bg-transparent text-cream text-[11px] sm:text-label uppercase tracking-[0.2em] font-sans font-medium
                         border border-cream/20 rounded-sm transition-all duration-500 ease-luxury
                         hover:border-cream/50 hover:bg-cream/5 active:bg-cream/10
                         disabled:opacity-20 disabled:pointer-events-none"
            >
              {t.contact.next}
            </motion.button>
          )}
        </div>

        {/* Step indicator dots — mobile friendly */}
        <div className="flex gap-1.5 mt-6 sm:mt-8">
          {steps.map((_, i) => (
            <motion.div
              key={i}
              animate={{
                width: i === currentStep ? 20 : 6,
                opacity: i <= currentStep ? 0.7 : 0.15,
                backgroundColor:
                  i === currentStep
                    ? "rgba(184,151,90,0.8)"
                    : i < currentStep
                    ? "rgba(184,151,90,0.35)"
                    : "rgba(140,130,121,0.2)",
              }}
              transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
              className="h-1.5 rounded-full"
            />
          ))}
        </div>

        {/* Error state */}
        <AnimatePresence>
          {status === "error" && (
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="text-caption text-terracotta mt-6 sm:mt-8 text-center max-w-md px-4"
            >
              {t.contact.errorText}{" "}
              <a href={`mailto:${contactEmail}`} className="text-gold/80 underline underline-offset-4">
                {contactEmail}
              </a>
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      {/* ===== BOTTOM DECORATION ===== */}
      <div className="relative z-10 pb-8 sm:pb-10 text-center">
        <p className="text-[10px] font-sans uppercase tracking-[0.3em] text-cream/10">
          {t.contact.bottomNote}
        </p>
      </div>
    </section>
  );
}
