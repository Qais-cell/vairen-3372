'use client'

import { useState } from 'react'
import { ArrowLeft, Check, Copy, Sparkles } from 'lucide-react'
import { professions, professionImage, professionPrompt } from '@/lib/data'
import type { Dictionary, Locale } from '@/lib/i18n'
import { CareerImage } from './career-image'
import { RelatedCourses } from './courses-view'

type Props = {
  id: string
  locale: Locale
  t: Dictionary
  onBack: () => void
  onConsult: (prompt: string) => void
  onOpenCourse: (id: string) => void
}
export function DetailHub({ id, locale, t, onBack, onConsult, onOpenCourse }: Props) {
  const [copyState, setCopyState] = useState<'idle' | 'copied' | 'error'>('idle')
  const p = professions.find((p) => p.id === id)
  if (!p) return null
  const prompt = professionPrompt(p, locale)
  async function copyPrompt() {
    try {
      await navigator.clipboard.writeText(prompt)
      setCopyState('copied')
    } catch {
      setCopyState('error')
    }
  }
  return (
    <section className="animate-view-in flex flex-col gap-7" aria-labelledby="hub-title">
      <button
        type="button"
        onClick={onBack}
        className="flex w-fit items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4 rtl:rotate-180" />
        {t.common.back}
      </button>
      <div className="relative overflow-hidden rounded-3xl border border-border bg-card">
        <CareerImage
          src={professionImage(id)}
          alt={p.title[locale]}
          eager
          className="h-64 w-full object-cover sm:h-96"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#101d1b] via-[#101d1b]/30 to-transparent" />
        <div className="absolute inset-x-6 bottom-6 text-white">
          <p className="mb-3 text-xs tracking-widest text-[#a8e0c8]">{p.field[locale]}</p>
          <h1 id="hub-title" className="text-3xl font-semibold sm:text-5xl">
            {p.title[locale]}
          </h1>
        </div>
      </div>
      <a
        href={`https://images.unsplash.com/photo-${photoIds[id]}`}
        target="_blank"
        rel="noopener noreferrer"
        className="-mt-4 w-fit text-[10px] text-muted-foreground underline underline-offset-4"
      >
        {t.career.photo}
      </a>
      <div className="grid gap-6 sm:grid-cols-[1fr_1.4fr]">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-widest text-signal">
            {t.professions.analyze}
          </p>
          <h2 className="mt-3 text-2xl font-semibold">{t.professions.skills}</h2>
          <p className="mt-3 text-xs leading-6 text-muted-foreground">{t.career.skillsHint}</p>
        </div>
        <ul className="grid gap-3">
          {p.skills.map((s, i) => (
            <li
              key={s.name.en}
              className="flex items-center gap-4 rounded-xl border border-border bg-card p-4"
            >
              <span className="font-mono text-xs text-signal">0{i + 1}</span>
              <h3 className="text-sm font-medium">{s.name[locale]}</h3>
            </li>
          ))}
        </ul>
      </div>
      <div className="overflow-hidden rounded-2xl border border-border bg-card">
        <div className="p-5">
          <h2 className="text-xl font-semibold">{t.career.visual}</h2>
          <p className="mt-2 text-sm text-muted-foreground">{t.career.visualHint}</p>
        </div>
        <img
          src={`/images/learning/${id}-${locale}.svg`}
          alt={`${t.career.visual}: ${p.title[locale]}`}
          width={1200}
          height={720}
          loading="lazy"
          className="w-full"
        />
      </div>
      <div className="rounded-2xl border border-border bg-card p-5 sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h2 className="text-lg font-semibold">{t.career.prompt}</h2>
          <button
            type="button"
            onClick={copyPrompt}
            className="flex items-center gap-2 rounded-full border border-border px-4 py-2 text-xs hover:bg-secondary"
          >
            {copyState === 'copied' ? <Check className="size-4" /> : <Copy className="size-4" />}
            {copyState === 'copied' ? t.career.copied : t.career.copy}
          </button>
        </div>
        <p className="mt-3 text-xs leading-6 text-muted-foreground">{t.career.promptHint}</p>
        <p className="mt-4 select-text rounded-xl bg-secondary p-4 text-sm leading-7">{prompt}</p>
        <span role="status" className="mt-2 block text-xs text-muted-foreground">
          {copyState === 'error' ? t.career.copyError : copyState === 'copied' ? t.career.copied : ''}
        </span>
      </div>
      <button
        type="button"
        onClick={() =>
          onConsult(
            locale === 'ar'
              ? `أريد خطة عملية لمهنة ${p.title.ar}. اذكر المتطلبات ومشروعاً تطبيقياً وخطوات الاستعداد للمقابلات، واسألني عن خبرتي الحالية.`
              : `Help me plan a career as a ${p.title.en}. Include prerequisites, a practical project and interview preparation. Ask about my current experience.`,
          )
        }
        className="flex min-h-13 items-center justify-center gap-2 rounded-xl bg-foreground px-4 py-3 text-sm font-medium text-primary-foreground hover:opacity-90"
      >
        <Sparkles className="size-4" />
        {t.career.consult}
      </button>
      <div className="border-t border-border pt-7">
        <h2 className="mb-5 text-2xl font-semibold">{t.career.learning}</h2>
        <p className="mb-5 text-xs leading-6 text-muted-foreground">{t.learning.note}</p>
        <RelatedCourses professionId={id} t={t} locale={locale} onOpen={onOpenCourse} />
      </div>
    </section>
  )
}
const photoIds: Record<string, string> = {
  'ml-engineer': '1555949963-ff9fe0c870eb',
  'backend-engineer': '1555066931-4365d14bab8c',
  'cloud-architect': '1451187580459-43490279c0fa',
  'security-analyst': '1563013544-824ae1b704d3',
  'devops-engineer': '1667372393119-3d4c48d07fc9',
  'data-engineer': '1551288049-bebda4e38f71',
  'product-designer': '1558655146-d09347e92766',
  'mobile-engineer': '1512941937669-90a1b58e7e9c',
  'ai-researcher': '1677442136019-21780ecad995',
  'blockchain-engineer': '1639762681485-074b7f938ba0',
}
