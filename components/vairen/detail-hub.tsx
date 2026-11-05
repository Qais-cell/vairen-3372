'use client'

import { ArrowLeft, CheckCircle2, Clock3, ExternalLink, Play, Sparkles } from 'lucide-react'
import { professions, courses, type Course, type Profession } from '@/lib/data'
import type { Dictionary, Locale } from '@/lib/i18n'

type Props = { kind: 'profession' | 'course'; id: string; locale: Locale; t: Dictionary; onBack: () => void; onConsult: (prompt: string) => void }

const images: Record<string, string> = {
  'ml-engineer': 'https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?auto=format&fit=crop&w=1400&q=85',
  'backend-engineer': 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1400&q=85',
  'cloud-architect': 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1400&q=85',
  'security-analyst': 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?auto=format&fit=crop&w=1400&q=85',
  'devops-engineer': 'https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?auto=format&fit=crop&w=1400&q=85',
  'data-engineer': 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1400&q=85',
  'product-designer': 'https://images.unsplash.com/photo-1558655146-d09347e92766?auto=format&fit=crop&w=1400&q=85',
}

export function DetailHub({ kind, id, locale, t, onBack, onConsult }: Props) {
  const item = kind === 'profession' ? professions.find((p) => p.id === id) : courses.find((c) => c.id === id)
  if (!item) return null
  const title = item.title[locale]
  const image = images[id] ?? 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1400&q=85'
  const isProfession = kind === 'profession'
  const profession = item as Profession
  const course = item as Course
  const lessons = isProfession ? profession.skills.map((skill) => skill.name[locale]) : Array.from({ length: course.modules }, (_, i) => `${locale === 'ar' ? 'الوحدة' : 'Module'} ${String(i + 1).padStart(2, '0')} · ${course.title[locale]}`)

  return (
    <section className="animate-view-in flex flex-col gap-6" aria-labelledby="hub-title">
      <button type="button" onClick={onBack} className="flex w-fit items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"><ArrowLeft className="size-4 rtl:rotate-180" />{locale === 'ar' ? 'عودة' : 'Back to library'}</button>
      <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-card">
        <img src={image} alt="" className="h-48 w-full object-cover opacity-70 sm:h-64" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/45 to-transparent" />
        <div className="absolute inset-x-5 bottom-5"><span className="font-mono text-[10px] uppercase tracking-[0.24em] text-signal">{isProfession ? profession.field[locale] : course.code}</span><h1 id="hub-title" className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">{title}</h1></div>
      </div>
      <div className="grid grid-cols-3 gap-2">
        {isProfession ? <><Metric label={t.professions.salary} value={profession.salary} /><Metric label={t.professions.growth} value={profession.growth} /><Metric label={t.professions.demand} value={t.professions.levels[profession.demand]} /></> : <><Metric label={t.courses.modules} value={String(course.modules)} /><Metric label={t.courses.hours} value={String(course.hours)} /><Metric label={locale === 'ar' ? 'المستوى' : 'Level'} value={t.courses.level[course.level]} /></>}
      </div>
      <div className="rounded-2xl border border-border bg-card p-5"><div className="flex items-center gap-2 text-signal"><Sparkles className="size-4" /><span className="font-mono text-[10px] uppercase tracking-[0.2em]">{locale === 'ar' ? 'مسار مصمم بعناية' : 'Curated path'}</span></div><p className="mt-3 text-sm leading-7 text-muted-foreground">{isProfession ? (locale === 'ar' ? 'مسار عملي من المهارات الأساسية إلى إثبات الخبرة وبناء ملف مهني قادر على المنافسة عالميًا.' : 'A practical path from foundational skills to proof of work, portfolio signal, and globally competitive roles.') : course.summary[locale]}</p></div>
      <div className="flex flex-col gap-3"><h2 className="text-lg font-semibold">{locale === 'ar' ? 'المنهج الكامل' : 'Complete curriculum'}</h2>{lessons.map((lesson, index) => <button key={lesson} type="button" className="group flex items-center gap-3 rounded-2xl border border-border bg-card p-4 text-start transition-all hover:-translate-y-0.5 hover:border-ring"><span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-secondary font-mono text-xs text-muted-foreground">{String(index + 1).padStart(2, '0')}</span><span className="flex-1 text-sm font-medium">{lesson}</span><Play className="size-4 text-muted-foreground transition-transform group-hover:translate-x-0.5" /></button>)}</div>
      <button type="button" onClick={() => onConsult(`Create a detailed learning and career plan for ${item.title.en}. Include prerequisites, projects, milestones and interview preparation.`)} className="flex h-12 items-center justify-center gap-2 rounded-xl bg-foreground text-sm font-medium text-primary-foreground transition-transform hover:scale-[1.01] active:scale-[0.98]"><ExternalLink className="size-4" />{locale === 'ar' ? 'اسأل فيرين عن هذا المسار' : 'Ask Vairen about this path'}</button>
    </section>
  )
}

function Metric({ label, value }: { label: string; value: string }) { return <div className="rounded-xl border border-border bg-card p-3"><p className="text-[10px] text-muted-foreground">{label}</p><p className="mt-1 truncate font-mono text-sm">{value}</p></div> }
