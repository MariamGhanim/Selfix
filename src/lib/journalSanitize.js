/** Bounds for journal text before it is stored or encrypted. */
export const TEXT_LIMITS = {
  note: 8000,
  todo: 500,
  title: 80,
  displayName: 80,
  generic: 8000,
}

const MAX_DEPTH = 12
const MAX_ARRAY = 200
const CONTROL_CHARS = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g
const UNSAFE_KEYS = new Set(['__proto__', 'prototype', 'constructor'])

export function clampText(value, max = TEXT_LIMITS.generic) {
  const text = typeof value === 'string' ? value : value == null ? '' : String(value)
  const clean = text.replace(CONTROL_CHARS, '')
  return clean.length > max ? clean.slice(0, max) : clean
}

export function sanitizeJournalValue(value, depth = 0) {
  if (value == null) return value
  const type = typeof value
  if (type === 'string') return clampText(value, TEXT_LIMITS.generic)
  if (type === 'number') return Number.isFinite(value) ? value : 0
  if (type === 'boolean') return value
  if (depth > MAX_DEPTH) return null
  if (Array.isArray(value)) {
    const capped = value.length > MAX_ARRAY ? value.slice(0, MAX_ARRAY) : value
    return capped.map((item) => sanitizeJournalValue(item, depth + 1))
  }
  if (type === 'object') {
    const out = {}
    for (const [key, child] of Object.entries(value)) {
      if (UNSAFE_KEYS.has(key)) continue
      const safeKey = clampText(key, 160)
      if (!safeKey) continue
      out[safeKey] = sanitizeJournalValue(child, depth + 1)
    }
    return out
  }
  return null
}

const JOURNAL_KEYS = [
  'theme',
  'profile',
  'pixels',
  'dailyNotes',
  'todos',
  'panels',
  'selectedLevel',
  'trackerPrefs',
]

/** Clamp journal text and drop non-JSON values without discarding pixel maps. */
export function sanitizeJournalState(state) {
  if (!state || typeof state !== 'object') return state
  const clean = sanitizeJournalValue(state, 0)
  const currentYear = new Date().getFullYear()
  const profile = clean.profile && typeof clean.profile === 'object' ? clean.profile : {}
  const year = Number(profile.year)
  const next = {}
  for (const key of JOURNAL_KEYS) next[key] = clean[key]
  next.profile = {
    displayName: clampText(profile.displayName || '', TEXT_LIMITS.displayName),
    year: Number.isFinite(year)
      ? Math.min(Math.max(Math.trunc(year), 2000), Math.min(currentYear + 1, 2100))
      : currentYear,
  }
  const asMap = (value) =>
    value && typeof value === 'object' && !Array.isArray(value) ? value : {}
  next.pixels = asMap(next.pixels)
  next.dailyNotes = asMap(next.dailyNotes)
  next.todos = asMap(next.todos)
  next.panels = asMap(next.panels)
  next.selectedLevel = asMap(next.selectedLevel)
  next.trackerPrefs = asMap(next.trackerPrefs)
  next.theme = next.theme === 'midnight' ? 'midnight' : 'pinky'
  return next
}
