export default function CertificateLoading() {
  return (
    <main className="min-h-screen animate-pulse bg-gray-100">
      <div className="border-b border-gray-200 bg-white">
        <div className="container mx-auto flex items-center justify-between py-4">
          <div className="h-5 w-40 rounded bg-gray-200" />
          <div className="h-9 w-24 rounded-xl bg-gray-200" />
        </div>
      </div>
      <div className="container mx-auto py-10">
        <div className="mx-auto max-w-2xl rounded-3xl bg-white shadow-xl overflow-hidden">
          <div className="h-20 bg-gray-100" />
          <div className="flex flex-col items-center gap-4 px-10 py-10">
            <div className="h-24 w-24 rounded-full bg-gray-200" />
            <div className="h-8 w-48 rounded bg-gray-200" />
            <div className="h-6 w-32 rounded bg-gray-100" />
            <div className="h-8 w-56 rounded-full bg-gray-200" />
            <div className="h-4 w-80 rounded bg-gray-100" />
            <div className="h-32 w-full rounded-2xl bg-gray-100" />
          </div>
          <div className="h-12 bg-gray-100" />
        </div>
      </div>
    </main>
  )
}
