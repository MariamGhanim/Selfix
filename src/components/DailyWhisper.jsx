import { AnimatePresence, motion } from 'framer-motion'
import { whisperForDate } from '../data/dailyWhispers'

export default function DailyWhisper() {
  const whisper = whisperForDate()

  return (
    <AnimatePresence mode="wait">
      <motion.p
        key={whisper.text}
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -4 }}
        transition={{ duration: 0.45, ease: 'easeOut' }}
        className="mx-auto mb-1.5 max-w-xl text-center font-display text-[11px] font-medium leading-snug tracking-tight text-[var(--ink-soft)] sm:text-[12px]"
      >
        <span className="mr-1.5" aria-hidden>
          {whisper.emoji}
        </span>
        <span className="italic text-[var(--accent-deep)]/90">{whisper.text}</span>
      </motion.p>
    </AnimatePresence>
  )
}
