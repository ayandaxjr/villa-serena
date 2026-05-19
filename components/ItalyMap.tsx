"use client";

import { useT } from "@/lib/i18n/LanguageContext";

/*
  Custom geographic illustration of central Italy.
  All coordinates projected from real lat/lng into SVG space:
    x = (lng - 10.5) / 3.5 * 400
    y = (44.5 - lat) / 3.0 * 400

  Key points:
    Villa Serena  43.00, 12.40  → 217, 200
    Perugia       43.11, 12.39  → 216, 185
    Lake Trasimeno43.13, 12.08  → 181, 182
    Cortona       43.27, 11.99  → 170, 163
    Città d.Pieve 42.95, 12.00  → 171, 207
    Florence      43.77, 11.25  →  86,  96
    Rome          41.90, 12.50  → 229, 347
    Spoleto       42.74, 12.74  → 256, 229
    Assisi        43.07, 12.62  → 240, 191
*/

export default function ItalyMap() {
  const t = useT();

  // SVG viewBox 0 0 400 460
  // We show the full central Italy strip + legend

  return (
    <svg
      viewBox="0 0 400 440"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-full"
      aria-label="Map showing Villa Serena location in Umbria, central Italy"
    >
      <defs>
        {/* Soft aged-paper background gradient */}
        <radialGradient id="bgGrad" cx="50%" cy="40%" r="65%">
          <stop offset="0%" stopColor="#f0ebe2" />
          <stop offset="100%" stopColor="#e4ddd2" />
        </radialGradient>

        {/* Gold glow for villa pin */}
        <radialGradient id="villaGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#b8975a" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#b8975a" stopOpacity="0" />
        </radialGradient>

        {/* Lake fill */}
        <radialGradient id="lakeGrad" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#9ab8c8" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#7aa0b2" stopOpacity="0.4" />
        </radialGradient>

        <filter id="softShadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#2c2824" floodOpacity="0.12" />
        </filter>
      </defs>

      {/* ── Background ────────────────────────────────────── */}
      <rect width="400" height="440" fill="url(#bgGrad)" rx="0" />

      {/* ── Subtle grid lines (cartographic feel) ─────────── */}
      {[100, 200, 300].map((v) => (
        <line key={`h${v}`} x1="0" y1={v} x2="400" y2={v} stroke="#c8bfb2" strokeWidth="0.4" strokeDasharray="3 6" />
      ))}
      {[100, 200, 300].map((v) => (
        <line key={`vl${v}`} x1={v} y1="0" x2={v} y2="440" stroke="#c8bfb2" strokeWidth="0.4" strokeDasharray="3 6" />
      ))}

      {/* ── Apennine ridge — stylised mountain spine ──────── */}
      <path
        d="M 150 60 C 155 80 165 95 168 120 C 171 145 175 160 178 180 C 181 200 185 215 188 235 C 191 255 195 275 200 295 C 205 315 210 330 215 350"
        stroke="#c8bfb2"
        strokeWidth="1.5"
        strokeDasharray="4 5"
        fill="none"
        opacity="0.7"
      />
      {/* Small mountain symbols along the ridge */}
      {[[165, 110], [172, 150], [180, 190], [190, 240]].map(([mx, my], i) => (
        <path
          key={`mt${i}`}
          d={`M ${mx - 5} ${my + 4} L ${mx} ${my - 4} L ${mx + 5} ${my + 4}`}
          stroke="#b0a898"
          strokeWidth="1"
          fill="none"
          opacity="0.5"
        />
      ))}
      <text x="147" y="108" fontSize="7" fill="#a09488" fontFamily="serif" transform="rotate(-70, 147, 108)" opacity="0.6">Apennines</text>

      {/* ── Tiber river (simplified S-curve through Umbria) ── */}
      <path
        d="M 210 140 C 218 160 222 178 220 198 C 218 218 222 238 228 258 C 232 275 235 295 233 315"
        stroke="#9ab8c8"
        strokeWidth="1.5"
        fill="none"
        opacity="0.55"
      />
      <text x="237" y="248" fontSize="7.5" fill="#7aa0b2" fontFamily="serif" fontStyle="italic" opacity="0.75">Tiber</text>

      {/* ── Lake Trasimeno ──────────────────────────────────── */}
      <ellipse cx="181" cy="182" rx="18" ry="12" fill="url(#lakeGrad)" stroke="#7aa0b2" strokeWidth="0.8" opacity="0.9" />
      <text x="157" y="175" fontSize="7" fill="#5a8898" fontFamily="serif" fontStyle="italic">Lago</text>
      <text x="155" y="183" fontSize="7" fill="#5a8898" fontFamily="serif" fontStyle="italic">Trasimeno</text>

      {/* ── Umbria region highlight ─────────────────────────── */}
      <path
        d="M 158 155 C 172 148 190 150 210 155 C 225 160 238 168 242 182 C 246 196 240 215 232 225 C 220 238 200 242 185 240 C 168 238 155 228 150 215 C 145 202 145 168 158 155 Z"
        fill="#b8975a"
        fillOpacity="0.05"
        stroke="#b8975a"
        strokeWidth="0.8"
        strokeDasharray="5 4"
        strokeOpacity="0.3"
      />
      <text x="172" y="246" fontSize="7.5" fill="#b8975a" fontFamily="serif" fontStyle="italic" opacity="0.65">Umbria</text>

      {/* ── Distance connection lines (dashed, to Rome & Florence) ─ */}
      {/* Florence line */}
      <line x1="217" y1="200" x2="86" y2="96" stroke="#2c2824" strokeWidth="0.7" strokeDasharray="5 5" opacity="0.2" />
      {/* Rome line */}
      <line x1="217" y1="200" x2="229" y2="347" stroke="#2c2824" strokeWidth="0.7" strokeDasharray="5 5" opacity="0.2" />

      {/* ── City dots ─────────────────────────────────────────── */}

      {/* Florence */}
      <circle cx="86" cy="96" r="4.5" fill="#e8e0d6" stroke="#2c2824" strokeWidth="1.2" />
      <text x="95" y="94" fontSize="9.5" fill="#2c2824" fontFamily="serif" fontWeight="400">Florence</text>
      <text x="95" y="104" fontSize="7.5" fill="#8c8279" fontFamily="sans-serif">~2 hrs</text>

      {/* Rome */}
      <circle cx="229" cy="347" r="4.5" fill="#e8e0d6" stroke="#2c2824" strokeWidth="1.2" />
      <text x="238" y="345" fontSize="9.5" fill="#2c2824" fontFamily="serif">Rome</text>
      <text x="238" y="355" fontSize="7.5" fill="#8c8279" fontFamily="sans-serif">~2 hrs</text>

      {/* Cortona */}
      <circle cx="170" cy="163" r="3" fill="#e8e0d6" stroke="#6b7b4c" strokeWidth="1" />
      <text x="130" y="161" fontSize="8" fill="#4a5a38" fontFamily="serif">Cortona</text>
      <text x="136" y="170" fontSize="7" fill="#8c8279" fontFamily="sans-serif">~30 min</text>

      {/* Città della Pieve */}
      <circle cx="171" cy="207" r="3" fill="#e8e0d6" stroke="#6b7b4c" strokeWidth="1" />
      <text x="113" y="204" fontSize="7.5" fill="#4a5a38" fontFamily="serif">Città d. Pieve</text>
      <text x="126" y="213" fontSize="7" fill="#8c8279" fontFamily="sans-serif">~20 min</text>

      {/* Perugia */}
      <circle cx="216" cy="185" r="3.5" fill="#e8e0d6" stroke="#6b7b4c" strokeWidth="1.2" />
      <text x="222" y="183" fontSize="8.5" fill="#4a5a38" fontFamily="serif">Perugia</text>
      <text x="222" y="192" fontSize="7" fill="#8c8279" fontFamily="sans-serif">~45 min airport</text>

      {/* Assisi */}
      <circle cx="240" cy="191" r="2.5" fill="#e8e0d6" stroke="#6b7b4c" strokeWidth="0.8" />
      <text x="245" y="194" fontSize="7.5" fill="#4a5a38" fontFamily="serif">Assisi</text>

      {/* ── Villa Serena — gold pin ─────────────────────────── */}
      {/* Glow pulse */}
      <circle cx="217" cy="200" r="22" fill="url(#villaGlow)" />
      <circle cx="217" cy="200" r="14" fill="#b8975a" fillOpacity="0.12" />

      {/* Pin drop shadow */}
      <ellipse cx="217" cy="212" rx="5" ry="2.5" fill="#2c2824" opacity="0.18" />

      {/* Pin body */}
      <path
        d="M 217 195 C 213 195 210 198 210 202 C 210 207 217 214 217 214 C 217 214 224 207 224 202 C 224 198 221 195 217 195 Z"
        fill="#b8975a"
        filter="url(#softShadow)"
      />
      <circle cx="217" cy="202" r="2.5" fill="white" opacity="0.85" />

      {/* Villa label */}
      <rect x="198" y="217" width="88" height="26" rx="4" fill="#2c2824" opacity="0.82" />
      <text x="242" y="228" fontSize="9" fill="#b8975a" fontFamily="serif" fontWeight="400" textAnchor="middle">Villa Serena</text>
      <text x="242" y="238" fontSize="7" fill="#f0ebe2" fontFamily="sans-serif" textAnchor="middle" opacity="0.8">Umbria · Italy</text>

      {/* ── Compass rose (top-right) ─────────────────────────── */}
      <g transform="translate(360, 55)" opacity="0.5">
        <circle cx="0" cy="0" r="14" fill="none" stroke="#a09488" strokeWidth="0.8" />
        <line x1="0" y1="-10" x2="0" y2="10" stroke="#a09488" strokeWidth="0.8" />
        <line x1="-10" y1="0" x2="10" y2="0" stroke="#a09488" strokeWidth="0.8" />
        <text x="0" y="-14" fontSize="7" fill="#2c2824" fontFamily="serif" textAnchor="middle">N</text>
      </g>

      {/* ── Legend bar at bottom ─────────────────────────────── */}
      <rect x="0" y="392" width="400" height="48" fill="#2c2824" opacity="0.85" />
      <circle cx="22" cy="416" r="5" fill="#b8975a" />
      <text x="32" y="419" fontSize="8.5" fill="#f0ebe2" fontFamily="serif">Villa Serena — Umbria–Tuscany Border</text>
      <circle cx="22" cy="432" r="3" fill="#e8e0d6" stroke="#6b7b4c" strokeWidth="1" />
      <text x="32" y="435" fontSize="7.5" fill="#a09488" fontFamily="sans-serif">Nearby towns · Lakes · Airports</text>
      {/* Scale bar */}
      <line x1="280" y1="420" x2="360" y2="420" stroke="#a09488" strokeWidth="1" />
      <line x1="280" y1="416" x2="280" y2="424" stroke="#a09488" strokeWidth="1" />
      <line x1="360" y1="416" x2="360" y2="424" stroke="#a09488" strokeWidth="1" />
      <text x="320" y="414" fontSize="7" fill="#a09488" fontFamily="sans-serif" textAnchor="middle">~80 km</text>
    </svg>
  );
}
