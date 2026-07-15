export default function Loading() {
  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-4xl w-full animate-fade-in">
      <div className="mb-8">
        <div className="skeleton h-7 w-48 mb-2" />
        <div className="skeleton h-4 w-64" />
      </div>
      {[...Array(3)].map((_, s) => (
        <div key={s} className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="skeleton h-3 w-24" />
            <div className="flex-1 h-px" style={{ background: 'var(--border)' }} />
          </div>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="card p-5">
                <div className="skeleton h-3 w-32 mb-3" />
                <div className="skeleton h-10 rounded-xl mb-3" />
                <div className="flex justify-end"><div className="skeleton h-8 w-24 rounded-lg" /></div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
