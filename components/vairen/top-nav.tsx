import { Languages, Moon, SlidersHorizontal, Sun } from 'lucide-react'
import type { Dictionary, Locale } from '@/lib/i18n'

export function TopNav({
  t,
  locale,
  theme,
  onLocale,
  onTheme,
  onOpenSettings,
}: {
  t: Dictionary
  locale: Locale
  theme: 'light' | 'dark'
  onLocale: (locale: Locale) => void
  onTheme: () => void
  onOpenSettings: () => void
}) {
  return (
    <header className="sticky top-0 z-30 border-b border-border bg-background/90 backdrop-blur-xl">
      <div className="mx-auto flex min-h-20 w-full max-w-5xl items-center justify-between gap-2 px-4 sm:px-8">
        <div className="flex items-center gap-3">
          <span className="brand-mark" aria-hidden="true">
            V<span />
          </span>
          <div>
            <span className="text-xl font-semibold tracking-tight" translate="no">
              Vairen<span className="text-signal">.</span>
            </span>
            <p className="hidden text-[10px] tracking-wider text-muted-foreground sm:block">{t.status}</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 sm:gap-3">
          <label className="flex h-10 items-center gap-1.5 rounded-full border border-border bg-card px-3 text-sm">
            <Languages className="size-4 text-muted-foreground" aria-hidden="true" />
            <span className="sr-only">{t.common.language}</span>
            <select
              value={locale}
              onChange={(e) => onLocale(e.target.value as Locale)}
              className="max-w-24 cursor-pointer bg-card text-foreground outline-none"
              aria-label={t.common.language}
            >
              <option value="en" lang="en">
                English
              </option>
              <option value="ar" lang="ar">
                العربية
              </option>
            </select>
          </label>
          <button
            type="button"
            onClick={onTheme}
            aria-label={theme === 'dark' ? t.common.light : t.common.dark}
            title={theme === 'dark' ? t.common.light : t.common.dark}
            className="icon-button"
            aria-pressed={theme === 'dark'}
          >
            {theme === 'dark' ? <Sun className="size-4" /> : <Moon className="size-4" />}
          </button>
          <button
            type="button"
            onClick={onOpenSettings}
            aria-label={t.common.settings}
            className="icon-button"
          >
            <SlidersHorizontal className="size-4" />
          </button>
        </div>
      </div>
    </header>
  )
}
