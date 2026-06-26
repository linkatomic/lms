export default function LessonLoading() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Nav + progress bar */}
      <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-4 w-28 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
          </div>
          <div className="h-4 w-12 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
        </div>
        <div className="h-1 bg-gray-100 dark:bg-gray-800">
          <div className="h-1 bg-indigo-400/50 w-1/3 animate-pulse" />
        </div>
      </div>

      {/* Lesson title area */}
      <div className="bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800">
        <div className="max-w-4xl mx-auto px-4 py-6 space-y-2 animate-pulse">
          <div className="h-3 w-20 bg-gray-200 dark:bg-gray-800 rounded" />
          <div className="h-8 w-72 bg-gray-200 dark:bg-gray-800 rounded-lg" />
        </div>
      </div>

      {/* Content skeleton */}
      <div className="max-w-4xl mx-auto px-4 py-8 space-y-4 animate-pulse">
        <div className="h-5 bg-gray-200 dark:bg-gray-800 rounded-lg w-full" />
        <div className="h-5 bg-gray-200 dark:bg-gray-800 rounded-lg w-5/6" />
        <div className="h-5 bg-gray-200 dark:bg-gray-800 rounded-lg w-4/5" />
        <div className="mt-6 h-5 bg-gray-200 dark:bg-gray-800 rounded-lg w-3/4" />
        <div className="h-5 bg-gray-200 dark:bg-gray-800 rounded-lg w-full" />
        <div className="h-5 bg-gray-200 dark:bg-gray-800 rounded-lg w-5/6" />
        <div className="h-5 bg-gray-200 dark:bg-gray-800 rounded-lg w-2/3" />
        <div className="mt-6 h-40 bg-gray-100 dark:bg-gray-800 rounded-2xl" />
        <div className="h-5 bg-gray-200 dark:bg-gray-800 rounded-lg w-full" />
        <div className="h-5 bg-gray-200 dark:bg-gray-800 rounded-lg w-4/5" />
      </div>
    </div>
  )
}
