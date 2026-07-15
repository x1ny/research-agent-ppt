import fs from 'fs'
import path from 'path'

const slidesDir = 'src/components/slides'
const files = fs.readdirSync(slidesDir).filter((f) => f.startsWith('Slide') && f.endsWith('.tsx'))
const usage = new Map()

function add(cls, owner) {
  if (!cls || cls.includes('${') || cls.includes('`')) return
  if (!usage.has(cls)) usage.set(cls, [])
  usage.get(cls).push(owner)
}

for (const f of files) {
  const c = fs.readFileSync(path.join(slidesDir, f), 'utf8')
  const owner = f.replace('.tsx', '')
  for (const m of c.matchAll(/className="([^"]+)"/g)) {
    m[1].split(/\s+/).forEach((x) => add(x, owner))
  }
  for (const m of c.matchAll(/className=\{`([^`]+)`\}/g)) {
    m[1]
      .replace(/\$\{[^}]+\}/g, ' ')
      .split(/\s+/)
      .forEach((x) => add(x, owner))
  }
}

for (const f of ['ProgressBar.tsx', 'DotNav.tsx', 'PageSeal.tsx', 'Stage.tsx', 'Track.tsx']) {
  const p = path.join('src/components', f)
  if (!fs.existsSync(p)) continue
  const c = fs.readFileSync(p, 'utf8')
  for (const m of c.matchAll(/className="([^"]+)"/g)) {
    m[1].split(/\s+/).forEach((x) => add(x, 'chrome:' + f))
  }
  for (const m of c.matchAll(/className=\{`([^`]+)`\}/g)) {
    m[1]
      .replace(/\$\{[^}]+\}/g, ' ')
      .split(/\s+/)
      .forEach((x) => add(x, 'chrome:' + f))
  }
}

const byCount = [...usage.entries()].sort((a, b) => b[1].length - a[1].length)
console.log('=== ALL CLASSES BY USAGE COUNT ===')
for (const [c, s] of byCount) {
  const uniq = [...new Set(s)]
  console.log(`${c}\t${uniq.length}\t${uniq.join(',')}`)
}
