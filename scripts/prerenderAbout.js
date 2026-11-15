import fs from 'node:fs'
import path from 'node:path'

const SITE = 'https://www.myselfix.me'
const ABOUT_TITLE = 'About Selfix Life · Year in Pixels Journal — Soft Pastel Habit & Mood Tracking'
const ABOUT_DESCRIPTION =
  'Selfix Life is a soft pastel space for your days, thoughts, and memories. Learn how Year in Pixels helps you track sleep, mood, habits, and daily notes with calm visual clarity.'

const ABOUT_BODY = `
<article class="seo-prerender" style="max-width:42rem;margin:2rem auto;padding:0 1.25rem;font-family:system-ui,sans-serif;line-height:1.65;color:#5a4550">
  <p><a href="/">Selfix Life</a> · About</p>
  <h1>Selfix Life — a soft space for your days, thoughts, and memories</h1>
  <p>
    Selfix Life is not a spreadsheet. It is a cozy Year in Pixels journal for painting your year in gentle
    pastel pixels — sleep, mood, habits, and daily notes gathered into a mosaic you can read at a glance.
  </p>
  <h2>Our story</h2>
  <p>
    Journaling should feel like opening a favorite notebook, not staring at a cold dashboard. Inspired by
    the classic Year in Pixels method, Selfix Life wraps that idea in an open-book experience with soft colors,
    binder tabs, and room to breathe on low-energy days.
  </p>
  <h2>How it works</h2>
  <ol>
    <li><strong>Select</strong> — touch a quiet square on your year grid.</li>
    <li><strong>Color</strong> — paint that day in a gentle pastel that matches how it felt.</li>
    <li><strong>Reflect</strong> — add chips, mini-quizzes, or a short private note beside the pixel.</li>
  </ol>
  <h2>Core features</h2>
  <ul>
    <li>Year in Pixels visual grids</li>
    <li>Sleep tracking</li>
    <li>Mood and energy tracking</li>
    <li>Habit tracking (hydration, focus, workouts, reading, and more)</li>
    <li>Daily journal notes</li>
    <li>Soft Rose and Midnight Soft themes</li>
  </ul>
  <p><a href="${SITE}/">Open Selfix Life</a> · <a href="${SITE}/contact">Contact</a></p>
</article>
`.trim()

function replaceMeta(html, { title, description, url, type = 'website' }) {
  let next = html
  next = next.replace(/<title>[\s\S]*?<\/title>/, `<title>${title}</title>`)
  next = next.replace(
    /<meta\s+name="description"\s+content="[^"]*"\s*\/?>/,
    `<meta name="description" content="${description}" />`,
  )
  next = next.replace(
    /<link\s+rel="canonical"\s+href="[^"]*"\s*\/?>/,
    `<link rel="canonical" href="${url}" />`,
  )
  next = next.replace(
    /<meta\s+property="og:url"\s+content="[^"]*"\s*\/?>/,
    `<meta property="og:url" content="${url}" />`,
  )
  next = next.replace(
    /<meta\s+property="og:type"\s+content="[^"]*"\s*\/?>/,
    `<meta property="og:type" content="${type}" />`,
  )
  next = next.replace(
    /<meta\s+property="og:title"\s+content="[^"]*"\s*\/?>/,
    `<meta property="og:title" content="${title}" />`,
  )
  next = next.replace(
    /<meta\s+property="og:description"\s+content="[^"]*"\s*\/?>/,
    `<meta property="og:description" content="${description}" />`,
  )
  next = next.replace(
    /<meta\s+name="twitter:title"\s+content="[^"]*"\s*\/?>/,
    `<meta name="twitter:title" content="${title}" />`,
  )
  next = next.replace(
    /<meta\s+name="twitter:description"\s+content="[^"]*"\s*\/?>/,
    `<meta name="twitter:description" content="${description}" />`,
  )
  return next
}

export function prerenderAboutPlugin() {
  return {
    name: 'selfix-prerender-about',
    apply: 'build',
    closeBundle() {
      const distDir = path.resolve(process.cwd(), 'dist')
      const indexPath = path.join(distDir, 'index.html')
      if (!fs.existsSync(indexPath)) {
        console.warn('[prerender-about] dist/index.html missing — skip')
        return
      }

      const indexHtml = fs.readFileSync(indexPath, 'utf8')
      let aboutHtml = replaceMeta(indexHtml, {
        title: ABOUT_TITLE,
        description: ABOUT_DESCRIPTION,
        url: `${SITE}/about`,
        type: 'article',
      })

      // Seed crawlable content inside #root; React replaces it on mount (UI unchanged).
      aboutHtml = aboutHtml.replace(
        /<div id="root"><\/div>/,
        `<div id="root">${ABOUT_BODY}</div>`,
      )

      // Enrich noscript for the about route as well.
      aboutHtml = aboutHtml.replace(
        /<noscript>[\s\S]*?<\/noscript>/,
        `<noscript>${ABOUT_BODY}</noscript>`,
      )

      const aboutDir = path.join(distDir, 'about')
      fs.mkdirSync(aboutDir, { recursive: true })
      fs.writeFileSync(path.join(aboutDir, 'index.html'), aboutHtml, 'utf8')
      console.log('[prerender-about] wrote dist/about/index.html')
    },
  }
}
