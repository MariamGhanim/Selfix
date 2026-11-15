/**
 * Selfix Life — ambient playlist
 *
 * Use direct audio file URLs only (`.mp3`, `.ogg`, `.wav`) — not YouTube pages.
 *
 * Bundled tracks live in `/public/audio` (served as `/audio/...`) so they work
 * out-of-the-box from your own host with no CORS or YouTube dependency.
 *
 * ---------------------------------------------------------------------------
 * HOW TO ADD MORE TRACKS (Pixabay / Mixkit / Wikimedia CC0)
 * ---------------------------------------------------------------------------
 * 1. Download a royalty-free MP3 (Pixabay Sound Effects or Mixkit Free SFX)
 * 2. Drop it in `public/audio/your-file.mp3`
 * 3. Append an entry below:
 *
 *    {
 *      id: 'my-track',
 *      title: 'My calm track',
 *      url: '/audio/your-file.mp3',
 *    },
 *
 * Or paste a direct HTTPS preview URL (must end in .mp3 and allow CORS/hotlink):
 *
 *    url: 'https://assets.mixkit.co/active_storage/sfx/2393/2393-preview.mp3'
 *
 * Sources used here: Mixkit free sound effects (royalty-free under Mixkit License).
 */
export const AMBIENT_TRACKS = [
  {
    id: 'soft-rain',
    title: 'Soft rain',
    url: '/audio/soft-rain.mp3',
  },
  {
    id: 'light-rain',
    title: 'Light rain ambience',
    url: '/audio/light-rain.mp3',
  },
  {
    id: 'forest-birds',
    title: 'Forest birds',
    url: '/audio/forest-birds.mp3',
  },
  {
    id: 'night-ambience',
    title: 'Night ambience',
    url: '/audio/night-ambience.mp3',
  },
  {
    id: 'cafe-ambience',
    title: 'Cafe ambience',
    url: '/audio/cafe-ambience.mp3',
  },
]

export default AMBIENT_TRACKS
