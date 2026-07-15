import AdminShell from '@/components/AdminShell'
import { createClient } from '@/lib/supabase/server'
import { getMainSiteUrl } from '@/lib/site-url'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  let pendingCount = 0
  try {
    const supabase = createClient()
    const { count } = await supabase
      .from('bookings')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'pending')
    pendingCount = count ?? 0
  } catch {
    // DB not yet connected — show 0
  }

  return (
    <AdminShell pendingCount={pendingCount} siteUrl={getMainSiteUrl()}>
      {children}
    </AdminShell>
  )
}
