import { and, asc, eq } from 'drizzle-orm'
import { db } from '../../db/index'
import { learningCourses, learningLessons, learningProgress } from '../../db/schema'

const validId = /^[a-z0-9-]{1,96}$/
const validVisitor = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
export default async function learning(request: Request): Promise<Response> {
  const headers = new Headers({ 'Cache-Control': 'private, no-store' })
  const url = new URL(request.url)
  const cookie = request.headers.get('cookie')?.match(/(?:^|;\s*)vairen-visitor=([^;]+)/)?.[1]
  const visitor = cookie && validVisitor.test(cookie) ? cookie : null
  if (request.method === 'GET') {
    const id = url.searchParams.get('course')
    const profession = url.searchParams.get('profession')
    if ((id && !validId.test(id)) || (profession && !validId.test(profession)))
      return Response.json({ error: 'Invalid identifier' }, { status: 400, headers })
    try {
      if (!id) {
        const [courses, lessonRows] = await Promise.all([
          db.select().from(learningCourses).orderBy(asc(learningCourses.id)),
          db.select({ courseId: learningLessons.courseId }).from(learningLessons),
        ])
        const counts = new Map<string, number>()
        lessonRows.forEach((row) => counts.set(row.courseId, (counts.get(row.courseId) ?? 0) + 1))
        return Response.json(
          {
            courses: courses
              .filter((c) => !profession || c.professionIds.includes(profession))
              .map((c) => ({ ...c, lessonCount: counts.get(c.id) ?? 0 })),
          },
          { headers },
        )
      }
      const [course] = await db.select().from(learningCourses).where(eq(learningCourses.id, id)).limit(1)
      if (!course) return Response.json({ error: 'Course not found' }, { status: 404, headers })
      const [lessons, progress] = await Promise.all([
        db
          .select()
          .from(learningLessons)
          .where(eq(learningLessons.courseId, id))
          .orderBy(asc(learningLessons.position)),
        visitor
          ? db
              .select({ lessonId: learningProgress.lessonId })
              .from(learningProgress)
              .innerJoin(learningLessons, eq(learningLessons.id, learningProgress.lessonId))
              .where(and(eq(learningProgress.visitorId, visitor), eq(learningLessons.courseId, id)))
          : Promise.resolve([]),
      ])
      return Response.json({ course, lessons, completed: progress.map((p) => p.lessonId) }, { headers })
    } catch {
      return Response.json({ error: 'Learning library is temporarily unavailable' }, { status: 503, headers })
    }
  }
  if (request.method !== 'POST')
    return Response.json(
      { error: 'Method not allowed' },
      { status: 405, headers: { ...Object.fromEntries(headers), Allow: 'GET, POST' } },
    )
  if (request.headers.get('origin') !== url.origin)
    return Response.json({ error: 'Invalid origin' }, { status: 403, headers })
  let body
  try {
    const raw = await request.text()
    if (raw.length > 1024) return Response.json({ error: 'Request too large' }, { status: 413, headers })
    body = JSON.parse(raw)
  } catch {
    return Response.json({ error: 'Invalid request' }, { status: 400, headers })
  }
  if (
    !body ||
    typeof body.lessonId !== 'string' ||
    !validId.test(body.lessonId) ||
    typeof body.completed !== 'boolean'
  )
    return Response.json({ error: 'Invalid progress' }, { status: 400, headers })
  const id = visitor ?? crypto.randomUUID()
  try {
    const [lesson] = await db
      .select({ id: learningLessons.id })
      .from(learningLessons)
      .where(eq(learningLessons.id, body.lessonId))
      .limit(1)
    if (!lesson) return Response.json({ error: 'Lesson not found' }, { status: 404, headers })
    if (body.completed)
      await db
        .insert(learningProgress)
        .values({ visitorId: id, lessonId: body.lessonId })
        .onConflictDoNothing()
    else
      await db
        .delete(learningProgress)
        .where(and(eq(learningProgress.visitorId, id), eq(learningProgress.lessonId, body.lessonId)))
    headers.append(
      'Set-Cookie',
      `vairen-visitor=${id}; HttpOnly; SameSite=Lax; Path=/; Max-Age=31536000${url.protocol === 'https:' ? '; Secure' : ''}`,
    )
    return Response.json({ lessonId: body.lessonId, completed: body.completed }, { headers })
  } catch {
    return Response.json({ error: 'Progress could not be saved' }, { status: 503, headers })
  }
}
