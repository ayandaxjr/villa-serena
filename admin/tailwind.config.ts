import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class', // uses .dark class on <html>
  theme: {
    extend: {
      colors: {
        gold:        '#B8975A',
        'gold-light': '#C9A96B',
      },
      fontFamily: {
        serif: ['Georgia', 'Cambria', 'serif'],
        sans:  ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono:  ['ui-monospace', 'SFMono-Regular', 'monospace'],
      },
    },
  },
  plugins: [],
}

export default config
