import { NextResponse } from 'next/server'

const GEMINI_API_KEY = process.env.GEMINI_API_KEY

// gemini-1.5-flash is retired by Google (404); later entries keep the chat working.
const MODEL_CHAIN = [
  'gemini-1.5-flash',
  'gemini-3.5-flash',
  'gemini-flash-latest',
  'gemini-3.5-flash-lite',
  'gemini-flash-lite-latest',
]

const RETRYABLE_STATUS = new Set([404, 429, 500, 503])

const SYSTEM_PROMPT = `You are Vairen, the AI assistant of Vairen, a platform for global career paths and technical learning.
Be precise, concise and practical. You are exclusively a global professions, career paths, employment and workforce expert. Help users choose professions, understand labor markets, build career roadmaps, prepare for interviews, improve employability and plan learning. Do not answer unrelated technical, medical, legal or general trivia questions; redirect them toward career relevance.
Use short paragraphs or compact lists. Never use emojis.
Always reply in the same language the user writes in (Arabic or English).`

type ChatMessage = { role: 'user' | 'model'; text: string }

export async function POST(request: Request) {
  let messages: ChatMessage[]
  try {
    const body = await request.json()
    messages = Array.isArray(body?.messages) ? body.messages : []
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
  }

  if (!GEMINI_API_KEY) return NextResponse.json({ error: 'Assistant is not configured.' }, { status: 503 })

  const contents = messages
    .filter(
      (m) =>
        (m.role === 'user' || m.role === 'model') &&
        typeof m.text === 'string' &&
        m.text.trim().length > 0,
    )
    .slice(-20)
    .map((m) => ({ role: m.role, parts: [{ text: m.text.slice(0, 8000) }] }))

  if (contents.length === 0 || contents[contents.length - 1].role !== 'user') {
    return NextResponse.json({ error: 'A user message is required' }, { status: 400 })
  }

  const payload = JSON.stringify({
    systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
    contents,
    generationConfig: { temperature: 0.7, maxOutputTokens: 2048 },
  })

  let lastError = 'The assistant is unavailable right now.'

  for (const model of MODEL_CHAIN) {
    try {
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-goog-api-key': GEMINI_API_KEY,
          },
          body: payload,
          signal: AbortSignal.timeout(45000),
        },
      )
      const data = await res.json()

      if (!res.ok) {
        lastError = data?.error?.message ?? `Request failed with ${res.status}`
        if (RETRYABLE_STATUS.has(res.status)) continue
        break
      }

      const text: string = (data?.candidates?.[0]?.content?.parts ?? [])
        .filter((p: { text?: string; thought?: boolean }) => p.text && !p.thought)
        .map((p: { text: string }) => p.text)
        .join('')
        .trim()

      if (!text) {
        lastError = 'Empty response from model.'
        continue
      }

      return NextResponse.json({ text, model })
    } catch (error) {
      lastError = error instanceof Error ? error.message : 'Network error'
    }
  }

  return NextResponse.json({ error: lastError }, { status: 502 })
}
