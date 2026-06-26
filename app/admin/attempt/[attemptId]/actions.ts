'use server'

import { createAdminClient } from '@/lib/supabase/admin'
import { revalidatePath } from 'next/cache'

export async function submitDescriptiveReview(
  attemptId: string,
  feedback: Record<string, string>,
  scores: Record<string, string>
) {
  const admin = createAdminClient()
  const { error } = await admin
    .from('quiz_attempts')
    .update({
      review_status: 'reviewed',
      admin_feedback: feedback,
      descriptive_scores: scores,
      reviewed_at: new Date().toISOString(),
    })
    .eq('id', attemptId)

  if (error) throw new Error(error.message)
  revalidatePath(`/admin/attempt/${attemptId}`)
}
