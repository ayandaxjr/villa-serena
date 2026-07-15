"use client";

import { useState, useCallback, useLayoutEffect, useRef, useMemo } from "react";
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

function scrollToTop() {
  window.scrollTo(0, 0);
  document.documentElement.scrollTop = 0;
  document.body.scrollTop = 0;
}

function setSiteLoading(active: boolean) {
  document.documentElement.classList.toggle("site-loading", active);
  if (active) {
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";
  } else {
    document.body.style.overflow = "";
    document.documentElement.style.overflow = "";
  }
}

function revealSiteContent() {
  scrollToTop();
  document.documentElement.classList.add("site-revealing");
}

function finishSiteReveal() {
  scrollToTop();
  document.documentElement.classList.remove("site-loading", "site-revealing");
  document.documentElement.classList.add("site-ready");
  document.body.style.overflow = "";
  document.documentElement.style.overflow = "";
}

export default function HomePage({ content }: { content: SiteContent }) {
  const [loaderDone, setLoaderDone] = useState(false);
  const [siteRevealed, setSiteRevealed] = useState(false);
  const mainRef = useRef<HTMLElement>(null);
  const preloadAssets = useMemo(() => collectHomePreloadUrls(content), [content]);

  useLayoutEffect(() => {
    if ("scrollRestoration" in history) history.scrollRestoration = "manual";
    document.documentElement.classList.remove("site-ready", "site-revealing");
    setSiteLoading(true);
    scrollToTop();
  }, []);

  /** Scroll locked at top; hero fades in underneath while loader dissolves */
  const handleBeforeLoaderExit = useCallback(() => {
    scrollToTop();
    setLoaderDone(true);
    revealSiteContent();
    setSiteRevealed(true);
  }, []);

  const handleLoaderComplete = useCallback(() => {
    finishSiteReveal();
  }, []);

  return (
    <LanguageProvider>
      <ContentProvider content={content}>
        <LoadingScreen
          assets={preloadAssets}
          onBeforeExit={handleBeforeLoaderExit}
          onComplete={handleLoaderComplete}
        />

        <div id="site-content" aria-hidden={!siteRevealed}>
          <CustomCursor />
          <Navbar />
          <main ref={mainRef} style={{ pointerEvents: siteRevealed ? "auto" : "none" }}>
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
        </div>
      </ContentProvider>
    </LanguageProvider>
  );
}
