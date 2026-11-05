'use client'

import { useEffect, useRef } from 'react'
import { Moon, Settings2, Sun, X } from 'lucide-react'
import type { Dictionary, Locale } from '@/lib/i18n'

export type Preferences = { locale: Locale; theme: 'light' | 'dark'; reducedMotion: boolean }

export function SettingsPanel({
  t,
  preferences,
  onChange,
  onClose,
}: {
  t: Dictionary
  preferences: Preferences
  onChange: (value: Partial<Preferences>) => void
  onClose: () => void
}) {
  const ref = useRef<HTMLDialogElement>(null)
  useEffect(() => {
    const dialog = ref.current
    const previous = document.activeElement as HTMLElement | null
    dialog?.showModal()
    const overflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      dialog?.close()
      document.body.style.overflow = overflow
      previous?.focus()
    }
  }, [])
  return (
    <dialog
      ref={ref}
      onCancel={(e) => {
        e.preventDefault()
        onClose()
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
      className="settings-dialog m-auto w-[calc(100%_-_2rem)] max-w-md rounded-3xl border border-border bg-card p-0 text-foreground shadow-2xl"
      aria-labelledby="settings-heading"
    >
      <div className="animate-view-in p-6">
        <div className="mb-6 flex items-center justify-between gap-3">
          <h2 id="settings-heading" className="flex items-center gap-2 text-lg font-semibold">
            <Settings2 className="size-5 text-signal" />
            {t.common.settings}
          </h2>
          <button type="button" onClick={onClose} className="icon-button" aria-label={t.common.close}>
            <X className="size-4" />
          </button>
        </div>
        <label className="flex items-center justify-between gap-4 border-b border-border py-4 text-sm">
          <span>{t.common.language}</span>
          <select
            value={preferences.locale}
            onChange={(e) => onChange({ locale: e.target.value as Locale })}
            className="rounded-lg border border-border bg-background p-2"
          >
            <option value="en">English</option>
            <option value="ar">العربية</option>
          </select>
        </label>
        <div className="flex items-center justify-between gap-4 border-b border-border py-4 text-sm">
          <span>{t.common.theme}</span>
          <div className="flex gap-2">
            {(['light', 'dark'] as const).map((theme) => (
              <button
                key={theme}
                type="button"
                aria-pressed={preferences.theme === theme}
                onClick={() => onChange({ theme })}
                className="flex items-center gap-2 rounded-lg border border-border p-2 aria-pressed:border-signal aria-pressed:bg-signal/10"
              >
                {theme === 'light' ? <Sun className="size-4" /> : <Moon className="size-4" />}
                {t.common[theme]}
              </button>
            ))}
          </div>
        </div>
        <label className="flex items-center justify-between gap-4 py-4 text-sm">
          <span>
            {t.common.motion}
            <span className="mt-1 block text-xs leading-relaxed text-muted-foreground">
              {t.common.motionHint}
            </span>
          </span>
          <input
            type="checkbox"
            checked={preferences.reducedMotion}
            onChange={(e) => onChange({ reducedMotion: e.target.checked })}
            className="size-5 accent-[var(--signal)]"
          />
        </label>
      </div>
    </dialog>
  )
}
