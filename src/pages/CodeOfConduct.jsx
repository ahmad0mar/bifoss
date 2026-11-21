import PageShell from '@/components/PageShell'
import Todo, { showTodos } from '@/components/Todo'
import { site } from '@/data/site'

const sections = [
  { h: 'Our pledge', p: [`${site.name} is for everyone, whatever your experience level, background, identity, appearance, beliefs or ability. We want learning here to be friendly, open and safe.`] },
  { h: 'What we expect', list: ['Be kind and patient, especially with beginners.', 'Respect different opinions and ways of working.', 'Give feedback that is specific and helpful, and take feedback gracefully.', 'Credit other people\'s work and follow the licences of the code you use.', 'Take responsibility for mistakes and learn from them.'] },
  { h: 'What is not acceptable', list: ['Harassment, insults, threats or discrimination of any kind.', 'Unwelcome sexual attention or sexualised comments and images.', 'Sharing someone\'s private information without their permission.', 'Disrupting sessions or repeatedly ignoring a request to stop.', 'Anything else that would reasonably make others feel unsafe or unwelcome.'] },
  { h: 'Where this applies', p: ['At events, in our chat spaces, on our repositories, and whenever someone represents the club in public.'] },
]

export default function CodeOfConduct() {
  return (
    <PageShell title="Code of conduct" intro="A short, plain-language version of the Contributor Covenant that everyone in the club agrees to follow.">
      <div className="prose-bifoss">
        {sections.map((s) => (
          <section key={s.h}>
            <h2>{s.h}</h2>
            {s.p?.map((t) => <p key={t}>{t}</p>)}
            {s.list && <ul>{s.list.map((t) => <li key={t}>{t}</li>)}</ul>}
          </section>
        ))}
        <h2>Reporting and enforcement</h2>
        <p>
          If you see or experience unacceptable behaviour, tell an organiser
          {site.email ? (
            <>
              {' '}or write to{' '}
              <a className="text-link" href={`mailto:${site.email}`}>{site.email}</a>
            </>
          ) : null}
          . Reports are treated seriously and kept as private as possible.
        </p>
        {showTodos && (
          <p><Todo>decide and state the consequences organisers may apply (warning, removal from an event, removal from the club) and who reviews reports</Todo></p>
        )}
        <p>Adapted from the Contributor Covenant, version 2.1, which is licensed CC BY 4.0. Read the original at contributor-covenant.org.</p>
      </div>
    </PageShell>
  )
}
