import { Link, useParams } from 'react-router-dom'
import { CalendarDays, Clock, MapPin } from 'lucide-react'
import PageShell from '@/components/PageShell'
import Markdown from '@/components/Markdown'
import ReadingProgress from '@/components/ReadingProgress'
import ShareButton from '@/components/ShareButton'
import SmartImage from '@/components/SmartImage'
import NotFound from '@/pages/NotFound'
import { getEvent, splitEvents, formatDate, isToday, plainExcerpt } from '@/lib/content'

export default function EventDetail() {
  const { slug } = useParams()
  const event = getEvent(slug)
  if (!event) {
    return (
      <NotFound
        title="We can't find that event"
        message="It may have been removed, or the link is wrong. See the full list of events."
        linkTo="/events"
        linkLabel="See events"
      />
    )
  }

  const isPast = splitEvents().past.some((e) => e.slug === event.slug)
  const liveNow = isToday(event.date) && !isPast

  const meta = [
    { Icon: CalendarDays, text: formatDate(event.date) },
    event.time && { Icon: Clock, text: event.time },
    event.venue && { Icon: MapPin, text: event.venue },
  ].filter(Boolean)

  const description = [
    `${formatDate(event.date)}${event.venue ? ` at ${event.venue}` : ''}.`,
    plainExcerpt(event.body, 110),
  ].filter(Boolean).join(' ')

  return (
    <>
      <ReadingProgress />
      <PageShell title={event.title} description={description}>
        {liveNow && <p className="mb-4 font-semibold text-brand-orange-ink">Happening today</p>}

        <ul className="mb-8 flex flex-col gap-2 text-brand-muted sm:flex-row sm:flex-wrap sm:gap-x-6 sm:gap-y-2">
          {meta.map(({ Icon, text }) => (
            <li key={text} className="flex items-center gap-2">
              <Icon className="h-4 w-4 shrink-0 text-brand-orange-ink" aria-hidden="true" />
              {text}
            </li>
          ))}
        </ul>

        <div className="mb-10 flex flex-wrap items-center gap-3">
          {!isPast && event.registerUrl && (
            <a className="btn-brand" href={event.registerUrl} target="_blank" rel="noreferrer noopener">
              Register
              <span className="sr-only"> (opens in a new tab)</span>
            </a>
          )}
          <ShareButton />
        </div>

        {isPast && (
          <p className="mb-8 font-semibold text-brand-ink">This event has finished.</p>
        )}

        {event.cover && (
          <SmartImage
            src={event.cover}
            alt=""
            className="mb-8 max-h-48 w-full max-w-3xl rounded-lg object-cover sm:max-h-80"
          />
        )}
        <Markdown>{event.body}</Markdown>

        <p className="mt-10">
          <Link className="text-link inline-flex min-h-[44px] items-center" to="/events">
            See events
          </Link>
        </p>
      </PageShell>
    </>
  )
}
