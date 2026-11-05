'use client'

import { useState } from 'react'
import { ArrowUpRight } from 'lucide-react'
import { courseCategories, courses, type Course } from '@/lib/data'
import type { Dictionary, Locale } from '@/lib/i18n'
import { cn } from '@/lib/utils'
import { SectionHeader } from './section-header'

type Filter = Course['category'] | 'all'

export function CoursesView({ t, locale }: { t: Dictionary; locale: Locale }) {
  const [filter, setFilter] = useState<Filter>('all')
  const filters: Filter[] = ['all', ...(Object.keys(courseCategories) as Course['category'][])]
  const visible = filter === 'all' ? courses : courses.filter((c) => c.category === filter)

  return (
    <section className="animate-view-in flex flex-col gap-6" aria-labelledby="courses-title">
      <SectionHeader id="courses-title" eyebrow={t.courses.eyebrow} title={t.courses.title} subtitle={t.courses.subtitle} />

      <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 [scrollbar-width:none]" role="group" aria-label={t.courses.eyebrow}>
        {filters.map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => setFilter(f)}
            aria-pressed={filter === f}
            className={cn(
              'h-9 shrink-0 rounded-full border px-4 text-sm transition-colors focus-visible:outline-2 focus-visible:outline-offset-2',
              filter === f
                ? 'border-foreground bg-foreground text-primary-foreground'
                : 'border-border text-muted-foreground hover:border-ring hover:text-foreground',
            )}
          >
            {f === 'all' ? t.courses.all : courseCategories[f][locale]}
          </button>
        ))}
      </div>

      <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {visible.map((c, i) => (
          <li key={c.id} className="animate-view-in" style={{ animationDelay: `${i * 40}ms` }}>
            <CourseCard course={c} t={t} locale={locale} />
          </li>
        ))}
      </ul>
    </section>
  )
}

function CourseCard({ course: c, t, locale }: { course: Course; t: Dictionary; locale: Locale }) {
  const levelIndex = ['beginner', 'intermediate', 'advanced'].indexOf(c.level)

  return (
    <article className="group flex h-full flex-col gap-4 rounded-xl border border-border bg-card p-4 transition-colors hover:border-ring">
      <div className="flex items-center justify-between">
        <span className="font-mono text-[11px] tracking-wider text-muted-foreground" translate="no">{c.code}</span>
        <ArrowUpRight
          className="size-4 text-muted-foreground transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:text-foreground ltr:group-hover:translate-x-0.5 rtl:-scale-x-100"
          aria-hidden="true"
        />
      </div>

      <div className="flex flex-1 flex-col gap-1.5">
        <h3 className="text-base font-semibold leading-snug text-pretty">{c.title[locale]}</h3>
        <p className="text-sm leading-relaxed text-muted-foreground text-pretty">{c.summary[locale]}</p>
      </div>

      <div className="flex items-center justify-between border-t border-border pt-3 text-xs text-muted-foreground">
        <div className="flex items-center gap-2">
          <span className="flex gap-0.5" aria-hidden="true">
            {[0, 1, 2].map((n) => (
              <span key={n} className={cn('h-2.5 w-1 rounded-full', n <= levelIndex ? 'bg-foreground' : 'bg-secondary')} />
            ))}
          </span>
          <span>{t.courses.level[c.level]}</span>
        </div>
        <span className="font-mono">
          {c.modules} {t.courses.modules} / {c.hours} {t.courses.hours}
        </span>
      </div>
    </article>
  )
}
