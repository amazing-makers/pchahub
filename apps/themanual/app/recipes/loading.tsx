export default function Loading() {
  return (
    <div className="animate-pulse">
      <div className="h-72 w-full bg-gray-200 sm:h-96" />
      <div className="container mx-auto py-8">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="h-52 rounded-2xl bg-gray-100" />
          ))}
        </div>
      </div>
    </div>
  )
}
