'use client'

import { useDeferredValue, useMemo, useState } from 'react'
import { ArrowUpRight, Search, X } from 'lucide-react'
import { professions, professionImage } from '@/lib/data'
import type { Dictionary, Locale } from '@/lib/i18n'
import { CareerImage } from './career-image'

export function ProfessionsView({
  t,
  locale,
  onOpen,
}: {
  t: Dictionary
  locale: Locale
  onOpen: (id: string) => void
}) {
  const [query, setQuery] = useState('')
  const deferredQuery = useDeferredValue(query)
  const results = useMemo(() => {
    const q = deferredQuery.trim().toLocaleLowerCase(locale)
    return professions.filter(
      (p) =>
        !q ||
        [
          p.title.en,
          p.title.ar,
          p.field.en,
          p.field.ar,
          ...p.skills.flatMap((s) => [s.name.en, s.name.ar]),
        ].some((v) => v.toLocaleLowerCase(locale).includes(q)),
    )
  }, [deferredQuery, locale])
  return (
    <section className="animate-view-in flex flex-col gap-8" aria-labelledby="professions-title">
      <header className="career-hero grid items-end gap-8 py-5 sm:grid-cols-[1.5fr_1fr] sm:py-9">
        <div>
          <p className="mb-5 flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.2em] text-signal">
            <span className="h-px w-7 bg-signal" />
            {t.professions.eyebrow}
          </p>
          <h1
            id="professions-title"
            className="max-w-lg text-4xl font-semibold leading-[1.18] tracking-tight sm:text-6xl"
          >
            {t.professions.title}
            <span className="text-signal">.</span>
          </h1>
          <p className="mt-5 max-w-md text-base leading-7 text-muted-foreground">{t.professions.subtitle}</p>
        </div>
        <div className="hero-note rounded-2xl border-s-2 border-signal bg-secondary/50 p-5">
          <span className="mb-2 block font-mono text-3xl text-signal">01—10</span>
          <p className="text-sm leading-7 text-muted-foreground">{t.career.marketNote}</p>
        </div>
      </header>
      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute start-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t.professions.searchPlaceholder}
            aria-label={t.professions.searchLabel}
            className="h-13 w-full rounded-xl border border-border bg-card ps-11 pe-12 text-sm outline-none focus:border-signal [&::-webkit-search-cancel-button]:hidden"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              aria-label={t.common.clearSearch}
              className="absolute end-2 top-1/2 -translate-y-1/2 rounded-full p-2"
            >
              <X className="size-4" />
            </button>
          )}
        </div>
        <span className="hidden shrink-0 text-xs text-muted-foreground sm:block" aria-live="polite">
          {t.professions.results(results.length)}
        </span>
      </div>
      {!results.length ? (
        <p
          className="rounded-2xl border border-dashed border-border p-12 text-center text-sm text-muted-foreground"
          role="status"
        >
          {t.professions.empty}
        </p>
      ) : (
        <ul className="career-grid grid gap-5 sm:grid-cols-2">
          {results.map((p, i) => (
            <li key={p.id} className="animate-view-in" style={{ animationDelay: `${Math.min(i, 5) * 65}ms` }}>
              <button
                type="button"
                onClick={() => onOpen(p.id)}
                className="career-card group flex h-full w-full flex-col overflow-hidden rounded-2xl border border-border bg-card text-start"
              >
                <div className="relative aspect-[1.9] w-full overflow-hidden">
                  <CareerImage
                    src={professionImage(p.id)}
                    alt={p.title[locale]}
                    eager={i < 2}
                    className="size-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <span className="absolute start-4 top-4 rounded-full bg-background/95 px-3 py-1.5 font-mono text-[10px]">
                    {String(professions.indexOf(p) + 1).padStart(2, '0')} / {p.avatar}
                  </span>
                  <span className="absolute bottom-3 end-3 flex size-9 items-center justify-center rounded-full bg-card text-foreground transition-transform group-hover:-translate-y-1">
                    <ArrowUpRight className="size-4 rtl:-scale-x-100" />
                  </span>
                </div>
                <div className="flex flex-1 flex-col gap-3 p-5">
                  <span className="text-[11px] font-medium text-signal">{p.field[locale]}</span>
                  <h2 className="text-xl font-semibold tracking-tight">{p.title[locale]}</h2>
                  <p className="text-xs leading-6 text-muted-foreground">
                    {p.skills
                      .slice(0, 3)
                      .map((s) => s.name[locale])
                      .join(' · ')}
                  </p>
                  <span className="mt-auto border-t border-border pt-3 text-xs font-medium">
                    {t.career.explore}
                  </span>
                </div>
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
