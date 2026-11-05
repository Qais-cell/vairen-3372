const { test } = require('node:test')
const assert = require('node:assert/strict')
const fs = require('node:fs')
const path = require('node:path')
const vm = require('node:vm')
const ts = require('typescript')
const { webcrypto } = require('node:crypto')

const source = ts.transpileModule(
  fs.readFileSync(path.join(__dirname, '../netlify/functions/preferences.mts'), 'utf8'),
  {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  },
).outputText

function setup({ fail = false } = {}) {
  let stored
  let writes = 0
  const db = {
    insert: () => ({
      values: (value) => ({
        onConflictDoUpdate: async () => {
          if (fail) throw new Error('Private database details')
          stored = value
          writes++
        },
      }),
    }),
    select: () => ({
      from: () => ({
        where: () => ({
          limit: async () => {
            if (fail) throw new Error('Unavailable')
            return stored ? [stored] : []
          },
        }),
      }),
    }),
  }
  const sandbox = {
    exports: {},
    Request,
    Response,
    URL,
    Headers,
    crypto: webcrypto,
    require: (name) =>
      name === 'drizzle-orm'
        ? { eq: (a, b) => [a, b] }
        : name.includes('schema')
          ? { preferences: {} }
          : { db },
  }
  vm.runInNewContext(source, sandbox)
  return { handler: sandbox.exports.default, stored: () => stored, writes: () => writes }
}
const url = 'https://vairen.test/.netlify/functions/preferences'
function save(body, extraHeaders = {}) {
  return new Request(url, {
    method: 'POST',
    headers: { origin: 'https://vairen.test', 'Content-Type': 'application/json', ...extraHeaders },
    body: JSON.stringify(body),
  })
}
const valid = { locale: 'ar', theme: 'light', reducedMotion: true }

test('does not query storage for visitors without a valid preference cookie', async () => {
  const { handler } = setup({ fail: true })
  assert.deepEqual(await (await handler(new Request(url))).json(), { preferences: null })
  assert.deepEqual(
    await (await handler(new Request(url, { headers: { cookie: 'vairen-visitor=invalid' } }))).json(),
    { preferences: null },
  )
})

test('rejects invalid settings and cross-origin changes before writing', async () => {
  const { handler, writes } = setup()
  for (const value of [
    null,
    {},
    { ...valid, locale: 'xx' },
    { ...valid, theme: 'invalid' },
    { ...valid, reducedMotion: 'true' },
  ])
    assert.equal((await handler(save(value))).status, 400)
  assert.equal((await handler(save(valid, { origin: 'https://untrusted.test' }))).status, 403)
  assert.equal(writes(), 0)
})

test('persists settings under an opaque visitor cookie and restores them', async () => {
  const { handler, stored, writes } = setup()
  const response = await handler(save(valid))
  assert.equal(response.status, 200)
  assert.equal(writes(), 1)
  const cookies = response.headers.getSetCookie()
  assert.equal(cookies.length, 2)
  assert.match(cookies[0], /HttpOnly/)
  assert.match(cookies[0], /Secure/)
  assert.match(cookies[1], /vairen-display=light.ar.1/)
  assert.equal(stored().locale, 'ar')
  const restored = await handler(new Request(url, { headers: { cookie: cookies[0].split(';')[0] } }))
  assert.equal((await restored.json()).preferences.theme, 'light')
  assert.match(restored.headers.get('cache-control'), /no-store/)
})

test('returns a recoverable storage error without exposing database diagnostics', async () => {
  const { handler } = setup({ fail: true })
  const response = await handler(save(valid))
  assert.equal(response.status, 503)
  assert.doesNotMatch(await response.text(), /Private database/)
  assert.equal(response.headers.getSetCookie().length, 0)
})
