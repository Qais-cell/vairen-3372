import { Fragment, type ReactNode } from 'react'

type Block =
  | { type: 'p'; lines: string[] }
  | { type: 'h'; text: string }
  | { type: 'ul' | 'ol'; items: string[] }

const BULLET = /^\s*[-*•]\s+/
const ORDERED = /^\s*\d+[.)]\s+/
const HEADING = /^#{1,6}\s+/

function inline(text: string): ReactNode[] {
  return text.split(/(\*\*[^*]+\*\*|`[^`]+`)/g).map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**') && part.length > 4) {
      return <strong key={i} className="font-semibold text-foreground">{part.slice(2, -2)}</strong>
    }
    if (part.startsWith('`') && part.endsWith('`') && part.length > 2) {
      return <code key={i} className="rounded bg-secondary px-1.5 py-0.5 font-mono text-[13px]">{part.slice(1, -1)}</code>
    }
    return <Fragment key={i}>{part}</Fragment>
  })
}

function parse(text: string): Block[] {
  const blocks: Block[] = []
  for (const raw of text.split('\n')) {
    const line = raw.trimEnd()
    const last = blocks[blocks.length - 1]
    if (!line.trim()) {
      blocks.push({ type: 'p', lines: [] })
      continue
    }
    if (HEADING.test(line)) {
      blocks.push({ type: 'h', text: line.replace(HEADING, '') })
    } else if (BULLET.test(line)) {
      const item = line.replace(BULLET, '')
      if (last?.type === 'ul') last.items.push(item)
      else blocks.push({ type: 'ul', items: [item] })
    } else if (ORDERED.test(line)) {
      const item = line.replace(ORDERED, '')
      if (last?.type === 'ol') last.items.push(item)
      else blocks.push({ type: 'ol', items: [item] })
    } else if (last?.type === 'p' && last.lines.length > 0) {
      last.lines.push(line)
    } else {
      blocks.push({ type: 'p', lines: [line] })
    }
  }
  return blocks.filter((b) => b.type !== 'p' || b.lines.length > 0)
}

export function FormattedText({ text }: { text: string }) {
  return (
    <div className="flex flex-col gap-3">
      {parse(text).map((block, i) => {
        if (block.type === 'h') {
          return <h3 key={i} className="pt-1 font-semibold text-foreground">{inline(block.text)}</h3>
        }
        if (block.type === 'ul' || block.type === 'ol') {
          const Tag = block.type
          return (
            <Tag
              key={i}
              className={`flex flex-col gap-1.5 ps-5 marker:text-muted-foreground ${block.type === 'ol' ? 'list-decimal' : 'list-disc'}`}
            >
              {block.items.map((item, j) => (
                <li key={j} className="ps-1">{inline(item)}</li>
              ))}
            </Tag>
          )
        }
        return (
          <p key={i} className="whitespace-pre-wrap text-pretty">
            {inline(block.lines.join('\n'))}
          </p>
        )
      })}
    </div>
  )
}
