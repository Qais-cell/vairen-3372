'use client'

import { useDeferredValue, useMemo, useState } from 'react'
import { ChevronDown, Search, X } from 'lucide-react'
import { professions, type Profession } from '@/lib/data'
import type { Dictionary, Locale } from '@/lib/i18n'
import { cn } from '@/lib/utils'
import { SectionHeader } from './section-header'

export function ProfessionsView({ t, locale, onConsult, onOpen }: { t: Dictionary; locale: Locale; onConsult: (prompt: string) => void; onOpen: (id: string) => void }) {
  const [query, setQuery] = useState('')
  const deferredQuery = useDeferredValue(query)

  const results = useMemo(() => {
    const q = deferredQuery.trim().toLowerCase()
    if (!q) return professions
    return professions.filter((p) =>
      [p.title.en, p.title.ar, p.field.en, p.field.ar, ...p.skills.flatMap((s) => [s.name.en, s.name.ar])]
        .some((v) => v.toLowerCase().includes(q)),
    )
  }, [deferredQuery])

  return (
    <section className="animate-view-in flex flex-col gap-6" aria-labelledby="professions-title">
      <SectionHeader id="professions-title" eyebrow={t.professions.eyebrow} title={t.professions.title} subtitle={t.professions.subtitle} />

      <div className="flex flex-col gap-3">
        <div className="relative">
          <Search className="pointer-events-none absolute top-1/2 size-4 -translate-y-1/2 text-muted-foreground ltr:left-4 rtl:right-4" aria-hidden="true" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t.professions.searchPlaceholder}
            aria-label={t.professions.searchLabel}
            className="h-12 w-full rounded-xl border border-border bg-card px-11 text-[15px] text-foreground placeholder:text-muted-foreground transition-colors focus:border-ring focus:outline-none [&::-webkit-search-cancel-button]:hidden"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              aria-label="Clear search"
              className="absolute top-1/2 flex size-8 -translate-y-1/2 items-center justify-center rounded-full text-muted-foreground hover:text-foreground ltr:right-2 rtl:left-2"
            >
              <X className="size-4" aria-hidden="true" />
            </button>
          )}
        </div>
        <p className="font-mono text-xs uppercase tracking-wider text-muted-foreground" aria-live="polite">
          {t.professions.results(results.length)}
        </p>
      </div>

      {results.length === 0 ? (
        <p className="rounded-xl border border-dashed border-border px-4 py-10 text-center text-sm text-muted-foreground">
          {t.professions.empty}
        </p>
      ) : (
        <ul className="flex flex-col gap-3">
          {results.map((p) => (
            <li key={p.id}>
              <ProfessionCard profession={p} t={t} locale={locale} onConsult={onConsult} onOpen={onOpen} />
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}

function ProfessionCard({ profession: p, t, locale, onConsult, onOpen }: { profession: Profession; t: Dictionary; locale: Locale; onConsult: (prompt: string) => void; onOpen: (id: string) => void }) {
  const [open, setOpen] = useState(false)
  const panelId = `skills-${p.id}`

  return (
    <article className={cn('overflow-hidden rounded-xl border bg-card transition-colors', open ? 'border-ring' : 'border-border hover:border-ring')} style={{ borderInlineStartColor: p.accent }}>
      <button
        type="button"
        onClick={() => { setOpen((o) => !o); onOpen(p.id) }}
        aria-expanded={open}
        aria-controls={panelId}
        className="flex w-full flex-col gap-4 p-4 text-start focus-visible:outline-2 focus-visible:-outline-offset-2"
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="flex size-11 shrink-0 items-center justify-center rounded-2xl border border-white/10 text-xs font-semibold tracking-tight" style={{ color: p.accent, background: `radial-gradient(circle at 30% 20%, ${p.accent}44, transparent 65%), #101010` }} aria-hidden="true">{p.avatar}</span>
            <div className="flex flex-col gap-1">
            <span className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">{p.field[locale]}</span>
              <h3 className="text-base font-semibold leading-snug text-pretty">{p.title[locale]}</h3>
            </div>
          </div>
          <ChevronDown className={cn('mt-1 size-4 shrink-0 text-muted-foreground transition-transform duration-300', open && 'rotate-180')} aria-hidden="true" />
        </div>

        <dl className="grid grid-cols-3 gap-2 border-t border-border pt-3">
          <Stat label={t.professions.demand} value={t.professions.levels[p.demand]} highlight={p.demand === 'very'} />
          <Stat label={t.professions.salary} value={p.salary} />
          <Stat label={t.professions.growth} value={p.growth} />
        </dl>
      </button>

      <div
        id={panelId}
        className={cn('grid transition-[grid-template-rows] duration-300 ease-out', open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]')}
      >
        <div className="overflow-hidden">
          <div className="flex flex-col gap-3 border-t border-border p-4">
            <h4 className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">{t.professions.analyze}</h4>
            <ul className="flex flex-col gap-3">
              {p.skills.map((s) => (
                <li key={s.name.en} className="flex flex-col gap-1.5">
                  <div className="flex items-center justify-between text-sm">
                    <span>{s.name[locale]}</span>
                    <span className="font-mono text-xs text-muted-foreground">{s.weight}</span>
                  </div>
                  <div className="h-1 overflow-hidden rounded-full bg-secondary" role="presentation">
                    <div
                      className="h-full rounded-full bg-foreground transition-[width] duration-700 ease-out"
                      style={{ width: open ? `${s.weight}%` : '0%' }}
                    />
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </article>
  )
}

function Stat({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className="flex flex-col gap-0.5">
      <dt className="text-[11px] text-muted-foreground">{label}</dt>
      <dd className={cn('font-mono text-sm', highlight ? 'text-signal' : 'text-foreground')}>{value}</dd>
    </div>
  )
}
