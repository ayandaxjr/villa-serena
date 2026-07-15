export default function InquiriesLoading() {
  return (
    <div className="p-8 max-w-[960px] animate-pulse">
      <div className="h-8 w-40 rounded-lg mb-2" style={{ background: 'var(--bg-elevated)' }} />
      <div className="h-4 w-64 rounded mb-8" style={{ background: 'var(--bg-elevated)' }} />
      <div className="card h-64" />
    </div>
  )
}
