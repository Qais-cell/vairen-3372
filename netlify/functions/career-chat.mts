import { eq } from 'drizzle-orm'
import { careerChat } from '../../lib/career-chat'
import { db } from '../../db/index'
import { learningCourses, learningLessons } from '../../db/schema'

export default async function handler(request: Request) {
  if (request.method !== 'POST') return careerChat(request)
  const origin = request.headers.get('origin')
  if (origin && origin !== new URL(request.url).origin)
    return Response.json({ error: 'Invalid origin' }, { status: 403 })
  let body
  try {
    const raw = await request.clone().text()
    if (raw.length > 48000) return Response.json({ error: 'Request too large' }, { status: 413 })
    body = JSON.parse(raw)
  } catch {
    return Response.json({ error: 'Invalid request' }, { status: 400 })
  }
  if (body?.lessonId === undefined) return careerChat(request)
  if (typeof body.lessonId !== 'string' || !/^[a-z0-9-]{1,96}$/.test(body.lessonId))
    return Response.json({ error: 'Invalid stage' }, { status: 400 })
  try {
    const [lesson] = await db.select().from(learningLessons).where(eq(learningLessons.id, body.lessonId)).limit(1)
    if (!lesson) return Response.json({ error: 'Stage not found' }, { status: 404 })
    const [course] = await db.select().from(learningCourses).where(eq(learningCourses.id, lesson.courseId)).limit(1)
    return careerChat(request, JSON.stringify({ course: course?.title, source: course?.sourceTitle, lesson }))
  } catch {
    return Response.json({ error: 'Stage tutor temporarily unavailable' }, { status: 503 })
  }
}
