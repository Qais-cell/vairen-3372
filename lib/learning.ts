import type { Locale } from './i18n'

export type Localized = Record<Locale, string>
export type LearningCategory =
  'systems' | 'ai' | 'cloud' | 'security' | 'design' | 'data' | 'mobile' | 'blockchain'
export type LearningLevel = 'beginner' | 'intermediate' | 'advanced'
export type LessonKind = 'video' | 'reading' | 'practice' | 'quiz'
export type QuizQuestion = {
  question: Localized
  options: Localized[]
  answer: number
  explanation: Localized
}
export type StudyContent = {
  introduction: Localized
  sections: { title: Localized; body: Localized }[]
  questions?: QuizQuestion[]
}
export type LearningCourse = {
  id: string
  title: Localized
  summary: Localized
  category: LearningCategory
  level: LearningLevel
  professionIds: string[]
  provider: string
  sourceTitle: string
  sourceUrl: string
  videoId: string
  imagePath: string
  visualPrompt: Localized
  prerequisites: Localized
  outcomes: Localized[]
}
export type LearningLesson = {
  id: string
  courseId: string
  position: number
  kind: LessonKind
  title: Localized
  content: StudyContent
}
export type CourseSummary = LearningCourse & { lessonCount: number }
export type CourseDetail = { course: LearningCourse; lessons: LearningLesson[]; completed: string[] }
export const learningCategories: Record<LearningCategory, Localized> = {
  systems: { en: 'Software & systems', ar: 'البرمجيات والأنظمة' },
  ai: { en: 'Artificial intelligence', ar: 'الذكاء الاصطناعي' },
  cloud: { en: 'Cloud & DevOps', ar: 'السحابة وDevOps' },
  security: { en: 'Cybersecurity', ar: 'الأمن السيبراني' },
  design: { en: 'Product design', ar: 'تصميم المنتجات' },
  data: { en: 'Data engineering', ar: 'هندسة البيانات' },
  mobile: { en: 'Mobile development', ar: 'تطوير الجوال' },
  blockchain: { en: 'Blockchain', ar: 'البلوك تشين' },
}
export function videoEmbedUrl(videoId: string) {
  if (!/^[A-Za-z0-9_-]{11}$/.test(videoId)) throw new Error('Invalid video identifier')
  return `https://www.youtube-nocookie.com/embed/${videoId}?rel=0&playsinline=1`
}
