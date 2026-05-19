"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import { LanguageProvider } from "@/lib/i18n/LanguageContext";
import LoadingScreen from "@/components/LoadingScreen";
import CustomCursor from "@/components/CustomCursor";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import HeroSection from "@/sections/HeroSection";

// Dynamic imports for code splitting — sections below fold load lazily
const PromiseSection = dynamic(() => import("@/sections/PromiseSection"));
const EstateSection = dynamic(() => import("@/sections/EstateSection"));
const WineSection = dynamic(() => import("@/sections/WineSection"));
const SpacesSection = dynamic(() => import("@/sections/SpacesSection"));
const LandSection = dynamic(() => import("@/sections/LandSection"), { ssr: false });
const LocationSection = dynamic(() => import("@/sections/LocationSection"));
const SeasonsSection = dynamic(() => import("@/sections/SeasonsSection"));
const BookingSection = dynamic(() => import("@/sections/BookingSection"));
const ContactSection = dynamic(() => import("@/sections/ContactSection"), { ssr: false });

export default function Home() {
  const [loaderDone, setLoaderDone] = useState(false);
  const mainRef = useRef<HTMLElement>(null);

  // Prevent ALL scrolling while loader is active — lock body
  useEffect(() => {
    if ("scrollRestoration" in history) {
      history.scrollRestoration = "manual";
    }
    // Disable smooth scrolling during loading so forced scrollTo takes effect
    document.documentElement.style.scrollBehavior = "auto";
    window.scrollTo(0, 0);

    // Lock scroll during loader
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    };
  }, []);

  // Re-enforce scroll = 0 when loaderDone fires, for the full fade-in duration
  useEffect(() => {
    if (!loaderDone) return;
    // Keep locked for 400ms more while fade-in begins (matches opacity transition start)
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";

    const timer = setTimeout(() => {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
      document.documentElement.style.scrollBehavior = "";
    }, 600); // hold lock through the first 600ms of the 1.2s fade-in
    return () => clearTimeout(timer);
  }, [loaderDone]);

  const handleLoaderComplete = useCallback(() => {
    // Forcefully reset scroll position before revealing content
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;

    // Double rAF ensures the scroll is painted before React re-renders
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
        setLoaderDone(true);
      });
    });
  }, []);

  return (
    <LanguageProvider>
      {/* Loading Experience — multi-stage word sequence → slide up → reveal hero */}
      <LoadingScreen onComplete={handleLoaderComplete} />

      {/* Custom Cursor (desktop only) */}
      <CustomCursor />

      {/* Sticky Navbar — appears after scrolling past hero */}
      <Navbar />

      {/* 
        Main Content — always in DOM so page has height.
        Opacity controlled by loaderDone to create smooth reveal.
        Hero is ALWAYS the first visible thing.
      */}
      <main
        ref={mainRef}
        style={{
          opacity: loaderDone ? 1 : 0,
          transition: "opacity 1.2s cubic-bezier(0.25, 0.1, 0.25, 1)",
          pointerEvents: loaderDone ? "auto" : "none",
        }}
      >
        {/* THE ARRIVAL — Full-viewport cinematic hero with video */}
        <HeroSection loaderDone={loaderDone} />

        {/* 01: THE PROMISE — "Some places you visit. This one, you inhabit." */}
        <PromiseSection />

        {/* 02: THE ESTATE — Video tour + premium carousel */}
        <EstateSection />

        {/* 03: THE WINE — Estate wines, USP */}
        <WineSection />

        {/* 04: THE SPACES — Three homes, one estate (14 guests) */}
        <SpacesSection />

        {/* 05: THE LAND — Parallax section: "This isn't a holiday rental" */}
        <LandSection />

        {/* 06: THE LOCATION — "Between two worlds" with distance indicators */}
        <LocationSection />

        {/* 07: THE SEASONS — Spring, Summer, Late Summer */}
        <SeasonsSection />

        {/* 08: SCHEDULE — Calendly embed for private viewings */}
        <BookingSection />

        {/* 09: THE INVITATION — Contact form with Resend email */}
        <ContactSection />
      </main>

      {/* Footer */}
      <Footer />
    </LanguageProvider>
  );
}
