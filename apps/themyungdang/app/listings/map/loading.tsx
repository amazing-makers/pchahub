/** Loading state for the map search page — shows a full-height placeholder */
export default function MapLoading() {
  return (
    <div className="relative flex h-[calc(100vh-64px)] w-full items-center justify-center bg-gray-100">
      <div className="absolute inset-0 animate-pulse bg-gray-200" />
      <div className="relative z-10 flex flex-col items-center gap-3 text-center">
        <div className="h-10 w-10 animate-pulse rounded-full bg-gray-300" />
        <p className="text-sm font-medium text-gray-400">지도를 불러오는 중…</p>
      </div>
    </div>
  )
}
