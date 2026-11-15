/** Soft, rotating daily lines shown near the journal header. */
export const DAILY_WHISPERS = [
  { emoji: '🌿', text: 'Small consistency is still a kind of magic.' },
  { emoji: '✨', text: 'Today does not need to be perfect to be precious.' },
  { emoji: '🫖', text: 'Warm pages. Soft progress. You are allowed to begin gently.' },
  { emoji: '🌙', text: 'Rest counts. Showing up softly still counts.' },
  { emoji: '🌸', text: 'Notice one lovely thing, then write it down.' },
  { emoji: '🕯️', text: 'A quiet check-in is still an act of care.' },
  { emoji: '🍃', text: 'You do not have to finish everything to be proud.' },
  { emoji: '💛', text: 'Be a soft place for yourself today.' },
  { emoji: '🌊', text: 'One honest pixel is better than a perfect blank page.' },
  { emoji: '☁️', text: 'Slow days are part of the story, too.' },
  { emoji: '🌷', text: 'Tend your habits like a tiny garden — light water, lots of kindness.' },
  { emoji: '🪽', text: 'Future-you is already grateful for this gentle note.' },
  { emoji: '🫧', text: 'Let the journal hold what your mind is carrying.' },
  { emoji: '☀️', text: 'A bright intention can be as small as a sip of water.' },
  { emoji: '📖', text: 'Turn the page with curiosity, not pressure.' },
]

export function whisperForDate(date = new Date()) {
  const start = new Date(date.getFullYear(), 0, 0)
  const dayOfYear = Math.floor((date - start) / 86_400_000)
  return DAILY_WHISPERS[Math.abs(dayOfYear) % DAILY_WHISPERS.length]
}
