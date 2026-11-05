import { BookOpen, Briefcase, Sparkles } from 'lucide-react'
import type { Dictionary } from '@/lib/i18n'
import { cn } from '@/lib/utils'

export type Tab = 'professions' | 'courses' | 'assistant'

const items: { id: Tab; icon: typeof Briefcase }[] = [
  { id: 'professions', icon: Briefcase },
  { id: 'courses', icon: BookOpen },
  { id: 'assistant', icon: Sparkles },
]

export function BottomNav({
  t,
  active,
  onChange,
}: {
  t: Dictionary
  active: Tab
  onChange: (tab: Tab) => void
}) {
  const activeIndex = items.findIndex((i) => i.id === active)

  return (
    <nav
      aria-label="Primary"
      className="fixed inset-x-0 bottom-0 z-30 border-t border-border bg-background/85 pb-[env(safe-area-inset-bottom)] backdrop-blur-xl"
    >
      <div className="relative mx-auto grid h-16 w-full max-w-2xl grid-cols-3 px-2">
        <span
          aria-hidden="true"
          className="absolute top-0 h-px w-1/3 bg-foreground transition-transform duration-300 ease-out ltr:left-0 rtl:right-0"
          style={{ transform: `translateX(calc(${activeIndex * 100}% * var(--dir, 1)))` }}
        />
        {items.map(({ id, icon: Icon }) => {
          const isActive = id === active
          return (
            <button
              key={id}
              type="button"
              onClick={() => onChange(id)}
              aria-current={isActive ? 'page' : undefined}
              className={cn(
                'flex flex-col items-center justify-center gap-1 text-xs transition-colors focus-visible:outline-2 focus-visible:-outline-offset-4',
                isActive ? 'text-foreground' : 'text-muted-foreground hover:text-foreground',
              )}
            >
              <Icon className="size-5" strokeWidth={isActive ? 2 : 1.5} aria-hidden="true" />
              <span className="font-medium">{t.tabs[id]}</span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}
