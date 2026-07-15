import PaymentCreator from './PaymentCreator'

export default function PaymentsPage({
  searchParams,
}: {
  searchParams: { email?: string; nights?: string; name?: string }
}) {
  return (
    <div className="p-8 max-w-[800px]">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold tracking-tight" style={{ color: 'var(--text-1)' }}>Payments</h1>
        <p style={{ fontSize: 13, color: 'var(--text-3)', marginTop: 4 }}>
          Create Stripe payment links for your guests
        </p>
      </div>

      <div className="flex items-start gap-3 p-4 mb-7 rounded-xl"
           style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)' }}>
        <svg style={{ width: 16, height: 16, color: 'var(--accent)', flexShrink: 0, marginTop: 1 }}
             viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
          <circle cx="12" cy="12" r="9"/><path d="M12 8v4M12 16h.01"/>
        </svg>
        <p style={{ fontSize: 12, color: 'var(--text-3)', lineHeight: 1.6 }}>
          Payment links are created via your connected Stripe account. The guest receives a secure link and pays online.
          Funds go directly to your Stripe account. You can share the link by email or WhatsApp.
        </p>
      </div>

      <PaymentCreator
        prefillEmail={searchParams.email}
        prefillNights={searchParams.nights}
        prefillName={searchParams.name}
      />
    </div>
  )
}
