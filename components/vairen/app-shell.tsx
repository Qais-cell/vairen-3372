'use client'

import { MotionConfig } from 'framer-motion'
import { Activity, useCallback, useEffect, useRef, useState } from 'react'
import { dictionary } from '@/lib/i18n'
import { createClient } from '@/lib/supabase/client'
import { TopNav } from './top-nav'
import { BottomNav, type Tab } from './bottom-nav'
import { ProfessionsView } from './professions-view'
import { CoursesView } from './courses-view'
import { CoursePlayer } from './course-player'
import { AssistantView } from './assistant-view'
import { IntroScreen } from './intro-screen'
import { AuthScreen } from './auth-screen'
import { SettingsPanel, type Preferences } from './settings-panel'
import { DetailHub } from './detail-hub'

export function AppShell() {
  const [preferences, setPreferences] = useState<Preferences>({
    locale: 'en',
    theme: 'dark',
    reducedMotion: false,
  })
  const [preferencesReady, setPreferencesReady] = useState(false)
  const [tab, setTab] = useState<Tab>('professions')
  const [introVisible, setIntroVisible] = useState(true)
  const [sessionReady, setSessionReady] = useState(false)
  const [authenticated, setAuthenticated] = useState(false)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [careerPrompt, setCareerPrompt] = useState<string | null>(null)
  const [courseId, setCourseId] = useState<string | null>(null)
  const courseOrigin = useRef<Tab>('professions')
  const [detail, setDetail] = useState<string | null>(null)
  const [saveState, setSaveState] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle')
  const modified = useRef(false)
  const revision = useRef(0)
  const saveQueue = useRef<Promise<void>>(Promise.resolve())
  const { locale, theme, reducedMotion } = preferences
  const t = dictionary[locale]

  useEffect(() => {
    const root = document.documentElement
    const cached = document.cookie.match(/(?:^|; )vairen-display=([^;]+)/)?.[1]?.split('.')
    const systemMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const systemTheme = window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark'
    setPreferences({
      locale: cached?.[1] === 'ar' ? 'ar' : 'en',
      theme: cached?.[0] === 'light' ? 'light' : cached?.[0] === 'dark' ? 'dark' : systemTheme,
      reducedMotion: cached ? cached[2] === '1' : systemMotion,
    })
    fetch('/.netlify/functions/preferences')
      .then(async (r) => {
        if (!r.ok) throw new Error('Unavailable')
        const data = await r.json()
        const p = data.preferences
        if (p && !modified.current && ['en', 'ar'].includes(p.locale) && ['light', 'dark'].includes(p.theme))
          setPreferences(p)
      })
      .catch(() => {
        if (cached && !modified.current) setSaveState('error')
      })
    setPreferencesReady(true)
  }, [])

  useEffect(() => {
    if (!preferencesReady) return
    const root = document.documentElement
    root.lang = locale
    root.dir = locale === 'ar' ? 'rtl' : 'ltr'
    root.dataset.theme = theme
    root.dataset.motion = reducedMotion ? 'reduced' : 'full'
    root.classList.toggle('dark', theme === 'dark')
    document
      .querySelector('meta[name="theme-color"]')
      ?.setAttribute('content', theme === 'dark' ? '#101b18' : '#fafbf8')
  }, [locale, theme, reducedMotion, preferencesReady])

  function save(next: Preferences) {
    const current = ++revision.current
    setSaveState('saving')
    // Serialize writes so rapid toggles cannot leave stale preferences in the database.
    saveQueue.current = saveQueue.current
      .catch(() => {})
      .then(async () => {
        try {
          const res = await fetch('/.netlify/functions/preferences', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(next),
          })
          if (!res.ok) throw new Error('Save failed')
          if (revision.current === current) setSaveState('saved')
        } catch {
          if (revision.current === current) setSaveState('error')
        }
      })
  }
  function changePreferences(partial: Partial<Preferences>) {
    modified.current = true
    const next = { ...preferences, ...partial }
    setPreferences(next)
    save(next)
  }

  useEffect(() => {
    const supabase = createClient()
    supabase.auth
      .getSession()
      .then(({ data }) => {
        setAuthenticated(Boolean(data.session))
        setSessionReady(true)
      })
      .catch(() => setSessionReady(true))
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setAuthenticated(Boolean(session))
      setSessionReady(true)
    })
    return () => listener.subscription.unsubscribe()
  }, [])

  useEffect(() => {
    const syncCourse = () => {
      const match = window.location.hash.match(/^#learn\/([a-z0-9-]{1,96})$/)
      setCourseId(match?.[1] ?? null)
      setTab(match ? 'courses' : courseOrigin.current)
    }
    if (window.location.hash.startsWith('#learn/')) {
      courseOrigin.current = 'courses'
      syncCourse()
    }
    window.addEventListener('popstate', syncCourse)
    return () => window.removeEventListener('popstate', syncCourse)
  }, [])
  const openCourse = (id: string) => {
    courseOrigin.current = tab
    setCourseId(id)
    setTab('courses')
    window.history.pushState({ vairenCourse: true }, '', `#learn/${id}`)
    window.scrollTo({ top: 0 })
  }
  const closeCourse = () => {
    setCourseId(null)
    setTab(courseOrigin.current)
    if (window.history.state?.vairenCourse) window.history.back()
    else window.history.replaceState(null, '', window.location.pathname + window.location.search)
    window.scrollTo({ top: 0 })
  }
  const changeTab = (next: Tab) => {
    setCourseId(null)
    if (window.location.hash.startsWith('#learn/'))
      window.history.replaceState(null, '', window.location.pathname + window.location.search)
    setDetail(null)
    setTab(next)
    window.scrollTo({ top: 0, behavior: reducedMotion ? 'instant' : 'smooth' })
  }
  const finishIntro = useCallback(() => setIntroVisible(false), [])
  const consult = (prompt: string) => {
    setCareerPrompt(prompt)
    setDetail(null)
    setTab('assistant')
  }

  return (
    <MotionConfig
      reducedMotion={reducedMotion ? 'always' : 'user'}
      transition={{ duration: reducedMotion ? 0 : 0.24 }}
    >
      <div className="flex min-h-dvh flex-col bg-background text-foreground">
        <TopNav
          t={t}
          locale={locale}
          theme={theme}
          onLocale={(locale) => changePreferences({ locale })}
          onTheme={() => changePreferences({ theme: theme === 'dark' ? 'light' : 'dark' })}
          onOpenSettings={() => setSettingsOpen(true)}
        />
        {saveState !== 'idle' && (
          <div
            role="status"
            className={`mx-auto flex w-full max-w-5xl items-center justify-end gap-2 px-4 pt-2 text-[10px] sm:px-8 ${saveState === 'error' ? 'text-destructive' : 'text-muted-foreground'}`}
          >
            {saveState === 'saving'
              ? t.common.saving
              : saveState === 'error'
                ? t.common.saveError
                : t.common.saved}
            {saveState === 'error' && (
              <button type="button" onClick={() => save(preferences)} className="underline">
                {t.common.retry}
              </button>
            )}
          </div>
        )}
        {settingsOpen && (
          <SettingsPanel
            t={t}
            preferences={preferences}
            onChange={changePreferences}
            onClose={() => setSettingsOpen(false)}
          />
        )}
        {!sessionReady ? (
          <main className="mx-auto w-full max-w-5xl p-8" aria-busy="true">
            <div className="h-40 animate-pulse rounded-2xl bg-secondary" />
            <div className="mt-6 grid grid-cols-2 gap-5">
              <div className="h-64 animate-pulse rounded-2xl bg-secondary" />
              <div className="h-64 animate-pulse rounded-2xl bg-secondary" />
            </div>
          </main>
        ) : !authenticated ? (
          <AuthScreen locale={locale} />
        ) : (
          <>
            <main
              id="workspace"
              className="mx-auto flex w-full max-w-5xl flex-1 flex-col px-4 pb-28 pt-7 sm:px-8 sm:pt-9"
            >
              {courseId && (
                <CoursePlayer key={courseId} id={courseId} locale={locale} t={t} onBack={closeCourse} />
              )}
              <Activity mode={courseId ? 'hidden' : 'visible'}>
                {detail ? (
                  <DetailHub
                    key={`${detail}-${locale}`}
                    id={detail}
                    t={t}
                    locale={locale}
                    onBack={() => {
                      setDetail(null)
                      window.scrollTo({ top: 0 })
                    }}
                    onConsult={consult}
                    onOpenCourse={openCourse}
                  />
                ) : (
                  <>
                    <Activity mode={tab === 'professions' ? 'visible' : 'hidden'}>
                      <div className="animate-view-in">
                        <ProfessionsView
                          t={t}
                          locale={locale}
                          onOpen={(id) => {
                            setDetail(id)
                            window.scrollTo({ top: 0 })
                          }}
                        />
                      </div>
                    </Activity>
                    <Activity mode={tab === 'courses' ? 'visible' : 'hidden'}>
                      <div className="animate-view-in">
                        <CoursesView t={t} locale={locale} onOpen={openCourse} />
                      </div>
                    </Activity>
                    <Activity mode={tab === 'assistant' ? 'visible' : 'hidden'}>
                      <AssistantView
                        t={t}
                        locale={locale}
                        initialPrompt={careerPrompt}
                        onPromptConsumed={() => setCareerPrompt(null)}
                      />
                    </Activity>
                  </>
                )}
              </Activity>
            </main>
            <BottomNav t={t} active={tab} onChange={changeTab} />
          </>
        )}
        {introVisible && <IntroScreen locale={locale} onComplete={finishIntro} />}
      </div>
    </MotionConfig>
  )
}
