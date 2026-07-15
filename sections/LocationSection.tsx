"use client";

import AnimatedSection from "@/components/AnimatedSection";
import { useT } from "@/lib/i18n/LanguageContext";
import { useSiteContent } from "@/lib/i18n/ContentContext";
import { useCmsText } from "@/lib/i18n/useCmsText";

// Villa Serena coordinates — Umbria, near Città della Pieve
const VILLA_LAT = 43.0055;
const VILLA_LNG = 12.349;
const GOOGLE_MAPS_DIRECTIONS = `https://www.google.com/maps/dir/?api=1&destination=${VILLA_LAT},${VILLA_LNG}`;
const GOOGLE_MAPS_EMBED = `https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d47607.12!2d${VILLA_LNG}!3d${VILLA_LAT}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x132e9b9cdea95b73%3A0x7fc4b3a5d4ff8ee0!2sCitt%C3%A0%20della%20Pieve%2C%20Province%20of%20Perugia%2C%20Italy!5e0!3m2!1sen!2snl!4v1747238400000!5m2!1sen!2snl`;

export default function LocationSection() {
  const t = useT();
  const c = useSiteContent();
  const cmsText = useCmsText();

  return (
    <section id="location" className="py-section bg-light-cream">
      <div className="max-w-wide mx-auto px-6 md:px-10">
        {/* Header */}
        <div className="max-w-content mx-auto text-center mb-16 md:mb-24">
          <AnimatedSection>
            <p className="section-label mb-4">{t.location.label}</p>
          </AnimatedSection>
          <AnimatedSection delay={0.15}>
            <h2 className="font-serif text-display text-stone_ font-light text-balance">
              {cmsText(c.location_headline, t.location.headline)}
            </h2>
          </AnimatedSection>
        </div>

        {/* Two-column layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 items-center">
          {/* Text */}
          <AnimatedSection direction="left">
            <div className="max-w-lg">
              <p className="text-body-lg font-light text-stone_/80 leading-relaxed mb-8">
                {cmsText(c.location_body1, t.location.body1)}
              </p>
              <p className="text-body-lg font-light text-stone_/80 leading-relaxed mb-10">
                {cmsText(c.location_body2, t.location.body2)}
              </p>

              {/* Distance indicators */}
              <div className="space-y-4">
                {t.location.distances.map((item) => (
                  <div
                    key={item.place}
                    className="flex items-center justify-between border-b border-stone_/8 pb-3"
                  >
                    <span className="font-serif text-subhead text-stone_ font-light">
                      {item.place}
                    </span>
                    <span className="text-caption uppercase tracking-[0.1em] text-warm-gray">
                      {item.time}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </AnimatedSection>

          {/* Google Maps — real map with working embed URL, no API key needed */}
          <AnimatedSection direction="right" delay={0.2}>
            <div className="flex flex-col gap-4">
              {/* Map iframe */}
              <div className="relative overflow-hidden rounded-xl border border-stone_/10 shadow-sm" style={{ aspectRatio: "1 / 1" }}>
                <iframe
                  src={GOOGLE_MAPS_EMBED}
                  className="absolute inset-0 w-full h-full border-0"
                  title="Villa Serena — Umbria, Italy"
                  loading="lazy"
                  allowFullScreen
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>

              {/* Get Directions CTA */}
              <a
                href={GOOGLE_MAPS_DIRECTIONS}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-3 w-full py-3.5 px-6 border border-stone_/15 rounded-xl bg-white hover:bg-stone_ hover:text-cream hover:border-stone_ transition-colors duration-300 group"
              >
                <svg viewBox="0 0 20 20" fill="none" className="w-4 h-4 text-gold group-hover:text-gold flex-shrink-0" stroke="currentColor" strokeWidth="1.4">
                  <path d="M10 2C6.13 2 3 5.13 3 9c0 5.25 7 9 7 9s7-3.75 7-9c0-3.87-3.13-7-7-7z" />
                  <circle cx="10" cy="9" r="2.5" />
                </svg>
                <span className="text-caption uppercase tracking-widest text-stone_ group-hover:text-cream transition-colors">
                  {t.location.getDirections}
                </span>
              </a>
            </div>
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
}
