'use client'

import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Check,
  CheckCircle2,
  ClipboardCheck,
  Copy,
  FileText,
  Layers3,
  Play,
  RotateCcw,
} from 'lucide-react'
import type { Dictionary, Locale } from '@/lib/i18n'
import {
  videoEmbedUrl,
  type CourseDetail,
  type LearningCourse,
  type LearningLesson,
  type QuizQuestion,
} from '@/lib/learning'
import { learningCopy } from '@/lib/learning-copy'
import { cn } from '@/lib/utils'
import { CareerImage } from './career-image'
import { LibraryError } from './courses-view'

const icons = { video: Play, reading: FileText, practice: Layers3, quiz: ClipboardCheck }
export function CoursePlayer({
  id,
  locale,
  t,
  onBack,
}: {
  id: string
  locale: Locale
  t: Dictionary
  onBack: () => void
}) {
  const copy = learningCopy[locale]
  const [data, setData] = useState<CourseDetail | null>(null)
  const [state, setState] = useState<'loading' | 'ready' | 'error'>('loading')
  const [revision, setRevision] = useState(0)
  const [active, setActive] = useState('overview')
  const [saveState, setSaveState] = useState<{ lesson: string; status: 'saving' | 'saved' | 'error' } | null>(
    null,
  )
  const [quizPassed, setQuizPassed] = useState(false)
  const busy = useRef(false)
  const heading = useRef<HTMLHeadingElement>(null)
  useEffect(() => {
    const controller = new AbortController()
    setState('loading')
    setData(null)
    setActive('overview')
    fetch(`/.netlify/functions/learning?course=${encodeURIComponent(id)}`, {
      signal: AbortSignal.any([controller.signal, AbortSignal.timeout(15000)]),
    })
      .then(async (response) => {
        if (!response.ok) throw new Error('Unavailable')
        const payload = await response.json()
        if (!payload.course || !Array.isArray(payload.lessons) || !Array.isArray(payload.completed))
          throw new Error('Invalid course')
        setData(payload)
        setState('ready')
      })
      .catch(() => {
        if (!controller.signal.aborted) setState('error')
      })
    return () => controller.abort()
  }, [id, revision])
  useEffect(() => {
    if (state === 'ready') heading.current?.focus({ preventScroll: true })
  }, [state])
  function chooseLesson(next: string) {
    setQuizPassed(false)
    setActive(next)
    document.getElementById('learning-content')?.scrollIntoView({ block: 'start', behavior: 'instant' })
  }
  async function toggleCompletion(lesson: LearningLesson) {
    if (!data || busy.current) return
    const complete = !data.completed.includes(lesson.id)
    if (complete && lesson.kind === 'quiz' && !quizPassed) return
    busy.current = true
    setSaveState({ lesson: lesson.id, status: 'saving' })
    try {
      const response = await fetch('/.netlify/functions/learning', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lessonId: lesson.id, completed: complete }),
        signal: AbortSignal.timeout(15000),
      })
      if (!response.ok) throw new Error('Save failed')
      setData((current) =>
        current?.course.id === id
          ? {
              ...current,
              completed: complete
                ? [...new Set([...current.completed, lesson.id])]
                : current.completed.filter((value) => value !== lesson.id),
            }
          : current,
      )
      setSaveState({ lesson: lesson.id, status: 'saved' })
    } catch {
      setSaveState({ lesson: lesson.id, status: 'error' })
    } finally {
      busy.current = false
    }
  }
  const lesson = data?.lessons.find((value) => value.id === active)
  const lessonIndex = data?.lessons.findIndex((value) => value.id === active) ?? -1
  const completedCount = data?.lessons.filter((value) => data.completed.includes(value.id)).length ?? 0
  const count = data?.lessons.length ?? 0
  const percent = count ? Math.round((completedCount / count) * 100) : 0
  return (
    <motion.section
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col gap-6"
      aria-labelledby="learning-title"
    >
      <button
        type="button"
        onClick={onBack}
        className="flex w-fit items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4 rtl:rotate-180" />
        {copy.back}
      </button>
      {state === 'loading' ? (
        <div aria-busy="true" aria-label={copy.loading} className="space-y-5">
          <div className="h-48 animate-pulse rounded-3xl bg-secondary" />
          <div className="grid gap-5 sm:grid-cols-[1fr_2fr]">
            <div className="h-80 animate-pulse rounded-2xl bg-secondary" />
            <div className="h-80 animate-pulse rounded-2xl bg-secondary" />
          </div>
        </div>
      ) : state === 'error' || !data ? (
        <LibraryError locale={locale} onRetry={() => setRevision((value) => value + 1)} />
      ) : (
        <>
          <header className="flex flex-wrap items-end justify-between gap-5 border-b border-border pb-6">
            <div>
              <p className="mb-3 font-mono text-[10px] uppercase tracking-widest text-signal">
                {copy.inside} · {t.courses.level[data.course.level]}
              </p>
              <h1
                ref={heading}
                tabIndex={-1}
                id="learning-title"
                className="max-w-2xl text-2xl font-semibold leading-tight tracking-tight outline-none sm:text-4xl"
              >
                {data.course.title[locale]}
              </h1>
            </div>
            <span className="rounded-full border border-border bg-card px-3 py-2 text-xs text-muted-foreground">
              {completedCount}/{count} {copy.lessons}
            </span>
          </header>
          <div className="grid grid-cols-[minmax(0,1fr)] items-start gap-6 lg:grid-cols-[250px_minmax(0,1fr)]">
            <aside
              className="min-w-0 rounded-2xl border border-border bg-card p-4 lg:sticky lg:top-28"
              aria-label={copy.curriculum}
            >
              <div className="mb-4">
                <div className="mb-2 flex justify-between text-xs">
                  <span>{copy.progress}</span>
                  <span className="font-mono text-signal">{percent}%</span>
                </div>
                <div
                  role="progressbar"
                  aria-label={copy.progress}
                  aria-valuenow={percent}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  className="h-1.5 overflow-hidden rounded-full bg-secondary"
                >
                  <motion.div
                    animate={{ scaleX: percent / 100 }}
                    style={{ originX: locale === 'ar' ? 1 : 0 }}
                    className="h-full w-full rounded-full bg-signal"
                  />
                </div>
                <p className="mt-3 text-[10px] leading-5 text-muted-foreground">{copy.progressHint}</p>
              </div>
              <nav className="flex max-w-full gap-2 overflow-x-auto pb-1 lg:flex-col" aria-label={copy.curriculum}>
                <button
                  type="button"
                  onClick={() => chooseLesson('overview')}
                  aria-current={active === 'overview' ? 'page' : undefined}
                  className={cn(
                    'flex shrink-0 items-center gap-3 rounded-xl border p-3 text-start text-xs',
                    active === 'overview'
                      ? 'border-signal bg-signal/10'
                      : 'border-transparent hover:bg-secondary',
                  )}
                >
                  <BookOpen className="size-4 shrink-0" />
                  {copy.overview}
                </button>
                {data.lessons.map((item, index) => {
                  const Icon = icons[item.kind]
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => chooseLesson(item.id)}
                      aria-current={active === item.id ? 'page' : undefined}
                      className={cn(
                        'flex shrink-0 items-start gap-3 rounded-xl border p-3 text-start text-xs lg:shrink',
                        active === item.id
                          ? 'border-signal bg-signal/10'
                          : 'border-transparent hover:bg-secondary',
                      )}
                    >
                      <span className="mt-0.5 text-signal">
                        {data.completed.includes(item.id) ? (
                          <CheckCircle2 className="size-4" />
                        ) : (
                          <Icon className="size-4" />
                        )}
                      </span>
                      <span className="max-w-44 leading-5">
                        <span className="mb-1 block font-mono text-[9px] text-muted-foreground">
                          {String(index + 1).padStart(2, '0')} / {copy[item.kind]}
                          {data.completed.includes(item.id) && (
                            <span className="sr-only"> · {copy.completed}</span>
                          )}
                        </span>
                        {item.title[locale]}
                      </span>
                    </button>
                  )
                })}
              </nav>
            </aside>
            <div id="learning-content" className="min-w-0 scroll-mt-28">
              <AnimatePresence mode="wait">
                <motion.div
                  key={active}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                >
                  {active === 'overview' ? (
                    <div className="space-y-6">
                      <div className="overflow-hidden rounded-2xl border border-border bg-card">
                        <CareerImage
                          src={data.course.imagePath}
                          alt=""
                          eager
                          className="aspect-[2] w-full object-cover"
                        />
                        <div className="p-5">
                          <p className="text-sm leading-7 text-muted-foreground">
                            {data.course.summary[locale]}
                          </p>
                          <h2 className="mb-2 mt-5 text-base font-semibold">{copy.prerequisites}</h2>
                          <p className="text-sm leading-7 text-muted-foreground">
                            {data.course.prerequisites[locale]}
                          </p>
                          <h2 className="mb-3 mt-5 text-base font-semibold">{copy.outcomes}</h2>
                          <ul className="space-y-2">
                            {data.course.outcomes.map((outcome) => (
                              <li key={outcome.en} className="flex items-start gap-2 text-sm leading-6">
                                <Check className="mt-1 size-4 shrink-0 text-signal" />
                                {outcome[locale]}
                              </li>
                            ))}
                          </ul>
                          {count > 0 ? (
                            <button
                              type="button"
                              onClick={() =>
                                chooseLesson(
                                  (
                                    data.lessons.find((item) => !data.completed.includes(item.id)) ??
                                    data.lessons[0]
                                  ).id,
                                )
                              }
                              className="mt-6 flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-foreground px-4 text-sm font-medium text-primary-foreground"
                            >
                              <Play className="size-4" />
                              {copy.open}
                            </button>
                          ) : (
                            <p className="mt-5 text-sm text-muted-foreground">{copy.noLessons}</p>
                          )}
                        </div>
                      </div>
                      <CourseVisual course={data.course} lessons={data.lessons} locale={locale} />
                      <div className="rounded-2xl border border-border bg-card p-5">
                        <h2 className="text-sm font-semibold">{copy.source}</h2>
                        <p className="mt-3 text-xs font-medium text-signal" translate="no">
                          {data.course.provider}
                        </p>
                        <p className="mt-2 text-xs leading-6" translate="no">
                          {data.course.sourceTitle}
                        </p>
                        <p className="mt-4 text-xs leading-6 text-muted-foreground">{copy.sourceHint}</p>
                        <p className="mt-2 text-xs leading-6 text-muted-foreground">{copy.language}</p>
                      </div>
                    </div>
                  ) : lesson ? (
                    <div className="space-y-6">
                      <header>
                        <p className="mb-3 text-[10px] uppercase tracking-widest text-signal">
                          {String(lessonIndex + 1).padStart(2, '0')} / {copy[lesson.kind]}
                        </p>
                        <h2 className="text-2xl font-semibold leading-snug">{lesson.title[locale]}</h2>
                        <p className="mt-4 text-sm leading-7 text-muted-foreground">
                          {lesson.content.introduction[locale]}
                        </p>
                      </header>
                      {lesson.kind === 'video' && (
                        <CourseVideo key={data.course.id} course={data.course} locale={locale} />
                      )}
                      {lesson.content.sections.map((section) => (
                        <article
                          key={section.title.en}
                          className="rounded-2xl border border-border bg-card p-5 sm:p-6"
                        >
                          <h3 className="mb-3 text-base font-semibold">{section.title[locale]}</h3>
                          <p className="whitespace-pre-wrap text-sm leading-8 text-muted-foreground">
                            {section.body[locale]}
                          </p>
                        </article>
                      ))}
                      {lesson.kind === 'quiz' && (
                        <KnowledgeCheck
                          key={lesson.id}
                          questions={lesson.content.questions ?? []}
                          locale={locale}
                          onPass={setQuizPassed}
                        />
                      )}
                      <div className="rounded-2xl border border-border bg-card p-4">
                        <button
                          type="button"
                          onClick={() => toggleCompletion(lesson)}
                          disabled={
                            saveState?.status === 'saving' ||
                            (lesson.kind === 'quiz' && !quizPassed && !data.completed.includes(lesson.id))
                          }
                          className="flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-foreground px-4 py-2 text-sm font-medium text-primary-foreground disabled:opacity-50"
                        >
                          <CheckCircle2 className="size-4" />
                          {saveState?.lesson === lesson.id && saveState.status === 'saving'
                            ? copy.saving
                            : data.completed.includes(lesson.id)
                              ? copy.undo
                              : copy.complete}
                        </button>
                        {lesson.kind === 'quiz' && !quizPassed && !data.completed.includes(lesson.id) && (
                          <p className="mt-3 text-xs leading-6 text-muted-foreground">{copy.quizGate}</p>
                        )}
                        {saveState?.lesson === lesson.id && (
                          <p
                            role="status"
                            className={cn(
                              'mt-3 text-xs',
                              saveState.status === 'error' ? 'text-destructive' : 'text-signal',
                            )}
                          >
                            {saveState.status === 'error'
                              ? copy.saveError
                              : saveState.status === 'saved'
                                ? copy.saved
                                : copy.saving}
                          </p>
                        )}
                      </div>
                      <div className="flex justify-between gap-3">
                        <button
                          type="button"
                          onClick={() =>
                            chooseLesson(lessonIndex > 0 ? data.lessons[lessonIndex - 1].id : 'overview')
                          }
                          className="flex items-center gap-2 rounded-xl border border-border px-3 py-3 text-xs"
                        >
                          <ArrowLeft className="size-4 rtl:rotate-180" />
                          {copy.previous}
                        </button>
                        {lessonIndex < count - 1 && (
                          <button
                            type="button"
                            onClick={() => chooseLesson(data.lessons[lessonIndex + 1].id)}
                            className="flex items-center gap-2 rounded-xl border border-border px-3 py-3 text-xs"
                          >
                            {copy.next}
                            <ArrowRight className="size-4 rtl:rotate-180" />
                          </button>
                        )}
                      </div>
                    </div>
                  ) : (
                    <p>{copy.noLessons}</p>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
          {count > 0 && completedCount === count && (
            <div
              role="status"
              className="flex items-center gap-3 rounded-2xl border border-signal/40 bg-signal/10 p-5 text-sm"
            >
              <CheckCircle2 className="size-5 text-signal" />
              {copy.finish}
            </div>
          )}
        </>
      )}
    </motion.section>
  )
}

function CourseVideo({ course, locale }: { course: LearningCourse; locale: Locale }) {
  const [loaded, setLoaded] = useState(false)
  const [version, setVersion] = useState(0)
  const copy = learningCopy[locale]
  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card">
      <div className="relative aspect-video bg-secondary">
        {loaded ? (
          <iframe
            key={version}
            src={videoEmbedUrl(course.videoId)}
            title={course.sourceTitle}
            className="absolute inset-0 size-full border-0"
            allow="accelerometer; encrypted-media; gyroscope; picture-in-picture; fullscreen"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          />
        ) : (
          <button
            type="button"
            onClick={() => setLoaded(true)}
            className="group absolute inset-0 flex size-full flex-col items-center justify-center gap-4 overflow-hidden"
          >
            <CareerImage
              src={course.imagePath}
              alt=""
              className="absolute inset-0 size-full object-cover opacity-30"
            />
            <span className="relative flex size-16 items-center justify-center rounded-full bg-foreground text-primary-foreground transition-transform group-hover:scale-105">
              <Play className="size-6" />
            </span>
            <span className="relative rounded-full bg-card px-4 py-2 text-xs font-medium">{copy.watch}</span>
          </button>
        )}
      </div>
      <div className="space-y-2 p-4">
        <p className="text-xs leading-6 text-muted-foreground">{copy.playerHint}</p>
        <p className="text-[10px] leading-5 text-muted-foreground">{copy.playerUnavailable}</p>
        {loaded && (
          <button
            type="button"
            onClick={() => setVersion((value) => value + 1)}
            className="flex items-center gap-1 text-xs text-signal"
          >
            <RotateCcw className="size-3" />
            {copy.reloadVideo}
          </button>
        )}
      </div>
    </div>
  )
}
function KnowledgeCheck({
  questions,
  locale,
  onPass,
}: {
  questions: QuizQuestion[]
  locale: Locale
  onPass: (pass: boolean) => void
}) {
  const [answers, setAnswers] = useState<Record<number, number>>({})
  const [checked, setChecked] = useState(false)
  const [missing, setMissing] = useState(false)
  const copy = learningCopy[locale]
  const score = questions.filter((q, index) => answers[index] === q.answer).length
  return (
    <div className="space-y-5">
      {questions.map((q, index) => (
        <fieldset key={q.question.en} className="rounded-2xl border border-border bg-card p-5">
          <legend className="px-2 text-sm font-medium leading-7">
            {index + 1}. {q.question[locale]}
          </legend>
          <div className="space-y-2">
            {q.options.map((option, optionIndex) => (
              <label
                key={option.en}
                className={cn(
                  'flex cursor-pointer items-start gap-3 rounded-xl border p-3 text-sm leading-6',
                  answers[index] === optionIndex ? 'border-signal bg-signal/10' : 'border-border',
                )}
              >
                <input
                  type="radio"
                  name={`question-${index}`}
                  value={optionIndex}
                  checked={answers[index] === optionIndex}
                  disabled={checked}
                  onChange={() => {
                    setAnswers((previous) => ({ ...previous, [index]: optionIndex }))
                    setMissing(false)
                  }}
                  className="mt-1 shrink-0 accent-[var(--signal)]"
                />
                <span>{option[locale]}</span>
              </label>
            ))}
          </div>
          {checked && (
            <p className="mt-4 text-xs leading-7 text-muted-foreground">
              <span
                className={
                  answers[index] === q.answer ? 'font-semibold text-signal' : 'font-semibold text-destructive'
                }
              >
                {answers[index] === q.answer ? copy.correct : copy.review}.{' '}
              </span>
              {q.explanation[locale]}
            </p>
          )}
        </fieldset>
      ))}
      <button
        type="button"
        onClick={() => {
          if (checked) {
            setChecked(false)
            setAnswers({})
            onPass(false)
            return
          }
          if (Object.keys(answers).length !== questions.length) {
            setMissing(true)
            return
          }
          setChecked(true)
          onPass(questions.length > 0 && score === questions.length)
        }}
        className="min-h-11 w-full rounded-xl border border-border bg-card px-4 text-sm font-medium hover:bg-secondary"
      >
        {checked ? copy.again : copy.check}
      </button>
      {missing && (
        <p role="alert" className="text-sm text-destructive">
          {copy.choose}
        </p>
      )}
      {checked && (
        <p role="status" className="text-sm text-signal">
          {score}/{questions.length} {copy.result}
        </p>
      )}
    </div>
  )
}
function CourseVisual({
  course,
  lessons,
  locale,
}: {
  course: LearningCourse
  lessons: LearningLesson[]
  locale: Locale
}) {
  const [selected, setSelected] = useState(0)
  const [copied, setCopied] = useState<'idle' | 'done' | 'error'>('idle')
  const copy = learningCopy[locale]
  const concepts = lessons.find((lesson) => lesson.kind === 'reading')?.content.sections ?? []
  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card">
      <div className="p-5">
        <h2 className="text-lg font-semibold">{copy.visual}</h2>
        <p className="mt-2 text-xs leading-6 text-muted-foreground">{copy.visualHint}</p>
      </div>
      <img
        src={`/images/courses/${course.id}-${locale}.svg`}
        alt={`${copy.visual}: ${course.title[locale]}`}
        width={1000}
        height={580}
        loading="lazy"
        className="w-full"
      />
      <div className="space-y-5 p-5">
        <div className="flex flex-wrap gap-2" role="group" aria-label={copy.focus}>
          {concepts.map((concept, index) => (
            <button
              key={concept.title.en}
              type="button"
              onClick={() => setSelected(index)}
              aria-pressed={selected === index}
              className="rounded-full border border-border px-3 py-2 text-xs aria-pressed:border-signal aria-pressed:bg-signal/10"
            >
              {concept.title[locale]}
            </button>
          ))}
        </div>
        {concepts[selected] && (
          <motion.p
            key={selected}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-xs leading-7 text-muted-foreground"
          >
            {concepts[selected].body[locale]}
          </motion.p>
        )}
        <details className="border-t border-border pt-4">
          <summary className="cursor-pointer text-sm font-medium">{copy.prompt}</summary>
          <p className="mt-3 text-xs leading-6 text-muted-foreground">{copy.promptHint}</p>
          <p className="mt-3 select-text rounded-xl bg-secondary p-4 text-xs leading-7">
            {course.visualPrompt[locale]}
          </p>
          <button
            type="button"
            onClick={async () => {
              try {
                await navigator.clipboard.writeText(course.visualPrompt[locale])
                setCopied('done')
              } catch {
                setCopied('error')
              }
            }}
            className="mt-4 flex items-center gap-2 rounded-full border border-border px-4 py-2 text-xs"
          >
            <Copy className="size-3.5" />
            {copy.copy}
          </button>
          <p role="status" className="mt-2 text-xs text-muted-foreground">
            {copied === 'done' ? copy.copied : copied === 'error' ? copy.copyError : ''}
          </p>
        </details>
      </div>
    </div>
  )
}
