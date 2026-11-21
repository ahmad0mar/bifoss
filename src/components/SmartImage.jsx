import { useState } from 'react'
import { cn } from '@/lib/utils'

/**
 * Loads an image from /public with a short fade-in. Lazy by default, with width and
 * height attributes (override per call) so the browser reserves space.
 * While loading or on error, shows a flat wash placeholder.
 */
export default function SmartImage({ src, alt = '', className, width = 800, height = 450, ...rest }) {
  const [failed, setFailed] = useState(false)
  const [loaded, setLoaded] = useState(false)

  if (!src || failed) {
    return (
      <div
        role={alt ? 'img' : undefined}
        aria-label={alt || undefined}
        aria-hidden={alt ? undefined : true}
        className={cn(
          'bg-brand-wash',
          className
        )}
      />
    )
  }

  return (
    <div className={cn('relative overflow-hidden', className)}>
      {/* Warm placeholder shown until image loads */}
      <div
        className="pointer-events-none absolute inset-0 bg-brand-wash transition-opacity duration-300"
        style={{ opacity: loaded ? 0 : 1 }}
        aria-hidden="true"
      />
      <img
        src={src}
        alt={alt}
        width={width}
        height={height}
        loading="lazy"
        decoding="async"
        onError={() => setFailed(true)}
        onLoad={() => setLoaded(true)}
        className="h-full w-full object-cover transition-opacity duration-300"
        style={{ opacity: loaded ? 1 : 0 }}
        {...rest}
      />
    </div>
  )
}
