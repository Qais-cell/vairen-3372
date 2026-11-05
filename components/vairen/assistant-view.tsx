'use client'

import { useEffect, useRef, useState, type FormEvent, type KeyboardEvent } from 'react'
import { ArrowUp, Mic, RotateCcw, Square, Volume2, VolumeX, Sparkles } from 'lucide-react'
import type { Dictionary, Locale } from '@/lib/i18n'
import { cn } from '@/lib/utils'
import { FormattedText } from './formatted-text'

type Message = { id: string; role: 'user' | 'model'; text: string; error?: boolean }
type SpeechRecognitionLike = {
  lang: string
  interimResults: boolean
  continuous: boolean
  onresult: ((event: { results: ArrayLike<ArrayLike<{ transcript: string }>> }) => void) | null
  onend: (() => void) | null
  onerror: (() => void) | null
  start: () => void
  stop: () => void
}
type SpeechRecognitionConstructor = new () => SpeechRecognitionLike

declare global {
  interface Window {
    SpeechRecognition?: SpeechRecognitionConstructor
    webkitSpeechRecognition?: SpeechRecognitionConstructor
  }
}

export function AssistantView({
  t,
  locale,
  initialPrompt,
  onPromptConsumed,
}: {
  t: Dictionary
  locale: Locale
  initialPrompt?: string | null
  onPromptConsumed?: () => void
}) {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [pending, setPending] = useState(false)
  const [listening, setListening] = useState(false)
  const [readAloud, setReadAloud] = useState(false)
  const [voiceError, setVoiceError] = useState(false)
  const busyRef = useRef(false)
  const voiceRef = useRef(false)
  const endRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null)

  useEffect(
    () => () => {
      recognitionRef.current?.stop()
      window.speechSynthesis?.cancel()
    },
    [],
  )

  useEffect(() => {
    endRef.current?.scrollIntoView({
      behavior:
        window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
        document.documentElement.dataset.motion === 'reduced'
          ? 'instant'
          : 'smooth',
      block: 'end',
    })
  }, [messages, pending])

  useEffect(() => {
    if (!initialPrompt || pending || busyRef.current) return
    void send(initialPrompt)
    onPromptConsumed?.()
    // A handoff waits for an in-flight response before it is consumed.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialPrompt, pending])

  async function send(raw: string, retry = false) {
    const text = raw.trim()
    if (!text || busyRef.current) return
    busyRef.current = true
    const userMessage: Message = { id: crypto.randomUUID(), role: 'user', text }
    const previous = messages.filter((m) => !m.error)
    if (retry && previous.at(-1)?.role === 'user') previous.pop()
    const history = [...previous, userMessage]
    setMessages(history)
    setInput('')
    setPending(true)
    try {
      const res = await fetch('/.netlify/functions/career-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          locale,
          messages: history.slice(-16).map(({ role, text }) => ({ role, text })),
        }),
        signal: AbortSignal.timeout(55000),
      })
      const data = await res.json()
      if (!res.ok || !data.text) throw new Error(data.error ?? 'Request failed')
      setMessages((prev) => [...prev, { id: crypto.randomUUID(), role: 'model', text: data.text }])
      if (voiceRef.current) speak(data.text)
    } catch {
      setMessages((prev) => [
        ...prev,
        { id: crypto.randomUUID(), role: 'model', text: t.assistant.error, error: true },
      ])
    } finally {
      busyRef.current = false
      setPending(false)
      textareaRef.current?.focus()
    }
  }

  function speak(text: string) {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel()
      const utterance = new SpeechSynthesisUtterance(text.replace(/[*#`]/g, ''))
      utterance.lang = document.documentElement.lang === 'ar' ? 'ar-SA' : 'en-US'
      window.speechSynthesis.speak(utterance)
    }
  }

  function toggleVoice() {
    if (listening) {
      recognitionRef.current?.stop()
      setListening(false)
      return
    }
    const Recognition = window.SpeechRecognition ?? window.webkitSpeechRecognition
    if (!Recognition) {
      setVoiceError(true)
      textareaRef.current?.focus()
      return
    }
    setVoiceError(false)
    const recognition = new Recognition()
    recognition.lang = document.documentElement.lang === 'ar' ? 'ar-SA' : 'en-US'
    recognition.interimResults = true
    recognition.continuous = false
    recognition.onresult = (event) => {
      const transcript = Array.from(
        { length: event.results.length },
        (_, i) => event.results[i][0].transcript,
      ).join('')
      setInput(transcript.slice(0, 6000))
    }
    recognition.onerror = () => {
      setVoiceError(true)
      setListening(false)
    }
    recognition.onend = () => {
      setListening(false)
      textareaRef.current?.focus()
    }
    recognitionRef.current = recognition
    try {
      recognition.start()
      setListening(true)
    } catch {
      setVoiceError(true)
      setListening(false)
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
      <div className="flex flex-wrap items-start justify-between gap-4">
        <header className="flex flex-col gap-2">
          <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-signal">
            {t.chat.eyebrow}
          </span>
          <h1 id="assistant-title" className="text-3xl font-semibold tracking-tight">
            {t.assistant.title}
          </h1>
          <p className="text-[15px] leading-relaxed text-muted-foreground text-pretty">
            {t.assistant.subtitle}
          </p>
        </header>
        <button
          type="button"
          aria-label={t.chat.voice}
          title={t.chat.voice}
          aria-pressed={readAloud}
          onClick={() => {
            voiceRef.current = !readAloud
            setReadAloud(!readAloud)
            if (readAloud) window.speechSynthesis?.cancel()
          }}
          className="icon-button"
        >
          {readAloud ? <Volume2 className="size-4" /> : <VolumeX className="size-4" />}
        </button>
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
          <div className="rounded-3xl border border-border bg-card p-5 sm:p-8">
            <Sparkles className="mb-5 size-8 text-signal" />
            <h2 className="text-2xl font-semibold">{t.chat.greeting}</h2>
            <p className="mb-6 mt-3 text-sm leading-6 text-muted-foreground">{t.chat.greetingHint}</p>
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
          </div>
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
              <span className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
                Vairen
              </span>
              <div className={cn('text-[15px] leading-relaxed', m.error && 'text-destructive')}>
                <FormattedText text={m.error ? t.assistant.error : m.text} />
                {m.error && (
                  <button
                    type="button"
                    disabled={pending}
                    onClick={() => {
                      const last = messages.filter((x) => x.role === 'user').at(-1)
                      if (last) void send(last.text, true)
                    }}
                    className="mt-3 rounded-full border border-border px-4 py-2 text-xs text-foreground disabled:opacity-50"
                  >
                    {t.chat.retry}
                  </button>
                )}
              </div>
            </div>
          ),
        )}
        {pending && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground" role="status">
            <span className="flex gap-1" aria-hidden="true">
              {[0, 1, 2].map((n) => (
                <span
                  key={n}
                  className="size-1.5 animate-pulse rounded-full bg-muted-foreground"
                  style={{ animationDelay: `${n * 150}ms` }}
                />
              ))}
            </span>
            {t.assistant.thinking}
          </div>
        )}
        <div ref={endRef} />
      </div>

      <div className="fixed inset-x-0 bottom-[calc(4rem+env(safe-area-inset-bottom))] z-20 bg-gradient-to-t from-background via-background to-transparent px-4 pb-3 pt-6">
        <form
          onSubmit={onSubmit}
          className="mx-auto flex w-full max-w-5xl items-end gap-2 rounded-2xl border border-border bg-card p-2 transition-colors focus-within:border-ring"
        >
          <label htmlFor="assistant-input" className="sr-only">
            {t.assistant.inputLabel}
          </label>
          <textarea
            id="assistant-input"
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder={t.assistant.placeholder}
            maxLength={6000}
            rows={1}
            className="max-h-40 min-h-10 flex-1 resize-none bg-transparent px-2 py-2 text-[15px] leading-relaxed text-foreground placeholder:text-muted-foreground focus:outline-none [field-sizing:content]"
          />
          <button
            type="button"
            onClick={toggleVoice}
            aria-label={listening ? t.assistant.voiceStop : t.assistant.voiceStart}
            className={cn(
              'flex size-10 shrink-0 items-center justify-center rounded-xl transition-colors',
              listening
                ? 'bg-signal text-black'
                : 'text-muted-foreground hover:bg-secondary hover:text-foreground',
            )}
          >
            {listening ? (
              <Square className="size-3.5" aria-hidden="true" />
            ) : (
              <Mic className="size-4" aria-hidden="true" />
            )}
          </button>
          <button
            type="submit"
            disabled={!input.trim() || pending}
            aria-label={t.assistant.send}
            className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-foreground text-primary-foreground transition-opacity disabled:opacity-30"
          >
            <ArrowUp className="size-4" aria-hidden="true" />
          </button>
        </form>
        <p className="mx-auto mt-2 max-w-5xl text-center text-[10px] leading-5 text-muted-foreground">
          {t.chat.disclaimer}
        </p>
        {voiceError && (
          <p role="status" className="text-center text-xs text-destructive">
            {t.chat.voiceUnavailable}
          </p>
        )}
        {listening && (
          <p className="mx-auto mt-2 max-w-5xl text-center font-mono text-[10px] uppercase tracking-widest text-signal">
            {t.assistant.listening}
          </p>
        )}
      </div>
    </section>
  )
}
