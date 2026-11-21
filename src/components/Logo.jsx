import { Link } from 'react-router-dom'

// The logo is a lowercase "bifoss" wordmark and is only ever used as an image.
export default function Logo({ className = 'h-8' }) {
  return (
    <Link to="/" aria-label="BIFOSS home" className="inline-flex min-h-[44px] items-center">
      <img
        src="/images/brand/bifoss-wordmark-sm.png"
        srcSet="/images/brand/bifoss-wordmark-sm.png 937w, /images/brand/bifoss-wordmark.png 1874w"
        sizes="120px"
        alt="BIFOSS"
        width="937"
        height="260"
        className={`${className} w-auto`}
      />
    </Link>
  )
}
