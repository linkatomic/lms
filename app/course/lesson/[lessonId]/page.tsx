import { createClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import LessonLayout from '@/components/LessonLayout'
import Lesson1HistoryOverview from '@/components/lessons/Lesson1HistoryOverview'
import Lesson2VisionMission from '@/components/lessons/Lesson2VisionMission'
import Lesson3Goals from '@/components/lessons/Lesson3Goals'
import Lesson4Philosophy from '@/components/lessons/Lesson4Philosophy'
import Lesson5Departments from '@/components/lessons/Lesson5Departments'
import Lesson6IntroDigitalMarketing from '@/components/lessons/Lesson6IntroDigitalMarketing'
import Lesson7ImportanceFuture from '@/components/lessons/Lesson7ImportanceFuture'
import Lesson8ContentMarketing from '@/components/lessons/Lesson8ContentMarketing'
import Lesson9GuestPosting from '@/components/lessons/Lesson9GuestPosting'
import Lesson10Quiz from '@/components/lessons/Lesson10Quiz'
import Lesson11KeyTerminologies from '@/components/lessons/Lesson11KeyTerminologies'
import Lesson12Quiz from '@/components/lessons/Lesson12Quiz'
import Lesson13KeyTerminologies from '@/components/lessons/Lesson13KeyTerminologies'
import Lesson14Quiz from '@/components/lessons/Lesson14Quiz'
import Lesson15KeyTerminologies from '@/components/lessons/Lesson15KeyTerminologies'
import Lesson16Quiz from '@/components/lessons/Lesson16Quiz'
import Lesson17KeyTerminologies from '@/components/lessons/Lesson17KeyTerminologies'
import Lesson18Quiz from '@/components/lessons/Lesson18Quiz'
import Lesson19KeyTerminologies from '@/components/lessons/Lesson19KeyTerminologies'
import Lesson20Quiz from '@/components/lessons/Lesson20Quiz'
import Lesson21KeyTerminologies from '@/components/lessons/Lesson21KeyTerminologies'
import Lesson22Quiz from '@/components/lessons/Lesson22Quiz'
import Lesson23KeyTerminologies from '@/components/lessons/Lesson23KeyTerminologies'
import Lesson24Quiz from '@/components/lessons/Lesson24Quiz'

const LESSON_COMPONENTS: Record<number, React.ComponentType> = {
  1: Lesson1HistoryOverview,
  2: Lesson2VisionMission,
  3: Lesson3Goals,
  4: Lesson4Philosophy,
  5: Lesson5Departments,
  6: Lesson6IntroDigitalMarketing,
  7: Lesson7ImportanceFuture,
  8: Lesson8ContentMarketing,
  9: Lesson9GuestPosting,
  10: Lesson10Quiz,
  11: Lesson11KeyTerminologies,
  12: Lesson12Quiz,
  13: Lesson13KeyTerminologies,
  14: Lesson14Quiz,
  15: Lesson15KeyTerminologies,
  16: Lesson16Quiz,
  17: Lesson17KeyTerminologies,
  18: Lesson18Quiz,
  19: Lesson19KeyTerminologies,
  20: Lesson20Quiz,
  21: Lesson21KeyTerminologies,
  22: Lesson22Quiz,
  23: Lesson23KeyTerminologies,
  24: Lesson24Quiz,
}

const LESSON_MODULE_MAP: Record<number, number> = {
  1: 1, 2: 1, 3: 1, 4: 1, 5: 1,
  6: 2, 7: 2, 8: 2, 9: 2, 10: 2, 11: 2, 12: 2, 13: 2, 14: 2, 15: 2, 16: 2, 17: 2, 18: 2, 19: 2, 20: 2, 21: 2, 22: 2, 23: 2, 24: 2,
}

export default async function LessonPage({ params }: { params: Promise<{ lessonId: string }> }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { lessonId } = await params
  const id = parseInt(lessonId)
  const LessonComponent = LESSON_COMPONENTS[id]
  const moduleId = LESSON_MODULE_MAP[id]

  if (!LessonComponent || !moduleId) notFound()

  return (
    <LessonLayout moduleId={moduleId} lessonId={id}>
      <LessonComponent />
    </LessonLayout>
  )
}
