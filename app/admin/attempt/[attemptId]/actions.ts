'use server'

import { createAdminClient } from '@/lib/supabase/admin'
import { revalidatePath } from 'next/cache'
import { sendEmail, reviewCompleteUserEmail } from '@/lib/gmail'
import { COURSE } from '@/lib/course-data'

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'

function getLessonTitle(lessonId: number): string {
  for (const mod of COURSE.modules) {
    const lesson = mod.lessons.find(l => l.id === lessonId)
    if (lesson) return lesson.title
  }
  return `Lesson ${lessonId}`
}

export async function submitDescriptiveReview(
  attemptId: string,
  feedback: Record<string, string>,
  scores: Record<string, string>
) {
  const admin = createAdminClient()

  // Fetch the attempt first so we can email the user
  const { data: attempt } = await admin
    .from('quiz_attempts')
    .select('user_id, user_email, lesson_id, score, total_questions, passed')
    .eq('id', attemptId)
    .single()

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

  // Send result email to the user
  if (attempt?.user_email) {
    // Get user display name
    const { data: profile } = await admin
      .from('profiles')
      .select('display_name')
      .eq('id', attempt.user_id)
      .single()

    const userName = profile?.display_name ?? attempt.user_email

    // Compile overall manager feedback (concatenate all non-empty feedback values)
    const combinedFeedback = Object.values(feedback)
      .filter(f => f?.trim())
      .join('\n\n')
      .trim() || null

    await sendEmail(
      attempt.user_email,
      `Your results for Lesson ${attempt.lesson_id} are ready`,
      reviewCompleteUserEmail({
        userName,
        lessonId: attempt.lesson_id,
        lessonTitle: getLessonTitle(attempt.lesson_id),
        score: attempt.score,
        totalQuestions: attempt.total_questions,
        passed: attempt.passed,
        feedback: combinedFeedback,
        resultsUrl: `${APP_URL}/my-results`,
      }),
    )
  }

  revalidatePath(`/admin/attempt/${attemptId}`)
}
