'use client'

import { useState } from 'react'
import { Brain, Eye, Languages, Settings2, X } from 'lucide-react'
import type { Dictionary } from '@/lib/i18n'

export function SettingsPanel({ t, onClose, onToggleLocale }: { t: Dictionary; onClose: () => void; onToggleLocale: () => void }) {
  const [reading, setReading] = useState(false)
  const [memory, setMemory] = useState(true)
  return (
    <div className="fixed inset-0 z-50 flex items-start justify-end bg-black/50 p-3 backdrop-blur-sm" role="dialog" aria-modal="true" aria-label="Settings">
      <div className="w-full max-w-sm rounded-2xl border border-white/10 bg-[#080808]/90 p-5 shadow-2xl backdrop-blur-2xl">
        <div className="flex items-center justify-between border-b border-border pb-4">
          <div className="flex items-center gap-2"><Settings2 className="size-4 text-signal" /><h2 className="font-medium">Settings</h2></div>
          <button type="button" onClick={onClose} aria-label="Close settings" className="rounded-full p-2 text-muted-foreground hover:bg-secondary hover:text-foreground"><X className="size-4" /></button>
        </div>
        <div className="flex flex-col gap-2 pt-4">
          <button type="button" onClick={onToggleLocale} className="flex items-center gap-3 rounded-xl border border-border p-3 text-start hover:bg-secondary"><Languages className="size-4 text-muted-foreground" /><span className="flex-1 text-sm">{t.toggleText}</span><span className="font-mono text-[10px] text-muted-foreground">LANG</span></button>
          <button type="button" onClick={() => setReading((v) => !v)} aria-pressed={reading} className="flex items-center gap-3 rounded-xl border border-border p-3 text-start hover:bg-secondary"><Eye className="size-4 text-muted-foreground" /><span className="flex-1 text-sm">Reading mode</span><span className="font-mono text-[10px] text-signal">{reading ? 'ON' : 'OFF'}</span></button>
          <button type="button" onClick={() => setMemory((v) => !v)} aria-pressed={memory} className="flex items-center gap-3 rounded-xl border border-border p-3 text-start hover:bg-secondary"><Brain className="size-4 text-muted-foreground" /><span className="flex-1 text-sm">Conversation memory</span><span className="font-mono text-[10px] text-signal">{memory ? 'ON' : 'OFF'}</span></button>
        </div>
        <p className="pt-5 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Vairen intelligence / Gemini route</p>
      </div>
    </div>
  )
}
