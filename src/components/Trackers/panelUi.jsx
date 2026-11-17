import { createContext, useContext, useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { RotateCcw } from 'lucide-react'
import { useJournal } from '../../context/JournalContext'
import { MONTHS_FULL } from '../../data/trackers'
import { PASTEL_CHIP_COLORS } from '../../data/panelOptions'
import { supportNoteForAnswers } from '../../data/miniQuizzes'

const PanelLayoutContext = createContext({ mode: 'page' })

export function PanelLayoutProvider({ mode = 'page', children }) {
  return (
    <PanelLayoutContext.Provider value={{ mode }}>{children}</PanelLayoutContext.Provider>
  )
}

export function usePanelLayout() {
  return useContext(PanelLayoutContext)
}

export function Chip({ active, onClick, emoji, label, colorIndex = 0, compact = false }) {
  const palette = PASTEL_CHIP_COLORS[colorIndex % PASTEL_CHIP_COLORS.length]
  return (
    <motion.button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      aria-label={label}
      whileHover={compact ? undefined : { scale: 1.03 }}
      whileTap={{ scale: 0.96 }}
      transition={{ type: 'spring', stiffness: 400, damping: 26 }}
      className={`inline-flex max-w-full items-center text-left font-medium leading-tight ${
        compact
          ? 'min-h-10 gap-1 rounded-full px-2.5 py-2 text-[11px] sm:min-h-0 sm:px-1.5 sm:py-0.5 sm:text-[10px]'
          : 'min-h-11 gap-1.5 rounded-full px-3.5 py-2.5 text-xs sm:min-h-0 sm:gap-1 sm:px-2.5 sm:py-1 sm:text-[11px]'
      } ${active ? 'shadow-sm ring-2 ring-white/50' : 'opacity-90 hover:opacity-100'}`}
      style={{
        background: active ? palette.active : palette.bg,
        color: active ? '#fff' : palette.text,
      }}
    >
      {emoji && (
        <span className={`shrink-0 leading-none ${compact ? 'text-[10px]' : 'text-[12px]'}`}>
          {emoji}
        </span>
      )}
      <span className="truncate">{label}</span>
    </motion.button>
  )
}

export function SelectChip({
  active,
  onClick,
  emoji,
  label,
  compact = false,
  wrap = false,
  className = '',
}) {
  return (
    <motion.button
      type="button"
      data-no-flip
      onClick={onClick}
      aria-pressed={active}
      aria-label={label}
      whileHover={{ scale: 1.045, y: -0.5 }}
      whileTap={{ scale: 0.94 }}
      transition={{ type: 'spring', stiffness: 420, damping: 24 }}
      className={`relative z-10 inline-flex min-h-11 max-w-full cursor-pointer items-center overflow-visible rounded-full text-left font-medium leading-tight transition-colors duration-200 sm:min-h-0 ${
        wrap ? 'whitespace-normal' : ''
      } ${
        compact
          ? 'gap-1.5 px-3.5 py-2.5 text-xs sm:gap-1 sm:px-2.5 sm:py-1 sm:text-[11px]'
          : 'gap-1.5 px-3.5 py-2.5 text-xs sm:px-3 sm:py-1.5 sm:text-xs'
      } ${
        active
          ? 'bg-[var(--accent-deep)] text-white shadow-md ring-2 ring-[var(--accent-soft)]'
          : 'bg-[var(--surface)] text-[var(--ink-soft)] shadow-sm ring-1 ring-[var(--page-edge)]/70 hover:bg-[var(--surface-strong)] hover:text-[var(--ink)] hover:ring-[var(--accent)]/40'
      } ${className}`}
    >
      <AnimatePresence initial={false}>
        {active && (
          <motion.span
            key="spark"
            className="chip-spark"
            initial={{ opacity: 0.85, scale: 0.35 }}
            animate={{ opacity: 0, scale: 1.85 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.42, ease: 'easeOut' }}
          />
        )}
        {active && (
          <motion.span
            key="check"
            initial={{ scale: 0, opacity: 0, rotate: -40 }}
            animate={{ scale: 1, opacity: 1, rotate: 0 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 480, damping: 18 }}
            className="shrink-0 text-[10px] leading-none opacity-90"
          >
            ✓
          </motion.span>
        )}
      </AnimatePresence>
      {emoji && (
        <motion.span
          layout
          className={`shrink-0 leading-none ${compact ? 'text-[12px]' : 'text-[13px]'}`}
        >
          {emoji}
        </motion.span>
      )}
      <span className={wrap ? 'whitespace-normal text-left' : 'truncate'}>{label}</span>
    </motion.button>
  )
}

export function ReviewHeading({ children, className = '', asQuestion = false }) {
  return (
    <p
      className={`${
        asQuestion
          ? 'font-display text-[12px] font-medium leading-snug text-[var(--ink)] sm:text-[13px]'
          : 'font-display text-[12px] font-medium tracking-tight text-[var(--ink)] sm:text-[13px]'
      } ${className}`}
    >
      {children}
    </p>
  )
}

export function SupportNote({ children }) {
  if (!children) return null
  return (
    <motion.p
      initial={{ opacity: 0, y: -3 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -3 }}
      className="mb-2 rounded-2xl bg-[var(--accent-glow)] px-3 py-1.5 text-[10px] font-medium leading-snug text-[var(--ink-soft)]"
    >
      {children}
    </motion.p>
  )
}

export function MotivationCard({ emoji, title, message }) {
  if (!title || !message) return null
  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.985 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -6, scale: 0.985 }}
      transition={{ type: 'spring', stiffness: 300, damping: 28 }}
      className="quote-banner rounded-[1.35rem] px-4 py-3.5 ring-1 ring-[var(--accent-soft)]/55"
    >
      <p className="font-display text-[14px] font-semibold leading-snug tracking-tight text-[var(--accent-deep)] sm:text-[15px]">
        <span className="mr-1.5">{emoji}</span>
        {title}
      </p>
      <p className="mt-2 font-body text-[12px] font-medium leading-relaxed text-[var(--ink)]/85 sm:text-[13px]">
        {message}
      </p>
    </motion.div>
  )
}

export function VibeAnchor({ children }) {
  return (
    <div className="quote-banner rounded-[1.25rem] px-3.5 py-3 ring-1 ring-[var(--page-edge)]/50">
      <p className="font-display text-[12px] font-medium italic leading-relaxed text-[var(--accent-deep)] sm:text-[13px]">
        {children}
      </p>
    </div>
  )
}

export function toggleSingle(current, id) {
  return current === id ? null : id
}

export function MiniQuiz({ questions, answers, onAnswer, title = 'Daily Mini-Quiz', wrap = false }) {
  const note = supportNoteForAnswers(answers, questions)

  return (
    <section className="shrink-0 space-y-3">
      <ReviewHeading>{title}</ReviewHeading>
      <AnimatePresence mode="wait">
        {note ? <SupportNote key={note}>{note}</SupportNote> : null}
      </AnimatePresence>
      <div className="space-y-3">
        {questions.map((q) => (
          <div key={q.key} className="space-y-1.5">
            <ReviewHeading asQuestion>{q.question}</ReviewHeading>
            <div className="flex flex-wrap gap-2 sm:gap-1.5">
              {q.options.map((opt) => (
                <SelectChip
                  key={opt.id}
                  compact
                  wrap={wrap}
                  emoji={opt.emoji}
                  label={opt.label}
                  active={answers?.[q.key] === opt.id}
                  onClick={() => onAnswer(q.key, toggleSingle(answers?.[q.key], opt.id))}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

export function ReviewPanelFrame({
  month,
  day,
  trackerId,
  notesPlaceholder = 'Quick note for today…',
  children,
}) {
  const { mode } = usePanelLayout()
  const isSheet = mode === 'sheet'

  return (
    <div
      data-no-flip
      className={`relative z-10 pb-2 ${isSheet ? 'space-y-3.5' : 'space-y-3'}`}
    >
      <div className={isSheet ? 'space-y-3.5' : 'space-y-3'}>{children}</div>
      <section className={`border-t border-[var(--page-edge)]/40 ${isSheet ? 'pt-3.5' : 'pt-3'}`}>
        <CompactDailyNotes
          trackerId={trackerId}
          month={month}
          day={day}
          tall
          accentLabel
          label="Notes"
          placeholder={notesPlaceholder}
        />
      </section>
    </div>
  )
}

export function ChipGroup({ label, children }) {
  return (
    <div className="mb-3 shrink-0">
      {label && <ReviewHeading className="mb-2">{label}</ReviewHeading>}
      <div className="flex flex-wrap gap-2 sm:gap-1.5">{children}</div>
    </div>
  )
}

export function FieldLabel({ children }) {
  return <ReviewHeading className="mb-2">{children}</ReviewHeading>
}

export function SoftInput(props) {
  return (
    <input
      {...props}
      data-no-flip
      className={`soft-field relative z-20 min-h-11 w-full rounded-2xl border-0 bg-[var(--surface)] px-3.5 py-2.5 text-base text-[var(--ink)] shadow-sm ring-1 ring-[var(--page-edge)]/60 outline-none transition duration-200 placeholder:text-[var(--ink-soft)]/70 focus:ring-2 focus:ring-[var(--accent)]/40 sm:min-h-0 sm:py-2 sm:text-sm ${props.className || ''}`}
    />
  )
}

export function SoftTextarea({ className = '', ...props }) {
  return (
    <textarea
      {...props}
      data-no-flip
      className={`soft-field relative z-20 w-full resize-y rounded-2xl border-0 bg-[var(--surface)] px-3.5 py-3 text-base leading-relaxed text-[var(--ink)] shadow-sm ring-1 ring-[var(--page-edge)]/60 outline-none transition duration-200 placeholder:text-[var(--ink-soft)]/70 focus:ring-2 focus:ring-[var(--accent)]/40 sm:px-3 sm:py-2.5 sm:text-sm ${
        className.includes('min-h-') ? '' : 'min-h-[7.5rem]'
      } ${className}`}
    />
  )
}

export function PanelShell({
  month,
  day,
  title,
  trackerId,
  onClear,
  hideNotes = false,
  children,
}) {
  const { resetPanel } = useJournal()
  const { mode } = usePanelLayout()
  const isSheet = mode === 'sheet'

  const clearToday = () => {
    if (onClear) onClear()
    else if (trackerId) resetPanel(trackerId, month, day)
  }

  return (
    <motion.div
      initial={isSheet ? false : { opacity: 0.88, y: 8, scale: 0.985 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
      className={
        isSheet
          ? 'flex min-h-0 flex-col overflow-visible bg-transparent p-0'
          : 'panel-glass flex h-full min-h-0 flex-col overflow-hidden rounded-[1.25rem] p-2.5 ring-1 ring-[var(--page-edge)]/40 sm:rounded-[1.55rem] sm:p-4'
      }
    >
      <div
        className={`flex shrink-0 items-center justify-between gap-2 ${
          isSheet ? 'mb-3' : 'mb-2.5 items-start sm:mb-3.5 sm:gap-3'
        }`}
      >
        {isSheet ? (
          <p className="font-display text-[13px] font-semibold tracking-tight text-[var(--ink)]">
            Today&apos;s log
          </p>
        ) : (
          <div className="min-w-0">
            <h4 className="truncate font-display text-lg font-semibold tracking-tight text-[var(--ink)] sm:text-[1.35rem]">
              {title}
            </h4>
            <p className="mt-0.5 font-display text-xs font-semibold tracking-tight text-[var(--accent-deep)] sm:mt-1 sm:text-[15px]">
              {MONTHS_FULL[month]} {day}
            </p>
          </div>
        )}
        <motion.button
          type="button"
          whileHover={{ scale: 1.04, rotate: -8 }}
          whileTap={{ scale: 0.94, rotate: -16 }}
          onClick={clearToday}
          aria-label="Clear today"
          className="inline-flex min-h-11 shrink-0 items-center gap-1.5 rounded-full bg-[var(--surface)] px-3.5 py-2 text-xs font-medium text-[var(--ink-soft)] shadow-sm ring-1 ring-[var(--page-edge)]/50 transition hover:text-[var(--ink)] sm:min-h-0 sm:px-2.5 sm:py-1.5 sm:text-[10px]"
        >
          <RotateCcw size={12} />
          Clear
        </motion.button>
      </div>
      <div
        data-no-flip
        className={
          isSheet
            ? 'space-y-3 overflow-visible'
            : 'min-h-0 flex-1 space-y-0.5 overflow-y-auto overscroll-contain pr-1 [-webkit-overflow-scrolling:touch]'
        }
      >
        {children}
        {!hideNotes && trackerId ? (
          <div className="mt-3 border-t border-[var(--page-edge)]/40 pt-3">
            <CompactDailyNotes trackerId={trackerId} month={month} day={day} />
          </div>
        ) : null}
      </div>
    </motion.div>
  )
}

export function CompactDailyNotes({
  trackerId,
  month,
  day,
  label = 'Notes',
  placeholder,
  tall,
  compact = false,
  accentLabel = false,
}) {
  const { getDailyNote, setDailyNote } = useJournal()
  const { mode } = usePanelLayout()
  const saved = trackerId ? getDailyNote(trackerId, month, day) : ''
  const [text, setText] = useState(saved)

  useEffect(() => {
    setText(saved)
  }, [trackerId, month, day, saved])

  const persist = (next) => {
    if (trackerId) setDailyNote(trackerId, month, day, next)
  }

  return (
    <div className="flex flex-col">
      {accentLabel || label ? (
        <ReviewHeading className={compact ? 'mb-1.5' : 'mb-2'}>{label}</ReviewHeading>
      ) : null}
      <SoftTextarea
        value={text}
        onChange={(e) => {
          const next = e.target.value
          setText(next)
          if (mode === 'sheet') persist(next)
        }}
        onBlur={() => persist(text)}
        placeholder={placeholder || 'Quick note for today...'}
        className={
          compact
            ? 'min-h-[3.75rem] sm:min-h-[4rem]'
            : tall
              ? 'min-h-[8rem]'
              : 'min-h-[6.5rem]'
        }
      />
    </div>
  )
}

export function toggleInList(list, item) {
  const arr = list || []
  return arr.includes(item) ? arr.filter((x) => x !== item) : [...arr, item]
}

export function ChoiceChips({ options, selected, onToggle, startIndex = 0, compact = false }) {
  return (
    <div className={`flex flex-wrap ${compact ? 'gap-1' : 'gap-1.5'}`}>
      {options.map((opt, i) => (
        <Chip
          key={opt.id}
          emoji={opt.emoji}
          label={opt.label}
          active={(selected || []).includes(opt.id)}
          onClick={() => onToggle(opt.id)}
          colorIndex={startIndex + i}
          compact={compact}
        />
      ))}
    </div>
  )
}
