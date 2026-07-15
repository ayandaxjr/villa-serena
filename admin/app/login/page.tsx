'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState<string | null>(null)

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    const supabase = createClient()
    const { error: err } = await supabase.auth.signInWithPassword({ email, password })
    if (err) {
      setError('Invalid email or password. Please try again.')
      setLoading(false)
      return
    }
    router.push('/')
    router.refresh()
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: 'var(--bg)' }}>
      <div className="w-full max-w-[360px] animate-slide-up">

        {/* Logo */}
        <div className="text-center mb-10">
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-5"
               style={{ background: 'var(--accent-dim)', border: '1px solid rgba(184,151,90,0.25)' }}>
            <span style={{ color: 'var(--accent)', fontSize: 13, fontWeight: 700, letterSpacing: '0.15em' }}>VS</span>
          </div>
          <h1 className="font-serif text-2xl font-light tracking-wide" style={{ color: 'var(--text-1)' }}>
            Villa Serena
          </h1>
          <p style={{ color: 'var(--text-3)', fontSize: 10, letterSpacing: '0.25em', textTransform: 'uppercase', marginTop: 6 }}>
            Private Management Panel
          </p>
        </div>

        {/* Card */}
        <div className="card p-7">
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="label" htmlFor="email">Email address</label>
              <input id="email" type="email" className="input" placeholder="you@example.com"
                value={email} onChange={e => setEmail(e.target.value)} required autoFocus />
            </div>
            <div>
              <label className="label" htmlFor="password">Password</label>
              <input id="password" type="password" className="input" placeholder="••••••••••"
                value={password} onChange={e => setPassword(e.target.value)} required />
            </div>

            {error && (
              <div className="px-4 py-3 rounded-xl text-sm" style={{ background: 'var(--error-bg)', color: 'var(--error-text)', border: '1px solid var(--error-border)' }}>
                {error}
              </div>
            )}

            <button type="submit" disabled={loading} className="btn btn-gold w-full" style={{ paddingTop: 12, paddingBottom: 12 }}>
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                  </svg>
                  Signing in…
                </span>
              ) : 'Sign in'}
            </button>
          </form>
        </div>

        <p className="text-center mt-6" style={{ fontSize: 11, color: 'var(--text-4)' }}>
          This panel is private. Unauthorised access is prohibited.
        </p>
      </div>
    </div>
  )
}
