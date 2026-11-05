import { eq } from 'drizzle-orm'
import { db } from '../../db/index'
import { preferences } from '../../db/schema'

const cookieName = 'vairen-visitor'
const validId = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

export default async function handler(request: Request): Promise<Response> {
  const headers = new Headers({ 'Cache-Control': 'private, no-store' })
  const existing = request.headers.get('cookie')?.match(/(?:^|;\s*)vairen-visitor=([^;]+)/)?.[1]
  if (request.method === 'GET') {
    if (!existing || !validId.test(existing)) return Response.json({ preferences: null }, { headers })
    try {
      const [saved] = await db
        .select({
          locale: preferences.locale,
          theme: preferences.theme,
          reducedMotion: preferences.reducedMotion,
        })
        .from(preferences)
        .where(eq(preferences.id, existing))
        .limit(1)
      return Response.json({ preferences: saved ?? null }, { headers })
    } catch {
      return Response.json({ error: 'Preferences unavailable' }, { status: 503, headers })
    }
  }
  if (request.method !== 'POST')
    return Response.json({ error: 'Method not allowed' }, { status: 405, headers })
  const url = new URL(request.url)
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
    !['en', 'ar'].includes(body.locale) ||
    !['light', 'dark'].includes(body.theme) ||
    typeof body.reducedMotion !== 'boolean'
  ) {
    return Response.json({ error: 'Invalid preferences' }, { status: 400, headers })
  }
  const id = existing && validId.test(existing) ? existing : crypto.randomUUID()
  try {
    const values = {
      id,
      locale: body.locale,
      theme: body.theme,
      reducedMotion: body.reducedMotion,
      updatedAt: new Date(),
    }
    await db.insert(preferences).values(values).onConflictDoUpdate({ target: preferences.id, set: values })
    const secure = url.protocol === 'https:' ? '; Secure' : ''
    headers.append(
      'Set-Cookie',
      `${cookieName}=${id}; HttpOnly; SameSite=Lax; Path=/; Max-Age=31536000${secure}`,
    )
    // A non-sensitive render hint avoids a theme flash before React loads.
    headers.append(
      'Set-Cookie',
      `vairen-display=${body.theme}.${body.locale}.${body.reducedMotion ? '1' : '0'}; SameSite=Lax; Path=/; Max-Age=31536000${secure}`,
    )
    return Response.json({ saved: true }, { headers })
  } catch {
    return Response.json({ error: 'Preferences could not be saved' }, { status: 503, headers })
  }
}
