'use client'

import { Suspense, useState, useEffect } from 'react'
import Sidebar from './Sidebar'

export default function AdminShell({
  pendingCount,
  siteUrl,
  children,
}: {
  pendingCount: number
  siteUrl: string
  children: React.ReactNode
}) {
  const [menuOpen, setMenuOpen] = useState(false)

  // Close drawer on route change / resize to desktop
  useEffect(() => {
    function onResize() {
      if (window.innerWidth >= 1024) setMenuOpen(false)
    }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  return (
    <div className="flex min-h-screen" style={{ background: 'var(--bg)' }}>
      {/* Mobile top bar */}
      <header
        className="lg:hidden fixed top-0 inset-x-0 z-40 flex items-center justify-between px-4 h-14"
        style={{ background: 'var(--sidebar-bg)', borderBottom: '1px solid var(--sidebar-border)' }}
      >
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-7 h-7 rounded-md flex items-center justify-center shrink-0"
               style={{ background: 'rgba(184,151,90,0.12)', border: '1px solid rgba(184,151,90,0.2)' }}>
            <span style={{ color: '#B8975A', fontSize: 9, fontWeight: 700, letterSpacing: '0.12em' }}>VS</span>
          </div>
          <span style={{ fontSize: 13, fontWeight: 600, color: 'rgba(255,255,255,0.9)' }} className="truncate">Villa Serena</span>
        </div>
        <div className="flex items-center gap-1">
        <a
          href={siteUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-ghost btn-sm shrink-0"
          style={{ fontSize: 11, padding: '6px 10px' }}
        >
          Live site ↗
        </a>
        <button
          onClick={() => setMenuOpen(o => !o)}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          className="w-10 h-10 flex items-center justify-center rounded-lg"
          style={{ color: 'rgba(255,255,255,0.7)' }}
        >
          {menuOpen ? (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <path d="M18 6 6 18M6 6l12 12" strokeLinecap="round" />
            </svg>
          ) : (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />
            </svg>
          )}
        </button>
        </div>
      </header>

      {/* Mobile overlay */}
      {menuOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
          onClick={() => setMenuOpen(false)}
        />
      )}

      {/* Sidebar — drawer on mobile, fixed on desktop */}
      <div
        className={`
          fixed lg:static inset-y-0 left-0 z-50 lg:z-auto
          transform transition-transform duration-300 ease-out
          ${menuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        <Suspense fallback={
          <div className="w-[220px] shrink-0 min-h-screen"
               style={{ background: 'var(--sidebar-bg)', borderRight: '1px solid var(--sidebar-border)' }} />
        }>
          <Sidebar pendingCount={pendingCount} siteUrl={siteUrl} onNavigate={() => setMenuOpen(false)} />
        </Suspense>
      </div>

      {/* Main content */}
      <main className="flex-1 overflow-auto min-w-0 animate-fade-in pt-14 lg:pt-0">
        {children}
      </main>
    </div>
  )
}
