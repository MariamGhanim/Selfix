import SiteLayout, { Section, SoftCard } from '../components/Legal/SiteLayout'

export default function AboutPage() {
  return (
    <SiteLayout
      title="About Selfix"
      subtitle="A pastel year-in-pixels journal for gentle habit tracking, mood awareness, and everyday mental clarity."
    >
      <Section title="Our story">
        <p>
          Selfix began as a simple wish: journaling should feel like opening a favorite notebook,
          not staring at a cold dashboard. We wanted something soft enough for low-energy days and
          structured enough to reveal patterns across a whole year.
        </p>
        <p>
          Inspired by the classic “Year in Pixels” method, Selfix wraps that idea in an open-book
          experience — binder tabs, page flips, cozy chips, and a calm pastel palette — so reflecting
          on your life feels inviting instead of clinical.
        </p>
      </Section>

      <Section title="How Year in Pixels works">
        <p>
          Each day is a tiny square. You choose a color level that matches how that day felt — mood,
          energy, sleep quality, focus depth, hydration, workouts, and more. Over weeks and months,
          those squares form a mosaic you can read at a glance.
        </p>
        <div className="grid gap-3 sm:grid-cols-3">
          <SoftCard>
            <p className="text-[10px] font-bold uppercase tracking-wide text-[var(--accent-deep)]">
              Select
            </p>
            <p className="mt-1 text-sm text-[var(--ink)]">
              First click a calendar cell to choose the date without logging anything yet.
            </p>
          </SoftCard>
          <SoftCard>
            <p className="text-[10px] font-bold uppercase tracking-wide text-[var(--accent-deep)]">
              Color
            </p>
            <p className="mt-1 text-sm text-[var(--ink)]">
              Second click applies or cycles intensity so your grid stays intentional and accurate.
            </p>
          </SoftCard>
          <SoftCard>
            <p className="text-[10px] font-bold uppercase tracking-wide text-[var(--accent-deep)]">
              Reflect
            </p>
            <p className="mt-1 text-sm text-[var(--ink)]">
              Use the right page for chips, notes, and routines that explain the color behind the day.
            </p>
          </SoftCard>
        </div>
        <p>
          This visual rhythm helps mental clarity: instead of remembering every detail, you notice
          streaks, soft seasons, and gentle trends — sleep dips, focus bursts, brighter weeks — with
          less overwhelm.
        </p>
      </Section>

      <Section title="What’s inside the journal">
        <ul className="grid list-none gap-2 sm:grid-cols-2">
          {[
            'Mood & energy pixel grids with rich emoji chip logs',
            'Sleep, focus, water, fruits, vitamins, and self-care pages',
            'Gym, outings, reading, teeth, shower, and to-do trackers',
            'Focus timer that can auto-log deep-work sessions',
            'Ambient music capsule for cozy journaling sessions',
            'Pinky Cute and Soft Sky themes with the same book layout',
            'Secure account access with email verification',
            'Cloud sync so your journal follows you across devices',
          ].map((item) => (
            <li
              key={item}
              className="rounded-2xl border border-[var(--page-edge)] bg-white/70 px-3.5 py-2.5 text-sm text-[var(--ink)]"
            >
              {item}
            </li>
          ))}
        </ul>
      </Section>

      <Section title="A welcoming note">
        <SoftCard className="bg-[var(--accent-glow)]/80">
          <p>
            Whether you visit Selfix every morning or only when you need a soft landing, you are
            welcome here. There is no perfect streak requirement — only honest pixels and kind
            attention to your own season of life.
          </p>
          <p className="mt-3">
            Open the book, pick a day, and paint what is true. We are glad you are here.
          </p>
        </SoftCard>
      </Section>
    </SiteLayout>
  )
}
