"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useState, useEffect } from "react";
import { useLanguage, languageLabels, type Language } from "@/lib/i18n/LanguageContext";
import { useSiteContent } from "@/lib/i18n/ContentContext";
import { useCmsText } from "@/lib/i18n/useCmsText";

const langs: Language[] = ["en", "nl", "it"];

export default function Navbar() {
  const [isVisible, setIsVisible] = useState(false);
  const { scrollY } = useScroll();
  const bgOpacity = useTransform(scrollY, [0, 100], [0, 0.95]);
  const { language, setLanguage, t } = useLanguage();
  const c = useSiteContent();
  const cmsText = useCmsText();

  useEffect(() => {
    const handleScroll = () => {
      // Show after scrolling past the hero (100vh)
      setIsVisible(window.scrollY > window.innerHeight * 0.8);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: isVisible ? 0 : -100 }}
      transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1.0] }}
      className="fixed top-0 left-0 right-0 z-50 px-6 md:px-10"
    >
      <motion.div
        style={{ opacity: bgOpacity }}
        className="absolute inset-0 bg-stone_ backdrop-blur-md"
      />
      <div className="relative flex items-center justify-between h-16 md:h-20 max-w-full-bleed mx-auto">
        {/* Logo */}
        <button
          onClick={() => scrollToSection("hero")}
          className="font-serif text-cream text-xl md:text-2xl font-light tracking-tight cursor-hover"
        >
          {cmsText(c.nav_logo, t.nav.logo)}
        </button>

        {/* Right side: Language Switcher + CTA */}
        <div className="flex items-center gap-4 md:gap-6">
          {/* Language Switcher */}
          <div className="flex items-center gap-0.5 sm:gap-1">
            {langs.map((lang) => (
              <button
                key={lang}
                onClick={() => setLanguage(lang)}
                className={`text-[10px] md:text-[11px] font-sans uppercase tracking-[0.15em] px-2 py-1 rounded-sm transition-all duration-300
                  ${language === lang
                    ? "text-gold bg-gold/10 font-medium"
                    : "text-cream/40 hover:text-cream/70"
                  }`}
              >
                {languageLabels[lang]}
              </button>
            ))}
          </div>

          {/* Divider */}
          <div className="w-px h-4 bg-cream/10" />

          {/* CTA */}
          <button
            onClick={() => scrollToSection("contact")}
            className="text-label uppercase tracking-[0.2em] text-gold hover:text-cream 
                       transition-colors duration-500 ease-luxury cursor-hover"
          >
            {cmsText(c.nav_cta, t.nav.cta)}
          </button>
        </div>
      </div>
    </motion.nav>
  );
}
