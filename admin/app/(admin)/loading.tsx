export default function Loading() {
  return (
    <div className="p-8 max-w-5xl mx-auto animate-fade-in">
      <div className="mb-8">
        <div className="skeleton h-7 w-32 mb-2" />
        <div className="skeleton h-4 w-52" />
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="stat-card">
            <div className="skeleton h-3 w-24 mb-3" />
            <div className="skeleton h-10 w-16 mb-2" />
            <div className="skeleton h-3 w-20" />
          </div>
        ))}
      </div>
      <div className="grid lg:grid-cols-2 gap-6">
        {[...Array(2)].map((_, i) => (
          <div key={i} className="card p-6">
            <div className="skeleton h-4 w-32 mb-5" />
            <div className="space-y-3">
              {[...Array(4)].map((_, j) => (
                <div key={j} className="skeleton h-14 rounded-xl" />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
