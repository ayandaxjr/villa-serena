"use client";

import { useState, useRef, useEffect } from "react";
import AnimatedSection from "@/components/AnimatedSection";
import AvailabilityCalendar, { DateRange } from "@/components/AvailabilityCalendar";
import { useT, useLanguage } from "@/lib/i18n/LanguageContext";

function formatDate(iso: string, lang: string) {
  const d = new Date(iso + "T00:00:00");
  return d.toLocaleDateString(
    lang === "nl" ? "nl-NL" : lang === "it" ? "it-IT" : "en-GB",
    { day: "numeric", month: "long", year: "numeric" }
  );
}

function nights(start: string, end: string) {
  return Math.round(
    (new Date(end).getTime() - new Date(start).getTime()) / 86_400_000
  );
}

export default function BookingSection() {
  const t = useT();
  const { language } = useLanguage();

  const [selectedRange, setSelectedRange] = useState<DateRange | null>(null);
  const formRef = useRef<HTMLDivElement>(null);

  // Scroll gently to the form when dates are selected
  useEffect(() => {
    if (!selectedRange || !formRef.current) return;
    const timeout = setTimeout(() => {
      formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 320); // small delay so the form renders first
    return () => clearTimeout(timeout);
  }, [selectedRange]);

  // Form fields
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [guests, setGuests] = useState("");
  const [message, setMessage] = useState("");

  const [sending, setSending] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRange) return;
    setSending(true);
    setError(null);
    try {
      const res = await fetch("/api/inquire", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name, email, phone,
          checkIn: selectedRange.start,
          checkOut: selectedRange.end,
          guests, message,
        }),
      });
      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        throw new Error((d as { error?: string }).error || "Something went wrong.");
      }
      setSuccess(true);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setSending(false);
    }
  };

  const resetForm = () => {
    setSuccess(false);
    setSelectedRange(null);
    setName(""); setEmail(""); setPhone(""); setGuests(""); setMessage("");
  };

  const b = t.booking;
  const n = selectedRange ? nights(selectedRange.start, selectedRange.end) : 0;

  return (
    <section id="booking" className="py-section bg-cream">
      <div className="max-w-wide mx-auto px-6 md:px-10">

        {/* ── Header ─────────────────────────────────────────────────── */}
        <div className="max-w-content mx-auto text-center mb-16 md:mb-20">
          <AnimatedSection>
            <p className="section-label mb-4">{b.label}</p>
          </AnimatedSection>
          <AnimatedSection delay={0.15}>
            <h2 className="font-serif text-display text-stone_ font-light text-balance mb-6">
              {b.headline}
            </h2>
          </AnimatedSection>
          <AnimatedSection delay={0.3}>
            <div className="gold-line mx-auto mb-8" />
          </AnimatedSection>
          <AnimatedSection delay={0.4}>
            <p className="text-body-lg font-light text-stone_/70 max-w-[560px] mx-auto">
              {b.description}
            </p>
          </AnimatedSection>
        </div>

        {/* ── Instruction hint ───────────────────────────────────────── */}
        <AnimatedSection delay={0.45}>
          <p className="text-center text-caption text-warm-gray tracking-widest uppercase mb-6">
            {b.calendarHint}
          </p>
        </AnimatedSection>

        {/* ── Calendar card ──────────────────────────────────────────── */}
        <AnimatedSection delay={0.5}>
          <div className="bg-white border border-stone_/8 rounded-2xl p-6 md:p-10 mb-8">
            <AvailabilityCalendar
              onRangeSelect={setSelectedRange}
              selectedRange={selectedRange}
              lang={language}
            />
          </div>
        </AnimatedSection>

        {/* ── Inquiry form ────────────────────────────────────────────── */}
        {selectedRange && !success && (
          <div ref={formRef} className="max-w-content mx-auto bg-white border border-stone_/8 rounded-2xl p-6 md:p-10 scroll-mt-24">
            {/* Dates confirmation banner inside form */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-stone_/3 border border-stone_/8 rounded-xl px-5 py-4 mb-8">
              <div>
                <p className="text-label uppercase tracking-widest text-gold mb-1">
                  {b.selectedLabel}
                </p>
                <p className="font-serif text-body text-stone_ font-light">
                  {formatDate(selectedRange.start, language)}
                  <span className="mx-2 text-gold">→</span>
                  {formatDate(selectedRange.end, language)}
                </p>
                <p className="text-caption text-warm-gray mt-0.5">
                  {n} {n === 1 ? b.night : b.nights}
                </p>
              </div>
              <button
                onClick={() => setSelectedRange(null)}
                className="text-caption text-warm-gray hover:text-stone_ transition-colors underline underline-offset-2 decoration-warm-gray/40 shrink-0"
              >
                {b.clearDates}
              </button>
            </div>

            <div className="mb-8">
              <h3 className="font-serif text-headline text-stone_ font-light mb-2">
                {b.formTitle}
              </h3>
              <p className="text-caption text-warm-gray font-light">
                {b.formSubtitle}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-caption text-warm-gray uppercase tracking-widest mb-2">
                    {b.fieldName} <span className="text-gold">*</span>
                  </label>
                  <input
                    type="text" required value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={b.fieldNamePlaceholder}
                    className="w-full bg-cream border border-stone_/12 rounded-lg px-4 py-3 text-body font-light text-stone_ placeholder:text-warm-gray/50 focus:outline-none focus:border-gold/40 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-caption text-warm-gray uppercase tracking-widest mb-2">
                    {b.fieldEmail} <span className="text-gold">*</span>
                  </label>
                  <input
                    type="email" required value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={b.fieldEmailPlaceholder}
                    className="w-full bg-cream border border-stone_/12 rounded-lg px-4 py-3 text-body font-light text-stone_ placeholder:text-warm-gray/50 focus:outline-none focus:border-gold/40 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-caption text-warm-gray uppercase tracking-widest mb-2">
                    {b.fieldPhone}
                  </label>
                  <input
                    type="tel" value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder={b.fieldPhonePlaceholder}
                    className="w-full bg-cream border border-stone_/12 rounded-lg px-4 py-3 text-body font-light text-stone_ placeholder:text-warm-gray/50 focus:outline-none focus:border-gold/40 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-caption text-warm-gray uppercase tracking-widest mb-2">
                    {b.fieldGuests}
                  </label>
                  <input
                    type="text" value={guests}
                    onChange={(e) => setGuests(e.target.value)}
                    placeholder={b.fieldGuestsPlaceholder}
                    className="w-full bg-cream border border-stone_/12 rounded-lg px-4 py-3 text-body font-light text-stone_ placeholder:text-warm-gray/50 focus:outline-none focus:border-gold/40 transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-caption text-warm-gray uppercase tracking-widest mb-2">
                  {b.fieldMessage}
                </label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder={b.fieldMessagePlaceholder}
                  rows={4}
                  className="w-full bg-cream border border-stone_/12 rounded-lg px-4 py-3 text-body font-light text-stone_ placeholder:text-warm-gray/50 focus:outline-none focus:border-gold/40 transition-colors resize-none"
                />
              </div>

              {error && <p className="text-caption text-red-500">{error}</p>}

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={sending}
                  className="w-full sm:w-auto px-10 py-3.5 bg-stone_ text-cream font-light tracking-widest uppercase text-caption rounded-full hover:bg-gold transition-colors duration-300 disabled:opacity-50"
                >
                  {sending ? b.sending : b.submit}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ── Success state ───────────────────────────────────────────── */}
        {success && selectedRange && (
          <div className="max-w-content mx-auto bg-white border border-stone_/8 rounded-2xl p-10 md:p-14 text-center">
            <div className="gold-line mx-auto mb-8" />
            <h3 className="font-serif text-display text-stone_ font-light mb-4">
              {b.successTitle}
            </h3>
            <p className="text-body font-light text-stone_/70 mb-2">{b.successBody}</p>
            <p className="font-serif text-body text-stone_ font-light mb-2">
              {formatDate(selectedRange.start, language)}
              <span className="mx-2 text-gold">→</span>
              {formatDate(selectedRange.end, language)}
            </p>
            <p className="text-caption text-warm-gray mt-6 mb-10">{b.successNote}</p>
            <button
              onClick={resetForm}
              className="text-caption text-warm-gray hover:text-stone_ uppercase tracking-widest transition-colors"
            >
              {b.newInquiry}
            </button>
          </div>
        )}

        {/* ── No-dates hint ───────────────────────────────────────────── */}
        {!selectedRange && !success && (
          <p className="text-center text-caption text-warm-gray/50 mt-2">
            {b.calendarCta}
          </p>
        )}
      </div>
    </section>
  );
}
