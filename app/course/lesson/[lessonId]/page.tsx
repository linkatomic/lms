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

const LESSON_COMPONENTS: Record<number, React.ComponentType> = {
  1: Lesson1HistoryOverview,
  2: Lesson2VisionMission,
  3: Lesson3Goals,
  4: Lesson4Philosophy,
  5: Lesson5Departments,
  6: Lesson6IntroDigitalMarketing,
  7: Lesson7ImportanceFuture,
}

const LESSON_MODULE_MAP: Record<number, number> = {
  1: 1, 2: 1, 3: 1, 4: 1, 5: 1,
  6: 2, 7: 2,
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
