"use client";

import { useState, useCallback, useEffect, useRef, useMemo } from "react";
import dynamic from "next/dynamic";
import { LanguageProvider } from "@/lib/i18n/LanguageContext";
import { ContentProvider } from "@/lib/i18n/ContentContext";
import type { SiteContent } from "@/lib/content";
import { collectHomePreloadUrls } from "@/lib/preload-assets";
import LoadingScreen from "@/components/LoadingScreen";
import CustomCursor from "@/components/CustomCursor";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import HeroSection from "@/sections/HeroSection";

import PromiseSection from "@/sections/PromiseSection";
import EstateSection from "@/sections/EstateSection";
import WineSection from "@/sections/WineSection";
import SeasonsSection from "@/sections/SeasonsSection";

const LandSection     = dynamic(() => import("@/sections/LandSection"), { ssr: false });
const LocationSection = dynamic(() => import("@/sections/LocationSection"));
const BookingSection  = dynamic(() => import("@/sections/BookingSection"));
const ContactSection  = dynamic(() => import("@/sections/ContactSection"), { ssr: false });

export default function HomePage({ content }: { content: SiteContent }) {
  const [loaderDone, setLoaderDone] = useState(false);
  const mainRef = useRef<HTMLElement>(null);
  const preloadAssets = useMemo(() => collectHomePreloadUrls(content), [content]);

  useEffect(() => {
    if ("scrollRestoration" in history) history.scrollRestoration = "manual";
    document.documentElement.style.scrollBehavior = "auto";
    window.scrollTo(0, 0);
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    };
  }, []);

  useEffect(() => {
    if (!loaderDone) return;
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";
    const timer = setTimeout(() => {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
      document.documentElement.style.scrollBehavior = "";
    }, 600);
    return () => clearTimeout(timer);
  }, [loaderDone]);

  const handleLoaderComplete = useCallback(() => {
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
        setLoaderDone(true);
      });
    });
  }, []);

  return (
    <LanguageProvider>
      {/* ContentProvider makes CMS content available to all sections */}
      <ContentProvider content={content}>
        <LoadingScreen assets={preloadAssets} onComplete={handleLoaderComplete} />
        <CustomCursor />
        <Navbar />
        <main
          ref={mainRef}
          aria-hidden={!loaderDone}
          style={{
            opacity: loaderDone ? 1 : 0,
            transition: "opacity 1.2s cubic-bezier(0.25, 0.1, 0.25, 1)",
            pointerEvents: loaderDone ? "auto" : "none",
          }}
        >
          <HeroSection loaderDone={loaderDone} />
          <PromiseSection />
          <EstateSection />
          <WineSection />
          <LandSection />
          <LocationSection />
          <SeasonsSection />
          <BookingSection />
          <ContactSection />
        </main>
        <Footer />
      </ContentProvider>
    </LanguageProvider>
  );
}
