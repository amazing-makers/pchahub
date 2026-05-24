export default function SubmitStoryLoading() {
  return (
    <main className="animate-pulse">
      <div className="border-b border-gray-100 bg-gray-50">
        <div className="container mx-auto py-section space-y-4">
          <div className="h-4 w-40 rounded bg-gray-200" />
          <div className="h-8 w-96 rounded bg-gray-200" />
          <div className="h-4 w-80 rounded bg-gray-100" />
        </div>
      </div>
      <div className="container mx-auto py-section">
        <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
          <div className="space-y-5">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-40 rounded-2xl bg-gray-100" />
            ))}
          </div>
          <div className="space-y-4">
            <div className="h-80 rounded-2xl bg-gray-100" />
            <div className="h-48 rounded-2xl bg-gray-100" />
          </div>
        </div>
      </div>
    </main>
  )
}
