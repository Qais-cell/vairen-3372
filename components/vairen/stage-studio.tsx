'use client'

import { useEffect, useRef, useState } from 'react'
import { Mic, Pause, Play, Square } from 'lucide-react'
import type { Dictionary, Locale } from '@/lib/i18n'
import type { LearningCourse, LearningLesson } from '@/lib/learning'
import { AssistantView } from './assistant-view'
import { CareerImage } from './career-image'
import { FormattedText } from './formatted-text'

export function StageStudio({ course, lesson, index, total, locale, t }: {
  course: LearningCourse; lesson: LearningLesson; index: number; total: number; locale: Locale; t: Dictionary
}) {
  const ar = locale === 'ar'
  const [status, setStatus] = useState<'idle' | 'speaking' | 'paused'>('idle')
  const [error, setError] = useState(false)
  const [rate, setRate] = useState(1)
  const [tutor, setTutor] = useState(false)
  const [part, setPart] = useState(0)
  const [step, setStep] = useState(0)
  const [scope, setScope] = useState<'stage' | 'step'>('stage')
  const selected = lesson.content.sections[step]
  const generation = useRef(0)
  const text = [lesson.title[locale], lesson.content.introduction[locale], ...lesson.content.sections.flatMap(s => [s.title[locale], s.body[locale]])].join('\n\n')
  // Keep utterances short: several browser engines silently stop on long text.
  const narration = scope === 'step' && selected ? `${selected.title[locale]}\n\n${selected.body[locale]}` : text
  const chunks = narration.match(/[\s\S]{1,220}(?:[\s،,。.!؟?]|$)|[\s\S]{1,220}/g) ?? [narration]
  useEffect(() => () => { generation.current++; window.speechSynthesis?.cancel() }, [])
  function stop() {
    generation.current++
    window.speechSynthesis?.cancel()
    setStatus('idle')
  }
  function chooseStep(next: number) {
    stop()
    setStep(next)
    setPart(0)
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
          <button type="button" onClick={() => chooseStep(i)} aria-current={step === i ? 'step' : undefined} className="w-full rounded-xl border border-transparent p-3 text-start hover:bg-secondary aria-current:border-signal/40 aria-current:bg-signal/10"><span className="font-mono text-[10px] text-signal">{String(i + 1).padStart(2, '0')}</span><span className="block text-sm leading-6">{section.title[locale]}</span></button>
        </li>)}
      </ol>
    </div>
    <div className="space-y-4 p-5 sm:p-7">
      <p className="text-sm leading-7 text-muted-foreground">{lesson.content.introduction[locale]}</p>
      {selected && <article className="rounded-xl border border-border p-5" aria-live="polite" aria-atomic="true">
        <p className="font-mono text-xs text-signal">{ar ? 'المفهوم' : 'CONCEPT'} {step + 1} / {lesson.content.sections.length}</p>
        <h4 className="my-3 font-semibold">{selected.title[locale]}</h4>
        <div className="text-sm leading-7 text-muted-foreground"><FormattedText text={selected.body[locale]}/></div>
        <nav className="mt-5 flex justify-between gap-3" aria-label={ar ? 'خطوات الشرح' : 'Explanation steps'}>
          <button type="button" disabled={step === 0} onClick={() => chooseStep(step - 1)} className="min-h-11 rounded-xl border border-border px-4 text-sm disabled:opacity-30">{ar ? 'السابق' : 'Previous'}</button>
          <button type="button" disabled={step === lesson.content.sections.length - 1} onClick={() => chooseStep(step + 1)} className="min-h-11 rounded-xl border border-border px-4 text-sm disabled:opacity-30">{ar ? 'التالي' : 'Next'}</button>
        </nav>
      </article>}
      <label className="flex items-center gap-3 text-xs">{ar ? 'نطاق القراءة' : 'Narration scope'}<select disabled={status !== 'idle'} value={scope} onChange={e => setScope(e.target.value as 'stage' | 'step')} className="rounded-lg border border-border bg-card p-2"><option value="stage">{ar ? 'المرحلة كاملة' : 'Full stage'}</option><option value="step">{ar ? 'المفهوم الحالي' : 'Current concept'}</option></select></label>
      <div className="flex flex-wrap items-center gap-3">
        <button type="button" onClick={() => {
          if (status === 'idle') start()
          else if (status === 'paused') { window.speechSynthesis.resume(); setStatus('speaking') }
          else { window.speechSynthesis.pause(); setStatus('paused') }
        }} className="flex min-h-11 items-center gap-2 rounded-xl bg-foreground px-4 text-sm text-primary-foreground">
          {status === 'speaking' ? <Pause className="size-4"/> : <Play className="size-4"/>}
          {status === 'speaking' ? (ar ? 'إيقاف مؤقت' : 'Pause') : status === 'paused' ? (ar ? 'استئناف' : 'Resume') : (scope === 'step' ? (ar ? 'استمع للمفهوم الحالي' : 'Listen to this concept') : (ar ? 'استمع للمرحلة كاملة' : 'Listen to the full stage'))}
        </button>
        {status !== 'idle' && <button type="button" onClick={stop} className="rounded-xl border border-border p-3" aria-label={ar ? 'إنهاء الشرح' : 'Stop narration'}><Square className="size-4"/></button>}
        <label className="flex items-center gap-2 text-xs">{ar ? 'السرعة' : 'Speed'}<select disabled={status !== 'idle'} value={rate} onChange={e => setRate(Number(e.target.value))} className="rounded-lg border border-border bg-card p-2">{[0.75, 1, 1.25, 1.5].map(v => <option key={v} value={v}>{v}×</option>)}</select></label>
      </div>
      <p className="text-xs leading-6 text-muted-foreground" role="status">{error ? (ar ? 'تعذر تشغيل الصوت. جرّب متصفحاً يدعم القراءة الصوتية وصوتاً باللغة المختارة.' : 'Audio unavailable. Try a browser with speech synthesis and a voice for this language.') : status !== 'idle' ? `${part} / ${chunks.length}` : (ar ? 'قراءة صوتية عبر المتصفح؛ الأصوات والتعرّف على الكلام يختلفان حسب الجهاز.' : 'Browser narration; available voices and speech recognition vary by device.')}</p>
      <button type="button" aria-expanded={tutor} onClick={() => { stop(); setTutor(!tutor) }} className="flex min-h-11 items-center gap-2 rounded-xl border border-signal/40 px-4 text-sm text-signal"><Mic className="size-4"/>{ar ? 'تحدث مع مدرّس المرحلة' : 'Talk to your stage tutor'}</button>
      {tutor && <AssistantView embedded lessonId={lesson.id} sectionIndex={step} locale={locale} t={t}/>}
    </div>
  </section>
}
