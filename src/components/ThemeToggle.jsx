import { motion } from 'framer-motion'
import { Cloud, Heart } from 'lucide-react'
import { THEMES } from '../data/themes'
import { useJournal } from '../context/JournalContext'

export default function ThemeToggle() {
  const { theme, setTheme } = useJournal()

  return (
    <div className="inline-flex items-center gap-0.5 rounded-full bg-white/85 p-0.5 shadow-md backdrop-blur">
      {Object.values(THEMES).map((t) => {
        const active = theme === t.id
        const Icon = t.id === 'pinky' ? Heart : Cloud
        return (
          <button
            key={t.id}
            type="button"
            onClick={() => setTheme(t.id)}
            className="relative rounded-full px-2.5 py-1 text-[10px] font-bold"
            title={t.label}
          >
            {active && (
              <motion.span
                layoutId="theme-pill"
                className="absolute inset-0 rounded-full bg-[var(--accent)]"
                transition={{ type: 'spring', stiffness: 380, damping: 28 }}
              />
            )}
            <span
              className={`relative z-10 inline-flex items-center gap-1 ${
                active ? 'text-white' : 'text-[var(--ink-soft)]'
              }`}
            >
              <Icon size={11} />
              <span className="hidden sm:inline">{t.label}</span>
            </span>
          </button>
        )
      })}
    </div>
  )
}
