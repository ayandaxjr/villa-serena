'use client'

import { useTheme } from './ThemeProvider'

export default function ThemeToggle() {
  const { theme, toggle } = useTheme()
  const isDark = theme === 'dark'

  return (
    <button
      onClick={toggle}
      title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      className="nav-item justify-between w-full"
    >
      <span className="flex items-center gap-3">
        {isDark ? <IconMoon className="w-[15px] h-[15px] shrink-0" /> : <IconSun className="w-[15px] h-[15px] shrink-0" />}
        {isDark ? 'Dark mode' : 'Light mode'}
      </span>
      {/* Toggle pill */}
      <div className={`relative w-8 h-4 rounded-full transition-colors duration-300 ${isDark ? 'bg-[rgba(255,255,255,0.12)]' : 'bg-[rgba(184,151,90,0.4)]'}`}>
        <div className={`absolute top-0.5 w-3 h-3 rounded-full shadow-sm transition-all duration-300 ${isDark ? 'left-0.5 bg-[rgba(255,255,255,0.4)]' : 'left-[18px] bg-[#B8975A]'}`} />
      </div>
    </button>
  )
}

function IconMoon({ className }: { className?: string }) {
  return <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
}
function IconSun({ className }: { className?: string }) {
  return <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>
}
