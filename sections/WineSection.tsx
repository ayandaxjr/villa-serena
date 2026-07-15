"use client";

import AnimatedSection, { StaggerContainer, StaggerItem } from "@/components/AnimatedSection";
import { useT } from "@/lib/i18n/LanguageContext";
import { useSiteContent } from "@/lib/i18n/ContentContext";
import { useCmsText } from "@/lib/i18n/useCmsText";
import { PHOTOS } from "@/lib/site-assets";
import { resolvePhoto } from "@/lib/resolve-photo";

const wineStaticData = [
  { id: 1, imageKey: 'wine_1_image' as const, defaultImage: PHOTOS.wine1 },
  { id: 2, imageKey: 'wine_2_image' as const, defaultImage: PHOTOS.wine2 },
  { id: 3, imageKey: 'wine_3_image' as const, defaultImage: PHOTOS.wine3 },
];

interface Wine {
  id: number;
  name: string;
  subtitle: string;
  description: string;
  image: string;
}

function WineCard({ wine }: { wine: Wine }) {
  return (
    <div className="flex flex-col items-center text-center">
      <div className="w-full max-w-[280px] mx-auto">
        <div className="relative aspect-[3/4] rounded-xl overflow-hidden bg-stone_/5 mb-6">
          <img
            src={wine.image}
            alt={wine.name}
            loading="eager"
            decoding="async"
            className="absolute inset-0 w-full h-full object-cover"
          />
        </div>
        <h3 className="font-serif text-xl md:text-2xl text-stone_ font-light mb-2">
          {wine.name}
        </h3>
        <p className="font-serif text-base md:text-lg text-gold/75 font-light italic mb-5">
          {wine.subtitle}
        </p>
        <p className="font-sans text-body text-warm-gray font-light leading-relaxed">
          {wine.description}
        </p>
      </div>
    </div>
  );
}

export default function WineSection() {
  const t = useT();
  const c = useSiteContent();
  const cmsText = useCmsText();

  const wines = wineStaticData.map((s, i) => {
    const cmsName = [c.wine_1_name, c.wine_2_name, c.wine_3_name][i];
    const cmsType = [c.wine_1_type, c.wine_2_type, c.wine_3_type][i];
    const cmsDesc = [c.wine_1_desc, c.wine_2_desc, c.wine_3_desc][i];
    const cmsImage = resolvePhoto(c[s.imageKey], s.defaultImage);
    return {
      id: s.id,
      name: cmsText(cmsName, t.wine.wines[i].name),
      subtitle: cmsText(cmsType, t.wine.wines[i].subtitle),
      description: cmsText(cmsDesc, t.wine.wines[i].description),
      image: cmsImage,
    };
  });

  const heroImage = PHOTOS.wineHero;

  return (
    <section id="wine" className="py-section bg-light-cream relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_20%,rgba(184,151,90,0.04)_0%,transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_80%_70%,rgba(107,123,76,0.03)_0%,transparent_40%)]" />

      <div className="relative max-w-wide mx-auto px-6 md:px-10">
        <div className="max-w-content mx-auto text-center mb-12 md:mb-16">
          <AnimatedSection>
            <p className="section-label mb-4">{t.wine.label}</p>
          </AnimatedSection>
          <AnimatedSection delay={0.15}>
            <h2 className="font-serif text-display text-stone_ font-light text-balance mb-6">
              {cmsText(c.wine_headline, t.wine.headline)}
            </h2>
          </AnimatedSection>
          <AnimatedSection delay={0.3}>
            <div className="gold-line mx-auto mb-8" />
          </AnimatedSection>
          <AnimatedSection delay={0.4}>
            <p className="text-body-lg font-light text-warm-gray max-w-xl mx-auto leading-relaxed">
              {cmsText(c.wine_description, t.wine.description)}
            </p>
          </AnimatedSection>
        </div>

        <AnimatedSection delay={0.2}>
          <div className="flex justify-center mb-14 md:mb-20">
            <div className="w-full max-w-2xl">
              <img
                src={heroImage}
                alt="Villa Serena estate wines"
                loading="eager"
                decoding="async"
                fetchPriority="high"
                className="w-full h-auto rounded-2xl object-cover"
              />
            </div>
          </div>
        </AnimatedSection>

        <StaggerContainer
          className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8 lg:gap-10 max-w-6xl mx-auto"
          staggerDelay={0.14}
        >
          {wines.map((wine) => (
            <StaggerItem key={wine.id}>
              <WineCard wine={wine} />
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}
