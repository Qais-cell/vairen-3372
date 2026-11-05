export function SectionHeader({
  id,
  eyebrow,
  title,
  subtitle,
}: {
  id: string
  eyebrow: string
  title: string
  subtitle: string
}) {
  return (
    <header className="flex flex-col gap-2">
      <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">{eyebrow}</span>
      <h1 id={id} className="text-3xl font-semibold tracking-tight text-balance">
        {title}
      </h1>
      <p className="text-[15px] leading-relaxed text-muted-foreground text-pretty">{subtitle}</p>
    </header>
  )
}
