import { motion } from 'framer-motion'
import { THEMES } from '../data/themes'
import { useJournal } from '../context/JournalContext'

export default function ThemeToggle() {
  const { theme, setTheme } = useJournal()
  const activeTheme = theme === 'midnight' ? 'midnight' : 'pinky'

  return (
    <div
      className="inline-flex items-center gap-0.5 rounded-full border border-[var(--page-edge)] bg-[var(--surface)] p-0.5 shadow-md backdrop-blur"
      role="group"
      aria-label="Color theme"
    >
      {Object.values(THEMES).map((t) => {
        const active = activeTheme === t.id
        return (
          <button
            key={t.id}
            type="button"
            onClick={() => setTheme(t.id)}
            className="relative flex h-7 items-center justify-center rounded-full px-2"
            title={t.label}
            aria-label={t.label}
            aria-pressed={active}
          >
            {active && (
              <motion.span
                layoutId="theme-pill"
                className="absolute inset-0 rounded-full bg-[var(--accent)]"
                transition={{ type: 'spring', stiffness: 380, damping: 28 }}
              />
            )}
            <span
              className={`relative z-10 h-3.5 w-3.5 rounded-full border shadow-sm ${
                active ? 'border-white/80' : 'border-[var(--page-edge)]'
              }`}
              style={{ background: t.swatch }}
            />
            <span
              className={`relative z-10 ml-1 text-[9px] font-bold sm:text-[10px] ${
                active ? 'text-white' : 'text-[var(--ink-soft)]'
              }`}
            >
              {t.short}
            </span>
          </button>
        )
      })}
    </div>
  )
}
