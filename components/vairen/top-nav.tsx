import { Languages, SlidersHorizontal } from 'lucide-react'
import type { Dictionary } from '@/lib/i18n'

export function TopNav({ t, onToggleLocale, onOpenSettings }: { t: Dictionary; onToggleLocale: () => void; onOpenSettings: () => void }) {
  return (
    <header className="sticky top-0 z-30 bg-transparent px-2 pt-2">
      <div className="mx-auto flex h-14 w-full max-w-2xl items-center justify-between px-4">
        <div className="flex items-center gap-3">
          <span className="font-sans text-lg font-semibold tracking-tight" translate="no">
            Vairen
          </span>
          <span className="flex items-center gap-2 rounded-full border border-border px-2.5 py-1">
            <span className="relative flex size-1.5" aria-hidden="true">
              <span className="animate-signal absolute inline-flex size-full rounded-full bg-signal" />
              <span className="relative inline-flex size-1.5 rounded-full bg-signal" />
            </span>
            <span className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
              {t.status}
            </span>
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button type="button" onClick={onOpenSettings} aria-label="Open settings" className="flex size-9 items-center justify-center rounded-full border border-transparent text-muted-foreground transition-colors hover:border-border hover:bg-secondary hover:text-foreground"><SlidersHorizontal className="size-4" /></button>
          <button
          type="button"
          onClick={onToggleLocale}
          aria-label={t.toggleLabel}
          className="flex h-9 items-center gap-2 rounded-full border border-border px-3.5 text-sm text-foreground transition-colors hover:border-ring hover:bg-secondary focus-visible:outline-2 focus-visible:outline-offset-2"
        >
          <Languages className="size-4 text-muted-foreground" aria-hidden="true" />
          <span>{t.toggleText}</span>
          </button>
        </div>
      </div>
    </header>
  )
}
