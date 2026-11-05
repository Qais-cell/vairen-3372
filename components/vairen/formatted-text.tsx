import { Fragment, type ReactNode } from 'react'

function inline(text: string): ReactNode[] {
  return text.split(/(\*\*[^*]+\*\*|`[^`]+`)/g).map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={i} className="font-semibold text-foreground">{part.slice(2, -2)}</strong>
    }
    if (part.startsWith('`') && part.endsWith('`')) {
      return <code key={i} className="rounded bg-secondary px-1.5 py-0.5 font-mono text-[13px]">{part.slice(1, -1)}</code>
    }
    return <Fragment key={i}>{part}</Fragment>
  })
}

export function FormattedText({ text }: { text: string }) {
  const blocks = text.split(/\n{2,}/)

  return (
    <div className="flex flex-col gap-3">
      {blocks.map((block, bi) => {
        const lines = block.split('\n').filter(Boolean)
        if (lines.length === 0) return null

        const heading = lines[0].match(/^#{1,6}\s+(.*)/)
        if (heading && lines.length === 1) {
          return <h3 key={bi} className="font-semibold">{inline(heading[1])}</h3>
        }

        if (lines.every((l) => /^\s*([-*]|\d+\.)\s+/.test(l))) {
          const ordered = /^\s*\d+\./.test(lines[0])
          const Tag = ordered ? 'ol' : 'ul'
          return (
            <Tag key={bi} className={`flex flex-col gap-1.5 ps-5 ${ordered ? 'list-decimal' : 'list-disc'} marker:text-muted-foreground`}>
              {lines.map((l, li) => (
                <li key={li}>{inline(l.replace(/^\s*([-*]|\d+\.)\s+/, ''))}</li>
              ))}
            </Tag>
          )
        }

        return (
          <p key={bi} className="whitespace-pre-wrap text-pretty">
            {inline(lines.map((l) => l.replace(/^#{1,6}\s+/, '')).join('\n'))}
          </p>
        )
      })}
    </div>
  )
}
