export const RATING_VIBES = [
  { id: 'productive', emoji: '🚀', label: 'Highly Productive' },
  { id: 'cozy-lazy', emoji: '🛋️', label: 'Cozy & Lazy' },
  { id: 'peaceful', emoji: '🌿', label: 'Peaceful' },
  { id: 'grateful', emoji: '🥺', label: 'Grateful' },
  { id: 'creative', emoji: '🎨', label: 'Creative Flow' },
  { id: 'stressed', emoji: '🔥', label: 'Stressed' },
  { id: 'memorable', emoji: '💫', label: 'Memorable' },
  { id: 'shopping', emoji: '🛍️', label: 'Retail Therapy' },
  { id: 'social', emoji: '💬', label: 'Social & Connected' },
  { id: 'restful', emoji: '😴', label: 'Restful Reset' },
  { id: 'busy', emoji: '🏃‍♀️', label: 'Fast-Paced' },
  { id: 'inspired', emoji: '✨', label: 'Inspired' },
]

export const RATING_DAY_TYPES = [
  { id: 'smooth', emoji: '☀️', label: 'Smooth Sailing' },
  { id: 'rollercoaster', emoji: '🎢', label: 'A Bit of Both' },
  { id: 'tough', emoji: '🌧️', label: 'Tough Day' },
]

export const RATING_MEANINGFUL = [
  { id: 'yes', emoji: '✨', label: 'Yes, it mattered' },
  { id: 'normal', emoji: '➖', label: 'Just a normal day' },
  { id: 'reset', emoji: '💭', label: 'Needed a reset' },
]

export const ENERGY_DRIVERS = [
  { id: 'great-coffee', emoji: '☕', label: 'Great Coffee' },
  { id: 'excellent-sleep', emoji: '😴', label: 'Excellent Sleep' },
  { id: 'sunny', emoji: '☀️', label: 'Sunny Weather' },
  { id: 'deep-work-win', emoji: '💻', label: 'Deep Work Success' },
  { id: 'bestie', emoji: '👯‍♀️', label: 'Talking to Bestie' },
  { id: 'new-music', emoji: '🎶', label: 'Discovering New Music' },
  { id: 'meditation', emoji: '🧘‍♀️', label: 'Meditation/Prayer' },
  { id: 'delicious-meal', emoji: '🥞', label: 'Delicious Meal' },
]

export const ENERGY_DRAINERS = [
  { id: 'exhausting-work', emoji: '🌪️', label: 'Exhausting Workload' },
  { id: 'sleep-deprived', emoji: '🥱', label: 'Severe Sleep Deprivation' },
  { id: 'overthinking', emoji: '🌀', label: 'Overthinking Spirals' },
  { id: 'traffic', emoji: '🚦', label: 'Bad Traffic / Commute' },
  { id: 'chaos', emoji: '📢', label: 'Loud Noises / Chaos' },
  { id: 'doomscroll', emoji: '📱', label: 'Doomscrolling Fatigue' },
]

export const ENERGY_PEAK_TIMES = [
  { id: 'morning', emoji: '🌅', label: 'Morning' },
  { id: 'afternoon', emoji: '☀️', label: 'Afternoon' },
  { id: 'night', emoji: '🌙', label: 'Night Owl' },
  { id: 'low', emoji: '🪫', label: 'Low All Day' },
]

export const ENERGY_BATTERY = [
  { id: 'charged', emoji: '🔋', label: 'Fully Charged' },
  { id: 'steady', emoji: '⚖️', label: 'Holding Steady' },
  { id: 'solo', emoji: '🫂', label: 'Need Solo Recharge' },
]

export const SHOWER_ROUTINE_GROUPS = [
  {
    id: 'hair',
    label: 'Hair Routine',
    options: [
      { id: 'scalp-shampoo', emoji: '🧴', label: 'Scalp Treatment' },
      { id: 'hair-mask', emoji: '🍯', label: 'Hair Mask' },
      { id: 'leave-in', emoji: '💧', label: 'Leave-in' },
      { id: 'serum', emoji: '✨', label: 'Serum / Anti-Frizz' },
      { id: 'diffuser', emoji: '💨', label: 'Blowout / Styling' },
    ],
  },
  {
    id: 'skincare',
    label: 'Skincare & Face',
    options: [
      { id: 'sheet-mask', emoji: '🎭', label: 'Hydrating Mask' },
      { id: 'skincare', emoji: '🪞', label: 'Complete Skincare' },
      { id: 'eye-patches', emoji: '👁️', label: 'Eye Patches' },
      { id: 'grooming', emoji: '🪒', label: 'Grooming / Shave' },
    ],
  },
  {
    id: 'body',
    label: 'Body & Relax',
    options: [
      { id: 'body-scrub', emoji: '🫧', label: 'Exfoliation' },
      { id: 'body-butter', emoji: '🧈', label: 'Body Lotion' },
      { id: 'bubble-bath', emoji: '🛁', label: 'Bath' },
      { id: 'body-mist', emoji: '🌸', label: 'Perfume / Mist' },
    ],
  },
]

export const SHOWER_ROUTINE = SHOWER_ROUTINE_GROUPS.flatMap((group) => group.options)

export const FRUIT_FOODS = [
  { id: 'apple', emoji: '🍎', label: 'Crisp Apple' },
  { id: 'banana', emoji: '🍌', label: 'Sweet Banana' },
  { id: 'berries', emoji: '🫐', label: 'Fresh Berries' },
  { id: 'citrus', emoji: '🍊', label: 'Orange / Citrus' },
  { id: 'salad', emoji: '🥗', label: 'Big Fresh Salad' },
  { id: 'leafy', emoji: '🥬', label: 'Leafy Greens (Rocca/Lettuce)' },
  { id: 'carrots', emoji: '🥕', label: 'Crunchy Carrots' },
  { id: 'cucumber', emoji: '🥒', label: 'Refreshing Cucumbers' },
  { id: 'peppers', emoji: '🫑', label: 'Bell Peppers' },
  { id: 'avocado', emoji: '🥑', label: 'Fresh Avocado' },
  { id: 'smoothie', emoji: '🧃', label: 'Green Veggie Smoothie' },
  { id: 'cooked', emoji: '🥦', label: 'Steamed / Cooked Veggies' },
  { id: 'nuts', emoji: '🥜', label: 'Raw Nuts & Seeds' },
  { id: 'kiwi', emoji: '🥝', label: 'Kiwi / Tropical Fruit' },
]

export const SWEET_TREATS = [
  { id: 'dark-choco', emoji: '🍫', label: 'Dark Chocolate Bar' },
  { id: 'donut', emoji: '🍩', label: 'Milk Chocolate / Donut' },
  { id: 'cake', emoji: '🍰', label: 'Cake Slice / Pastry' },
  { id: 'cookies', emoji: '🍪', label: 'Butter Cookies / Biscuits' },
  { id: 'ice-cream', emoji: '🍨', label: 'Creamy Ice Cream' },
  { id: 'boba', emoji: '🧋', label: 'Sweet Latte / Boba Tea' },
  { id: 'candy', emoji: '🍬', label: 'Candy / Fruit Gummies' },
  { id: 'croissant', emoji: '🥐', label: 'Fresh Buttery Croissant' },
  { id: 'homemade', emoji: '🍮', label: 'Homemade Sweet Treat' },
  { id: 'pancakes', emoji: '🥞', label: 'Fluffy Pancakes / Waffles' },
  { id: 'honey', emoji: '🍯', label: 'Honey Drizzle Dessert' },
  { id: 'pie', emoji: '🥧', label: 'Fruit Pie / Tart' },
  { id: 'nutella', emoji: '🍫', label: 'Nutella / Chocolate Spread' },
  { id: 'soda', emoji: '🥤', label: 'Fizzy Soda / Sugary Drink' },
]

export const WATER_ACTIONS = [
  { id: 'plus-cup', emoji: '💧', label: '+1 Cup (250ml)', cups: 1, ml: 250 },
  { id: 'minus-cup', emoji: '💧', label: '-1 Cup', cups: -1, ml: -250 },
  { id: 'plus-500', emoji: '🍼', label: '+500ml Bottle', cups: 2, ml: 500 },
  { id: 'plus-1l', emoji: '🧊', label: '+1L Big Bottle', cups: 4, ml: 1000 },
]

export const WATER_PERKS = [
  { id: 'lemon', emoji: '🍋', label: 'Lemon Slice Infused' },
  { id: 'mint', emoji: '🌿', label: 'Fresh Mint Infused' },
  { id: 'cucumber', emoji: '🥒', label: 'Cucumber Slices' },
  { id: 'berry', emoji: '🍓', label: 'Berry Infused Water' },
  { id: 'electrolytes', emoji: '⚡', label: 'Electrolytes Added' },
  { id: 'herbal-tea', emoji: '🫖', label: 'Warm Herbal Tea' },
  { id: 'coconut', emoji: '🥥', label: 'Coconut Water' },
  { id: 'salt', emoji: '🧂', label: 'Pinch of Himalayan Salt' },
]

export const VITAMIN_LIST = [
  { id: 'd3', emoji: '☀️', label: 'Vitamin D3' },
  { id: 'c', emoji: '🍊', label: 'Vitamin C' },
  { id: 'omega', emoji: '🐟', label: 'Omega-3 Fish Oil' },
  { id: 'iron', emoji: '🩸', label: 'Iron / Folic Acid' },
  { id: 'magnesium', emoji: '🧠', label: 'Magnesium Glycinate' },
  { id: 'zinc', emoji: '🛡️', label: 'Zinc Immunity' },
  { id: 'multi', emoji: '💊', label: 'Daily Multivitamin' },
  { id: 'biotin', emoji: '✨', label: 'Biotin & Collagen' },
  { id: 'calcium', emoji: '🥛', label: 'Calcium Supplement' },
  { id: 'b-complex', emoji: '🧬', label: 'B-Complex Vitamin' },
  { id: 'probiotics', emoji: '🦠', label: 'Gut Health Probiotics' },
  { id: 'ashwagandha', emoji: '🌿', label: 'Ashwagandha Root' },
  { id: 'turmeric', emoji: '🫚', label: 'Turmeric Extract' },
  { id: 'green-tea', emoji: '🍵', label: 'Green Tea Extract' },
]

export const SELF_DEV_TOPICS = [
  { id: 'coding', emoji: '💻', label: 'Coding & Programming' },
  { id: 'data', emoji: '📊', label: 'Data Science & SQL' },
  { id: 'math', emoji: '📐', label: 'Advanced Math & Logic' },
  { id: 'nonfiction', emoji: '📚', label: 'Non-fiction Book Reading' },
  { id: 'language', emoji: '🗣️', label: 'Language Practice (Japanese/Korean)' },
  { id: 'career', emoji: '🎯', label: 'Career & Resume Prep' },
  { id: 'course', emoji: '🎓', label: 'Online Certificate Course' },
  { id: 'journaling', emoji: '✍️', label: 'Journaling & Reflection' },
  { id: 'saas', emoji: '🚀', label: 'SaaS / Business Strategy' },
  { id: 'uiux', emoji: '🎨', label: 'UI/UX Design Study' },
  { id: 'finance', emoji: '📈', label: 'Financial Literacy' },
  { id: 'psych', emoji: '🧠', label: 'Psychology & Philosophy' },
  { id: 'podcast', emoji: '🎧', label: 'Educational Podcasts' },
  { id: 'skill', emoji: '📝', label: 'Skill Practice Session' },
]

export const SELF_DEV_DURATIONS = [
  { id: '15m', emoji: '⏱️', label: '15m', level: 1 },
  { id: '30m', emoji: '⏱️', label: '30m', level: 1 },
  { id: '1h', emoji: '⏱️', label: '1h', level: 2 },
  { id: '1.5h', emoji: '⏱️', label: '1.5h', level: 2 },
  { id: '2h+', emoji: '⏱️', label: '2h+', level: 3 },
]

export const READING_CHOICES = [
  { id: 'fiction', emoji: '📖', label: 'Fiction / Novel' },
  { id: 'science', emoji: '🔬', label: 'Science & Technology' },
  { id: 'self-help', emoji: '🌱', label: 'Self-Help & Growth' },
  { id: 'philosophy', emoji: '🧠', label: 'Philosophy & Mind' },
  { id: 'poetry', emoji: '📜', label: 'Poetry & Literature' },
  { id: 'biography', emoji: '👤', label: 'Biography / Memoir' },
  { id: 'psychology', emoji: '🧩', label: 'Psychology & Behavior' },
  { id: 'true-crime', emoji: '🕵️', label: 'True Crime & Mystery' },
  { id: 'scifi', emoji: '🌌', label: 'Sci-Fi & Fantasy' },
  { id: 'art', emoji: '🎨', label: 'Art & Design Books' },
  { id: 'wealth', emoji: '💰', label: 'Wealth & Business' },
  { id: 'nature', emoji: '🌿', label: 'Nature & Biology' },
  { id: 'review', emoji: '🔖', label: 'Book Review & Notes' },
]

export const READING_PAGE_BOOSTS = [
  { id: 'p5', emoji: '⚡', label: '+5 pages', pages: 5 },
  { id: 'p10', emoji: '⚡', label: '+10 pages', pages: 10 },
  { id: 'p25', emoji: '⚡', label: '+25 pages', pages: 25 },
]

export const TEETH_ROUTINE = [
  { id: 'morning', emoji: '☀️', label: 'Morning Routine Brush' },
  { id: 'night', emoji: '🌙', label: 'Night Routine Brush' },
  { id: 'floss', emoji: '🧵', label: 'Dental Floss' },
  { id: 'mouthwash', emoji: '✨', label: 'Mouthwash Rinse' },
  { id: 'whitening', emoji: '💎', label: 'Teeth Whitening Strip' },
  { id: 'tongue', emoji: '🦷', label: 'Tongue Scraper' },
  { id: 'herbal', emoji: '🌿', label: 'Herbal Toothpaste' },
  { id: 'water-floss', emoji: '💧', label: 'Water Flosser' },
  { id: 'freshener', emoji: '🌬️', label: 'Breath Freshener Spray' },
  { id: 'electric', emoji: '🪥', label: 'Electric Toothbrush Mode' },
  { id: 'fluoride', emoji: '🛡️', label: 'Fluoride Protection' },
  { id: 'post-meal', emoji: '✨', label: 'Extra Post-Meal Brush' },
]

export const WORKOUT_CHIPS = [
  { id: 'rest', emoji: '🛋️', label: 'Complete Rest Day', level: 0 },
  { id: 'morning-stretch', emoji: '🧘‍♀️', label: 'Light Morning Stretching', level: 1 },
  { id: 'mobility', emoji: '🤸‍♀️', label: 'Mobility & Flexibility', level: 1 },
  { id: 'pilates', emoji: '🧘‍♂️', label: 'Pilates Flow Session', level: 1 },
  { id: 'full-body', emoji: '💪', label: 'Full Body Gym Workout', level: 3 },
  { id: 'upper', emoji: '🏋️‍♀️', label: 'Upper Body Strength', level: 3 },
  { id: 'lower', emoji: '🦵', label: 'Lower Body / Glutes', level: 3 },
  { id: 'treadmill', emoji: '🏃‍♀️', label: 'Treadmill Cardio', level: 2 },
  { id: 'walk', emoji: '🚶‍♀️', label: 'Outdoor Walking (10k steps)', level: 2 },
  { id: 'cycling', emoji: '🚴‍♀️', label: 'Cycling / Spin', level: 2 },
  { id: 'swim', emoji: '🏊‍♂️', label: 'Swimming Laps', level: 3 },
  { id: 'dance', emoji: '💃', label: 'Dance Workout', level: 2 },
  { id: 'hiit', emoji: '🥊', label: 'Boxing / HIIT', level: 4 },
  { id: 'core', emoji: '🛹', label: 'Core & Abs Workout', level: 3 },
]

export const WORKOUT_DURATIONS = [
  { id: 'lt5', emoji: '⏱️', label: 'Less than 5m' },
  { id: '5-10', emoji: '⏱️', label: '5 - 10m' },
  { id: '11-20', emoji: '⏱️', label: '11 - 20m' },
  { id: '21-30', emoji: '⏱️', label: '21 - 30m' },
  { id: '31-40', emoji: '⏱️', label: '31 - 40m' },
  { id: '40plus', emoji: '⏱️', label: '40m+' },
]

export const SLEEP_DURATIONS = [
  { id: 'severe', emoji: '🪫', label: '< 5h', hint: 'Severe debt', anchorHours: 4 },
  { id: 'moderate', emoji: '🌙', label: '5 – 6.5h', hint: 'Moderate debt', anchorHours: 5.5 },
  { id: 'optimal', emoji: '✨', label: '7 – 8.5h', hint: 'Optimal', anchorHours: 8 },
  { id: 'oversleep', emoji: '😴', label: '9h+', hint: 'Possible fatigue', anchorHours: 9.5 },
]

export const SLEEP_FRAGMENTATION = [
  { id: 'solid', emoji: '💤', label: 'Uninterrupted', short: 'Uninterrupted' },
  { id: 'mild_waking', emoji: '🔄', label: '1–2 brief wakings', short: 'Brief wakings' },
  {
    id: 'frequent_awakenings',
    emoji: '⚠️',
    label: 'Frequent awakenings',
    short: 'Fragmented night',
  },
]

export const SLEEP_DISRUPTERS = [
  { id: 'caffeine', emoji: '☕', label: 'Late caffeine' },
  { id: 'screens', emoji: '📱', label: 'Screens' },
  { id: 'meal', emoji: '🍽️', label: 'Late meal' },
  { id: 'environment', emoji: '🌡️', label: 'Room / environment' },
  { id: 'stress', emoji: '😰', label: 'Stress / racing thoughts' },
]

export const SLEEP_MORNING = [
  {
    id: 'alert',
    emoji: '⚡',
    label: 'Alert & energized',
    short: 'Woke alert',
  },
  {
    id: 'groggy',
    emoji: '🌫️',
    label: 'Groggy / slow to wake',
    short: 'Sleep inertia',
  },
  {
    id: 'exhausted',
    emoji: '🧟',
    label: 'Exhausted',
    short: 'Exhausted wake-up',
  },
  {
    id: 'aches',
    emoji: '🤕',
    label: 'Headache / body aches',
    short: 'Aches on waking',
  },
]

export const SLEEP_LOCATIONS = [
  { id: 'bed', emoji: '🛏️', label: 'My bed' },
  { id: 'sofa', emoji: '🛋️', label: 'Sofa' },
  { id: 'floor', emoji: '🪵', label: 'Floor / mattress' },
  { id: 'car', emoji: '🚗', label: 'Car' },
  { id: 'hotel', emoji: '✈️', label: 'Travel / hotel' },
  { id: 'guest', emoji: '🛋️', label: 'Guest room' },
]

export const FOCUS_QUICK_ADDS = [
  { id: 'pomodoro', emoji: '🍅', label: '+25m', minutes: 25 },
  { id: 'hour', emoji: '⏳', label: '+1h', minutes: 60 },
  { id: 'flow', emoji: '🚀', label: '+2h', minutes: 120 },
]

export const FOCUS_VIBES = [
  { id: 'laser', emoji: '🎯', label: 'Deep Flow' },
  { id: 'breakthrough', emoji: '💡', label: 'Idea' },
  { id: 'coding', emoji: '💻', label: 'Coding' },
  { id: 'data', emoji: '📊', label: 'Data' },
  { id: 'research', emoji: '📚', label: 'Reading' },
  { id: 'writing', emoji: '✍️', label: 'Writing' },
  { id: 'course', emoji: '🎓', label: 'Studying' },
  { id: 'saas', emoji: '🚀', label: 'Building' },
  { id: 'lofi', emoji: '🎧', label: 'Lo-Fi' },
  { id: 'fog', emoji: '🌪️', label: 'Brain Fog' },
  { id: 'phone', emoji: '📱', label: 'Distracted' },
  { id: 'caffeine', emoji: '☕', label: 'Caffeinated' },
]

export const FOCUS_ENVIRONMENTS = [
  { id: 'desk', emoji: '🖥️', label: 'Desk' },
  { id: 'bedside', emoji: '🛋️', label: 'Bed' },
  { id: 'cafe', emoji: '☕', label: 'Cafe' },
  { id: 'library', emoji: '📚', label: 'Library' },
  { id: 'late-night', emoji: '🌙', label: 'Late Night' },
  { id: 'morning', emoji: '☀️', label: 'Morning' },
]

export function focusMinutesToLevel(minutes) {
  const m = Math.max(0, Number(minutes) || 0)
  if (m <= 0) return null
  if (m < 60) return 1
  if (m < 240) return 2
  return 3
}

/** Parse "45m", "1.5h", "1h30", or bare numbers (≤8 → hours, else minutes). */
export function parseFocusDurationToMinutes(raw) {
  const s = String(raw || '')
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '')
  if (!s) return null

  let m = s.match(/^(\d+(?:\.\d+)?)h(\d{1,2})m?$/)
  if (m) {
    const mins = parseFloat(m[1]) * 60 + parseInt(m[2], 10)
    return Number.isFinite(mins) && mins > 0 ? Math.round(mins) : null
  }

  m = s.match(/^(\d+(?:\.\d+)?)(h|hr|hrs|hours)$/)
  if (m) {
    const mins = parseFloat(m[1]) * 60
    return Number.isFinite(mins) && mins > 0 ? Math.round(mins) : null
  }

  m = s.match(/^(\d+(?:\.\d+)?)(m|min|mins|minutes)$/)
  if (m) {
    const mins = parseFloat(m[1])
    return Number.isFinite(mins) && mins > 0 ? Math.round(mins) : null
  }

  m = s.match(/^(\d+(?:\.\d+)?)$/)
  if (m) {
    const n = parseFloat(m[1])
    if (!Number.isFinite(n) || n <= 0) return null
    if (String(m[1]).includes('.') || n <= 8) return Math.round(n * 60)
    return Math.round(n)
  }

  return null
}

export const OUTING_VIBES = [
  { id: 'cafe', emoji: '☕', label: 'Cozy Cafe Date' },
  { id: 'park', emoji: '🌳', label: 'Park Walk & Fresh Air' },
  { id: 'mall', emoji: '🛍️', label: 'Shopping Spree / Mall' },
  { id: 'dinner', emoji: '🍽️', label: 'Dinner with Friend' },
  { id: 'family', emoji: '👨‍👩‍👧', label: 'Family Gathering' },
  { id: 'library', emoji: '📚', label: 'Library / Study Date' },
  { id: 'solo-coffee', emoji: '☕', label: 'Solo Coffee & Read' },
  { id: 'cinema', emoji: '🎬', label: 'Cinema / Movie Night' },
  { id: 'sushi', emoji: '🍣', label: 'Sushi / Restaurant Outing' },
  { id: 'sunset', emoji: '🌅', label: 'Sunset Beach / Nile Walk' },
  { id: 'museum', emoji: '🖼️', label: 'Art Gallery or Museum' },
  { id: 'grocery', emoji: '🛒', label: 'Grocery Supermarket Run' },
  { id: 'road-trip', emoji: '🚗', label: 'Long Road Trip / Drive' },
  { id: 'fair', emoji: '🎡', label: 'Fun Fair / Amusement Park' },
]

export const SALAH_PRAYERS = [
  { id: 'fajr', label: 'Fajr', emoji: '🌅' },
  { id: 'dhuhr', label: 'Dhuhr', emoji: '☀️' },
  { id: 'asr', label: 'Asr', emoji: '🌤️' },
  { id: 'maghrib', label: 'Maghrib', emoji: '🌇' },
  { id: 'isha', label: 'Isha', emoji: '🌙' },
]

export const SALAH_STATUSES = [
  { id: 'onTime', label: 'On Time', tone: 'good' },
  { id: 'late', label: 'Late', tone: 'soft' },
  { id: 'missed', label: 'Missed', tone: 'miss' },
]

export const SALAH_COUNT_OPTIONS = [
  { value: 0, label: '0' },
  { value: 1, label: '1' },
  { value: 2, label: '2' },
  { value: 3, label: '3' },
  { value: 4, label: '4' },
  { value: 5, label: '5' },
  { value: 6, label: '5+' },
]

export const PANEL_DEFAULTS = {
  rating: { choices: [], highlight: '', dayType: null, meaningful: null },
  energy: { drivers: [], drainers: [], peakTime: null, battery: null },
  shower: { choices: [], q1: null, q2: null, q3: null },
  fruits: { choices: [], servings: 0, q1: null, q2: null, q3: null },
  sweets: { choices: [], count: 0, q1: null, q2: null, q3: null },
  water: { cups: 0, ml: 0, choices: [], q1: null, q2: null, q3: null },
  sleep: {
    duration: null,
    durationSource: null,
    sleepTime: '',
    wakeTime: '',
    locations: [],
    quality: [],
    fragmentationLevel: null,
    sleepDisrupters: [],
    morningInertia: null,
    calculatedQualityScore: null,
    qualityBadge: null,
    q1: null,
    q2: null,
    q3: null,
  },
  salah: {
    prayers: {
      fajr: null,
      dhuhr: null,
      asr: null,
      maghrib: null,
      isha: null,
    },
    paintedPlus: false,
    q1: null,
    q2: null,
    q3: null,
    reflection: '',
  },
  focus: {
    minutes: 0,
    vibes: [],
    environments: [],
  },
  vitamins: { choices: [], custom: [], q1: null, q2: null, q3: null },
  study: { choices: [], duration: null, q1: null, q2: null, q3: null },
  reading: { book: '', pages: 0, choices: [], q1: null, q2: null, q3: null },
  teeth: { choices: [], q1: null, q2: null, q3: null },
  workout: { choices: [], duration: null, q1: null, q2: null, q3: null },
  outings: { withWho: '', choices: [], q1: null, q2: null, q3: null },
}

export const PASTEL_CHIP_COLORS = [
  { bg: '#FFE8F0', active: '#F5A3BC', text: '#7A3D52' },
  { bg: '#E8F4FF', active: '#8EC4F0', text: '#2F5478' },
  { bg: '#EAF8EE', active: '#8FD4A4', text: '#2F6B45' },
  { bg: '#FFF3E4', active: '#F0B87A', text: '#7A4E28' },
  { bg: '#F3E9FF', active: '#C4A3F0', text: '#5A3D7A' },
  { bg: '#E6F9F7', active: '#7DD4CB', text: '#2F6B65' },
  { bg: '#FFF8E7', active: '#F0D48A', text: '#7A6528' },
  { bg: '#FFE8E8', active: '#F0A8A8', text: '#7A3D3D' },
]
