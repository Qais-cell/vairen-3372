'use client'

import { useEffect, useRef, useState, type FormEvent, type KeyboardEvent } from 'react'
import { ArrowUp, RotateCcw } from 'lucide-react'
import type { Dictionary } from '@/lib/i18n'
import { cn } from '@/lib/utils'
import { FormattedText } from './formatted-text'

type Message = { id: string; role: 'user' | 'model'; text: string; error?: boolean }

export function AssistantView({ t }: { t: Dictionary }) {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [pending, setPending] = useState(false)
  const endRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' })
  }, [messages, pending])

  async function send(raw: string) {
    const text = raw.trim()
    if (!text || pending) return

    const userMessage: Message = { id: crypto.randomUUID(), role: 'user', text }
    const history = [...messages.filter((m) => !m.error), userMessage]
    setMessages((prev) => [...prev, userMessage])
    setInput('')
    setPending(true)

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: history.map(({ role, text }) => ({ role, text })) }),
      })
      const data = await res.json()
      if (!res.ok || !data.text) throw new Error(data.error ?? 'Request failed')
      setMessages((prev) => [...prev, { id: crypto.randomUUID(), role: 'model', text: data.text }])
    } catch {
      setMessages((prev) => [...prev, { id: crypto.randomUUID(), role: 'model', text: t.assistant.error, error: true }])
    } finally {
      setPending(false)
      textareaRef.current?.focus()
    }
  }

  function onSubmit(e: FormEvent) {
    e.preventDefault()
    send(input)
  }

  function onKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      if (e.nativeEvent.isComposing || e.keyCode === 229) return
      e.preventDefault()
      send(input)
    }
  }

  return (
    <section className="animate-view-in flex flex-1 flex-col" aria-labelledby="assistant-title">
      <div className="flex items-start justify-between gap-4">
        <header className="flex flex-col gap-2">
          <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">Gemini</span>
          <h1 id="assistant-title" className="text-3xl font-semibold tracking-tight">{t.assistant.title}</h1>
          <p className="text-[15px] leading-relaxed text-muted-foreground text-pretty">{t.assistant.subtitle}</p>
        </header>
        {messages.length > 0 && (
          <button
            type="button"
            onClick={() => setMessages([])}
            disabled={pending}
            className="flex h-9 shrink-0 items-center gap-2 rounded-full border border-border px-3 text-sm text-muted-foreground transition-colors hover:border-ring hover:text-foreground disabled:opacity-50"
          >
            <RotateCcw className="size-3.5" aria-hidden="true" />
            {t.assistant.clear}
          </button>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-4 pb-32 pt-6" aria-live="polite">
        {messages.length === 0 && (
          <ul className="flex flex-col gap-2">
            {t.assistant.suggestions.map((s) => (
              <li key={s}>
                <button
                  type="button"
                  onClick={() => send(s)}
                  className="w-full rounded-xl border border-border bg-card px-4 py-3 text-start text-sm leading-relaxed text-muted-foreground transition-colors hover:border-ring hover:text-foreground"
                >
                  {s}
                </button>
              </li>
            ))}
          </ul>
        )}

        {messages.map((m) =>
          m.role === 'user' ? (
            <div key={m.id} className="animate-view-in flex justify-end">
              <p className="max-w-[85%] whitespace-pre-wrap rounded-2xl bg-secondary px-4 py-2.5 text-[15px] leading-relaxed">
                <span className="sr-only">{t.assistant.you}: </span>
                {m.text}
              </p>
            </div>
          ) : (
            <div key={m.id} className="animate-view-in flex flex-col gap-1.5">
              <span className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">Vairen</span>
              <div className={cn('text-[15px] leading-relaxed', m.error && 'text-destructive')}>
                <FormattedText text={m.text} />
              </div>
            </div>
          ),
        )}

        {pending && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground" role="status">
            <span className="flex gap-1" aria-hidden="true">
              {[0, 1, 2].map((n) => (
                <span key={n} className="size-1.5 animate-pulse rounded-full bg-muted-foreground" style={{ animationDelay: `${n * 150}ms` }} />
              ))}
            </span>
            {t.assistant.thinking}
          </div>
        )}
        <div ref={endRef} />
      </div>

      <div className="fixed inset-x-0 bottom-[calc(4rem+env(safe-area-inset-bottom))] z-20 bg-gradient-to-t from-background via-background to-transparent px-4 pb-3 pt-6">
        <form onSubmit={onSubmit} className="mx-auto flex w-full max-w-2xl items-end gap-2 rounded-2xl border border-border bg-card p-2 transition-colors focus-within:border-ring">
          <label htmlFor="assistant-input" className="sr-only">{t.assistant.inputLabel}</label>
          <textarea
            id="assistant-input"
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder={t.assistant.placeholder}
            rows={1}
            className="max-h-40 min-h-10 flex-1 resize-none bg-transparent px-2 py-2 text-[15px] leading-relaxed text-foreground placeholder:text-muted-foreground focus:outline-none [field-sizing:content]"
          />
          <button
            type="submit"
            disabled={!input.trim() || pending}
            aria-label={t.assistant.send}
            className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-foreground text-primary-foreground transition-opacity disabled:opacity-30"
          >
            <ArrowUp className="size-4" aria-hidden="true" />
          </button>
        </form>
      </div>
    </section>
  )
}
