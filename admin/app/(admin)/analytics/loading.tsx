export default function Loading() {
  return (
    <div className="p-8 max-w-6xl mx-auto animate-fade-in">
      <div className="mb-8">
        <div className="skeleton h-7 w-28 mb-2" />
        <div className="skeleton h-4 w-60" />
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="stat-card">
            <div className="skeleton h-3 w-24 mb-3" />
            <div className="skeleton h-9 w-14 mb-2" />
            <div className="skeleton h-3 w-20" />
          </div>
        ))}
      </div>
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="card p-6">
          <div className="skeleton h-4 w-40 mb-6" />
          <div className="skeleton h-52 rounded-xl" />
        </div>
        <div className="card p-6">
          <div className="skeleton h-4 w-40 mb-6" />
          <div className="skeleton h-52 rounded-xl" />
        </div>
      </div>
    </div>
  )
}
