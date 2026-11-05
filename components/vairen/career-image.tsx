'use client'
import { useState } from 'react'
export function CareerImage({
  src,
  alt,
  className = '',
  eager = false,
}: {
  src: string
  alt: string
  className?: string
  eager?: boolean
}) {
  const [failed, setFailed] = useState(false)
  return (
    <img
      src={failed ? '/images/careers/fallback.svg' : src}
      alt={alt}
      width={1200}
      height={750}
      loading={eager ? 'eager' : 'lazy'}
      decoding="async"
      onError={() => setFailed(true)}
      className={className}
    />
  )
}
