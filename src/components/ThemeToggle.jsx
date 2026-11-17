import { motion } from 'framer-motion'
import { THEMES } from '../data/themes'
import { useJournal } from '../context/JournalContext'

export default function ThemeToggle() {
  const { theme, setTheme } = useJournal()
  const activeTheme = theme === 'midnight' ? 'midnight' : 'pinky'

  return (
    <div
      className="inline-flex h-9 items-center gap-0.5 rounded-full border border-[var(--page-edge)] bg-[var(--surface)] p-0.5 shadow-md backdrop-blur sm:h-auto sm:min-h-0"
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
            className="relative flex h-8 min-w-8 items-center justify-center rounded-full px-1.5 sm:h-7 sm:min-w-0 sm:px-2"
            title={t.label}
            aria-label={t.label}
            aria-pressed={active}
          >
            {active && (
              <motion.span
                layoutId="theme-pill"
                className="absolute inset-0 rounded-full bg-[var(--toggle-active)]"
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
              className={`relative z-10 ml-1 hidden text-[9px] font-bold sm:inline sm:text-[10px] ${
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
