'use client'

import Link from 'next/link'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import ThemeToggle from './ThemeToggle'

type NavItem = {
  href: string
  label: string
  icon: React.FC<{ className?: string }>
  children?: { href: string; label: string; statusFilter?: string }[]
}

const NAV: NavItem[] = [
  { href: '/',             label: 'Overview',     icon: IcGrid },
  { href: '/bookings',
    label: 'Bookings',
    icon: IcCalendar,
    children: [
      { href: '/bookings',                  label: 'All bookings' },
      { href: '/bookings?status=pending',   label: 'Pending',   statusFilter: 'pending' },
      { href: '/bookings?status=approved',  label: 'Approved',  statusFilter: 'approved' },
      { href: '/bookings?status=declined',  label: 'Declined',  statusFilter: 'declined' },
      { href: '/bookings?status=completed', label: 'Completed', statusFilter: 'completed' },
    ],
  },
  { href: '/inquiries',    label: 'Inquiries',    icon: IcMail },
  { href: '/guests',       label: 'Guests',       icon: IcUsers },
  { href: '/availability', label: 'Availability', icon: IcBlock },
  { href: '/payments',     label: 'Payments',     icon: IcCard },
  { href: '/analytics',    label: 'Analytics',    icon: IcChart },
  { href: '/content',      label: 'Content',      icon: IcPencil },
]

export default function Sidebar({ pendingCount, siteUrl, onNavigate }: { pendingCount?: number; siteUrl: string; onNavigate?: () => void }) {
  const pathname      = usePathname()
  const searchParams  = useSearchParams()
  const router        = useRouter()
  const currentStatus = searchParams.get('status')

  const [bookingsOpen, setBookingsOpen] = useState(
    pathname.startsWith('/bookings')
  )

  async function signOut() {
    const sb = createClient()
    await sb.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  function isTopActive(href: string) {
    if (href === '/') return pathname === '/'
    return pathname.startsWith(href.split('?')[0])
  }

  function isChildActive(child: { href: string; statusFilter?: string }) {
    if (!pathname.startsWith('/bookings')) return false
    if (child.statusFilter) return currentStatus === child.statusFilter
    // "All bookings" is active when no status filter
    return !currentStatus
  }

  return (
    <aside style={{ background: 'var(--sidebar-bg)', borderRight: '1px solid var(--sidebar-border)' }}
           className="w-[260px] lg:w-[220px] shrink-0 flex flex-col min-h-screen h-full overflow-y-auto">
      {/* Logo */}
      <div className="px-5 pt-7 pb-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center"
               style={{ background: 'rgba(184,151,90,0.12)', border: '1px solid rgba(184,151,90,0.2)' }}>
            <span style={{ color: '#B8975A', fontSize: 11, fontWeight: 700, letterSpacing: '0.15em' }}>VS</span>
          </div>
          <div>
            <p style={{ fontSize: 13, fontWeight: 600, color: 'rgba(255,255,255,0.9)', lineHeight: 1 }}>Villa Serena</p>
            <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', letterSpacing: '0.2em', textTransform: 'uppercase', marginTop: 3 }}>Admin</p>
          </div>
        </div>
      </div>

      <div className="mx-4 mb-3" style={{ height: 1, background: 'rgba(255,255,255,0.05)' }} />

      {/* Navigation */}
      <nav className="flex-1 px-3 py-1 space-y-0.5 overflow-y-auto">
        {NAV.map(item => {
          const active      = isTopActive(item.href)
          const hasChildren = !!item.children

          if (hasChildren) {
            return (
              <div key={item.href}>
                <button
                  onClick={() => setBookingsOpen(o => !o)}
                  className={`nav-item w-full justify-between ${active ? 'active' : ''}`}
                >
                  <span className="flex items-center gap-3">
                    <item.icon className="w-[15px] h-[15px] shrink-0" />
                    {item.label}
                  </span>
                  <span className="flex items-center gap-2">
                    {pendingCount ? (
                      <span className="w-4 h-4 rounded-full bg-gold text-[9px] font-bold text-white flex items-center justify-center">
                        {pendingCount > 9 ? '9+' : pendingCount}
                      </span>
                    ) : null}
                    <IcChevron className={`w-3 h-3 transition-transform duration-200 ${bookingsOpen ? 'rotate-90' : ''}`} />
                  </span>
                </button>

                {bookingsOpen && (
                  <div className="mt-0.5 space-y-0.5 animate-fade-in">
                    {item.children!.map(child => (
                      <Link
                        key={child.href}
                        href={child.href}
                        onClick={onNavigate}
                        className={`nav-sub-item ${isChildActive(child) ? 'active' : ''}`}
                      >
                        <span className="w-1 h-1 rounded-full bg-current opacity-50" />
                        {child.label}
                        {child.statusFilter === 'pending' && pendingCount ? (
                          <span className="ml-auto text-[10px] text-gold/70 font-mono">{pendingCount}</span>
                        ) : null}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            )
          }

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className={`nav-item ${active ? 'active' : ''}`}
            >
              <item.icon className="w-[15px] h-[15px] shrink-0" />
              {item.label}
            </Link>
          )
        })}
      </nav>

      {/* Bottom: live site link + theme toggle + sign out */}
      <div className="px-3 pb-5 pt-3 space-y-1 mt-2" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <a
          href={siteUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={onNavigate}
          className="nav-item"
        >
          <IcExternal className="w-[15px] h-[15px] shrink-0" />
          Live website ↗
        </a>
        <ThemeToggle />
        <button
          onClick={signOut}
          className="nav-item w-full text-left"
        >
          <IcSignOut className="w-[15px] h-[15px] shrink-0" />
          Sign out
        </button>
      </div>
    </aside>
  )
}

function IcGrid({ className }: { className?: string }) {
  return <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/></svg>
}
function IcCalendar({ className }: { className?: string }) {
  return <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>
}
function IcUsers({ className }: { className?: string }) {
  return <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="7" r="4"/><path d="M3 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2"/><path d="M16 3.13a4 4 0 0 1 0 7.75M21 21v-2a4 4 0 0 0-3-3.87"/></svg>
}
function IcBlock({ className }: { className?: string }) {
  return <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9"/><path d="M4.93 4.93 19.07 19.07"/></svg>
}
function IcCard({ className }: { className?: string }) {
  return <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="5" width="20" height="14" rx="2"/><path d="M2 10h20"/></svg>
}
function IcChart({ className }: { className?: string }) {
  return <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round"><path d="M3 3v18h18"/><path d="m7 16 4-4 4 4 4-6"/></svg>
}
function IcChevron({ className }: { className?: string }) {
  return <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
}
function IcSignOut({ className }: { className?: string }) {
  return <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
}
function IcPencil({ className }: { className?: string }) {
  return <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
}
function IcMail({ className }: { className?: string }) {
  return <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
}
function IcExternal({ className }: { className?: string }) {
  return <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
}
