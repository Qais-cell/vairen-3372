'use client'

import { Activity, useCallback, useEffect, useState } from 'react'
import { dictionary, type Locale } from '@/lib/i18n'
import { createClient } from '@/lib/supabase/client'
import { TopNav } from './top-nav'
import { BottomNav, type Tab } from './bottom-nav'
import { ProfessionsView } from './professions-view'
import { CoursesView } from './courses-view'
import { AssistantView } from './assistant-view'
import { IntroScreen } from './intro-screen'
import { AuthScreen } from './auth-screen'
import { SettingsPanel } from './settings-panel'
import { DetailHub } from './detail-hub'

export function AppShell() {
  const [locale, setLocale] = useState<Locale>('en')
  const [tab, setTab] = useState<Tab>('professions')
  const [introVisible, setIntroVisible] = useState(true)
  const [sessionReady, setSessionReady] = useState(false)
  const [authenticated, setAuthenticated] = useState(false)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [careerPrompt, setCareerPrompt] = useState<string | null>(null)
  const [detail, setDetail] = useState<{ kind: 'profession' | 'course'; id: string } | null>(null)
  const t = dictionary[locale]

  useEffect(() => {
    const root = document.documentElement
    root.lang = locale
    root.dir = locale === 'ar' ? 'rtl' : 'ltr'
  }, [locale])

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getSession().then(({ data }) => {
      setAuthenticated(Boolean(data.session))
      setSessionReady(true)
    })
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setAuthenticated(Boolean(session))
      setSessionReady(true)
    })
    return () => listener.subscription.unsubscribe()
  }, [])

  const changeTab = (next: Tab) => {
    setTab(next)
    window.scrollTo({ top: 0 })
  }

  const finishIntro = useCallback(() => setIntroVisible(false), [])

  if (introVisible) return <IntroScreen locale={locale} onComplete={finishIntro} />
  if (!sessionReady) return <div className="min-h-dvh bg-background" />
  if (!authenticated) return <AuthScreen locale={locale} />

  return (
    <div className="flex min-h-dvh flex-col bg-background text-foreground">
      <TopNav t={t} onToggleLocale={() => setLocale((l) => (l === 'en' ? 'ar' : 'en'))} onOpenSettings={() => setSettingsOpen(true)} />
      {settingsOpen && <SettingsPanel t={t} onClose={() => setSettingsOpen(false)} onToggleLocale={() => setLocale((l) => (l === 'en' ? 'ar' : 'en'))} />}
      <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col px-4 pb-28 pt-6">
        {detail ? <DetailHub {...detail} t={t} locale={locale} onBack={() => setDetail(null)} onConsult={(prompt) => { setCareerPrompt(prompt); setDetail(null); setTab('assistant') }} /> : <>
          <Activity mode={tab === 'professions' ? 'visible' : 'hidden'}><ProfessionsView key={`p-${locale}`} t={t} locale={locale} onConsult={(prompt) => { setCareerPrompt(prompt); setTab('assistant') }} onOpen={(id) => setDetail({ kind: 'profession', id })} /></Activity>
          <Activity mode={tab === 'courses' ? 'visible' : 'hidden'}><CoursesView key={`c-${locale}`} t={t} locale={locale} onOpen={(id) => setDetail({ kind: 'course', id })} /></Activity>
          <Activity mode={tab === 'assistant' ? 'visible' : 'hidden'}><AssistantView t={t} initialPrompt={careerPrompt} onPromptConsumed={() => setCareerPrompt(null)} /></Activity>
        </>}
      </main>
      <BottomNav t={t} active={tab} onChange={changeTab} />
    </div>
  )
}
