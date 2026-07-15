"use client";

import { useT } from "@/lib/i18n/LanguageContext";
import { useSiteContent } from "@/lib/i18n/ContentContext";
import { useCmsText } from "@/lib/i18n/useCmsText";

export default function Footer() {
  const t = useT();
  const c = useSiteContent();
  const cmsText = useCmsText();
  const email = cmsText(c.footer_email, t.footer.email);

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
              href={`mailto:${email}`}
              className="text-body text-gold/70 hover:text-gold transition-colors duration-500 ease-luxury cursor-hover"
            >
              {email}
            </a>
          </div>

          <div className="text-center md:text-right">
            <p className="text-caption text-warm-gray/40">
              &copy; {new Date().getFullYear()} &middot; {t.footer.credit}{" "}
              <span className="text-cream/50 font-medium tracking-wide">{c.footer_credit_name || 'VILATECH'}</span>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
