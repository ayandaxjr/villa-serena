import Link from 'next/link'
import type { Inquiry } from '@/lib/supabase/types'
import { createClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

function formatDateTime(iso: string) {
  return new Date(iso).toLocaleString('en-GB', {
    day: 'numeric', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })
}

function thisMonthCount(items: Inquiry[]) {
  const now = new Date()
  const key = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
  return items.filter(i => i.created_at.startsWith(key)).length
}

export default async function InquiriesPage() {
  let inquiries: Inquiry[] = []

  try {
    const supabase = createClient()
    const { data } = await supabase
      .from('inquiries')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(200)
    inquiries = (data as Inquiry[]) ?? []
  } catch {
    /* table may not exist yet — run supabase/inquiries-migration.sql */
  }

  const monthCount = thisMonthCount(inquiries)

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-[960px] mx-auto w-full">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold tracking-tight" style={{ color: 'var(--text-1)' }}>
          Inquiries
        </h1>
        <p style={{ fontSize: 13, color: 'var(--text-3)', marginTop: 4 }}>
          Section 10 — The Invitation · {inquiries.length} total · {monthCount} this month
        </p>
      </div>

      <div className="card overflow-hidden">
        {!inquiries.length ? (
          <div className="text-center py-16 px-6">
            <p style={{ fontSize: 14, color: 'var(--text-2)', marginBottom: 8 }}>No inquiries yet</p>
            <p style={{ fontSize: 12, color: 'var(--text-3)', maxWidth: 420, margin: '0 auto' }}>
              Submissions from the contact form will appear here and an email will be sent to info@villa-serena.nl.
              If this stays empty after a test, run <code style={{ color: 'var(--accent)' }}>supabase/inquiries-migration.sql</code> in Supabase.
            </p>
          </div>
        ) : (
          <div className="divide-y" style={{ borderColor: 'var(--border)' }}>
            {inquiries.map(inq => (
              <div key={inq.id} className="p-5 sm:p-6 hover:bg-[var(--bg-elevated)] transition-colors">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-4">
                  <div>
                    <p style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-1)' }}>{inq.name}</p>
                    <a
                      href={`mailto:${inq.email}`}
                      style={{ fontSize: 13, color: 'var(--accent)', marginTop: 2, display: 'inline-block' }}
                    >
                      {inq.email}
                    </a>
                  </div>
                  <p style={{ fontSize: 12, color: 'var(--text-3)', shrink: 0 }}>
                    {formatDateTime(inq.created_at)}
                  </p>
                </div>

                <div className="grid sm:grid-cols-2 gap-3 mb-4" style={{ fontSize: 13, color: 'var(--text-2)' }}>
                  {inq.phone && (
                    <p><span style={{ color: 'var(--text-3)' }}>Phone · </span>{inq.phone}</p>
                  )}
                  {inq.guests && (
                    <p><span style={{ color: 'var(--text-3)' }}>Group · </span>{inq.guests}</p>
                  )}
                  {inq.preferred_date && (
                    <p className="sm:col-span-2">
                      <span style={{ color: 'var(--text-3)' }}>Preferred dates · </span>{inq.preferred_date}
                    </p>
                  )}
                </div>

                {inq.message && (
                  <p style={{
                    fontSize: 13,
                    color: 'var(--text-2)',
                    lineHeight: 1.6,
                    padding: '12px 14px',
                    borderRadius: 12,
                    background: 'var(--bg-elevated)',
                    border: '1px solid var(--border)',
                  }}>
                    {inq.message}
                  </p>
                )}

                {inq.guest_id && (
                  <Link
                    href={`/guests/${inq.guest_id}`}
                    style={{ fontSize: 12, color: 'var(--accent)', marginTop: 12, display: 'inline-block' }}
                  >
                    View guest profile →
                  </Link>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
