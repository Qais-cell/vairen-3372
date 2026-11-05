'use client'

import { Activity, useEffect, useState } from 'react'
import { dictionary, type Locale } from '@/lib/i18n'
import { TopNav } from './top-nav'
import { BottomNav, type Tab } from './bottom-nav'
import { ProfessionsView } from './professions-view'
import { CoursesView } from './courses-view'
import { AssistantView } from './assistant-view'

export function AppShell() {
  const [locale, setLocale] = useState<Locale>('en')
  const [tab, setTab] = useState<Tab>('professions')
  const t = dictionary[locale]

  useEffect(() => {
    const root = document.documentElement
    root.lang = locale
    root.dir = locale === 'ar' ? 'rtl' : 'ltr'
  }, [locale])

  const changeTab = (next: Tab) => {
    setTab(next)
    window.scrollTo({ top: 0 })
  }

  return (
    <div className="flex min-h-dvh flex-col bg-background text-foreground">
      <TopNav
        t={t}
        onToggleLocale={() => setLocale((l) => (l === 'en' ? 'ar' : 'en'))}
      />

      <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col px-4 pb-28 pt-6">
        <Activity mode={tab === 'professions' ? 'visible' : 'hidden'}>
          <ProfessionsView key={`p-${locale}`} t={t} locale={locale} />
        </Activity>
        <Activity mode={tab === 'courses' ? 'visible' : 'hidden'}>
          <CoursesView key={`c-${locale}`} t={t} locale={locale} />
        </Activity>
        <Activity mode={tab === 'assistant' ? 'visible' : 'hidden'}>
          <AssistantView t={t} />
        </Activity>
      </main>

      <BottomNav t={t} active={tab} onChange={changeTab} />
    </div>
  )
}
