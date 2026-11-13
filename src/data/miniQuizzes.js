export const QUIZ_DEFAULTS = { q1: null, q2: null, q3: null }

export const SHOWER_QUIZ = [
  {
    key: 'q1',
    question: 'What kind of shower vibe was it today?',
    options: [
      { id: 'quick', emoji: '⚡', label: 'Quick 5-Min Rinse' },
      { id: 'spa', emoji: '🧖‍♀️', label: 'Full Spa & Self-Care' },
      { id: 'relaxing', emoji: '🌡️', label: 'Warm & Relaxing' },
    ],
  },
  {
    key: 'q2',
    question: 'What water temperature did you go for?',
    options: [
      { id: 'hot', emoji: '♨️', label: 'Hot & Steamy' },
      { id: 'warm', emoji: '⚖️', label: 'Just Warm' },
      { id: 'cold', emoji: '❄️', label: 'Refreshing Cold' },
    ],
  },
  {
    key: 'q3',
    question: 'How do you feel stepping out?',
    options: [
      { id: 'reborn', emoji: '✨', label: 'Fresh & Reborn' },
      { id: 'pampered', emoji: '🧴', label: 'Soft & Pampered' },
      { id: 'bed', emoji: '😴', label: 'Ready for Bed' },
    ],
  },
]

export const FRUITS_QUIZ = [
  {
    key: 'q1',
    question: 'How did you enjoy your fruit today?',
    options: [
      { id: 'whole', emoji: '🍎', label: 'Fresh & Whole' },
      { id: 'smoothie', emoji: '🥤', label: 'Blended Smoothie' },
      { id: 'bowl', emoji: '🥗', label: 'Mixed Fruit Bowl' },
    ],
  },
  {
    key: 'q2',
    question: 'When did you have your fruit serving?',
    options: [
      { id: 'morning', emoji: '🌅', label: 'Morning Kickstart' },
      { id: 'afternoon', emoji: '☀️', label: 'Afternoon Snack' },
      { id: 'evening', emoji: '🌙', label: 'Evening Sweet Fix' },
    ],
  },
  {
    key: 'q3',
    question: 'Did it hit the spot?',
    options: [
      { id: 'refreshing', emoji: '😋', label: 'So Refreshing!' },
      { id: 'healthy', emoji: '⚖️', label: 'Light & Healthy' },
      { id: 'craving', emoji: '➕', label: 'Still Craving Sweets' },
    ],
  },
]

export const SWEETS_QUIZ = [
  {
    key: 'q1',
    question: 'What was the sweet treat occasion?',
    options: [
      { id: 'coffee', emoji: '☕', label: 'Coffee / Tea Companion' },
      { id: 'reward', emoji: '🎉', label: 'Reward / Celebration' },
      { id: 'craving', emoji: '🤤', label: 'Random Craving' },
    ],
  },
  {
    key: 'q2',
    question: 'How big was the indulgence?',
    options: [
      { id: 'tiny', emoji: '🤏', label: 'Just a Tiny Bite' },
      { id: 'normal', emoji: '🧁', label: 'Normal Portion' },
      { id: 'allout', emoji: '🍰', label: 'Went All Out' },
    ],
  },
  {
    key: 'q3',
    question: 'How do you feel afterward?',
    options: [
      { id: 'worth', emoji: '🥰', label: '100% Worth It' },
      { id: 'fine', emoji: '⚖️', label: 'Totally Fine' },
      { id: 'crash', emoji: '😵', label: 'Sugar Crash' },
    ],
  },
]

export const WATER_QUIZ = [
  {
    key: 'q1',
    question: 'How steady was your hydration today?',
    options: [
      { id: 'early', emoji: '🌅', label: 'Started Early & Strong' },
      { id: 'sipping', emoji: '⏱️', label: 'Sipping All Day' },
      { id: 'late', emoji: '🌙', label: 'Chugged It Late' },
    ],
  },
  {
    key: 'q2',
    question: 'What kept you hydrated the most?',
    options: [
      { id: 'plain', emoji: '💧', label: 'Plain Cold Water' },
      { id: 'infused', emoji: '🍋', label: 'Infused / Electrolytes' },
      { id: 'tea', emoji: '🍵', label: 'Herbal Tea / Drinks' },
    ],
  },
  {
    key: 'q3',
    question: 'How does your body feel right now?',
    options: [
      { id: 'glowing', emoji: '✨', label: 'Hydrated & Glowing' },
      { id: 'okay', emoji: '⚖️', label: 'Doing Okay' },
      { id: 'thirsty', emoji: '🏜️', label: 'Still Thirsty' },
    ],
  },
]

export const SLEEP_QUIZ = [
  {
    key: 'q1',
    question: 'How easily did you fall asleep?',
    options: [
      { id: 'light', emoji: '😴', label: 'Out Like a Light' },
      { id: 'tossed', emoji: '⏳', label: 'Tossed & Turned a Bit' },
      { id: 'scrolling', emoji: '📱', label: 'Stayed Up Scrolling' },
    ],
  },
  {
    key: 'q2',
    question: 'How did you feel when the alarm went off?',
    options: [
      { id: 'ready', emoji: '☀️', label: 'Refreshed & Ready' },
      { id: 'fivemore', emoji: '🥱', label: 'Needed 5 More Mins' },
      { id: 'zombie', emoji: '🧟', label: 'Total Zombie Mode' },
    ],
  },
  {
    key: 'q3',
    question: 'Did your sleep feel restorative?',
    options: [
      { id: 'deep', emoji: '🔋', label: 'Deep & Restful' },
      { id: 'average', emoji: '⚖️', label: 'Average Night' },
      { id: 'nap', emoji: '💤', label: 'Need a Nap Today' },
    ],
  },
]

export const WORKOUT_QUIZ = [
  {
    key: 'q1',
    question: 'How hard did you push yourself today?',
    options: [
      { id: 'light', emoji: '🚶', label: 'Light & Easy Movement' },
      { id: 'solid', emoji: '💪', label: 'Solid Steady Effort' },
      { id: 'beast', emoji: '🔥', label: 'Beast Mode Unlocked' },
    ],
  },
  {
    key: 'q2',
    question: 'How was your energy during the session?',
    options: [
      { id: 'unstoppable', emoji: '⚡', label: 'Unstoppable' },
      { id: 'paced', emoji: '⚖️', label: 'Paced Myself' },
      { id: 'struggled', emoji: '😮‍💨', label: 'Struggled to Finish' },
    ],
  },
  {
    key: 'q3',
    question: 'What is your post-workout mood?',
    options: [
      { id: 'proud', emoji: '🏆', label: 'Proud & Accomplished' },
      { id: 'calm', emoji: '😌', label: 'Calm Endorphins' },
      { id: 'sore', emoji: '🦵', label: 'Sore & Ready to Rest' },
    ],
  },
]

export const TEETH_QUIZ = [
  {
    key: 'q1',
    question: 'How thorough was your dental care today?',
    options: [
      { id: 'full', emoji: '✨', label: 'Full Routine (Brush + Floss)' },
      { id: 'standard', emoji: '🪥', label: 'Standard Brushing' },
      { id: 'rush', emoji: '⚡', label: 'Quick Rush' },
    ],
  },
  {
    key: 'q2',
    question: 'Did you stay consistent morning and night?',
    options: [
      { id: 'both', emoji: '✅', label: 'Both Morning & Night' },
      { id: 'morning', emoji: '🌅', label: 'Morning Only' },
      { id: 'night', emoji: '🌙', label: 'Night Only' },
    ],
  },
  {
    key: 'q3',
    question: 'How do your teeth and gums feel?',
    options: [
      { id: 'clean', emoji: '😁', label: 'Squeaky Clean & Fresh' },
      { id: 'normal', emoji: '⚖️', label: 'Normal' },
      { id: 'sensitive', emoji: '⚠️', label: 'A Bit Sensitive' },
    ],
  },
]

export const OUTINGS_QUIZ = [
  {
    key: 'q1',
    question: 'Who did you spend this outing with?',
    options: [
      { id: 'solo', emoji: '🧍', label: 'Peaceful Solo Date' },
      { id: 'friends', emoji: '👯', label: 'Bestie / Friends' },
      { id: 'family', emoji: '👨‍👩‍👧', label: 'Family / Partner' },
    ],
  },
  {
    key: 'q2',
    question: 'What was the main vibe of going out?',
    options: [
      { id: 'cafe', emoji: '☕', label: 'Cozy Cafe & Chill' },
      { id: 'adventure', emoji: '🎉', label: 'Fun Adventure' },
      { id: 'errands', emoji: '🛍️', label: 'Productive Errands' },
    ],
  },
  {
    key: 'q3',
    question: 'How did going out affect your mood?',
    options: [
      { id: 'recharged', emoji: '🔋', label: 'Recharged My Spirit' },
      { id: 'pace', emoji: '⚖️', label: 'Nice Change of Pace' },
      { id: 'home', emoji: '🪫', label: 'Ready to Go Home' },
    ],
  },
]

export const VITAMINS_QUIZ = [
  {
    key: 'q1',
    question: 'When did you take your supplements today?',
    options: [
      { id: 'breakfast', emoji: '🍳', label: 'With Breakfast' },
      { id: 'lunch', emoji: '🥗', label: 'With Lunch' },
      { id: 'bed', emoji: '🌙', label: 'Before Bed' },
    ],
  },
  {
    key: 'q2',
    question: 'How consistent have you been lately?',
    options: [
      { id: 'schedule', emoji: '🎯', label: 'Right on Schedule' },
      { id: 'late', emoji: '⏰', label: 'Took Them Late' },
      { id: 'track', emoji: '🔄', label: 'Getting Back on Track' },
    ],
  },
  {
    key: 'q3',
    question: 'Did you take them with enough water & food?',
    options: [
      { id: 'meal', emoji: '💧', label: 'Yes, Full Meal & Water' },
      { id: 'sip', emoji: '🤏', label: 'Just a Quick Sip' },
      { id: 'empty', emoji: '⚠️', label: 'On an Empty Stomach' },
    ],
  },
]

export const READING_QUIZ = [
  {
    key: 'q1',
    question: 'How did you read today?',
    options: [
      { id: 'physical', emoji: '📖', label: 'Physical Book' },
      { id: 'kindle', emoji: '📱', label: 'Kindle / E-Reader' },
      { id: 'audio', emoji: '🎧', label: 'Audiobook' },
    ],
  },
  {
    key: 'q2',
    question: 'How focused were you during your session?',
    options: [
      { id: 'hooked', emoji: '🤿', label: 'Completely Hooked' },
      { id: 'casual', emoji: '☕', label: 'Relaxed Casual Read' },
      { id: 'reread', emoji: '😴', label: 'Kept Re-reading Lines' },
    ],
  },
  {
    key: 'q3',
    question: "What did you get out of today's pages?",
    options: [
      { id: 'idea', emoji: '💡', label: 'New Idea / Inspired' },
      { id: 'escape', emoji: '🧘', label: 'Peaceful Escape' },
      { id: 'goal', emoji: '📈', label: 'Closer to My Goal' },
    ],
  },
]

export const STUDY_QUIZ = [
  {
    key: 'q1',
    question: 'What type of growth did you focus on?',
    options: [
      { id: 'course', emoji: '🎥', label: 'Course / Tutorial' },
      { id: 'planning', emoji: '✍️', label: 'Planning & Journaling' },
      { id: 'practice', emoji: '🧠', label: 'Hands-on Practice' },
    ],
  },
  {
    key: 'q2',
    question: "How challenging was today's session?",
    options: [
      { id: 'easy', emoji: '🌱', label: 'Easy & Enjoyable' },
      { id: 'stretch', emoji: '🧩', label: 'Stretched My Brain' },
      { id: 'comfort', emoji: '🔥', label: 'Out of My Comfort Zone' },
    ],
  },
  {
    key: 'q3',
    question: 'What is your biggest takeaway today?',
    options: [
      { id: 'aha', emoji: '💡', label: 'Aha! Breakthrough' },
      { id: 'brick', emoji: '🧱', label: 'One Brick Closer' },
      { id: 'review', emoji: '🔄', label: 'Good Review' },
    ],
  },
]
