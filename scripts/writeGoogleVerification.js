import fs from 'node:fs'
import path from 'node:path'

/** Load KEY=VALUE pairs from a local .env (no dependency). Does not override existing env. */
function loadEnvFile(filePath) {
  if (!fs.existsSync(filePath)) return
  const text = fs.readFileSync(filePath, 'utf8')
  for (const rawLine of text.split(/\r?\n/)) {
    const line = rawLine.trim()
    if (!line || line.startsWith('#')) continue
    const eq = line.indexOf('=')
    if (eq <= 0) continue
    const key = line.slice(0, eq).trim()
    let value = line.slice(eq + 1).trim()
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1)
    }
    if (process.env[key] === undefined) process.env[key] = value
  }
}

loadEnvFile(path.resolve(process.cwd(), '.env'))

/**
 * Writes Google Search Console HTML verification into public/ at build time.
 * Content comes from env (host build env / local .env) so the file is never committed.
 *
 * GOOGLE_SITE_VERIFICATION_FILENAME=google………….html
 * GOOGLE_SITE_VERIFICATION_CONTENT=google-site-verification: google………….html
 */
const filename = process.env.GOOGLE_SITE_VERIFICATION_FILENAME?.trim()
const content = process.env.GOOGLE_SITE_VERIFICATION_CONTENT?.trim()

const publicDir = path.resolve(process.cwd(), 'public')

if (!filename || !content) {
  console.log(
    '[google-verify] skipped (set GOOGLE_SITE_VERIFICATION_FILENAME + GOOGLE_SITE_VERIFICATION_CONTENT to emit the file)',
  )
  process.exit(0)
}

if (
  !/^google[a-z0-9]+\.html$/i.test(filename) ||
  filename.includes('..') ||
  filename.includes('/') ||
  filename.includes('\\')
) {
  console.error('[google-verify] invalid GOOGLE_SITE_VERIFICATION_FILENAME')
  process.exit(1)
}

fs.mkdirSync(publicDir, { recursive: true })
const outPath = path.join(publicDir, filename)
fs.writeFileSync(outPath, `${content}\n`, 'utf8')
console.log(`[google-verify] wrote public/${filename}`)
