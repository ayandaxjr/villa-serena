export default function Loading() {
  return (
    <div className="p-8 max-w-6xl mx-auto animate-fade-in">
      <div className="mb-6">
        <div className="skeleton h-7 w-20 mb-2" />
        <div className="skeleton h-4 w-44" />
      </div>
      <div className="card overflow-hidden">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="flex items-center gap-5 px-5 py-4 border-b" style={{ borderColor: 'var(--border)' }}>
            <div className="skeleton w-9 h-9 rounded-full shrink-0" />
            <div className="flex-1">
              <div className="skeleton h-4 w-36 mb-2" />
              <div className="skeleton h-3 w-52" />
            </div>
            <div className="skeleton h-3 w-20" />
          </div>
        ))}
      </div>
    </div>
  )
}
