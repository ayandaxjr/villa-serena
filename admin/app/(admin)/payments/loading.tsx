export default function Loading() {
  return (
    <div className="p-8 max-w-3xl mx-auto animate-fade-in">
      <div className="mb-8">
        <div className="skeleton h-7 w-28 mb-2" />
        <div className="skeleton h-4 w-72" />
      </div>
      <div className="card p-7">
        <div className="skeleton h-5 w-48 mb-6" />
        <div className="grid grid-cols-2 gap-4 mb-4">
          {[...Array(4)].map((_, i) => (
            <div key={i}>
              <div className="skeleton h-3 w-20 mb-2" />
              <div className="skeleton h-10 rounded-xl" />
            </div>
          ))}
        </div>
        <div className="skeleton h-10 rounded-xl mb-4" />
        <div className="skeleton h-12 rounded-xl" />
      </div>
    </div>
  )
}
