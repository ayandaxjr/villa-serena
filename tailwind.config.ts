import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./sections/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        stone_: "#2C2824",
        cream: "#F5F0EB",
        olive: "#6B7B4C",
        terracotta: "#C4734F",
        gold: "#B8975A",
        "warm-gray": "#8C8279",
        "light-cream": "#FAF8F5",
      },
      fontFamily: {
        serif: ["Cormorant Garamond", "Georgia", "serif"],
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      fontSize: {
        "hero": ["clamp(3rem, 8vw, 6rem)", { lineHeight: "1.05", letterSpacing: "-0.02em" }],
        "display": ["clamp(2.5rem, 5vw, 3.5rem)", { lineHeight: "1.1" }],
        "headline": ["clamp(1.75rem, 3vw, 2.5rem)", { lineHeight: "1.2" }],
        "subhead": ["clamp(1.25rem, 2vw, 1.5rem)", { lineHeight: "1.3" }],
        "body-lg": ["1.125rem", { lineHeight: "1.8" }],
        "body": ["1rem", { lineHeight: "1.8" }],
        "caption": ["0.8125rem", { lineHeight: "1.6", letterSpacing: "0.05em" }],
        "label": ["0.6875rem", { lineHeight: "1.4", letterSpacing: "0.15em" }],
      },
      spacing: {
        "section": "clamp(100px, 12vw, 160px)",
        "section-sm": "clamp(60px, 8vw, 100px)",
      },
      maxWidth: {
        "content": "720px",
        "wide": "1200px",
        "full-bleed": "1440px",
      },
      transitionTimingFunction: {
        "luxury": "cubic-bezier(0.25, 0.1, 0.25, 1.0)",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(30px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "scale-in": {
          "0%": { opacity: "0", transform: "scale(0.95)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        "draw-line": {
          "0%": { width: "0" },
          "100%": { width: "60px" },
        },
        pulse: {
          "0%, 100%": { opacity: "0.4" },
          "50%": { opacity: "1" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.8s cubic-bezier(0.25, 0.1, 0.25, 1.0) forwards",
        "fade-in": "fade-in 0.8s cubic-bezier(0.25, 0.1, 0.25, 1.0) forwards",
        "scale-in": "scale-in 0.8s cubic-bezier(0.25, 0.1, 0.25, 1.0) forwards",
        "draw-line": "draw-line 0.6s cubic-bezier(0.25, 0.1, 0.25, 1.0) forwards",
        pulse: "pulse 2.5s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
