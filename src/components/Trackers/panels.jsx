import { useEffect, useState } from 'react'
import { Plus } from 'lucide-react'
import { useJournal } from '../../context/JournalContext'
import {
  ENERGY_BATTERY,
  ENERGY_DRAINERS,
  ENERGY_DRIVERS,
  ENERGY_PEAK_TIMES,
  FOCUS_ENVIRONMENTS,
  FOCUS_QUICK_ADDS,
  FOCUS_VIBES,
  FRUIT_FOODS,
  focusMinutesToLevel,
  OUTING_VIBES,
  RATING_DAY_TYPES,
  RATING_MEANINGFUL,
  RATING_VIBES,
  READING_CHOICES,
  READING_PAGE_BOOSTS,
  SELF_DEV_DURATIONS,
  SELF_DEV_TOPICS,
  SHOWER_ROUTINE,
  SLEEP_DURATIONS,
  SLEEP_LOCATIONS,
  SLEEP_QUALITY,
  SWEET_TREATS,
  TEETH_ROUTINE,
  VITAMIN_LIST,
  WATER_ACTIONS,
  WATER_PERKS,
  WORKOUT_CHIPS,
  WORKOUT_DURATIONS,
} from '../../data/panelOptions'
import {
  Chip,
  ChipGroup,
  ChoiceChips,
  CompactDailyNotes,
  FieldLabel,
  MiniQuiz,
  PanelShell,
  ReviewHeading,
  ReviewPanelFrame,
  SelectChip,
  SoftInput,
  toggleInList,
  toggleSingle,
} from './panelUi'
import {
  FRUITS_QUIZ,
  OUTINGS_QUIZ,
  READING_QUIZ,
  SHOWER_QUIZ,
  SLEEP_QUIZ,
  STUDY_QUIZ,
  SWEETS_QUIZ,
  TEETH_QUIZ,
  VITAMINS_QUIZ,
  WATER_QUIZ,
  WORKOUT_QUIZ,
} from '../../data/miniQuizzes'
import TodoList from './TodoList'

function quizAnswers(data) {
  return { q1: data.q1 ?? null, q2: data.q2 ?? null, q3: data.q3 ?? null }
}

function setQuizAnswer(patch, key, value) {
  patch({ [key]: value })
}

function usePanel(trackerId, month, day) {
  const { getPanel, setPanel } = useJournal()
  const data = getPanel(trackerId, month, day)
  const patch = (next, pixelValue) => {
    setPanel(trackerId, month, day, next, pixelValue)
  }
  return { data, patch }
}

const RATING_VIBE_IDS = new Set(RATING_VIBES.map((v) => v.id))

export function RatingPanel({ month, day }) {
  const { data, patch } = usePanel('rating', month, day)
  const [highlight, setHighlight] = useState(data.highlight || '')
  const [limitHint, setLimitHint] = useState(false)
  const choices = (data.choices || []).filter((id) => RATING_VIBE_IDS.has(id))

  useEffect(() => {
    setHighlight(data.highlight || '')
  }, [month, day, data.highlight])

  useEffect(() => {
    const raw = data.choices || []
    const cleaned = raw.filter((id) => RATING_VIBE_IDS.has(id))
    if (cleaned.length !== raw.length) patch({ choices: cleaned })
  }, [month, day, data.choices, patch])

  const toggleVibe = (id) => {
    if (choices.includes(id)) {
      setLimitHint(false)
      patch({ choices: choices.filter((x) => x !== id) })
      return
    }
    if (choices.length >= 3) {
      setLimitHint(true)
      window.setTimeout(() => setLimitHint(false), 1600)
      return
    }
    setLimitHint(false)
    patch({ choices: [...choices, id] })
  }

  return (
    <PanelShell
      month={month}
      day={day}
      title="End-of-Day Review"
      trackerId="rating"
      hideNotes
    >
      <div
        data-no-flip
        className="relative z-10 flex h-full min-h-0 flex-col gap-1.5 overflow-hidden"
      >
        <section className="shrink-0">
          <div className="mb-0.5 flex items-end justify-between gap-2">
            <ReviewHeading>How would you sum up today?</ReviewHeading>
            <span
              className={`text-[9px] font-bold ${
                choices.length >= 3 ? 'text-[var(--accent-deep)]' : 'text-[var(--ink-soft)]'
              }`}
            >
              {choices.length}/3 vibes
            </span>
          </div>
          <p className="mb-1 text-[9px] text-[var(--ink-soft)]">
            Pick up to 3 vibe tags — tap again to remove
          </p>
          {limitHint && (
            <p className="mb-1 rounded-xl bg-[#fde8ee] px-2 py-1 text-[9px] font-semibold text-[#b8385c]">
              You already picked 3. Deselect one first, then choose another.
            </p>
          )}
          <div className="flex flex-wrap gap-1">
            {RATING_VIBES.map((opt) => (
              <SelectChip
                key={opt.id}
                compact
                emoji={opt.emoji}
                label={opt.label}
                active={choices.includes(opt.id)}
                onClick={() => toggleVibe(opt.id)}
              />
            ))}
          </div>
        </section>

        <section className="shrink-0 rounded-2xl border border-[var(--page-edge)]/60 bg-[var(--accent-glow)]/70 px-2 py-1.5">
          <ReviewHeading className="mb-1">Quick Day Check-in</ReviewHeading>
          <div className="space-y-1.5">
            <div>
              <ReviewHeading className="mb-0.5 !text-[10px] sm:!text-[11px]">Day Type:</ReviewHeading>
              <div className="flex flex-wrap gap-1">
                {RATING_DAY_TYPES.map((opt) => (
                  <SelectChip
                    key={opt.id}
                    compact
                    emoji={opt.emoji}
                    label={opt.label}
                    active={data.dayType === opt.id}
                    onClick={() => patch({ dayType: toggleSingle(data.dayType, opt.id) })}
                  />
                ))}
              </div>
            </div>
            <div>
              <ReviewHeading className="mb-0.5 !text-[10px] sm:!text-[11px]">
                Did today feel meaningful?
              </ReviewHeading>
              <div className="flex flex-wrap gap-1">
                {RATING_MEANINGFUL.map((opt) => (
                  <SelectChip
                    key={opt.id}
                    compact
                    emoji={opt.emoji}
                    label={opt.label}
                    active={data.meaningful === opt.id}
                    onClick={() =>
                      patch({ meaningful: toggleSingle(data.meaningful, opt.id) })
                    }
                  />
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="shrink-0">
          <ReviewHeading className="mb-1">Highlight of the Day</ReviewHeading>
          <SoftInput
            value={highlight}
            onChange={(e) => setHighlight(e.target.value)}
            onBlur={() => patch({ highlight: highlight.trim() })}
            onKeyDown={(e) => e.key === 'Enter' && patch({ highlight: highlight.trim() })}
            placeholder="Best moment or small win today…"
            className="!py-1.5 !text-[11px]"
          />
        </section>

        <section className="flex min-h-0 flex-1 flex-col border-t border-[var(--page-edge)]/50 pt-1.5">
          <CompactDailyNotes
            month={month}
            day={day}
            tall
            accentLabel
            label="Daily Journal / Brain Dump"
            placeholder="Brain dump, feelings, unfinished thoughts…"
          />
        </section>
      </div>
    </PanelShell>
  )
}

const ENERGY_DRIVER_IDS = new Set(ENERGY_DRIVERS.map((d) => d.id))
const ENERGY_DRAINER_IDS = new Set(ENERGY_DRAINERS.map((d) => d.id))

export function EnergyPanel({ month, day }) {
  const { data, patch } = usePanel('energy', month, day)

  useEffect(() => {
    const legacy = data.choices || []
    if (!legacy.length) return
    const hasNew =
      (data.drivers || []).length > 0 ||
      (data.drainers || []).length > 0 ||
      data.peakTime != null ||
      data.battery != null
    if (hasNew) {
      patch({ choices: [] })
      return
    }
    patch({
      drivers: legacy.filter((id) => ENERGY_DRIVER_IDS.has(id)),
      drainers: legacy.filter((id) => ENERGY_DRAINER_IDS.has(id)),
      choices: [],
    })
  }, [month, day])

  const drivers = (data.drivers || []).filter((id) => ENERGY_DRIVER_IDS.has(id))
  const drainers = (data.drainers || []).filter((id) => ENERGY_DRAINER_IDS.has(id))

  return (
    <PanelShell month={month} day={day} title="Energy check-in" trackerId="energy" hideNotes>
      <div
        data-no-flip
        className="relative z-10 flex h-full min-h-0 flex-col gap-1.5 overflow-hidden"
      >
        <section className="shrink-0">
          <ReviewHeading className="mb-1">Energy Boosters (Drivers)</ReviewHeading>
          <div className="flex flex-wrap gap-1">
            {ENERGY_DRIVERS.map((opt) => (
              <SelectChip
                key={opt.id}
                compact
                emoji={opt.emoji}
                label={opt.label}
                active={drivers.includes(opt.id)}
                onClick={() => patch({ drivers: toggleInList(drivers, opt.id), choices: [] })}
              />
            ))}
          </div>
        </section>

        <section className="shrink-0">
          <ReviewHeading className="mb-1">Energy Drainers</ReviewHeading>
          <div className="flex flex-wrap gap-1">
            {ENERGY_DRAINERS.map((opt) => (
              <SelectChip
                key={opt.id}
                compact
                emoji={opt.emoji}
                label={opt.label}
                active={drainers.includes(opt.id)}
                onClick={() => patch({ drainers: toggleInList(drainers, opt.id), choices: [] })}
              />
            ))}
          </div>
        </section>

        <section className="shrink-0 rounded-2xl border border-[var(--page-edge)]/60 bg-[var(--accent-glow)]/70 px-2 py-1.5">
          <ReviewHeading className="mb-1">Quick Energy Check</ReviewHeading>
          <div className="space-y-1.5">
            <div>
              <ReviewHeading className="mb-0.5 !text-[10px] sm:!text-[11px]">
                Peak Energy Time:
              </ReviewHeading>
              <div className="flex flex-wrap gap-1">
                {ENERGY_PEAK_TIMES.map((opt) => (
                  <SelectChip
                    key={opt.id}
                    compact
                    emoji={opt.emoji}
                    label={opt.label}
                    active={data.peakTime === opt.id}
                    onClick={() => patch({ peakTime: toggleSingle(data.peakTime, opt.id) })}
                  />
                ))}
              </div>
            </div>
            <div>
              <ReviewHeading className="mb-0.5 !text-[10px] sm:!text-[11px]">
                Social & Mental Battery:
              </ReviewHeading>
              <div className="flex flex-wrap gap-1">
                {ENERGY_BATTERY.map((opt) => (
                  <SelectChip
                    key={opt.id}
                    compact
                    emoji={opt.emoji}
                    label={opt.label}
                    active={data.battery === opt.id}
                    onClick={() => patch({ battery: toggleSingle(data.battery, opt.id) })}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="flex min-h-0 flex-1 flex-col border-t border-[var(--page-edge)]/50 pt-1.5">
          <CompactDailyNotes
            month={month}
            day={day}
            tall
            accentLabel
            label="Daily Notes"
            placeholder="How did your energy feel today…"
          />
        </section>
      </div>
    </PanelShell>
  )
}

export function ShowerPanel({ month, day }) {
  const { data, patch } = usePanel('shower', month, day)

  return (
    <PanelShell month={month} day={day} title="Shower & hair care" trackerId="shower" hideNotes>
      <ReviewPanelFrame month={month} day={day} notesPlaceholder="Shower thoughts, hair notes…">
        <section>
          <ReviewHeading className="mb-1">Routine details</ReviewHeading>
          <div className="flex flex-wrap gap-1">
            {SHOWER_ROUTINE.map((opt) => (
              <SelectChip
                key={opt.id}
                compact
                emoji={opt.emoji}
                label={opt.label}
                active={(data.choices || []).includes(opt.id)}
                onClick={() => patch({ choices: toggleInList(data.choices, opt.id) })}
              />
            ))}
          </div>
        </section>
        <MiniQuiz
          questions={SHOWER_QUIZ}
          answers={quizAnswers(data)}
          onAnswer={(key, value) => setQuizAnswer(patch, key, value)}
        />
      </ReviewPanelFrame>
    </PanelShell>
  )
}

export function FruitsPanel({ month, day }) {
  const { data, patch } = usePanel('fruits', month, day)
  const servings = data.servings || 0

  const setServings = (n) => {
    const next = Math.max(0, n)
    patch({ servings: next }, next === 0 ? null : Math.min(4, next))
  }

  return (
    <PanelShell month={month} day={day} title="Fruits & vegetables" trackerId="fruits" hideNotes>
      <ReviewPanelFrame month={month} day={day} notesPlaceholder="Fruit & veggie notes…">
        <section>
          <ReviewHeading className="mb-1">What I ate</ReviewHeading>
          <div className="flex flex-wrap gap-1">
            {FRUIT_FOODS.map((opt) => (
              <SelectChip
                key={opt.id}
                compact
                emoji={opt.emoji}
                label={opt.label}
                active={(data.choices || []).includes(opt.id)}
                onClick={() => {
                  const adding = !(data.choices || []).includes(opt.id)
                  const choices = toggleInList(data.choices, opt.id)
                  const nextServings = Math.max(0, adding ? servings + 1 : servings - 1)
                  patch(
                    { choices, servings: nextServings },
                    nextServings === 0 ? null : Math.min(4, nextServings),
                  )
                }}
              />
            ))}
          </div>
          <div className="mt-1.5 flex flex-wrap items-center gap-1">
            <SelectChip compact emoji="➕" label="+1 Serving" active={false} onClick={() => setServings(servings + 1)} />
            <span className="rounded-full bg-[var(--surface)] px-2 py-1 text-[10px] font-bold text-[var(--ink)]">
              {servings} serving{servings === 1 ? '' : 's'}
            </span>
            {servings > 0 && (
              <SelectChip compact emoji="➖" label="-1" active={false} onClick={() => setServings(servings - 1)} />
            )}
          </div>
        </section>
        <MiniQuiz
          questions={FRUITS_QUIZ}
          answers={quizAnswers(data)}
          onAnswer={(key, value) => setQuizAnswer(patch, key, value)}
        />
      </ReviewPanelFrame>
    </PanelShell>
  )
}

export function SweetsPanel({ month, day }) {
  const { data, patch } = usePanel('sweets', month, day)
  const count = data.count || 0

  const setCount = (n) => {
    const next = Math.max(0, n)
    patch({ count: next }, next === 0 ? null : Math.min(4, next))
  }

  return (
    <PanelShell month={month} day={day} title="Sweets & sugar" trackerId="sweets" hideNotes>
      <ReviewPanelFrame month={month} day={day} notesPlaceholder="Sweet tooth notes…">
        <section>
          <ReviewHeading className="mb-1">Treats</ReviewHeading>
          <div className="flex flex-wrap gap-1">
            {SWEET_TREATS.map((opt) => (
              <SelectChip
                key={opt.id}
                compact
                emoji={opt.emoji}
                label={opt.label}
                active={(data.choices || []).includes(opt.id)}
                onClick={() => {
                  const adding = !(data.choices || []).includes(opt.id)
                  const choices = toggleInList(data.choices, opt.id)
                  const nextCount = Math.max(0, adding ? count + 1 : count - 1)
                  patch({ choices, count: nextCount }, nextCount === 0 ? null : Math.min(4, nextCount))
                }}
              />
            ))}
          </div>
          <div className="mt-1.5 flex flex-wrap items-center gap-1">
            <SelectChip compact emoji="➕" label="+1 Sweet" active={false} onClick={() => setCount(count + 1)} />
            <span className="rounded-full bg-[var(--surface)] px-2 py-1 text-[10px] font-bold text-[var(--ink)]">
              {count} treat{count === 1 ? '' : 's'}
            </span>
            {count > 0 && (
              <SelectChip compact emoji="➖" label="-1" active={false} onClick={() => setCount(count - 1)} />
            )}
          </div>
        </section>
        <MiniQuiz
          questions={SWEETS_QUIZ}
          answers={quizAnswers(data)}
          onAnswer={(key, value) => setQuizAnswer(patch, key, value)}
        />
      </ReviewPanelFrame>
    </PanelShell>
  )
}

export function WaterPanel({ month, day }) {
  const { data, patch } = usePanel('water', month, day)
  const cups = data.cups || 0
  const ml = data.ml || 0

  const applyAction = (action) => {
    const nextCups = Math.max(0, cups + action.cups)
    const nextMl = Math.max(0, ml + action.ml)
    patch({ cups: nextCups, ml: nextMl }, nextCups === 0 ? null : Math.min(8, nextCups))
  }

  return (
    <PanelShell month={month} day={day} title="Water intake" trackerId="water" hideNotes>
      <ReviewPanelFrame month={month} day={day} notesPlaceholder="Hydration notes…">
        <section>
          <div className="mb-1 rounded-full bg-[var(--surface)] px-3 py-1 text-center text-[11px] font-bold text-[var(--ink)]">
            {cups} cups · {ml} ml
          </div>
          <ReviewHeading className="mb-1">Hydration controls</ReviewHeading>
          <div className="mb-1.5 flex flex-wrap gap-1">
            {WATER_ACTIONS.map((opt) => (
              <SelectChip
                key={opt.id}
                compact
                emoji={opt.emoji}
                label={opt.label}
                active={false}
                onClick={() => applyAction(opt)}
              />
            ))}
          </div>
          <ReviewHeading className="mb-1">Infusions & perks</ReviewHeading>
          <div className="flex flex-wrap gap-1">
            {WATER_PERKS.map((opt) => (
              <SelectChip
                key={opt.id}
                compact
                emoji={opt.emoji}
                label={opt.label}
                active={(data.choices || []).includes(opt.id)}
                onClick={() => patch({ choices: toggleInList(data.choices, opt.id) })}
              />
            ))}
          </div>
        </section>
        <MiniQuiz
          questions={WATER_QUIZ}
          answers={quizAnswers(data)}
          onAnswer={(key, value) => setQuizAnswer(patch, key, value)}
        />
      </ReviewPanelFrame>
    </PanelShell>
  )
}

export function VitaminsPanel({ month, day }) {
  const { data, patch } = usePanel('vitamins', month, day)
  const [customText, setCustomText] = useState('')

  const syncLevel = (choices, custom) => {
    const total = (choices?.length || 0) + (custom?.length || 0)
    if (total === 0) return null
    if (total >= 3) return 1
    return 2
  }

  const addCustom = () => {
    const name = customText.trim()
    if (!name) return
    if ((data.custom || []).includes(name)) {
      setCustomText('')
      return
    }
    const custom = [...(data.custom || []), name]
    patch({ custom }, syncLevel(data.choices, custom))
    setCustomText('')
  }

  return (
    <PanelShell month={month} day={day} title="Vitamins & supplements" trackerId="vitamins" hideNotes>
      <ReviewPanelFrame month={month} day={day} notesPlaceholder="Supplement notes…">
        <section>
          <ReviewHeading className="mb-1">Today&apos;s stack</ReviewHeading>
          <div className="flex flex-wrap gap-1">
            {VITAMIN_LIST.map((opt) => (
              <SelectChip
                key={opt.id}
                compact
                emoji={opt.emoji}
                label={opt.label}
                active={(data.choices || []).includes(opt.id)}
                onClick={() => {
                  const choices = toggleInList(data.choices, opt.id)
                  patch({ choices }, syncLevel(choices, data.custom))
                }}
              />
            ))}
            {(data.custom || []).map((name) => (
              <SelectChip
                key={name}
                compact
                emoji="➕"
                label={`${name} ×`}
                active
                onClick={() => {
                  const custom = (data.custom || []).filter((c) => c !== name)
                  patch({ custom }, syncLevel(data.choices, custom))
                }}
              />
            ))}
          </div>
          <div className="mt-1.5 flex gap-1.5">
            <SoftInput
              value={customText}
              onChange={(e) => setCustomText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addCustom()}
              placeholder="+ Add custom supplement"
              className="!py-1.5 !text-[11px]"
            />
            <button
              type="button"
              data-no-flip
              onClick={addCustom}
              className="rounded-xl bg-[var(--accent-deep)] px-2.5 text-white"
            >
              <Plus size={14} />
            </button>
          </div>
        </section>
        <MiniQuiz
          questions={VITAMINS_QUIZ}
          answers={quizAnswers(data)}
          onAnswer={(key, value) => setQuizAnswer(patch, key, value)}
        />
      </ReviewPanelFrame>
    </PanelShell>
  )
}

export function StudyPanel({ month, day }) {
  const { data, patch } = usePanel('study', month, day)

  const setDuration = (id) => {
    const block = SELF_DEV_DURATIONS.find((d) => d.id === id)
    const next = data.duration === id ? null : id
    const level = next ? block?.level ?? 1 : data.choices?.length ? 1 : null
    patch({ duration: next }, level)
  }

  return (
    <PanelShell month={month} day={day} title="Self-development" trackerId="study" hideNotes>
      <ReviewPanelFrame month={month} day={day} notesPlaceholder="Growth notes & takeaways…">
        <section>
          <ReviewHeading className="mb-1">Topics</ReviewHeading>
          <div className="mb-1.5 flex flex-wrap gap-1">
            {SELF_DEV_TOPICS.map((opt) => (
              <SelectChip
                key={opt.id}
                compact
                emoji={opt.emoji}
                label={opt.label}
                active={(data.choices || []).includes(opt.id)}
                onClick={() => {
                  const choices = toggleInList(data.choices, opt.id)
                  const block = SELF_DEV_DURATIONS.find((d) => d.id === data.duration)
                  const level = block?.level ?? (choices.length ? 1 : null)
                  patch({ choices }, level)
                }}
              />
            ))}
          </div>
          <ReviewHeading className="mb-1">Duration</ReviewHeading>
          <div className="flex flex-wrap gap-1">
            {SELF_DEV_DURATIONS.map((d) => (
              <SelectChip
                key={d.id}
                compact
                emoji={d.emoji}
                label={d.label}
                active={data.duration === d.id}
                onClick={() => setDuration(d.id)}
              />
            ))}
          </div>
        </section>
        <MiniQuiz
          questions={STUDY_QUIZ}
          answers={quizAnswers(data)}
          onAnswer={(key, value) => setQuizAnswer(patch, key, value)}
        />
      </ReviewPanelFrame>
    </PanelShell>
  )
}

export function ReadingPanel({ month, day }) {
  const { data, patch } = usePanel('reading', month, day)
  const [book, setBook] = useState(data.book || '')
  const pages = data.pages || 0

  useEffect(() => {
    setBook(data.book || '')
  }, [month, day, data.book])

  const levelFromPages = (p) => {
    if (p <= 0) return null
    if (p < 10) return 2
    if (p < 25) return 3
    if (p < 50) return 4
    return 5
  }

  const addPages = (n) => {
    const next = Math.max(0, pages + n)
    patch({ pages: next }, levelFromPages(next))
  }

  return (
    <PanelShell month={month} day={day} title="Reading log" trackerId="reading" hideNotes>
      <ReviewPanelFrame month={month} day={day} notesPlaceholder="Reading reflections…">
        <section>
          <ReviewHeading className="mb-1">Current book</ReviewHeading>
          <SoftInput
            value={book}
            onChange={(e) => setBook(e.target.value)}
            onBlur={() => patch({ book: book.trim() })}
            placeholder="Current book title & author"
            className="mb-1.5 !py-1.5 !text-[11px]"
          />
          <ReviewHeading className="mb-1">Genre & session</ReviewHeading>
          <div className="mb-1.5 flex flex-wrap gap-1">
            {READING_CHOICES.map((opt) => (
              <SelectChip
                key={opt.id}
                compact
                emoji={opt.emoji}
                label={opt.label}
                active={(data.choices || []).includes(opt.id)}
                onClick={() => patch({ choices: toggleInList(data.choices, opt.id) })}
              />
            ))}
          </div>
          <ReviewHeading className="mb-1">Fast pages</ReviewHeading>
          <div className="flex flex-wrap items-center gap-1">
            <span className="rounded-full bg-[var(--surface)] px-2 py-1 text-[10px] font-bold">{pages} pages</span>
            {READING_PAGE_BOOSTS.map((b) => (
              <SelectChip
                key={b.id}
                compact
                emoji={b.emoji}
                label={b.label}
                active={false}
                onClick={() => addPages(b.pages)}
              />
            ))}
            {pages > 0 && (
              <SelectChip compact emoji="↩️" label="-5 pages" active={false} onClick={() => addPages(-5)} />
            )}
          </div>
        </section>
        <MiniQuiz
          questions={READING_QUIZ}
          answers={quizAnswers(data)}
          onAnswer={(key, value) => setQuizAnswer(patch, key, value)}
        />
      </ReviewPanelFrame>
    </PanelShell>
  )
}

export function TeethPanel({ month, day }) {
  const { data, patch } = usePanel('teeth', month, day)

  const syncLevel = (choices) => {
    const brushes = choices.filter((r) => r === 'morning' || r === 'night' || r === 'post-meal').length
    if (brushes >= 2) return 2
    if (brushes === 1) return 1
    if (choices.length > 0) return 1
    return null
  }

  return (
    <PanelShell month={month} day={day} title="Teeth brushing" trackerId="teeth" hideNotes>
      <ReviewPanelFrame month={month} day={day} notesPlaceholder="Dental care notes…">
        <section>
          <ReviewHeading className="mb-1">Oral care routine</ReviewHeading>
          <div className="flex flex-wrap gap-1">
            {TEETH_ROUTINE.map((opt) => (
              <SelectChip
                key={opt.id}
                compact
                emoji={opt.emoji}
                label={opt.label}
                active={(data.choices || []).includes(opt.id)}
                onClick={() => {
                  const choices = toggleInList(data.choices, opt.id)
                  patch({ choices }, syncLevel(choices))
                }}
              />
            ))}
          </div>
        </section>
        <MiniQuiz
          questions={TEETH_QUIZ}
          answers={quizAnswers(data)}
          onAnswer={(key, value) => setQuizAnswer(patch, key, value)}
        />
      </ReviewPanelFrame>
    </PanelShell>
  )
}

export function WorkoutPanel({ month, day }) {
  const { data, patch } = usePanel('workout', month, day)

  const syncLevel = (choices) => {
    if (!choices.length) return null
    if (choices.includes('rest') && choices.length === 1) return 0
    const levels = choices
      .map((id) => WORKOUT_CHIPS.find((w) => w.id === id)?.level ?? 0)
      .filter((n) => n > 0)
    if (!levels.length) return null
    return Math.max(...levels)
  }

  return (
    <PanelShell month={month} day={day} title="Gym & stretching" trackerId="workout" hideNotes>
      <ReviewPanelFrame month={month} day={day} notesPlaceholder="Workout notes…">
        <section>
          <ReviewHeading className="mb-1">Workout</ReviewHeading>
          <div className="mb-1.5 flex flex-wrap gap-1">
            {WORKOUT_CHIPS.map((opt) => (
              <SelectChip
                key={opt.id}
                compact
                emoji={opt.emoji}
                label={opt.label}
                active={(data.choices || []).includes(opt.id)}
                onClick={() => {
                  const choices = toggleInList(data.choices, opt.id)
                  patch({ choices }, syncLevel(choices))
                }}
              />
            ))}
          </div>
          <ReviewHeading className="mb-1">Duration</ReviewHeading>
          <div className="flex flex-wrap gap-1">
            {WORKOUT_DURATIONS.map((d) => (
              <SelectChip
                key={d.id}
                compact
                emoji={d.emoji}
                label={d.label}
                active={data.duration === d.id}
                onClick={() => patch({ duration: toggleSingle(data.duration, d.id) })}
              />
            ))}
          </div>
        </section>
        <MiniQuiz
          questions={WORKOUT_QUIZ}
          answers={quizAnswers(data)}
          onAnswer={(key, value) => setQuizAnswer(patch, key, value)}
        />
      </ReviewPanelFrame>
    </PanelShell>
  )
}

export function FocusPanel({ month, day }) {
  const { data, patch } = usePanel('focus', month, day)
  const [customHours, setCustomHours] = useState('')
  const minutes = data.minutes || 0
  const hours = (minutes / 60).toFixed(minutes % 60 === 0 ? 0 : 1)

  const setMinutes = (nextMinutes) => {
    const m = Math.max(0, nextMinutes)
    patch({ minutes: m }, focusMinutesToLevel(m))
  }

  const addCustom = () => {
    const h = parseFloat(customHours)
    if (!Number.isFinite(h) || h <= 0) return
    setMinutes(minutes + Math.round(h * 60))
    setCustomHours('')
  }

  return (
    <PanelShell month={month} day={day} title="Focus & deep work" trackerId="focus">
      <div className="mb-2 rounded-full bg-[var(--surface)] px-3 py-1.5 text-center text-xs font-bold text-[var(--ink)]">
        Today: {minutes} min · {hours}h logged
      </div>

      <ChipGroup label="Quick logger">
        <div className="flex flex-wrap gap-1.5">
          {FOCUS_QUICK_ADDS.map((q, i) => (
            <Chip
              key={q.id}
              emoji={q.emoji}
              label={q.label}
              active={false}
              colorIndex={i}
              onClick={() => setMinutes(minutes + q.minutes)}
            />
          ))}
          {minutes > 0 && (
            <Chip
              emoji="↩️"
              label="-25m"
              active={false}
              colorIndex={7}
              onClick={() => setMinutes(minutes - 25)}
            />
          )}
        </div>
      </ChipGroup>

      <FieldLabel>Custom focus hours</FieldLabel>
      <div className="mb-2.5 flex gap-1.5">
        <SoftInput
          type="number"
          min="0"
          step="0.25"
          value={customHours}
          onChange={(e) => setCustomHours(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && addCustom()}
          placeholder="e.g. 1.5 hours"
        />
        <button
          type="button"
          onClick={addCustom}
          className="rounded-xl bg-[var(--accent-deep)] px-2.5 text-white shadow"
          title="Add custom hours"
        >
          <Plus size={14} />
        </button>
      </div>

      <ChipGroup label="Focus quality & vibe">
        <ChoiceChips
          options={FOCUS_VIBES}
          selected={data.vibes}
          onToggle={(id) => patch({ vibes: toggleInList(data.vibes, id) })}
        />
      </ChipGroup>

      <ChipGroup label="Environment & setup">
        <ChoiceChips
          options={FOCUS_ENVIRONMENTS}
          selected={data.environments}
          onToggle={(id) => patch({ environments: toggleInList(data.environments, id) })}
          startIndex={3}
        />
      </ChipGroup>
    </PanelShell>
  )
}

export function SleepPanel({ month, day }) {
  const { data, patch } = usePanel('sleep', month, day)
  const [sleepTime, setSleepTime] = useState(data.sleepTime || '')
  const [wakeTime, setWakeTime] = useState(data.wakeTime || '')

  useEffect(() => {
    setSleepTime(data.sleepTime || '')
    setWakeTime(data.wakeTime || '')
  }, [month, day, data.sleepTime, data.wakeTime])

  const setDuration = (id) => {
    const next = data.duration === id ? null : id
    const block = SLEEP_DURATIONS.find((d) => d.id === next)
    patch({ duration: next }, block?.level ?? null)
  }

  return (
    <PanelShell month={month} day={day} title="Sleep & rest" trackerId="sleep" hideNotes>
      <ReviewPanelFrame month={month} day={day} notesPlaceholder="Sleep dreams & notes…">
        <section>
          <ReviewHeading className="mb-1">Sleep duration</ReviewHeading>
          <div className="mb-1.5 flex flex-wrap gap-1">
            {SLEEP_DURATIONS.map((d) => (
              <SelectChip
                key={d.id}
                compact
                emoji={d.emoji}
                label={d.label}
                active={data.duration === d.id}
                onClick={() => setDuration(d.id)}
              />
            ))}
          </div>
          <div className="mb-1.5 grid grid-cols-2 gap-1.5">
            <div>
              <ReviewHeading className="mb-0.5 !text-[10px]">Sleep Time</ReviewHeading>
              <SoftInput
                type="time"
                value={sleepTime}
                onChange={(e) => setSleepTime(e.target.value)}
                onBlur={() => patch({ sleepTime })}
                className="!py-1 !text-[11px]"
              />
            </div>
            <div>
              <ReviewHeading className="mb-0.5 !text-[10px]">Wake Up</ReviewHeading>
              <SoftInput
                type="time"
                value={wakeTime}
                onChange={(e) => setWakeTime(e.target.value)}
                onBlur={() => patch({ wakeTime })}
                className="!py-1 !text-[11px]"
              />
            </div>
          </div>
          <ReviewHeading className="mb-1">Location & quality</ReviewHeading>
          <div className="flex flex-wrap gap-1">
            {SLEEP_LOCATIONS.map((opt) => (
              <SelectChip
                key={opt.id}
                compact
                emoji={opt.emoji}
                label={opt.label}
                active={(data.locations || []).includes(opt.id)}
                onClick={() => patch({ locations: toggleInList(data.locations, opt.id) })}
              />
            ))}
            {SLEEP_QUALITY.map((opt) => (
              <SelectChip
                key={opt.id}
                compact
                emoji={opt.emoji}
                label={opt.label}
                active={(data.quality || []).includes(opt.id)}
                onClick={() => patch({ quality: toggleInList(data.quality, opt.id) })}
              />
            ))}
          </div>
        </section>
        <MiniQuiz
          questions={SLEEP_QUIZ}
          answers={quizAnswers(data)}
          onAnswer={(key, value) => setQuizAnswer(patch, key, value)}
        />
      </ReviewPanelFrame>
    </PanelShell>
  )
}

export function OutingsPanel({ month, day }) {
  const { data, patch } = usePanel('outings', month, day)
  const [withWho, setWithWho] = useState(data.withWho || '')

  useEffect(() => {
    setWithWho(data.withWho || '')
  }, [month, day, data.withWho])

  const saveWithWho = (value) => {
    const next = value.trim()
    setWithWho(next)
    const choices = data.choices || []
    const level = choices.length ? 2 : next ? 1 : null
    patch({ withWho: next }, level)
  }

  return (
    <PanelShell month={month} day={day} title="Outings & hangouts" trackerId="outings" hideNotes>
      <ReviewPanelFrame month={month} day={day} notesPlaceholder="Outing memories…">
        <section>
          <ReviewHeading className="mb-1">Who I was with</ReviewHeading>
          <SoftInput
            value={withWho}
            onChange={(e) => setWithWho(e.target.value)}
            onBlur={() => saveWithWho(withWho)}
            onKeyDown={(e) => e.key === 'Enter' && saveWithWho(withWho)}
            placeholder="Who I was with"
            className="mb-1.5 !py-1.5 !text-[11px]"
          />
          <ReviewHeading className="mb-1">Outing vibe</ReviewHeading>
          <div className="flex flex-wrap gap-1">
            {OUTING_VIBES.map((opt) => (
              <SelectChip
                key={opt.id}
                compact
                emoji={opt.emoji}
                label={opt.label}
                active={(data.choices || []).includes(opt.id)}
                onClick={() => {
                  const choices = toggleInList(data.choices, opt.id)
                  const who = (data.withWho || withWho || '').trim()
                  patch({ choices }, choices.length ? 2 : who ? 1 : null)
                }}
              />
            ))}
          </div>
        </section>
        <MiniQuiz
          questions={OUTINGS_QUIZ}
          answers={quizAnswers(data)}
          onAnswer={(key, value) => setQuizAnswer(patch, key, value)}
        />
      </ReviewPanelFrame>
    </PanelShell>
  )
}

export function TasksPanel({ month, day }) {
  const { setTodos } = useJournal()

  const clearToday = () => {
    setTodos(month, day, [], null)
  }

  return (
    <PanelShell month={month} day={day} title="To-Do Checklist" onClear={clearToday}>
      <TodoList month={month} day={day} embedded />
    </PanelShell>
  )
}
