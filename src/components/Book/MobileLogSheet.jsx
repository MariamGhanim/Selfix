import { useEffect } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion } from 'framer-motion'
import {
  Apple,
  Bike,
  BookOpen,
  Brain,
  Camera,
  Candy,
  CheckSquare,
  Coffee,
  Droplets,
  Dumbbell,
  Flame,
  GlassWater,
  Heart,
  Leaf,
  MapPin,
  Moon,
  MoonStar,
  Music,
  Palette,
  Pill,
  Smile,
  Sparkles,
  Star,
  Sun,
  Target,
  Wallet,
  X,
  Zap,
} from 'lucide-react'
import { useJournal } from '../../context/JournalContext'
import { PanelLayoutProvider } from '../Trackers/panelUi'
import RightPage from './RightPage'

const ICONS = {
  Star,
  Zap,
  Droplets,
  Apple,
  Candy,
  GlassWater,
  Moon,
  MoonStar,
  Target,
  Dumbbell,
  Smile,
  MapPin,
  CheckSquare,
  Pill,
  BookOpen,
  Sparkles,
  Sun,
  Heart,
  Leaf,
  Coffee,
  Music,
  Camera,
  Wallet,
  Bike,
  Palette,
  Brain,
  Flame,
}

function formatSheetDate(year, month, day) {
  return new Date(year, month, day).toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
  })
}

export default function MobileLogSheet({ open, onClose, tracker, selectedDay }) {
  const { year } = useJournal()
  const title = tracker?.title || 'Today'
  const Icon = ICONS[tracker?.icon] || Star
  const dateLabel =
    selectedDay != null
      ? formatSheetDate(year, selectedDay.month, selectedDay.day)
      : ''

  useEffect(() => {
    if (!open) return undefined
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = prev
      window.removeEventListener('keydown', onKey)
    }
  }, [open, onClose])

  if (typeof document === 'undefined') return null

  return createPortal(
    <AnimatePresence>
      {open && tracker && selectedDay ? (
        <div className="mobile-log-sheet fixed inset-0 z-[80] md:hidden" data-no-flip>
          <motion.button
            type="button"
            aria-label="Close log"
            className="absolute inset-0 bg-black/30 backdrop-blur-[2px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22 }}
            onClick={onClose}
          />

          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={`${title} for ${dateLabel}`}
            className="mobile-log-panel absolute inset-x-0 bottom-0 flex max-h-[92dvh] flex-col overflow-hidden rounded-t-[1.75rem] border border-b-0 border-[var(--page-edge)] bg-[var(--paper)] shadow-[0_-18px_48px_rgba(0,0,0,0.18)]"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', stiffness: 380, damping: 34 }}
            onClick={(e) => e.stopPropagation()}
            onPointerDown={(e) => e.stopPropagation()}
          >
            <div className="flex shrink-0 flex-col items-center px-4 pt-2.5 pb-3">
              <div className="mb-3 h-1 w-10 rounded-full bg-[var(--page-edge)]" />
              <div className="flex w-full items-start gap-3">
                <div
                  className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl text-white shadow-md"
                  style={{
                    background: tracker.tabColor,
                    boxShadow: `0 8px 18px ${tracker.tabColor}44`,
                  }}
                >
                  <Icon size={18} />
                </div>
                <div className="min-w-0 flex-1 pt-0.5">
                  <p className="truncate font-display text-lg font-semibold tracking-tight text-[var(--ink)]">
                    {title}
                  </p>
                  <p className="mt-0.5 font-display text-[13px] font-semibold text-[var(--accent-deep)]">
                    {dateLabel}
                  </p>
                  <p className="mt-1 text-[11px] font-medium text-[var(--ink-soft)]">
                    Changes save as you go
                  </p>
                </div>
                <motion.button
                  type="button"
                  whileTap={{ scale: 0.92 }}
                  onClick={onClose}
                  className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--surface)] text-[var(--ink)] shadow-md ring-1 ring-[var(--page-edge)]/60"
                  aria-label="Close and save"
                  title="Close"
                >
                  <X size={18} strokeWidth={2.25} />
                </motion.button>
              </div>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-3 pb-[max(1rem,env(safe-area-inset-bottom))] [-webkit-overflow-scrolling:touch]">
              <PanelLayoutProvider mode="sheet">
                <RightPage tracker={tracker} selectedDay={selectedDay} />
              </PanelLayoutProvider>
            </div>
          </motion.div>
        </div>
      ) : null}
    </AnimatePresence>,
    document.body,
  )
}
