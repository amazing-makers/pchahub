/** Reusable skeleton / loading-state components for client-only islands */

/** Internal building block — caller must provide rounded-* class */
function Pulse({ className }: { className?: string }) {
  return (
    <div
      className={`animate-pulse bg-gray-200 ${className ?? ''}`}
      aria-hidden
    />
  )
}

// ── Listing card skeleton (matches ListingCard dimensions) ─────────────────────
export function ListingCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
      <Pulse className="h-44 w-full rounded-none" />
      <div className="space-y-2.5 p-4">
        <Pulse className="h-3.5 w-1/3 rounded-md" />
        <Pulse className="h-5 w-3/4 rounded-md" />
        <Pulse className="h-4 w-1/2 rounded-md" />
        <div className="flex gap-2 pt-1">
          <Pulse className="h-3.5 w-16 rounded-md" />
          <Pulse className="h-3.5 w-12 rounded-md" />
        </div>
      </div>
    </div>
  )
}

// ── A 2–3 card grid of skeletons (for sections on home / mypage) ───────────────
export function ListingSectionSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <ListingCardSkeleton key={i} />
      ))}
    </div>
  )
}

// ── Listing detail sidebar skeleton ───────────────────────────────────────────
export function ListingDetailSidebarSkeleton() {
  return (
    <div className="space-y-4">
      {/* Price + action card */}
      <div className="space-y-4 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        <div className="space-y-1.5">
          <Pulse className="h-3 w-16 rounded-md" />
          <Pulse className="h-8 w-40 rounded-lg" />
        </div>
        <Pulse className="h-11 w-full rounded-xl" />
        <div className="grid grid-cols-2 gap-2">
          <Pulse className="h-10 w-full rounded-xl" />
          <Pulse className="h-10 w-full rounded-xl" />
        </div>
      </div>
      {/* Owner card */}
      <div className="space-y-3 rounded-2xl border border-gray-200 bg-white p-5">
        <Pulse className="h-3 w-12 rounded-md" />
        <Pulse className="h-4 w-32 rounded-md" />
        <Pulse className="h-4 w-24 rounded-md" />
        <Pulse className="h-16 w-full rounded-lg" />
      </div>
    </div>
  )
}

// ── Mini map skeleton ──────────────────────────────────────────────────────────
export function MiniMapSkeleton() {
  return (
    <div className="relative h-64 overflow-hidden rounded-xl bg-gray-100">
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
        <Pulse className="h-4 w-4 rounded-full" />
        <Pulse className="h-3 w-24 rounded-md" />
      </div>
    </div>
  )
}

// ── Stat number skeleton (for mypage quick stats) ─────────────────────────────
export function StatSkeleton() {
  return <Pulse className="inline-block h-4 w-8 rounded-md align-middle" />
}
