'use client'

import { useEffect, useRef, useState } from 'react'
import { Mic, Pause, Play, Square } from 'lucide-react'
import type { Dictionary, Locale } from '@/lib/i18n'
import type { LearningCourse, LearningLesson } from '@/lib/learning'
import { AssistantView } from './assistant-view'
import { CareerImage } from './career-image'

export function StageStudio({ course, lesson, index, total, locale, t }: {
  course: LearningCourse; lesson: LearningLesson; index: number; total: number; locale: Locale; t: Dictionary
}) {
  const ar = locale === 'ar'
  const [status, setStatus] = useState<'idle' | 'speaking' | 'paused'>('idle')
  const [error, setError] = useState(false)
  const [rate, setRate] = useState(1)
  const [tutor, setTutor] = useState(false)
  const [part, setPart] = useState(0)
  const generation = useRef(0)
  const text = [lesson.title[locale], lesson.content.introduction[locale], ...lesson.content.sections.flatMap(s => [s.title[locale], s.body[locale]])].join('\n\n')
  // Keep utterances short: several browser engines silently stop on long text.
  const chunks = text.match(/[\s\S]{1,220}(?:[\s،,。.!؟?]|$)|[\s\S]{1,220}/g) ?? [text]
  useEffect(() => () => { generation.current++; window.speechSynthesis?.cancel() }, [])
  function stop() {
    generation.current++
    window.speechSynthesis?.cancel()
    setStatus('idle')
  }
  function start() {
    if (!('speechSynthesis' in window)) { setError(true); return }
    stop()
    setError(false)
    setStatus('speaking')
    const current = generation.current
    function next(position: number) {
      if (generation.current !== current) return
      if (position >= chunks.length) { setStatus('idle'); return }
      setPart(position + 1)
      const speech = new SpeechSynthesisUtterance(chunks[position].replace(/[*#`]/g, ''))
      speech.lang = ar ? 'ar-SA' : 'en-US'
      speech.rate = rate
      speech.onend = () => next(position + 1)
      speech.onerror = () => { if (generation.current === current) { setError(true); setStatus('idle') } }
      window.speechSynthesis.speak(speech)
    }
    next(0)
  }
  return <section className="overflow-hidden rounded-2xl border border-signal/30 bg-card" aria-label={ar ? 'استوديو المرحلة' : 'Stage studio'}>
    <div className="border-b border-border bg-secondary/40 p-5 sm:p-7">
      <p className="font-mono text-xs text-signal">{ar ? 'المرحلة' : 'STAGE'} {String(index + 1).padStart(2, '0')} / {total}</p>
      <h3 className="mt-3 text-lg font-semibold">{lesson.title[locale]}</h3>
      <p className="mt-2 text-xs text-muted-foreground">{course.title[locale]}</p>
      <CareerImage src={`/images/stages/${lesson.id}-${locale}.svg`} alt={ar ? `خريطة مفاهيم: ${lesson.title[locale]}` : `Concept map: ${lesson.title[locale]}`} className="mt-5 h-auto w-full rounded-xl" />
      <ol className="mt-6 space-y-3" aria-label={ar ? 'خريطة المفاهيم' : 'Concept map'}>
        {lesson.content.sections.map((section, i) => <li key={section.title.en} className="flex items-center gap-4">
          <svg viewBox="0 0 56 56" className="size-14 shrink-0 text-signal" aria-hidden="true"><rect x="1" y="1" width="54" height="54" rx="16" fill="currentColor" fillOpacity=".08" stroke="currentColor" strokeOpacity=".35"/><path d="M15 36V22l13-8 13 8v14l-13 8zM15 22l13 8 13-8M28 30v14" fill="none" stroke="currentColor"/><circle cx="28" cy="14" r="3" fill="currentColor"/></svg>
          <div><span className="font-mono text-[10px] text-signal">{String(i + 1).padStart(2, '0')}</span><p className="text-sm leading-6">{section.title[locale]}</p></div>
        </li>)}
      </ol>
    </div>
    <div className="space-y-4 p-5 sm:p-7">
      <div className="flex flex-wrap items-center gap-3">
        <button type="button" onClick={() => {
          if (status === 'idle') start()
          else if (status === 'paused') { window.speechSynthesis.resume(); setStatus('speaking') }
          else { window.speechSynthesis.pause(); setStatus('paused') }
        }} className="flex min-h-11 items-center gap-2 rounded-xl bg-foreground px-4 text-sm text-primary-foreground">
          {status === 'speaking' ? <Pause className="size-4"/> : <Play className="size-4"/>}
          {status === 'speaking' ? (ar ? 'إيقاف مؤقت' : 'Pause') : status === 'paused' ? (ar ? 'استئناف' : 'Resume') : (ar ? 'استمع للمرحلة كاملة' : 'Listen to the full stage')}
        </button>
        {status !== 'idle' && <button type="button" onClick={stop} className="rounded-xl border border-border p-3" aria-label={ar ? 'إنهاء الشرح' : 'Stop narration'}><Square className="size-4"/></button>}
        <label className="flex items-center gap-2 text-xs">{ar ? 'السرعة' : 'Speed'}<select disabled={status !== 'idle'} value={rate} onChange={e => setRate(Number(e.target.value))} className="rounded-lg border border-border bg-card p-2">{[0.75, 1, 1.25, 1.5].map(v => <option key={v} value={v}>{v}×</option>)}</select></label>
      </div>
      <p className="text-xs leading-6 text-muted-foreground" role="status">{error ? (ar ? 'تعذر تشغيل الصوت. جرّب متصفحاً يدعم القراءة الصوتية وصوتاً باللغة المختارة.' : 'Audio unavailable. Try a browser with speech synthesis and a voice for this language.') : status !== 'idle' ? `${part} / ${chunks.length}` : (ar ? 'قراءة صوتية عبر المتصفح؛ الأصوات والتعرّف على الكلام يختلفان حسب الجهاز.' : 'Browser narration; available voices and speech recognition vary by device.')}</p>
      <button type="button" aria-expanded={tutor} onClick={() => { stop(); setTutor(!tutor) }} className="flex min-h-11 items-center gap-2 rounded-xl border border-signal/40 px-4 text-sm text-signal"><Mic className="size-4"/>{ar ? 'تحدث مع مدرّس المرحلة' : 'Talk to your stage tutor'}</button>
      {tutor && <AssistantView embedded lessonId={lesson.id} locale={locale} t={t}/>} 
    </div>
  </section>
}
