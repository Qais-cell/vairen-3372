const { test } = require('node:test')
const assert = require('node:assert/strict')
const fs = require('node:fs')
const path = require('node:path')
const vm = require('node:vm')
const ts = require('typescript')
const { webcrypto } = require('node:crypto')
function compile(file, globals = {}) {
  const sandbox = { exports: {}, Request, Response, URL, Headers, Map, crypto: webcrypto, ...globals }
  const code = ts.transpileModule(fs.readFileSync(path.join(__dirname, '..', file), 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  }).outputText
  vm.runInNewContext(code, sandbox)
  return sandbox.exports
}
const catalog = compile('db/seeds/learning.ts')
const url = 'https://vairen.test/.netlify/functions/learning'
function setup({ fail = false } = {}) {
  const tables = Object.fromEntries(
    ['learningCourses', 'learningLessons', 'learningProgress'].map((name) => [
      name,
      Object.fromEntries(
        ['id', 'courseId', 'visitorId', 'lessonId', 'position'].map((key) => [key, { table: name, key }]),
      ),
    ]),
  )
  Object.entries(tables).forEach(([name, table]) => {
    table.name = name
  })
  const rows = {
    learningCourses: JSON.parse(JSON.stringify(catalog.seedCourses)),
    learningLessons: JSON.parse(JSON.stringify(catalog.seedLessons)),
    learningProgress: [],
  }
  const evaluate = (condition, row) =>
    !condition ||
    (condition.and
      ? condition.and.every((c) => evaluate(c, row))
      : row[condition.field.table]?.[condition.field.key] === condition.value)
  const db = {
    select(projection) {
      let table, condition, joined, limit
      const query = {
        from(value) {
          table = value
          return query
        },
        where(value) {
          condition = value
          return query
        },
        innerJoin(value) {
          joined = value
          return query
        },
        orderBy() {
          return query
        },
        limit(value) {
          limit = value
          return query
        },
        then(resolve, reject) {
          if (fail) return Promise.reject(new Error('Private storage details')).then(resolve, reject)
          let result = rows[table.name].map((row) => ({ [table.name]: row }))
          if (joined)
            result = result.flatMap((row) =>
              rows[joined.name]
                .filter((lesson) => lesson.id === row.learningProgress.lessonId)
                .map((lesson) => ({ ...row, [joined.name]: lesson })),
            )
          result = result
            .filter((row) => evaluate(condition, row))
            .map((row) =>
              projection
                ? Object.fromEntries(
                    Object.entries(projection).map(([key, field]) => [key, row[field.table][field.key]]),
                  )
                : row[table.name],
            )
          if (limit !== undefined) result = result.slice(0, limit)
          return Promise.resolve(result).then(resolve, reject)
        },
      }
      return query
    },
    insert() {
      return {
        values(value) {
          return {
            async onConflictDoNothing() {
              if (fail) throw new Error('Private storage details')
              if (
                !rows.learningProgress.some(
                  (row) => row.visitorId === value.visitorId && row.lessonId === value.lessonId,
                )
              )
                rows.learningProgress.push(value)
            },
          }
        },
      }
    },
    delete() {
      return {
        async where(condition) {
          if (fail) throw new Error('Private storage details')
          rows.learningProgress = rows.learningProgress.filter(
            (row) => !evaluate(condition, { learningProgress: row }),
          )
        },
      }
    },
  }
  const handler = compile('netlify/functions/learning.mts', {
    require: (name) =>
      name === 'drizzle-orm'
        ? {
            eq: (field, value) => ({ field, value }),
            and: (...conditions) => ({ and: conditions }),
            asc: (field) => field,
          }
        : name.includes('schema')
          ? tables
          : { db },
  }).default
  return { handler, rows }
}
function save(body, cookie, origin = 'https://vairen.test') {
  return new Request(url, {
    method: 'POST',
    headers: { origin, 'Content-Type': 'application/json', ...(cookie ? { cookie } : {}) },
    body: JSON.stringify(body),
  })
}
test('catalog includes complete embedded sources, bilingual companions and valid quizzes for every career', () => {
  assert.equal(catalog.seedCourses.length, 14)
  assert.equal(catalog.seedLessons.length, 56)
  assert.equal(new Set(catalog.seedCourses.map((c) => c.id)).size, 14)
  const roles = new Set(catalog.seedCourses.flatMap((course) => course.professionIds))
  assert.equal(roles.size, 10)
  assert.equal(new Set(catalog.seedCourses.map((c) => c.category)).size, 8)
  assert.equal(new Set(catalog.seedCourses.map((c) => c.level)).size, 3)
  for (const course of catalog.seedCourses) {
    assert.match(course.videoId, /^[A-Za-z0-9_-]{11}$/)
    assert.equal(new URL(course.sourceUrl).hostname, 'www.youtube.com')
    assert.ok(fs.existsSync(path.join(__dirname, '../public', course.imagePath)))
    const lessons = catalog.seedLessons.filter((lesson) => lesson.courseId === course.id)
    assert.equal(lessons.length, 4)
    assert.equal(new Set(lessons.map((lesson) => lesson.kind)).size, 4)
    for (const locale of ['en', 'ar']) {
      assert.ok(course.visualPrompt[locale].length > 100)
      assert.ok(fs.existsSync(path.join(__dirname, `../public/images/courses/${course.id}-${locale}.svg`)))
      for (const lesson of lessons) assert.ok(lesson.content.introduction[locale])
    }
    for (const question of lessons.find((lesson) => lesson.kind === 'quiz').content.questions)
      assert.ok(question.answer >= 0 && question.answer < question.options.length)
  }
})
test('serves the library, filters professions and handles missing courses', async () => {
  const { handler } = setup()
  const list = await handler(new Request(url))
  const data = await list.json()
  assert.equal(data.courses.length, 14)
  assert.ok(data.courses.every((course) => course.lessonCount === 4))
  const filtered = await (await handler(new Request(`${url}?profession=product-designer`))).json()
  assert.equal(filtered.courses.length, 1)
  assert.equal(filtered.courses[0].id, 'figma-design')
  assert.equal((await handler(new Request(`${url}?course=missing`))).status, 404)
  assert.equal((await handler(new Request(`${url}?course=invalid%2Fpath`))).status, 400)
})
test('saves completion idempotently, restores it and isolates visitors', async () => {
  const { handler, rows } = setup()
  const lessonId = catalog.seedLessons[0].id
  const courseId = catalog.seedCourses[0].id
  const first = await handler(save({ lessonId, completed: true }))
  assert.equal(first.status, 200)
  const cookie = first.headers.getSetCookie()[0].split(';')[0]
  assert.match(first.headers.getSetCookie()[0], /HttpOnly.*Secure/)
  await handler(save({ lessonId, completed: true }, cookie))
  assert.equal(rows.learningProgress.length, 1)
  const own = await (await handler(new Request(`${url}?course=${courseId}`, { headers: { cookie } }))).json()
  assert.deepEqual(own.completed, [lessonId])
  const otherCookie = 'vairen-visitor=00000000-0000-4000-8000-000000000001'
  const other = await (
    await handler(new Request(`${url}?course=${courseId}`, { headers: { cookie: otherCookie } }))
  ).json()
  assert.deepEqual(other.completed, [])
  await handler(save({ lessonId, completed: false }, otherCookie))
  assert.equal(rows.learningProgress.length, 1)
  await handler(save({ lessonId, completed: false }, cookie))
  assert.equal(rows.learningProgress.length, 0)
})
test('rejects malformed progress and cross-origin changes before writing', async () => {
  const { handler, rows } = setup()
  for (const value of [
    null,
    {},
    { lessonId: '../bad', completed: true },
    { lessonId: 'valid', completed: 'yes' },
  ])
    assert.equal((await handler(save(value))).status, 400)
  assert.equal(
    (await handler(save({ lessonId: 'valid', completed: true }, null, 'https://untrusted.test'))).status,
    403,
  )
  assert.equal((await handler(save({ lessonId: 'unknown', completed: true }))).status, 404)
  assert.equal((await handler(new Request(url, { method: 'DELETE' }))).status, 405)
  assert.equal(rows.learningProgress.length, 0)
})
test('returns recoverable errors without exposing storage diagnostics', async () => {
  const { handler } = setup({ fail: true })
  for (const request of [new Request(url), save({ lessonId: catalog.seedLessons[0].id, completed: true })]) {
    const response = await handler(request)
    assert.equal(response.status, 503)
    assert.doesNotMatch(await response.text(), /Private storage/)
    assert.equal(response.headers.getSetCookie().length, 0)
  }
})
test('video URLs only allow validated publisher video IDs', () => {
  const { videoEmbedUrl } = compile('lib/learning.ts')
  assert.match(videoEmbedUrl('rfscVS0vtbw'), /^https:\/\/www\.youtube-nocookie\.com\/embed\//)
  assert.throws(() => videoEmbedUrl('https://untrusted.test/video'))
})
