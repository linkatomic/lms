export default function DashboardLoading() {
  return (
    <div className="min-h-dvh bg-[#F7F8FF] dark:bg-[#0A0B12]">
      {/* Nav skeleton */}
      <div className="h-14 border-b border-gray-100 dark:border-white/[0.06] bg-white/80 dark:bg-[#0A0B12]/80" />

      {/* Hero skeleton */}
      <div className="h-52 bg-gradient-to-br from-indigo-600 via-indigo-700 to-violet-800 animate-pulse" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-5 space-y-5">
        {/* Stat cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-28 rounded-2xl bg-white dark:bg-white/[0.04] border border-gray-100 dark:border-white/[0.07] animate-pulse" />
          ))}
        </div>

        {/* Course + next lesson */}
        <div className="grid lg:grid-cols-5 gap-4">
          <div className="lg:col-span-3 h-48 rounded-2xl bg-white dark:bg-white/[0.04] border border-gray-100 dark:border-white/[0.07] animate-pulse" />
          <div className="lg:col-span-2 h-48 rounded-2xl bg-white dark:bg-white/[0.04] border border-gray-100 dark:border-white/[0.07] animate-pulse" />
        </div>

        {/* Module progress */}
        <div className="grid sm:grid-cols-3 gap-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-36 rounded-2xl bg-white dark:bg-white/[0.04] border border-gray-100 dark:border-white/[0.07] animate-pulse" />
          ))}
        </div>
      </div>
    </div>
  )
}
