const { test } = require('node:test')
const assert = require('node:assert/strict')
const fs = require('node:fs')
const path = require('node:path')
const vm = require('node:vm')
const ts = require('typescript')

const source = ts.transpileModule(fs.readFileSync(path.join(__dirname, '../lib/career-chat.ts'), 'utf8'), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, esModuleInterop: true, target: ts.ScriptTarget.ES2022 },
}).outputText

function setup({ failureStatus } = {}) {
  let payload
  class APIError extends Error {
    constructor(status) {
      super('Private provider diagnostics')
      this.status = status
    }
  }
  class Provider {
    static APIError = APIError
    constructor() {
      this.chat = {
        completions: {
          create: async (value) => {
            payload = value
            if (failureStatus) throw new APIError(failureStatus)
            return { choices: [{ message: { content: 'Practical career guidance.' } }] }
          },
        },
      }
    }
  }
  const sandbox = { exports: {}, require: () => Provider, Response, Request, URL }
  vm.runInNewContext(source, sandbox)
  return { handler: sandbox.exports.careerChat, payload: () => payload }
}

const validBody = { locale: 'ar', messages: [{ role: 'user', text: 'Help me choose a career.' }] }
function request(body, headers = {}) {
  return new Request('https://vairen.test/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...headers },
    body: JSON.stringify(body),
  })
}

test('rejects invalid chat histories and unsupported interface languages', async () => {
  const { handler } = setup()
  const invalid = [
    null,
    {},
    { locale: 'en', messages: [null] },
    { locale: 'fr', messages: validBody.messages },
    { locale: 'en', messages: [] },
    { locale: 'en', messages: [{ role: 'model', text: 'Hi' }] },
    { locale: 'en', messages: [{ role: 'user', text: 'x'.repeat(6001) }] },
  ]
  for (const body of invalid) assert.equal((await handler(request(body))).status, 400)
})

test('rejects unsupported methods, foreign origins, malformed JSON and oversized bodies', async () => {
  const { handler } = setup()
  assert.equal((await handler(new Request('https://vairen.test/api/chat'))).status, 405)
  assert.equal((await handler(request(validBody, { origin: 'https://untrusted.test' }))).status, 403)
  assert.equal(
    (await handler(new Request('https://vairen.test/api/chat', { method: 'POST', body: '{' }))).status,
    400,
  )
  assert.equal(
    (await handler(request({ locale: 'en', messages: [{ role: 'user', text: 'x'.repeat(48001) }] }))).status,
    413,
  )
})

test('sends the selected language and bounded career instructions to the provider', async () => {
  const { handler, payload } = setup()
  const response = await handler(request(validBody))
  assert.equal(response.status, 200)
  assert.equal((await response.json()).text, 'Practical career guidance.')
  assert.match(payload().messages[0].content, /Arabic/)
  assert.match(payload().messages[0].content, /careers/)
  assert.equal(payload().messages.at(-1).role, 'user')
  assert.equal(response.headers.get('cache-control'), 'no-store')
})

for (const [upstream, expected] of [
  [500, 503],
  [429, 429],
]) {
  test(`handles provider ${upstream} without exposing diagnostics`, async () => {
    const { handler } = setup({ failureStatus: upstream })
    const response = await handler(request(validBody))
    assert.equal(response.status, expected)
    assert.doesNotMatch(await response.text(), /Private provider/)
  })
}
