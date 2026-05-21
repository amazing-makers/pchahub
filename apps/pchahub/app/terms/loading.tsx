export default function TermsLoading() {
  return (
    <main className="bg-gray-50">
      <section className="border-b border-gray-200 bg-white">
        <div className="container mx-auto py-8 animate-pulse">
          <div className="h-8 w-40 rounded bg-gray-200" />
          <div className="mt-2 h-4 w-56 rounded bg-gray-100" />
        </div>
      </section>

      <div className="container mx-auto py-8 animate-pulse max-w-3xl space-y-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="space-y-3">
            <div className="h-6 w-40 rounded bg-gray-200" />
            {Array.from({ length: 4 }).map((_, j) => (
              <div key={j} className={`h-4 rounded bg-gray-100 ${j % 4 === 3 ? 'w-2/3' : 'w-full'}`} />
            ))}
          </div>
        ))}
      </div>
    </main>
  )
}
