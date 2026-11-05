'use client'

import { FormEvent, useState } from 'react'
import { ArrowRight, LockKeyhole, Mail, UserRound } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { type Locale, dictionary } from '@/lib/i18n'

export function AuthScreen({ locale }: { locale: Locale }) {
  const t = dictionary[locale]
  const [mode, setMode] = useState<'sign-in' | 'sign-up'>('sign-up')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [pending, setPending] = useState(false)
  const [message, setMessage] = useState('')

  async function submit(event: FormEvent) {
    event.preventDefault()
    setPending(true)
    setMessage('')
    const supabase = createClient()
    const redirectTo =
      process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL ?? `${window.location.origin}/auth/callback`
    const result =
      mode === 'sign-up'
        ? await supabase.auth.signUp({
            email,
            password,
            options: { emailRedirectTo: redirectTo, data: { full_name: name } },
          })
        : await supabase.auth.signInWithPassword({ email, password })

    if (result.error) {
      setMessage(result.error.message.toLowerCase().includes('confirm') ? t.auth.confirm : t.auth.invalid)
    } else if (mode === 'sign-up') {
      setMessage(t.auth.checkEmail)
    } else {
      window.location.reload()
    }
    setPending(false)
  }

  return (
    <main className="flex flex-1 items-center justify-center bg-background px-4 py-16">
      <div className="w-full max-w-md animate-view-in">
        <div className="mb-8 flex items-center gap-3">
          <span className="size-2 rounded-full bg-signal" />
          <span className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
            {t.auth.access}
          </span>
        </div>
        <h1 className="text-3xl font-semibold tracking-tight">
          {mode === 'sign-up' ? t.auth.title : t.auth.signIn}
        </h1>
        <p className="mt-2 text-muted-foreground">
          {mode === 'sign-up' ? t.auth.subtitle : t.auth.signInSubtitle}
        </p>

        <form onSubmit={submit} className="mt-8 flex flex-col gap-4">
          {mode === 'sign-up' && (
            <Field icon={UserRound} label={t.auth.name} value={name} onChange={setName} required />
          )}
          <Field icon={Mail} label={t.auth.email} type="email" value={email} onChange={setEmail} required />
          <Field
            icon={LockKeyhole}
            label={t.auth.password}
            type="password"
            value={password}
            onChange={setPassword}
            minLength={6}
            required
          />
          {message && (
            <p
              className="rounded-lg border border-border bg-card p-3 text-sm text-muted-foreground"
              role="status"
            >
              {message}
            </p>
          )}
          <button
            disabled={pending}
            className="mt-2 flex h-12 items-center justify-center gap-2 rounded-xl bg-foreground font-medium text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            {pending ? t.auth.loading : mode === 'sign-up' ? t.auth.create : t.auth.signIn}
            <ArrowRight className="size-4 rtl:rotate-180" aria-hidden="true" />
          </button>
        </form>

        <button
          type="button"
          onClick={() => {
            setMode(mode === 'sign-up' ? 'sign-in' : 'sign-up')
            setMessage('')
          }}
          className="mt-6 text-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
        >
          {mode === 'sign-up' ? t.auth.existing : t.auth.newAccount}
        </button>
      </div>
    </main>
  )
}

function Field({
  icon: Icon,
  label,
  type = 'text',
  value,
  onChange,
  ...props
}: {
  icon: typeof UserRound
  label: string
  type?: string
  value: string
  onChange: (value: string) => void
  required?: boolean
  minLength?: number
}) {
  return (
    <label className="flex flex-col gap-2 text-sm">
      <span>{label}</span>
      <span className="relative">
        <Icon
          className="absolute start-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
          aria-hidden="true"
        />
        <input
          {...props}
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="h-12 w-full rounded-xl border border-border bg-card ps-11 pe-4 outline-none transition-colors focus:border-ring"
        />
      </span>
    </label>
  )
}
