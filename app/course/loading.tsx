export default function CourseLoading() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Nav skeleton */}
      <div className="h-16 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800" />

      {/* Hero skeleton */}
      <div className="h-44 bg-gradient-to-br from-indigo-600 via-blue-600 to-violet-700 animate-pulse" />

      <div className="max-w-4xl mx-auto px-4 py-10 space-y-4">
        <div className="h-6 w-40 bg-gray-200 dark:bg-gray-800 rounded-lg animate-pulse" />

        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden animate-pulse">
            <div className="h-20 bg-gradient-to-r from-indigo-500/30 to-violet-500/30" />
            <div className="p-4 space-y-3">
              {[...Array(4)].map((_, j) => (
                <div key={j} className="h-12 bg-gray-100 dark:bg-gray-800 rounded-lg" />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
