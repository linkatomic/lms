'use server'

import { createAdminClient } from '@/lib/supabase/admin'
import { revalidatePath } from 'next/cache'

export async function setAttemptLimit(userId: string, lessonId: number, maxAttempts: number) {
  const admin = createAdminClient()
  const { error } = await admin.from('quiz_attempt_limits').upsert(
    { user_id: userId, lesson_id: lessonId, max_attempts: maxAttempts, updated_at: new Date().toISOString() },
    { onConflict: 'user_id,lesson_id' }
  )
  if (error) throw new Error(error.message)
  revalidatePath(`/admin/quiz/${lessonId}`)
}
