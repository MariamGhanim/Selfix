import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { HeartHandshake, Palette, Sparkles } from 'lucide-react'

const STEPS = [
  {
    id: 'select',
    title: 'Select',
    icon: Sparkles,
    color: '#f2b8c6',
    blurb: 'Touch a quiet square on your year. No rush — just choose the day that wants your attention.',
    detail:
      'The calendar stays soft and patient. One tap holds the date open like a page marker in a favorite book.',
  },
  {
    id: 'color',
    title: 'Color',
    icon: Palette,
    color: '#d4c2ef',
    blurb: 'Paint that day in a gentle pastel — blush for mood, mint for rest, butter for bright hours.',
    detail:
      'Colors are feelings made visible. Over weeks they gather into a mosaic you can read without words.',
  },
  {
    id: 'reflect',
    title: 'Reflect',
    icon: HeartHandshake,
    color: '#b8dfc8',
    blurb: 'Whisper a note, tap a cozy chip, or leave it simple. The pixel already remembers enough.',
    detail:
      'Mini-quizzes and notes live beside the color — never as pressure, only as a soft place to land.',
  },
]

export default function HowItWorks() {
  const [active, setActive] = useState(0)
  const current = STEPS[active]
  const Icon = current.icon

  return (
    <div className="about-how relative">
      <div className="mb-6 max-w-xl">
        <p className="font-display text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--accent-deep)]">
          How it feels
        </p>
        <h2 className="mt-2 font-display text-2xl font-semibold tracking-tight text-[var(--ink)] sm:text-3xl">
          Select · Color · Reflect
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-[var(--ink-soft)] sm:text-[15px]">
          Three soft steps — less like a workflow, more like lighting a candle and opening the journal.
        </p>
      </div>

      <div className="flex flex-col gap-5 lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:items-stretch lg:gap-8">
        <div className="flex flex-col gap-2.5">
          {STEPS.map((step, index) => {
            const StepIcon = step.icon
            const isActive = index === active
            return (
              <motion.button
                key={step.id}
                type="button"
                onClick={() => setActive(index)}
                whileHover={{ x: 4 }}
                whileTap={{ scale: 0.985 }}
                className={`relative overflow-hidden rounded-[1.35rem] px-4 py-3.5 text-left transition ${
                  isActive
                    ? 'bg-[var(--surface)] shadow-lg ring-2 ring-[var(--accent)]/50'
                    : 'bg-[var(--surface)]/55 ring-1 ring-[var(--page-edge)]/45 hover:bg-[var(--surface)]/85'
                }`}
              >
                {isActive && (
                  <motion.span
                    layoutId="about-how-glow"
                    className="pointer-events-none absolute inset-0 opacity-80"
                    style={{
                      background: `radial-gradient(circle at 12% 40%, ${step.color}55, transparent 55%)`,
                    }}
                    transition={{ type: 'spring', stiffness: 360, damping: 30 }}
                  />
                )}
                <div className="relative z-10 flex items-start gap-3">
                  <span
                    className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl text-[var(--ink)] shadow-sm"
                    style={{ background: `${step.color}99` }}
                  >
                    <StepIcon size={18} />
                  </span>
                  <div className="min-w-0">
                    <p className="font-display text-[15px] font-semibold text-[var(--ink)]">
                      <span className="mr-2 text-[var(--accent-deep)]/70">{String(index + 1).padStart(2, '0')}</span>
                      {step.title}
                    </p>
                    <p className="mt-1 text-[13px] leading-relaxed text-[var(--ink-soft)]">{step.blurb}</p>
                  </div>
                </div>
              </motion.button>
            )
          })}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={current.id}
            initial={{ opacity: 0, y: 16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.98 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="about-how-stage relative flex min-h-[16rem] flex-col justify-between overflow-hidden rounded-[1.75rem] p-5 sm:min-h-[18rem] sm:p-7"
            style={{
              background: `linear-gradient(145deg, color-mix(in srgb, ${current.color} 42%, var(--surface)), var(--paper))`,
            }}
          >
            <div className="pointer-events-none absolute -right-8 -top-8 h-36 w-36 rounded-full opacity-70 blur-2xl" style={{ background: current.color }} />
            <div className="relative z-10">
              <motion.div
                initial={{ scale: 0.85, rotate: -8 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: 'spring', stiffness: 320, damping: 18 }}
                className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-[1.25rem] bg-[var(--surface)] text-[var(--ink)] shadow-md"
              >
                <Icon size={26} />
              </motion.div>
              <p className="font-display text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--accent-deep)]">
                Step {active + 1}
              </p>
              <h3 className="mt-2 font-display text-2xl font-semibold tracking-tight text-[var(--ink)]">
                {current.title}
              </h3>
              <p className="mt-3 max-w-md font-display text-[15px] leading-relaxed text-[var(--ink)]/90">
                {current.detail}
              </p>
            </div>

            <div className="relative z-10 mt-6 flex gap-1.5">
              {STEPS.map((step, index) => (
                <button
                  key={step.id}
                  type="button"
                  aria-label={`Show ${step.title}`}
                  onClick={() => setActive(index)}
                  className={`h-1.5 rounded-full transition-all ${
                    index === active ? 'w-8 bg-[var(--accent-deep)]' : 'w-3 bg-[var(--page-edge)]'
                  }`}
                />
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}
