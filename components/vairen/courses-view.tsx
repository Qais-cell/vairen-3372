'use client'

import { useDeferredValue, useEffect, useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowUpRight, BookOpen, Layers3, Search, Play, RotateCcw } from 'lucide-react'
import type { Dictionary, Locale } from '@/lib/i18n'
import {
  learningCategories,
  type CourseSummary,
  type LearningCategory,
  type LearningLevel,
} from '@/lib/learning'
import { learningCopy } from '@/lib/learning-copy'
import { CareerImage } from './career-image'

const endpoint = '/.netlify/functions/learning'
export function useCourseLibrary(professionId?: string) {
  const [courses, setCourses] = useState<CourseSummary[]>([])
  const [state, setState] = useState<'loading' | 'ready' | 'error'>('loading')
  const [revision, setRevision] = useState(0)
  useEffect(() => {
    const controller = new AbortController()
    setState('loading')
    fetch(`${endpoint}${professionId ? `?profession=${encodeURIComponent(professionId)}` : ''}`, {
      signal: controller.signal,
    })
      .then(async (response) => {
        if (!response.ok) throw new Error('Unavailable')
        const data = await response.json()
        if (!Array.isArray(data.courses)) throw new Error('Invalid catalog')
        setCourses(data.courses)
        setState('ready')
      })
      .catch(() => {
        if (!controller.signal.aborted) setState('error')
      })
    return () => controller.abort()
  }, [professionId, revision])
  return { courses, state, retry: () => setRevision((v) => v + 1) }
}

export function CoursesView({
  t,
  locale,
  onOpen,
}: {
  t: Dictionary
  locale: Locale
  onOpen: (id: string) => void
}) {
  const { courses, state, retry } = useCourseLibrary()
  const copy = learningCopy[locale]
  const [filter, setFilter] = useState<LearningCategory | 'all'>('all')
  const [level, setLevel] = useState<LearningLevel | 'all'>('all')
  const [query, setQuery] = useState('')
  const deferred = useDeferredValue(query)
  const visible = useMemo(
    () =>
      courses.filter(
        (c) =>
          (filter === 'all' || c.category === filter) &&
          (level === 'all' || c.level === level) &&
          [c.title[locale], c.summary[locale], c.provider, learningCategories[c.category][locale]].some(
            (text) => text.toLocaleLowerCase(locale).includes(deferred.trim().toLocaleLowerCase(locale)),
          ),
      ),
    [courses, filter, level, deferred, locale],
  )
  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col gap-7"
      aria-labelledby="courses-title"
    >
      <header className="learning-hero grid gap-6 rounded-3xl border border-border bg-card p-6 sm:grid-cols-[1fr_auto] sm:p-9">
        <div>
          <p className="mb-5 font-mono text-[10px] uppercase tracking-[0.22em] text-signal">{copy.eyebrow}</p>
          <h1
            id="courses-title"
            className="max-w-xl text-3xl font-semibold leading-tight tracking-tight sm:text-5xl"
          >
            {copy.title}
          </h1>
          <p className="mt-5 max-w-xl text-sm leading-7 text-muted-foreground">{copy.subtitle}</p>
        </div>
        <div className="flex items-end justify-between gap-6 sm:flex-col sm:items-start">
          <span className="flex size-14 items-center justify-center rounded-2xl border border-border bg-secondary text-signal">
            <BookOpen className="size-7" />
          </span>
          <div>
            <p className="font-mono text-4xl text-signal">
              {state === 'ready' ? String(courses.length).padStart(2, '0') : '—'}
            </p>
            <p className="mt-2 text-xs text-muted-foreground">
              {copy.courses} · {copy.duration}
            </p>
          </div>
        </div>
      </header>
      <div className="flex flex-col gap-3">
        <label className="relative">
          <Search className="pointer-events-none absolute start-4 top-4 size-4 text-muted-foreground" />
          <span className="sr-only">{copy.search}</span>
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={copy.search}
            className="h-12 w-full rounded-xl border border-border bg-card ps-11 pe-4 text-sm outline-none focus:border-signal"
          />
        </label>
        <div className="flex flex-wrap gap-3">
          <label className="flex min-w-0 flex-1 items-center gap-3 rounded-xl border border-border bg-card px-3 py-2 text-sm">
            <span className="text-muted-foreground">{t.learning.category}</span>
            <select
              aria-label={t.learning.category}
              value={filter}
              onChange={(e) => setFilter(e.target.value as typeof filter)}
              className="min-w-0 flex-1 rounded-lg bg-secondary p-2"
            >
              <option value="all">{t.courses.all}</option>
              {Object.entries(learningCategories).map(([id, name]) => (
                <option key={id} value={id}>
                  {name[locale]}
                </option>
              ))}
            </select>
          </label>
          <label className="flex min-w-0 flex-1 items-center gap-3 rounded-xl border border-border bg-card px-3 py-2 text-sm">
            <span className="text-muted-foreground">{t.learning.level}</span>
            <select
              aria-label={t.learning.level}
              value={level}
              onChange={(e) => setLevel(e.target.value as typeof level)}
              className="min-w-0 flex-1 rounded-lg bg-secondary p-2"
            >
              <option value="all">{copy.everyLevel}</option>
              {(['beginner', 'intermediate', 'advanced'] as const).map((value) => (
                <option key={value} value={value}>
                  {t.courses.level[value]}
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>
      {state === 'loading' ? (
        <CourseSkeleton label={copy.loading} />
      ) : state === 'error' ? (
        <LibraryError locale={locale} onRetry={retry} />
      ) : (
        <AnimatePresence mode="wait">
          <motion.div
            key={`${filter}-${level}-${deferred}`}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
          >
            {visible.length ? (
              <ul className="grid gap-5 sm:grid-cols-2">
                {visible.map((course) => (
                  <li key={course.id}>
                    <CourseCard course={course} locale={locale} t={t} onOpen={onOpen} />
                  </li>
                ))}
              </ul>
            ) : (
              <div className="rounded-2xl border border-dashed border-border p-10 text-center">
                <Layers3 className="mx-auto mb-4 size-7 text-muted-foreground" />
                <p role="status" className="text-sm text-muted-foreground">
                  {copy.noResults}
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setQuery('')
                    setLevel('all')
                    setFilter('all')
                  }}
                  className="mt-4 text-sm text-signal underline"
                >
                  {copy.reset}
                </button>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      )}
    </motion.section>
  )
}

export function CourseCard({
  course,
  t,
  locale,
  onOpen,
}: {
  course: CourseSummary
  t: Dictionary
  locale: Locale
  onOpen: (id: string) => void
}) {
  const copy = learningCopy[locale]
  return (
    <motion.button
      type="button"
      onClick={() => onOpen(course.id)}
      whileTap={{ scale: 0.985 }}
      className="course-card group flex h-full w-full flex-col overflow-hidden rounded-2xl border border-border bg-card text-start"
    >
      <div className="relative aspect-[2.1] w-full overflow-hidden">
        <CareerImage
          src={course.imagePath}
          alt=""
          className="size-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <span className="absolute start-3 bottom-3 rounded-full bg-background/95 px-3 py-1 text-[10px] font-medium">
          {t.courses.level[course.level]}
        </span>
        <span className="absolute end-3 top-3 flex size-9 items-center justify-center rounded-full bg-background/95 text-signal">
          <Play className="size-4" />
        </span>
      </div>
      <div className="flex flex-1 flex-col gap-3 p-5">
        <span className="text-[10px] font-medium text-signal" translate="no">
          {course.provider}
        </span>
        <h2 className="text-xl font-semibold leading-snug">{course.title[locale]}</h2>
        <p className="flex-1 text-sm leading-6 text-muted-foreground">{course.summary[locale]}</p>
        <span className="flex items-center justify-between gap-2 border-t border-border pt-3 text-xs">
          <span>
            {course.lessonCount} {copy.lessons}
          </span>
          <span className="flex items-center gap-1 font-medium">
            {copy.open}
            <ArrowUpRight className="size-3.5 rtl:-scale-x-100" />
          </span>
        </span>
      </div>
    </motion.button>
  )
}

export function RelatedCourses({
  professionId,
  t,
  locale,
  onOpen,
}: {
  professionId: string
  t: Dictionary
  locale: Locale
  onOpen: (id: string) => void
}) {
  const { courses, state, retry } = useCourseLibrary(professionId)
  if (state === 'loading') return <CourseSkeleton label={learningCopy[locale].loading} />
  if (state === 'error') return <LibraryError locale={locale} onRetry={retry} />
  return courses.length ? (
    <ul className="grid gap-4 sm:grid-cols-2">
      {courses.map((course) => (
        <li key={course.id}>
          <CourseCard course={course} t={t} locale={locale} onOpen={onOpen} />
        </li>
      ))}
    </ul>
  ) : (
    <p className="text-sm text-muted-foreground">{t.career.noCourses}</p>
  )
}
export function CourseSkeleton({ label }: { label: string }) {
  return (
    <div aria-busy="true" aria-label={label} className="grid gap-5 sm:grid-cols-2">
      {[0, 1].map((id) => (
        <div key={id} className="overflow-hidden rounded-2xl border border-border bg-card">
          <div className="h-40 animate-pulse bg-secondary" />
          <div className="space-y-4 p-5">
            <div className="h-4 w-1/3 animate-pulse rounded bg-secondary" />
            <div className="h-6 w-3/4 animate-pulse rounded bg-secondary" />
            <div className="h-14 animate-pulse rounded bg-secondary" />
          </div>
        </div>
      ))}
    </div>
  )
}
export function LibraryError({ locale, onRetry }: { locale: Locale; onRetry: () => void }) {
  const copy = learningCopy[locale]
  return (
    <div role="alert" className="rounded-2xl border border-border bg-card p-8 text-center">
      <p className="text-sm text-muted-foreground">{copy.loadError}</p>
      <button
        type="button"
        onClick={onRetry}
        className="mx-auto mt-4 flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm"
      >
        <RotateCcw className="size-4" />
        {copy.retry}
      </button>
    </div>
  )
}
