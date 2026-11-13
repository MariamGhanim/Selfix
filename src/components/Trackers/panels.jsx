import { useEffect, useState } from 'react'
import { Plus } from 'lucide-react'
import { useJournal } from '../../context/JournalContext'
import {
  ENERGY_DRAINERS,
  ENERGY_DRIVERS,
  FOCUS_ENVIRONMENTS,
  FOCUS_QUICK_ADDS,
  FOCUS_VIBES,
  FRUIT_FOODS,
  focusMinutesToLevel,
  OUTING_VIBES,
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
  FieldLabel,
  PanelShell,
  SoftInput,
  toggleInList,
} from './panelUi'
import TodoList from './TodoList'

function usePanel(trackerId, month, day) {
  const { getPanel, setPanel } = useJournal()
  const data = getPanel(trackerId, month, day)
  const patch = (next, pixelValue) => {
    setPanel(trackerId, month, day, next, pixelValue)
  }
  return { data, patch }
}

export function RatingPanel({ month, day }) {
  const { data, patch } = usePanel('rating', month, day)
  const [highlight, setHighlight] = useState(data.highlight || '')

  useEffect(() => {
    setHighlight(data.highlight || '')
  }, [month, day, data.highlight])

  return (
    <PanelShell month={month} day={day} title="Mood & vibe" trackerId="rating">
      <ChipGroup label="Day rating choices">
        <ChoiceChips
          options={RATING_VIBES}
          selected={data.choices}
          onToggle={(id) => patch({ choices: toggleInList(data.choices, id) })}
        />
      </ChipGroup>
      <FieldLabel>Best moment of the day</FieldLabel>
      <SoftInput
        value={highlight}
        onChange={(e) => setHighlight(e.target.value)}
        onBlur={() => patch({ highlight: highlight.trim() })}
        onKeyDown={(e) => e.key === 'Enter' && patch({ highlight: highlight.trim() })}
        placeholder="Best moment of the day"
        className="mb-1"
      />
    </PanelShell>
  )
}

export function EnergyPanel({ month, day }) {
  const { data, patch } = usePanel('energy', month, day)
  const toggle = (id) => patch({ choices: toggleInList(data.choices, id) })

  return (
    <PanelShell month={month} day={day} title="Energy check-in" trackerId="energy">
      <ChipGroup label="Drivers">
        <ChoiceChips options={ENERGY_DRIVERS} selected={data.choices} onToggle={toggle} />
      </ChipGroup>
      <ChipGroup label="Drainers">
        <ChoiceChips
          options={ENERGY_DRAINERS}
          selected={data.choices}
          onToggle={toggle}
          startIndex={ENERGY_DRIVERS.length}
        />
      </ChipGroup>
    </PanelShell>
  )
}

export function ShowerPanel({ month, day }) {
  const { data, patch } = usePanel('shower', month, day)

  return (
    <PanelShell month={month} day={day} title="Shower & hair care" trackerId="shower">
      <ChipGroup label="Routine details">
        <ChoiceChips
          options={SHOWER_ROUTINE}
          selected={data.choices}
          onToggle={(id) => patch({ choices: toggleInList(data.choices, id) })}
        />
      </ChipGroup>
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
    <PanelShell month={month} day={day} title="Fruits & vegetables" trackerId="fruits">
      <ChipGroup label="What I ate">
        <ChoiceChips
          options={FRUIT_FOODS}
          selected={data.choices}
          onToggle={(id) => {
            const adding = !(data.choices || []).includes(id)
            const choices = toggleInList(data.choices, id)
            const nextServings = Math.max(0, adding ? servings + 1 : servings - 1)
            patch({ choices, servings: nextServings }, nextServings === 0 ? null : Math.min(4, nextServings))
          }}
        />
      </ChipGroup>
      <div className="mb-1 flex flex-wrap items-center gap-1.5">
        <Chip
          emoji="➕"
          label="+1 Serving"
          active={false}
          colorIndex={2}
          onClick={() => setServings(servings + 1)}
        />
        <span className="rounded-full bg-white/85 px-2.5 py-1 text-[11px] font-bold text-[var(--ink)]">
          {servings} serving{servings === 1 ? '' : 's'}
        </span>
        {servings > 0 && (
          <Chip emoji="➖" label="-1" active={false} colorIndex={7} onClick={() => setServings(servings - 1)} />
        )}
      </div>
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
    <PanelShell month={month} day={day} title="Sweets & sugar" trackerId="sweets">
      <ChipGroup label="Treats">
        <ChoiceChips
          options={SWEET_TREATS}
          selected={data.choices}
          onToggle={(id) => {
            const adding = !(data.choices || []).includes(id)
            const choices = toggleInList(data.choices, id)
            const nextCount = Math.max(0, adding ? count + 1 : count - 1)
            patch({ choices, count: nextCount }, nextCount === 0 ? null : Math.min(4, nextCount))
          }}
        />
      </ChipGroup>
      <div className="mb-1 flex flex-wrap items-center gap-1.5">
        <Chip emoji="➕" label="+1 Sweet" active={false} colorIndex={3} onClick={() => setCount(count + 1)} />
        <span className="rounded-full bg-white/85 px-2.5 py-1 text-[11px] font-bold text-[var(--ink)]">
          {count} treat{count === 1 ? '' : 's'}
        </span>
        {count > 0 && (
          <Chip emoji="➖" label="-1" active={false} colorIndex={7} onClick={() => setCount(count - 1)} />
        )}
      </div>
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
    <PanelShell month={month} day={day} title="Water intake" trackerId="water">
      <div className="mb-2 rounded-full bg-white/85 px-3 py-1.5 text-center text-xs font-bold text-[var(--ink)]">
        {cups} cups · {ml} ml
      </div>
      <ChipGroup label="Hydration controls">
        <div className="flex flex-wrap gap-1.5">
          {WATER_ACTIONS.map((opt, i) => (
            <Chip
              key={opt.id}
              emoji={opt.emoji}
              label={opt.label}
              active={false}
              colorIndex={i}
              onClick={() => applyAction(opt)}
            />
          ))}
        </div>
      </ChipGroup>
      <ChipGroup label="Infusions & perks">
        <ChoiceChips
          options={WATER_PERKS}
          selected={data.choices}
          onToggle={(id) => patch({ choices: toggleInList(data.choices, id) })}
          startIndex={4}
        />
      </ChipGroup>
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
    <PanelShell month={month} day={day} title="Vitamins & supplements" trackerId="vitamins">
      <ChipGroup label="Today's stack">
        <ChoiceChips
          options={VITAMIN_LIST}
          selected={data.choices}
          onToggle={(id) => {
            const choices = toggleInList(data.choices, id)
            patch({ choices }, syncLevel(choices, data.custom))
          }}
        />
        <div className="mt-1.5 flex flex-wrap gap-1.5">
          {(data.custom || []).map((name, i) => (
            <Chip
              key={name}
              emoji="➕"
              label={`${name} ×`}
              active
              colorIndex={i}
              onClick={() => {
                const custom = (data.custom || []).filter((c) => c !== name)
                patch({ custom }, syncLevel(data.choices, custom))
              }}
            />
          ))}
        </div>
      </ChipGroup>
      <FieldLabel>Add custom supplement</FieldLabel>
      <div className="mb-1 flex gap-1.5">
        <SoftInput
          value={customText}
          onChange={(e) => setCustomText(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && addCustom()}
          placeholder="+ Add custom supplement"
        />
        <button
          type="button"
          onClick={addCustom}
          className="rounded-xl bg-[var(--accent-deep)] px-2.5 text-white"
        >
          <Plus size={14} />
        </button>
      </div>
    </PanelShell>
  )
}

export function StudyPanel({ month, day }) {
  const { data, patch } = usePanel('study', month, day)

  const setDuration = (id) => {
    const block = SELF_DEV_DURATIONS.find((d) => d.id === id)
    const next = data.duration === id ? null : id
    const level = next
      ? block?.level ?? 1
      : data.choices?.length
        ? 1
        : null
    patch({ duration: next }, level)
  }

  return (
    <PanelShell month={month} day={day} title="Self-development" trackerId="study">
      <ChipGroup label="Topics">
        <ChoiceChips
          options={SELF_DEV_TOPICS}
          selected={data.choices}
          onToggle={(id) => {
            const choices = toggleInList(data.choices, id)
            const block = SELF_DEV_DURATIONS.find((d) => d.id === data.duration)
            const level = block?.level ?? (choices.length ? 1 : null)
            patch({ choices }, level)
          }}
        />
      </ChipGroup>
      <ChipGroup label="Duration">
        <div className="flex flex-wrap gap-1.5">
          {SELF_DEV_DURATIONS.map((d, i) => (
            <Chip
              key={d.id}
              emoji={d.emoji}
              label={d.label}
              active={data.duration === d.id}
              colorIndex={i}
              onClick={() => setDuration(d.id)}
            />
          ))}
        </div>
      </ChipGroup>
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
    <PanelShell month={month} day={day} title="Reading log" trackerId="reading">
      <FieldLabel>Current book title & author</FieldLabel>
      <SoftInput
        value={book}
        onChange={(e) => setBook(e.target.value)}
        onBlur={() => patch({ book: book.trim() })}
        placeholder="Current book title & author"
        className="mb-2"
      />
      <ChipGroup label="Genre & session">
        <ChoiceChips
          options={READING_CHOICES}
          selected={data.choices}
          onToggle={(id) => patch({ choices: toggleInList(data.choices, id) })}
        />
      </ChipGroup>
      <ChipGroup label="Fast pages session">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="rounded-full bg-white/85 px-2.5 py-1 text-[11px] font-bold">
            {pages} pages
          </span>
          {READING_PAGE_BOOSTS.map((b, i) => (
            <Chip
              key={b.id}
              emoji={b.emoji}
              label={b.label}
              active={false}
              colorIndex={i + 2}
              onClick={() => addPages(b.pages)}
            />
          ))}
          {pages > 0 && (
            <Chip
              emoji="↩️"
              label="-5 pages"
              active={false}
              colorIndex={7}
              onClick={() => addPages(-5)}
            />
          )}
        </div>
      </ChipGroup>
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
    <PanelShell month={month} day={day} title="Teeth brushing" trackerId="teeth">
      <ChipGroup label="Oral care routine">
        <ChoiceChips
          options={TEETH_ROUTINE}
          selected={data.choices}
          onToggle={(id) => {
            const choices = toggleInList(data.choices, id)
            patch({ choices }, syncLevel(choices))
          }}
        />
      </ChipGroup>
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
    <PanelShell month={month} day={day} title="Gym & stretching" trackerId="workout">
      <ChipGroup label="Workout">
        <ChoiceChips
          options={WORKOUT_CHIPS}
          selected={data.choices}
          onToggle={(id) => {
            const choices = toggleInList(data.choices, id)
            patch({ choices }, syncLevel(choices))
          }}
        />
      </ChipGroup>
      <ChipGroup label="Duration">
        <div className="flex flex-wrap gap-1.5">
          {WORKOUT_DURATIONS.map((d, i) => (
            <Chip
              key={d.id}
              emoji={d.emoji}
              label={d.label}
              active={data.duration === d.id}
              colorIndex={i}
              onClick={() => patch({ duration: data.duration === d.id ? null : d.id })}
            />
          ))}
        </div>
      </ChipGroup>
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
      <div className="mb-2 rounded-full bg-white/85 px-3 py-1.5 text-center text-xs font-bold text-[var(--ink)]">
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
    <PanelShell month={month} day={day} title="Sleep & rest" trackerId="sleep">
      <ChipGroup label="Sleep duration">
        <div className="flex flex-wrap gap-1.5">
          {SLEEP_DURATIONS.map((d, i) => (
            <Chip
              key={d.id}
              emoji={d.emoji}
              label={d.label}
              active={data.duration === d.id}
              colorIndex={i}
              onClick={() => setDuration(d.id)}
            />
          ))}
        </div>
      </ChipGroup>

      <div className="mb-2 grid grid-cols-1 gap-2 sm:grid-cols-2">
        <div>
          <FieldLabel>Sleep Time (From)</FieldLabel>
          <SoftInput
            type="time"
            value={sleepTime}
            onChange={(e) => setSleepTime(e.target.value)}
            onBlur={() => patch({ sleepTime })}
            aria-label="Sleep Time From"
          />
        </div>
        <div>
          <FieldLabel>Wake Up Time (To)</FieldLabel>
          <SoftInput
            type="time"
            value={wakeTime}
            onChange={(e) => setWakeTime(e.target.value)}
            onBlur={() => patch({ wakeTime })}
            aria-label="Wake Up Time To"
          />
        </div>
      </div>

      <ChipGroup label="Sleeping location">
        <ChoiceChips
          options={SLEEP_LOCATIONS}
          selected={data.locations}
          onToggle={(id) => patch({ locations: toggleInList(data.locations, id) })}
        />
      </ChipGroup>

      <ChipGroup label="Sleep quality & vibe">
        <ChoiceChips
          options={SLEEP_QUALITY}
          selected={data.quality}
          onToggle={(id) => patch({ quality: toggleInList(data.quality, id) })}
          startIndex={2}
        />
      </ChipGroup>
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
    <PanelShell month={month} day={day} title="Outings & hangouts" trackerId="outings">
      <FieldLabel>Who I was with</FieldLabel>
      <SoftInput
        value={withWho}
        onChange={(e) => setWithWho(e.target.value)}
        onBlur={() => saveWithWho(withWho)}
        onKeyDown={(e) => e.key === 'Enter' && saveWithWho(withWho)}
        placeholder="Who I was with"
        className="mb-2"
      />
      <ChipGroup label="Outing vibe">
        <ChoiceChips
          options={OUTING_VIBES}
          selected={data.choices}
          onToggle={(id) => {
            const choices = toggleInList(data.choices, id)
            const who = (data.withWho || withWho || '').trim()
            patch({ choices }, choices.length ? 2 : who ? 1 : null)
          }}
        />
      </ChipGroup>
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
