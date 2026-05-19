"use client";

import { useEffect, useState, useCallback } from "react";

export interface DateRange {
  start: string; // "YYYY-MM-DD"
  end: string;   // "YYYY-MM-DD"
}

interface BookedPeriod {
  start: string;
  end: string;
}

interface Props {
  onRangeSelect: (range: DateRange | null) => void;
  selectedRange: DateRange | null;
  lang?: string;
}

// ── helpers ──────────────────────────────────────────────────────────────────

function toISO(d: Date): string {
  return d.toISOString().slice(0, 10);
}

function addMonths(d: Date, n: number): Date {
  const out = new Date(d);
  out.setDate(1);
  out.setMonth(out.getMonth() + n);
  return out;
}

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfWeek(year: number, month: number) {
  // 0=Mon, 6=Sun
  const d = new Date(year, month, 1).getDay();
  return (d + 6) % 7;
}

function parseISO(s: string): Date {
  const [y, m, d] = s.split("-").map(Number);
  return new Date(y, m - 1, d);
}

function compareDates(a: string, b: string) {
  return parseISO(a).getTime() - parseISO(b).getTime();
}

// ── per-language calendar strings ─────────────────────────────────────────────

const LABELS: Record<string, { months: string[]; days: string[]; prev: string; next: string; legend: { available: string; unavailable: string; selected: string } }> = {
  en: {
    months: ["January","February","March","April","May","June","July","August","September","October","November","December"],
    days: ["Mo","Tu","We","Th","Fr","Sa","Su"],
    prev: "← Previous",
    next: "Next →",
    legend: { available: "Available", unavailable: "Unavailable", selected: "Your stay" },
  },
  nl: {
    months: ["Januari","Februari","Maart","April","Mei","Juni","Juli","Augustus","September","Oktober","November","December"],
    days: ["Ma","Di","Wo","Do","Vr","Za","Zo"],
    prev: "← Vorige",
    next: "Volgende →",
    legend: { available: "Beschikbaar", unavailable: "Bezet", selected: "Uw verblijf" },
  },
  it: {
    months: ["Gennaio","Febbraio","Marzo","Aprile","Maggio","Giugno","Luglio","Agosto","Settembre","Ottobre","Novembre","Dicembre"],
    days: ["Lu","Ma","Me","Gi","Ve","Sa","Do"],
    prev: "← Precedente",
    next: "Successivo →",
    legend: { available: "Disponibile", unavailable: "Non disponibile", selected: "Il vostro soggiorno" },
  },
};

// ── main component ────────────────────────────────────────────────────────────

export default function AvailabilityCalendar({ onRangeSelect, selectedRange, lang = "en" }: Props) {
  const L = LABELS[lang] ?? LABELS.en;

  const today = toISO(new Date());
  const [bookedPeriods, setBookedPeriods] = useState<BookedPeriod[]>([]);
  const [loadingAvail, setLoadingAvail] = useState(true);

  // offset in months from today's month
  const [offset, setOffset] = useState(0);

  // for date range picking: first click → pickStart, second → pickEnd
  const [pickStart, setPickStart] = useState<string | null>(selectedRange?.start ?? null);
  const [pickEnd, setPickEnd] = useState<string | null>(selectedRange?.end ?? null);
  const [hoverDate, setHoverDate] = useState<string | null>(null);

  // how many months to show side by side (responsive)
  const [monthsToShow, setMonthsToShow] = useState(3);
  useEffect(() => {
    const update = () => setMonthsToShow(window.innerWidth < 768 ? 1 : window.innerWidth < 1200 ? 2 : 3);
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  // Fetch booked periods
  useEffect(() => {
    fetch("/api/availability")
      .then((r) => r.json())
      .then((data) => {
        setBookedPeriods(data.periods ?? []);
        setLoadingAvail(false);
      })
      .catch(() => setLoadingAvail(false));
  }, []);

  // Keep internal state in sync with parent
  useEffect(() => {
    setPickStart(selectedRange?.start ?? null);
    setPickEnd(selectedRange?.end ?? null);
  }, [selectedRange]);

  // ── date helpers ────────────────────────────────────────────────────────────

  const isBooked = useCallback(
    (iso: string) =>
      bookedPeriods.some(
        (p) => compareDates(iso, p.start) >= 0 && compareDates(iso, p.end) <= 0
      ),
    [bookedPeriods]
  );

  const isPast = (iso: string) => iso < today;

  const isUnavailable = (iso: string) => isPast(iso) || isBooked(iso);

  const isRangeBlocked = (start: string, end: string) => {
    // Check if any day between start..end is booked
    const s = parseISO(start);
    const e = parseISO(end);
    for (let d = new Date(s); d <= e; d.setDate(d.getDate() + 1)) {
      if (isBooked(toISO(d))) return true;
    }
    return false;
  };

  // For range highlighting
  const effectiveEnd = pickStart && !pickEnd ? hoverDate : pickEnd;

  const isInRange = (iso: string) => {
    if (!pickStart || !effectiveEnd) return false;
    const [a, b] =
      compareDates(pickStart, effectiveEnd) <= 0
        ? [pickStart, effectiveEnd]
        : [effectiveEnd, pickStart];
    return iso > a && iso < b;
  };

  const isRangeStart = (iso: string) => {
    if (!pickStart || !effectiveEnd) return iso === pickStart;
    const [a] =
      compareDates(pickStart, effectiveEnd) <= 0
        ? [pickStart, effectiveEnd]
        : [effectiveEnd, pickStart];
    return iso === a;
  };

  const isRangeEnd = (iso: string) => {
    if (!pickStart || !effectiveEnd) return false;
    const [, b] =
      compareDates(pickStart, effectiveEnd) <= 0
        ? [pickStart, effectiveEnd]
        : [effectiveEnd, pickStart];
    return iso === b;
  };

  // ── click handler ────────────────────────────────────────────────────────────

  const handleDayClick = (iso: string) => {
    if (isUnavailable(iso)) return;

    if (!pickStart || (pickStart && pickEnd)) {
      // Start fresh
      setPickStart(iso);
      setPickEnd(null);
      onRangeSelect(null);
      return;
    }

    // Second click — determine start/end order
    const [s, e] =
      compareDates(pickStart, iso) <= 0 ? [pickStart, iso] : [iso, pickStart];

    // Block if any booked day in range
    if (isRangeBlocked(s, e)) {
      setPickStart(iso);
      setPickEnd(null);
      onRangeSelect(null);
      return;
    }

    setPickEnd(e);
    setPickStart(s);
    onRangeSelect({ start: s, end: e });
  };

  // ── render a single month ────────────────────────────────────────────────────

  const renderMonth = (year: number, month: number) => {
    const daysInMonth = getDaysInMonth(year, month);
    const firstDow = getFirstDayOfWeek(year, month);

    const cells: (string | null)[] = [
      ...Array(firstDow).fill(null),
      ...Array.from({ length: daysInMonth }, (_, i) =>
        toISO(new Date(year, month, i + 1))
      ),
    ];

    return (
      <div key={`${year}-${month}`} className="flex-1 min-w-0">
        {/* Month title */}
        <p className="text-center font-serif text-body text-stone_ font-light mb-4 tracking-wide">
          {L.months[month]} {year}
        </p>

        {/* Day-of-week headers */}
        <div className="grid grid-cols-7 mb-1">
          {L.days.map((d) => (
            <div
              key={d}
              className="text-center text-[10px] uppercase tracking-widest text-warm-gray/70 pb-2"
            >
              {d}
            </div>
          ))}
        </div>

        {/* Day cells */}
        <div className="grid grid-cols-7 gap-y-0.5">
          {cells.map((iso, idx) => {
            if (!iso)
              return <div key={`empty-${idx}`} className="aspect-square" />;

            const booked = isBooked(iso);
            const past = isPast(iso);
            const unavail = past || booked;
            const inRange = isInRange(iso);
            const rangeStart = isRangeStart(iso);
            const rangeEnd = isRangeEnd(iso);

            let cellClass =
              "aspect-square flex items-center justify-center text-[13px] select-none transition-colors duration-100 ";

            if (unavail) {
              cellClass += "text-stone_/20 cursor-not-allowed ";
              if (booked)
                cellClass +=
                  "relative after:absolute after:inset-x-2 after:top-1/2 after:h-px after:bg-stone_/20 ";
            } else if (rangeStart || rangeEnd) {
              cellClass += "bg-gold text-white font-medium cursor-pointer rounded-full z-10 ";
            } else if (inRange) {
              cellClass += "bg-gold/10 text-stone_ cursor-pointer ";
              if (rangeStart) cellClass += "rounded-l-full ";
              if (rangeEnd) cellClass += "rounded-r-full ";
            } else {
              cellClass +=
                "text-stone_ cursor-pointer hover:bg-gold/10 hover:rounded-full ";
            }

            return (
              <div
                key={iso}
                className={cellClass}
                onClick={() => handleDayClick(iso)}
                onMouseEnter={() => !unavail && setHoverDate(iso)}
                onMouseLeave={() => setHoverDate(null)}
                title={booked ? "Unavailable" : undefined}
              >
                {new Date(iso + "T00:00:00").getDate()}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  // ── compute which months to show ─────────────────────────────────────────────

  const baseDate = addMonths(new Date(), offset);
  const months = Array.from({ length: monthsToShow }, (_, i) => {
    const d = addMonths(baseDate, i);
    return { year: d.getFullYear(), month: d.getMonth() };
  });

  return (
    <div>
      {/* Navigation */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => setOffset((o) => o - monthsToShow)}
          disabled={offset <= 0}
          className="text-caption text-warm-gray hover:text-stone_ disabled:opacity-30 disabled:cursor-not-allowed transition-opacity"
        >
          {L.prev}
        </button>
        <button
          onClick={() => setOffset((o) => o + monthsToShow)}
          className="text-caption text-warm-gray hover:text-stone_ transition-opacity"
        >
          {L.next}
        </button>
      </div>

      {/* Month grid */}
      <div className="flex gap-8 md:gap-10 min-h-[280px]">
        {loadingAvail ? (
          <div className="flex-1 flex items-center justify-center text-warm-gray/50 text-caption">
            Loading availability…
          </div>
        ) : (
          months.map(({ year, month }) => renderMonth(year, month))
        )}
      </div>

      {/* Legend */}
      <div className="flex items-center gap-6 mt-6 pt-5 border-t border-stone_/8 flex-wrap">
        <LegendItem color="bg-white border border-stone_/15" label={L.legend.available} />
        <LegendItem color="bg-stone_/8 border border-stone_/15 relative overflow-hidden before:absolute before:inset-0 before:bg-[repeating-linear-gradient(-45deg,transparent,transparent_3px,rgba(0,0,0,.06)_3px,rgba(0,0,0,.06)_4px)]" label={L.legend.unavailable} />
        <LegendItem color="bg-gold" label={L.legend.selected} />
      </div>
    </div>
  );
}

function LegendItem({ color, label }: { color: string; label: string }) {
  return (
    <div className="flex items-center gap-2">
      <div className={`w-4 h-4 rounded-full ${color}`} />
      <span className="text-caption text-warm-gray font-light">{label}</span>
    </div>
  );
}
