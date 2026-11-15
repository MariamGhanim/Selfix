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

/** Distinct, readable swatches for per-level color picks (not near-identical pinks). */
export const LEVEL_COLOR_SWATCHES = [
  '#ef5350',
  '#ec407a',
  '#ab47bc',
  '#7e57c2',
  '#5c6bc0',
  '#42a5f5',
  '#29b6f6',
  '#26c6da',
  '#26a69a',
  '#66bb6a',
  '#9ccc65',
  '#d4e157',
  '#ffee58',
  '#ffca28',
  '#ffa726',
  '#ff7043',
  '#8d6e63',
  '#78909c',
  '#eceff1',
  '#90a4ae',
]

export const GRID_LEVEL_PRESETS = [
  {
    id: 'yesno',
    label: 'Yes / No',
    levels: [
      { value: 0, label: 'No', color: '#ef9a9a' },
      { value: 1, label: 'Yes', color: '#66bb6a' },
    ],
  },
  {
    id: 'scale04',
    label: '0 to 4 Scale',
    levels: [
      { value: 0, label: '0', color: '#eceff1' },
      { value: 1, label: '1', color: '#90caf9' },
      { value: 2, label: '2', color: '#42a5f5' },
      { value: 3, label: '3', color: '#1e88e5' },
      { value: 4, label: '4', color: '#0d47a1' },
    ],
  },
  {
    id: 'lowhigh',
    label: 'Low to High',
    levels: [
      { value: 1, label: 'Low', color: '#ef5350' },
      { value: 2, label: 'Mild', color: '#ffca28' },
      { value: 3, label: 'Good', color: '#66bb6a' },
      { value: 4, label: 'High', color: '#42a5f5' },
      { value: 5, label: 'Peak', color: '#7e57c2' },
    ],
  },
  {
    id: 'custom',
    label: 'Custom',
    levels: [
      { value: 1, label: 'Missed', color: '#ef9a9a' },
      { value: 2, label: 'Partial', color: '#ffd54f' },
      { value: 3, label: 'Done', color: '#81c784' },
      { value: 4, label: 'Extra', color: '#64b5f6' },
    ],
  },
]

export const DEFAULT_CUSTOM_GRID_LEVELS = GRID_LEVEL_PRESETS.find((p) => p.id === 'custom').levels

export const DEFAULT_CUSTOM_CHECKLIST_LEVELS = [
  { value: 0, label: '0', color: '#ef9a9a' },
  { value: 1, label: '1', color: '#ffd54f' },
  { value: 2, label: '2', color: '#81c784' },
  { value: 3, label: '3', color: '#64b5f6' },
  { value: 4, label: 'All Done', color: '#7e57c2' },
]

export const DEFAULT_CUSTOM_NOTES_LEVELS = [
  { value: 1, label: 'Noted', color: '#64b5f6' },
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
