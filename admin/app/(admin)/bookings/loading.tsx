export default function Loading() {
  return (
    <div className="p-8 max-w-6xl mx-auto animate-fade-in">
      <div className="mb-6">
        <div className="skeleton h-7 w-28 mb-2" />
        <div className="skeleton h-4 w-40" />
      </div>
      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        {[...Array(5)].map((_, i) => <div key={i} className="skeleton h-8 w-24 rounded-lg" />)}
      </div>
      {/* Table */}
      <div className="card overflow-hidden">
        <div className="p-5 border-b" style={{ borderColor: 'var(--border)' }}>
          <div className="skeleton h-4 w-20" />
        </div>
        {[...Array(6)].map((_, i) => (
          <div key={i} className="flex items-center gap-6 px-5 py-4 border-b" style={{ borderColor: 'var(--border)' }}>
            <div className="skeleton h-4 w-32" />
            <div className="skeleton h-4 w-48 flex-1" />
            <div className="skeleton h-4 w-24" />
            <div className="skeleton h-6 w-16 rounded-lg" />
          </div>
        ))}
      </div>
    </div>
  )
}
