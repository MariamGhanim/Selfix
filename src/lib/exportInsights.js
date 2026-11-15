import { buildExportReport } from './insights'

export function downloadTextReport(data, categoryLabel) {
  const text = buildExportReport(data, categoryLabel)
  const blob = new Blob([text], { type: 'text/plain;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `selfix-insights-${data.bounds.label.replace(/[^\w\-]+/g, '_')}.txt`
  document.body.appendChild(a)
  a.click()
  a.remove()
  URL.revokeObjectURL(url)
}

export function openPrintableReport(data, categoryLabel) {
  const text = buildExportReport(data, categoryLabel)
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Selfix Insights Report — ${data.bounds.label}</title>
  <style>
    body { font-family: Georgia, 'Times New Roman', serif; color: #5a4550; background: #fff9f6; margin: 0; padding: 32px; }
    h1 { font-size: 22px; margin: 0 0 4px; }
    .meta { color: #8a707a; font-size: 13px; margin-bottom: 24px; }
    pre { white-space: pre-wrap; font-family: ui-monospace, Consolas, monospace; font-size: 12px; line-height: 1.55; background: #fff; border: 1px solid #ead6dc; border-radius: 16px; padding: 20px; }
    .actions { margin-bottom: 16px; }
    button { border: 0; background: #b87a8c; color: #fff; border-radius: 999px; padding: 8px 14px; font-weight: 700; cursor: pointer; }
    @media print { .actions { display: none; } body { padding: 12px; } }
  </style>
</head>
<body>
  <div class="actions"><button onclick="window.print()">Save / Print as PDF</button></div>
  <h1>Selfix Analytics Report</h1>
  <p class="meta">${data.bounds.label} · ${categoryLabel}</p>
  <pre>${text.replace(/</g, '&lt;')}</pre>
</body>
</html>`
  const win = window.open('', '_blank', 'noopener,noreferrer,width=900,height=700')
  if (!win) {
    downloadTextReport(data, categoryLabel)
    return
  }
  win.document.write(html)
  win.document.close()
}
