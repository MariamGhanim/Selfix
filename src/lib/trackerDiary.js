import { cellKey, TRACKERS } from '../data/trackers'
import { FOCUS_ENVIRONMENTS, SALAH_PRAYERS } from '../data/panelOptions'

export const DIARY_RANGES = [
  { id: 'weekly', label: 'Weekly' },
  { id: 'monthly', label: 'Monthly' },
]

function startOfDay(d) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate())
}

function addDays(d, n) {
  const next = new Date(d)
  next.setDate(next.getDate() + n)
  return next
}

function parsePixelKey(key) {
  const colon = key.indexOf(':')
  if (colon < 0) return null
  const trackerId = key.slice(0, colon)
  const parts = key.slice(colon + 1).split('-').map(Number)
  if (parts.length !== 3 || parts.some((n) => !Number.isFinite(n))) return null
  return { trackerId, year: parts[0], month: parts[1], day: parts[2] }
}

function parsePanelKey(key) {
  const colon = key.indexOf(':')
  if (colon < 0) return null
  const trackerId = key.slice(0, colon)
  const parts = key.slice(colon + 1).split('-').map(Number)
  if (parts.length !== 3 || parts.some((n) => !Number.isFinite(n))) return null
  return { trackerId, year: parts[0], month: parts[1], day: parts[2] }
}

function inRange(y, m, d, from, to) {
  const t = new Date(y, m, d).getTime()
  return t >= from.getTime() && t <= to.getTime()
}

export function getDiaryBounds(rangeId, year, anchor = new Date()) {
  const today = startOfDay(new Date())
  const focus = startOfDay(anchor)
  const yearStart = new Date(year, 0, 1)
  const yearEnd = new Date(year, 11, 31)
  const inYear = focus > yearEnd ? yearEnd : focus < yearStart ? yearStart : focus
  const hardCap = today < yearEnd ? today : yearEnd

  if (rangeId === 'monthly') {
    const from = new Date(inYear.getFullYear(), inYear.getMonth(), 1)
    const monthEnd = new Date(inYear.getFullYear(), inYear.getMonth() + 1, 0)
    const to = monthEnd > hardCap ? hardCap : monthEnd
    return {
      from,
      to: to < from ? from : to,
      label: from.toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
      periodWord: 'month',
    }
  }

  const day = inYear.getDay()
  const mondayOffset = day === 0 ? -6 : 1 - day
  let from = addDays(inYear, mondayOffset)
  let to = addDays(from, 6)
  if (from < yearStart) from = yearStart
  if (to > hardCap) to = hardCap
  if (to < from) to = from
  return {
    from,
    to,
    label: `${from.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} – ${to.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`,
    periodWord: 'week',
  }
}

export function shiftDiaryAnchor(rangeId, anchor, direction) {
  const d = new Date(anchor)
  if (rangeId === 'monthly') d.setMonth(d.getMonth() + direction)
  else d.setDate(d.getDate() + direction * 7)
  return d
}

function enumerateDays(from, to) {
  const days = []
  let cursor = startOfDay(from)
  const end = startOfDay(to)
  while (cursor <= end) {
    days.push({
      year: cursor.getFullYear(),
      month: cursor.getMonth(),
      day: cursor.getDate(),
      date: new Date(cursor),
      key: cellKey(cursor.getFullYear(), cursor.getMonth(), cursor.getDate()),
      weekday: cursor.getDay(),
      label: cursor.toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'short',
        day: 'numeric',
      }),
    })
    cursor = addDays(cursor, 1)
  }
  return days
}

function levelLabel(tracker, value) {
  if (value == null) return null
  return tracker.levels?.find((l) => l.value === value)?.label || String(value)
}

function joinSoft(parts) {
  const clean = parts.filter(Boolean)
  if (!clean.length) return ''
  if (clean.length === 1) return clean[0]
  if (clean.length === 2) return `${clean[0]} and ${clean[1]}`
  return `${clean.slice(0, -1).join(', ')}, and ${clean[clean.length - 1]}`
}

function collectWrittenNotes(panel, trackerNote) {
  const notes = []
  if (trackerNote?.trim()) notes.push(trackerNote.trim())
  if (panel?.reflection?.trim()) notes.push(panel.reflection.trim())
  if (panel?.highlight?.trim()) notes.push(panel.highlight.trim())
  if (panel?.note?.trim()) notes.push(panel.note.trim())
  if (panel?.book?.trim()) notes.push(panel.book.trim())
  return [...new Set(notes)]
}

function describeSalahDay(value, panel) {
  const prayers = panel?.prayers || {}
  const statuses = SALAH_PRAYERS.map((p) => ({
    ...p,
    status: prayers[p.id] || null,
  }))
  const onTime = statuses.filter((p) => p.status === 'onTime')
  const late = statuses.filter((p) => p.status === 'late')
  const bits = []

  if (onTime.length === 5 || value === 5) bits.push('All five prayers on time')
  else if (value === 6) bits.push('All five on time, plus sunnah')
  else if (onTime.length === 1) bits.push(`${onTime[0].label} on time`)
  else if (onTime.length) bits.push(`${onTime.map((p) => p.label).join(', ')} on time`)
  else if (value != null && value > 0) bits.push(`${value} on time`)

  if (late.length) {
    bits.push(
      late.length === 1
        ? `${late[0].label} late`
        : `${late.map((p) => p.label).join(', ')} late`,
    )
  }

  if (!bits.length && !panel?.reflection?.trim()) {
    return { headline: null, details: [], empty: true }
  }

  return {
    headline: bits[0] || null,
    details: bits.slice(1),
    empty: false,
  }
}

function describeFocusDay(value, panel, levelText) {
  const mins = Number(panel?.minutes) || 0
  const envs = (panel?.environments || [])
    .map((id) => FOCUS_ENVIRONMENTS.find((e) => e.id === id)?.label || id)
    .filter(Boolean)
  const bits = []
  if (mins > 0) {
    bits.push(mins >= 60 ? `${Math.round((mins / 60) * 10) / 10} hours` : `${mins} minutes`)
  } else if (levelText && value !== 0) {
    bits.push(levelText)
  } else if (value === 0) {
    bits.push('Rest day')
  }
  if (envs.length) bits.push(joinSoft(envs))
  if (!bits.length) return { headline: null, details: [], empty: true }
  return { headline: bits[0], details: bits.slice(1), empty: false }
}

function describeTasksDay(value, todos) {
  const list = todos || []
  if (!list.length && value == null) return { headline: null, details: [], empty: true }
  const done = list.filter((t) => t.done || t.completed)
  const bits = []
  if (list.length) {
    bits.push(
      done.length === list.length
        ? `Finished ${list.length} task${list.length === 1 ? '' : 's'}`
        : `${done.length} of ${list.length} done`,
    )
  } else if (value != null) {
    bits.push(value === 4 ? 'List finished' : `${value} on the list`)
  }
  const names = done
    .map((t) => t.text || t.title || t.label)
    .filter(Boolean)
    .slice(0, 3)
  if (names.length) bits.push(names.join(', '))
  return { headline: bits[0], details: bits.slice(1), empty: false }
}

function describeGenericDay(tracker, value, panel) {
  const label = levelLabel(tracker, value)
  const bits = []

  if (tracker.id === 'sleep') {
    if (value === 1) bits.push('Under 5 hours')
    else if (value === 2) bits.push('5 to 6 hours')
    else if (value === 3) bits.push('7 to 8 hours')
    else if (value === 4) bits.push('8+ hours')
  } else if (tracker.id === 'water') {
    if (value != null && value > 0) bits.push(`${value === 8 ? '8+' : value} cups`)
    else return { headline: null, details: [], empty: true }
  } else if (tracker.id === 'teeth') {
    if (value === 1) bits.push('Once')
    else if (value === 2) bits.push('Twice')
    else return { headline: null, details: [], empty: true }
  } else if (tracker.id === 'shower') {
    if (label) bits.push(label)
  } else if (tracker.id === 'vitamins') {
    if (value === 1) bits.push('Taken')
    else if (value === 2) bits.push('Partly')
    else return { headline: null, details: [], empty: true }
  } else if (tracker.id === 'fruits' || tracker.id === 'sweets') {
    if (value != null && value > 0) bits.push(label || String(value))
    else return { headline: null, details: [], empty: true }
  } else if (tracker.id === 'workout') {
    if (value === 0) bits.push('Rest day')
    else if (label) bits.push(label)
  } else if (tracker.id === 'reading') {
    if (value === 1) return { headline: null, details: [], empty: true }
    if (label) bits.push(label)
    if (panel?.pages) bits.push(`${panel.pages} pages`)
  } else if (tracker.id === 'outings') {
    if (value === 0) bits.push('Home')
    else if (label) bits.push(label)
    if (panel?.withWho?.trim()) bits.push(panel.withWho.trim())
  } else if (tracker.id === 'energy' || tracker.id === 'rating') {
    if (label) bits.push(label)
  } else if (tracker.id === 'study') {
    if (value === 0) return { headline: null, details: [], empty: true }
    if (label) bits.push(label)
  } else if (label) {
    bits.push(label)
  }

  if (!bits.length) return { headline: null, details: [], empty: true }
  return { headline: bits[0], details: bits.slice(1), empty: false }
}

function describeDay(tracker, value, panel, todos) {
  if (tracker.id === 'salah') return describeSalahDay(value, panel)
  if (tracker.id === 'focus') return describeFocusDay(value, panel, levelLabel(tracker, value))
  if (tracker.id === 'tasks') return describeTasksDay(value, todos)
  return describeGenericDay(tracker, value, panel)
}

export function buildTrackerDiary(state, trackerId, rangeId, year, anchor = new Date()) {
  const y = year ?? state?.profile?.year ?? new Date().getFullYear()
  const bounds = getDiaryBounds(rangeId, y, anchor)
  const days = enumerateDays(bounds.from, bounds.to)
  const catalog = [...TRACKERS, ...(state?.trackerPrefs?.custom || [])]
  const tracker = catalog.find((t) => t.id === trackerId) || TRACKERS[0]

  const pixelIndex = {}
  for (const [key, value] of Object.entries(state?.pixels || {})) {
    const parsed = parsePixelKey(key)
    if (!parsed || parsed.trackerId !== tracker.id) continue
    if (!inRange(parsed.year, parsed.month, parsed.day, bounds.from, bounds.to)) continue
    pixelIndex[cellKey(parsed.year, parsed.month, parsed.day)] = value
  }

  const panelIndex = {}
  for (const [key, value] of Object.entries(state?.panels || {})) {
    const parsed = parsePanelKey(key)
    if (!parsed || parsed.trackerId !== tracker.id) continue
    if (!inRange(parsed.year, parsed.month, parsed.day, bounds.from, bounds.to)) continue
    panelIndex[cellKey(parsed.year, parsed.month, parsed.day)] = value
  }

  const entries = days
    .map((d) => {
      const value = pixelIndex[d.key] ?? null
      const panel = panelIndex[d.key] || {}
      const todos = state?.todos?.[d.key] || []
      const trackerNote = state?.dailyNotes?.[`${tracker.id}:${d.key}`] || ''
      const writtenNotes = collectWrittenNotes(panel, trackerNote)
      const described = describeDay(tracker, value, panel, todos)
      const mins = Number(panel?.minutes) || 0
      const empty = described.empty && !writtenNotes.length
      return {
        ...d,
        value,
        color: tracker.levels?.find((l) => l.value === value)?.color || tracker.tabColor,
        empty,
        headline: described.headline,
        details: described.details,
        writtenNotes,
        minutes: mins,
        tasksDone: todos.filter((t) => t.done || t.completed).length,
        tasksTotal: todos.length,
      }
    })
    .reverse()

  const moments = entries.filter((e) => !e.empty)
  const notes = moments
    .filter((e) => e.writtenNotes?.length)
    .map((e) => ({
      key: e.key,
      label: e.label,
      notes: e.writtenNotes,
    }))

  return {
    tracker,
    bounds,
    entries,
    moments,
    notes,
    loggedCount: moments.length,
    dayCount: entries.length,
  }
}
