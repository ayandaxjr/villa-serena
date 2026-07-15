export default function Loading() {
  return (
    <div className="p-8 max-w-3xl mx-auto animate-fade-in">
      <div className="mb-8">
        <div className="skeleton h-7 w-32 mb-2" />
        <div className="skeleton h-4 w-56" />
      </div>
      <div className="card p-6 mb-6">
        <div className="skeleton h-5 w-40 mb-5" />
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div><div className="skeleton h-3 w-20 mb-2" /><div className="skeleton h-10 rounded-xl" /></div>
          <div><div className="skeleton h-3 w-20 mb-2" /><div className="skeleton h-10 rounded-xl" /></div>
        </div>
        <div className="skeleton h-10 rounded-xl mb-4" />
        <div className="skeleton h-10 rounded-xl" />
      </div>
      <div className="card overflow-hidden">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="flex gap-4 px-5 py-4 border-b" style={{ borderColor: 'var(--border)' }}>
            <div className="flex-1"><div className="skeleton h-4 w-48 mb-2" /><div className="skeleton h-3 w-32" /></div>
            <div className="skeleton h-7 w-16 rounded-lg" />
          </div>
        ))}
      </div>
    </div>
  )
}
