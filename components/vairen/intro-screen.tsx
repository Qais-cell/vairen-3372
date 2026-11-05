'use client'

import { useEffect, useState } from 'react'
import { dictionary, type Locale } from '@/lib/i18n'

export function IntroScreen({ locale, onComplete }: { locale: Locale; onComplete: () => void }) {
  const t = dictionary[locale]
  const [leaving, setLeaving] = useState(false)

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setLeaving(true)
      window.setTimeout(onComplete, 500)
    }, 2200)
    return () => window.clearTimeout(timer)
  }, [onComplete])

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center bg-background transition-opacity duration-500 ${leaving ? 'opacity-0' : 'opacity-100'}`} aria-label={t.intro.welcome}>
      <div className="flex flex-col items-center gap-8 text-center">
        <div className="relative flex size-28 animate-[intro-float_2.2s_ease-in-out_infinite] items-center justify-center rounded-[2rem] border border-border bg-card shadow-[0_0_80px_rgba(34,197,94,0.08)]">
          <div className="absolute inset-3 rounded-[1.35rem] border border-signal/40" />
          <span className="font-mono text-3xl font-semibold tracking-tighter">V</span>
          <span className="absolute -bottom-1 size-2 rounded-full bg-signal shadow-[0_0_18px_#22c55e]" />
        </div>
        <div className="animate-view-in">
          <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-muted-foreground">Vairen / 001</p>
          <h1 className="mt-3 text-2xl font-semibold tracking-tight">{t.intro.welcome}</h1>
        </div>
      </div>
    </div>
  )
}
