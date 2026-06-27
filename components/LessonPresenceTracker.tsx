'use client'

import { useEffect } from 'react'

export default function LessonPresenceTracker({ lessonId }: { lessonId: number }) {
  useEffect(() => {
    const send = () =>
      fetch('/api/presence/heartbeat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lessonId }),
      }).catch(() => {})

    send() // immediate on mount
    const iv = setInterval(send, 60_000) // every 60s

    // Re-ping when the tab becomes visible again
    const onVisible = () => { if (!document.hidden) send() }
    document.addEventListener('visibilitychange', onVisible)

    return () => {
      clearInterval(iv)
      document.removeEventListener('visibilitychange', onVisible)
    }
  }, [lessonId])

  return null
}
