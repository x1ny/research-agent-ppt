import fs from 'fs'
import path from 'path'

const names = new Set([
  'slide', 'eyebrow', 'slide-title', 'headrule', 'content', 'caption', 'chip', 'chip-row',
  'flow', 'flow-node', 'n-red', 'n-gold', 'arrow', 'grid-2x2', 'grid-card', 'stepper', 'step',
  'steplink', 'abstract-slide', 'storm-slide', 'storm-meta', 'storm-layout', 'storm-perspectives',
  'storm-perspective', 'storm-dialogue', 'storm-pair', 'storm-round', 'storm-caption',
  'costorm-tabs', 'costorm-tab', 'costorm-panel', 'costorm-transcript', 'costorm-turn',
  'costorm-speaker', 'costorm-bubble', 'costorm-result', 'costorm-result-grid', 'costorm-result-card',
  'perspective-slide', 'perspective-flow', 'perspective-card', 'query-flow', 'query-card',
  'parse-grid', 'parse-column', 'kb-console', 'kb-console-head', 'kb-console-body',
  'draft-workbench', 'draft-workbench-head', 'draft-workbench-grid', 'tickets', 'ticket',
  'pin-row', 'pin', 'window', 'window-bar', 'window-body', 'timeline', 'tl-item', 'radial',
  'c-red', 'c-gold', 'c-slate', 'slide-sub', 'progress', 'dots', 'dot', 'seal',
])

function walk(dir, out = []) {
  for (const f of fs.readdirSync(dir)) {
    const p = path.join(dir, f)
    if (fs.statSync(p).isDirectory()) walk(p, out)
    else if (/\.tsx$/.test(f)) out.push(p)
  }
  return out
}

const hits = []
for (const file of walk('src/components')) {
  const c = fs.readFileSync(file, 'utf8')
  const tokens = new Set()
  for (const m of c.matchAll(/className="([^"]+)"/g)) {
    m[1].split(/\s+/).forEach((t) => tokens.add(t))
  }
  for (const m of c.matchAll(/className=\{`([^`]+)`\}/g)) {
    m[1]
      .replace(/\$\{[^}]+\}/g, ' ')
      .split(/\s+/)
      .forEach((t) => tokens.add(t))
  }
  for (const t of tokens) {
    if (names.has(t) || [...names].some((n) => n.endsWith('-') === false && t.startsWith('costorm-') && names.has(t))) {
      if (names.has(t)) hits.push(`${file}: ${t}`)
    }
    if (/^(costorm-|kb-|draft-|query-|parse-|perspective-|storm-)/.test(t) && !t.includes('[')) {
      hits.push(`${file}: ${t}`)
    }
  }
}

const uniq = [...new Set(hits)]
console.log(uniq.length ? uniq.join('\n') : 'NONE')
