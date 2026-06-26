import { createClient } from '@/lib/supabase/client'

export interface QuizAttempt {
  id: string
  user_id: string
  user_email: string | null
  lesson_id: number
  score: number
  total_questions: number
  pass_mark: number
  passed: boolean
  terminated: boolean
  time_used: number
  answers: Record<string, string>
  review_status: string        // 'not_required' | 'pending' | 'reviewed'
  admin_feedback: Record<string, string>   // {questionIndex: 'admin comment text'}
  descriptive_scores: Record<string, string> // {questionIndex: 'correct'|'partial'|'incorrect'}
  reviewed_at: string | null
  created_at: string
}

export interface SaveAttemptData {
  lesson_id: number
  score: number
  total_questions: number
  pass_mark: number
  passed: boolean
  terminated: boolean
  time_used: number
  answers: Record<string, string>
  review_status?: string  // defaults to 'not_required'; L27 passes 'pending'
}

export async function getQuizAttempts(lessonId: number): Promise<QuizAttempt[]> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('quiz_attempts')
    .select('*')
    .eq('lesson_id', lessonId)
    .order('created_at', { ascending: false })
  if (error) { console.error('getQuizAttempts error:', error); return [] }
  return (data ?? []) as QuizAttempt[]
}

export async function saveQuizAttempt(data: SaveAttemptData): Promise<boolean> {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const { error } = await supabase.from('quiz_attempts').insert([{
    ...data,
    user_id: user?.id,
    user_email: user?.email ?? null,
    review_status: data.review_status ?? 'not_required',
  }])
  if (error) { console.error('saveQuizAttempt error:', error); return false }
  return true
}
