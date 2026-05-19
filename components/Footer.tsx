"use client";

import { useT } from "@/lib/i18n/LanguageContext";

export default function Footer() {
  const t = useT();

  return (
    <footer className="bg-stone_ text-warm-gray py-12 md:py-16 will-change-auto">
      <div className="max-w-wide mx-auto px-6 md:px-10">
        {/* Divider */}
        <div className="w-full h-px bg-cream/[0.06] mb-10" />

        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Brand */}
          <div className="text-center md:text-left">
            <h3 className="font-serif text-cream text-xl font-light tracking-tight">
              {t.footer.brand}
            </h3>
          </div>

          {/* Contact */}
          <div className="text-center">
            <a
              href={`mailto:${t.footer.email}`}
              className="text-body text-gold/70 hover:text-gold transition-colors duration-500 ease-luxury cursor-hover"
            >
              {t.footer.email}
            </a>
          </div>

          {/* Credit */}
          <div className="text-center md:text-right">
            <p className="text-caption text-warm-gray/40">
              &copy; {new Date().getFullYear()} &middot; {t.footer.credit}{" "}
              <span className="text-cream/50 font-medium tracking-wide">VILATECH</span>
              {" "}&middot;{" "}
              <span className="text-cream/50">{t.footer.creditName}</span>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
