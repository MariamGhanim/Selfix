export const TRACKER_ICON_OPTIONS = [
  'Star',
  'Zap',
  'Moon',
  'MoonStar',
  'Sun',
  'Heart',
  'Sparkles',
  'Target',
  'CheckSquare',
  'BookOpen',
  'Dumbbell',
  'Droplets',
  'GlassWater',
  'Apple',
  'Candy',
  'Pill',
  'Smile',
  'MapPin',
  'Leaf',
  'Coffee',
  'Music',
  'Camera',
  'Wallet',
  'Bike',
  'Palette',
  'Brain',
  'Flame',
]

export const TRACKER_COLOR_OPTIONS = [
  '#f2a0b5',
  '#f0d45a',
  '#90caf9',
  '#74bc64',
  '#ffab91',
  '#64b5f6',
  '#9fa8da',
  '#f48fb1',
  '#81c784',
  '#80deea',
  '#ffb74d',
  '#ce93d8',
  '#aed581',
  '#d4a574',
  '#7eb8e8',
  '#b8a4e8',
]

export const CUSTOM_TRACKER_TYPES = [
  {
    id: 'grid',
    label: 'Year-in-Pixels Grid',
    hint: 'Paint days on the calendar with soft levels',
  },
  {
    id: 'checklist',
    label: 'Daily Checklist',
    hint: 'Check off custom tasks for each day',
  },
  {
    id: 'notes',
    label: 'Daily Notes',
    hint: 'A cozy notes page for free writing',
  },
]

/** Distinct multi-hue pastel swatches for per-level color picks. */
export const LEVEL_COLOR_SWATCHES = [
  '#f3a6a0',
  '#f2b8c6',
  '#f5c9a8',
  '#f0d06a',
  '#f0d89a',
  '#c5dbb4',
  '#8fd4a8',
  '#b8dfc8',
  '#9fd4c4',
  '#a8d8e8',
  '#8ec5f0',
  '#a8b8e8',
  '#b8a0e8',
  '#d4a0e8',
  '#e8a0b4',
  '#f28b82',
  '#7dcea0',
  '#a78bda',
]

export const GRID_LEVEL_PRESETS = [
  {
    id: 'yesno',
    label: 'Yes / No',
    levels: [
      { value: 0, label: 'No', color: '#f3a6a0' },
      { value: 1, label: 'Yes', color: '#8fd4a8' },
    ],
  },
  {
    id: 'scale04',
    label: '0 to 4 Scale',
    levels: [
      { value: 0, label: '0', color: '#f2b8c6' },
      { value: 1, label: '1', color: '#f0d06a' },
      { value: 2, label: '2', color: '#8fd4a8' },
      { value: 3, label: '3', color: '#8ec5f0' },
      { value: 4, label: '4', color: '#b8a0e8' },
    ],
  },
  {
    id: 'lowhigh',
    label: 'Low to High',
    levels: [
      { value: 1, label: 'Low', color: '#f3a6a0' },
      { value: 2, label: 'Mild', color: '#f0d06a' },
      { value: 3, label: 'Good', color: '#8fd4a8' },
      { value: 4, label: 'High', color: '#8ec5f0' },
      { value: 5, label: 'Peak', color: '#b8a0e8' },
    ],
  },
  {
    id: 'custom',
    label: 'Custom',
    levels: [
      { value: 1, label: 'Missed', color: '#f3a6a0' },
      { value: 2, label: 'Partial', color: '#f0d06a' },
      { value: 3, label: 'Done', color: '#8fd4a8' },
      { value: 4, label: 'Extra', color: '#b8a0e8' },
    ],
  },
]

export const DEFAULT_CUSTOM_GRID_LEVELS = GRID_LEVEL_PRESETS.find((p) => p.id === 'custom').levels

export const DEFAULT_CUSTOM_CHECKLIST_LEVELS = [
  { value: 0, label: '0', color: '#f3a6a0' },
  { value: 1, label: '1', color: '#f0d06a' },
  { value: 2, label: '2', color: '#8fd4a8' },
  { value: 3, label: '3', color: '#8ec5f0' },
  { value: 4, label: 'All Done', color: '#b8a0e8' },
]

export const DEFAULT_CUSTOM_NOTES_LEVELS = [
  { value: 1, label: 'Noted', color: '#8ec5f0' },
]

const HEX_COLOR = /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/

export function clonePresetLevels(presetId = 'custom') {
  const preset = GRID_LEVEL_PRESETS.find((p) => p.id === presetId) || GRID_LEVEL_PRESETS[3]
  return preset.levels.map((l) => ({ ...l }))
}

export function nextLevelColor(existingColors = []) {
  const used = new Set(existingColors.map((c) => String(c).toLowerCase()))
  const free = LEVEL_COLOR_SWATCHES.find((c) => !used.has(c.toLowerCase()))
  return free || LEVEL_COLOR_SWATCHES[existingColors.length % LEVEL_COLOR_SWATCHES.length]
}

/** Sanitize user-authored levels for storage on a custom grid tracker. */
export function normalizeCustomLevels(rawLevels) {
  if (!Array.isArray(rawLevels) || rawLevels.length < 2) return null
  const seen = new Set()
  const cleaned = []
  for (let i = 0; i < Math.min(rawLevels.length, 8); i += 1) {
    const raw = rawLevels[i] || {}
    let value = Number(raw.value)
    if (!Number.isFinite(value)) value = i + 1
    while (seen.has(value)) value += 1
    seen.add(value)
    const label =
      String(raw.label || '')
        .trim()
        .slice(0, 48) || `Level ${i + 1}`
    const colorCandidate = String(raw.color || '').trim()
    const color = HEX_COLOR.test(colorCandidate)
      ? colorCandidate.length === 4
        ? `#${colorCandidate[1]}${colorCandidate[1]}${colorCandidate[2]}${colorCandidate[2]}${colorCandidate[3]}${colorCandidate[3]}`
        : colorCandidate
      : LEVEL_COLOR_SWATCHES[i % LEVEL_COLOR_SWATCHES.length]
    cleaned.push({ value, label, color })
  }
  return cleaned.length >= 2 ? cleaned : null
}
