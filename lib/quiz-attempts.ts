import { createClient } from '@/lib/supabase/client'

export interface QuizAttempt {
  id: string
  user_id: string
  lesson_id: number
  score: number
  total_questions: number
  pass_mark: number
  passed: boolean
  terminated: boolean
  time_used: number
  answers: Record<string, string>
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
  const { error } = await supabase.from('quiz_attempts').insert([data])
  if (error) { console.error('saveQuizAttempt error:', error); return false }
  return true
}
