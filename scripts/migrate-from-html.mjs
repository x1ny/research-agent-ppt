import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(__dirname, '..')
const html = fs.readFileSync(path.join(root, 'ppt.html'), 'utf8')

const SLIDE_NAMES = [
  'Slide01Title',
  'Slide02WhyNotBareModel',
  'Slide03ProblemAbstract',
  'Slide04StormLineage',
  'Slide05FiveLinks',
  'Slide06QueryIntent',
  'Slide07Perspective',
  'Slide08StormDialogue',
  'Slide09CoStorm',
  'Slide10ParseTemplate',
  'Slide11EvidenceLedger',
  'Slide12KbBridge',
  'Slide13KbRounds',
  'Slide14DraftWorkbench',
  'Slide15NextHandoff',
  'Slide16NextResearch',
  'Slide17ThankYou',
  'Slide18QA',
]

function htmlToJsx(fragment) {
  let s = fragment
  // void tags self-close
  s = s.replace(/<(br|hr|img|input|meta|link|source|area|col|embed|wbr)([^>]*?)(?<!\/)>/gi, '<$1$2 />')
  // class -> className
  s = s.replace(/\sclass=/g, ' className=')
  // for -> htmlFor
  s = s.replace(/\sfor=/g, ' htmlFor=')
  // aria / data attributes stay
  // style="a:b; c:d" -> style={{ a: 'b', c: 'd' }}
  s = s.replace(/\sstyle="([^"]*)"/g, (_, styleStr) => {
    const entries = styleStr
      .split(';')
      .map((x) => x.trim())
      .filter(Boolean)
      .map((pair) => {
        const i = pair.indexOf(':')
        const key = pair.slice(0, i).trim()
        const val = pair.slice(i + 1).trim()
        const camel = key.replace(/-([a-z])/g, (_, c) => c.toUpperCase())
        // keep numbers as strings for safety (fontSize: 82px etc)
        return `${camel}: '${val.replace(/'/g, "\\'")}'`
      })
    return ` style={{ ${entries.join(', ')} }}`
  })
  // comments
  s = s.replace(/<!--([\s\S]*?)-->/g, '{/*$1*/}')
  // Escape lone braces in text? rare in this ppt
  // tabindex -> tabIndex
  s = s.replace(/\stabindex=/g, ' tabIndex=')
  // colspan / rowspan
  s = s.replace(/\scolspan=/g, ' colSpan=')
  s = s.replace(/\srowspan=/g, ' rowSpan=')
  // stroke-width etc already in SVG attrs - React wants camelCase for SVG
  s = s.replace(/\sstroke-width=/g, ' strokeWidth=')
  s = s.replace(/\sstroke-linecap=/g, ' strokeLinecap=')
  s = s.replace(/\sstroke-linejoin=/g, ' strokeLinejoin=')
  s = s.replace(/\sstroke-dasharray=/g, ' strokeDasharray=')
  s = s.replace(/\sfill-rule=/g, ' fillRule=')
  s = s.replace(/\sclip-rule=/g, ' clipRule=')
  s = s.replace(/\sclip-path=/g, ' clipPath=')
  s = s.replace(/\sfont-size=/g, ' fontSize=')
  s = s.replace(/\sfont-family=/g, ' fontFamily=')
  s = s.replace(/\sfont-weight=/g, ' fontWeight=')
  s = s.replace(/\stext-anchor=/g, ' textAnchor=')
  s = s.replace(/\sstop-color=/g, ' stopColor=')
  s = s.replace(/\sstop-opacity=/g, ' stopOpacity=')
  s = s.replace(/\sxlink:href=/g, ' xlinkHref=')
  // &nbsp; etc ok in JSX as entities in strings but in HTML text they're fine as {'\u00A0'} or &nbsp; - React accepts &nbsp; in JSX text? Actually in JSX, &nbsp; works in some setups; safer leave as-is - React JSX supports HTML entities in text.
  return s
}

// --- CSS ---
const styleMatch = html.match(/<style>([\s\S]*?)<\/style>/)
if (!styleMatch) throw new Error('no style')
let css = styleMatch[1]

const theme = `
@import "tailwindcss";

@theme {
  --color-bg: #EFEBDD;
  --color-bg-card: #FBF9F2;
  --color-bg-card-2: #F3EEE0;
  --color-ink: #2A241D;
  --color-ink-dim: #6E6455;
  --color-seal: #A6332A;
  --color-seal-tint: rgba(166, 51, 42, 0.09);
  --color-bronze: #8C6D12;
  --color-bronze-tint: rgba(140, 109, 18, 0.09);
  --color-slate: #3D5163;
  --color-slate-tint: rgba(61, 81, 99, 0.09);
  --color-line: rgba(42, 36, 29, 0.18);
  --color-line-soft: rgba(42, 36, 29, 0.10);
  --font-display: "Noto Serif SC", "Songti SC", "STSong", "SimSun", serif;
  --font-body: "PingFang SC", "Microsoft YaHei", "Noto Sans SC", system-ui, -apple-system, sans-serif;
  --font-mono: "JetBrains Mono", "SF Mono", Consolas, "Courier New", monospace;
}

:root {
  --bg: #EFEBDD;
  --bg-card: #FBF9F2;
  --bg-card-2: #F3EEE0;
  --ink: #2A241D;
  --ink-dim: #6E6455;
  --seal: #A6332A;
  --seal-tint: rgba(166,51,42,.09);
  --bronze: #8C6D12;
  --bronze-tint: rgba(140,109,18,.09);
  --slate: #3D5163;
  --slate-tint: rgba(61,81,99,.09);
  --line: rgba(42,36,29,.18);
  --line-soft: rgba(42,36,29,.10);
  --font-display: "Noto Serif SC","Songti SC","STSong","SimSun",serif;
  --font-body: "PingFang SC","Microsoft YaHei","Noto Sans SC",system-ui,-apple-system,sans-serif;
  --font-mono: "JetBrains Mono","SF Mono",Consolas,"Courier New",monospace;
}

@layer base {
  * { box-sizing: border-box; }
  html, body, #root {
    margin: 0;
    padding: 0;
    height: 100%;
    overflow: hidden;
    font-size: 24px;
    background: var(--bg);
    background-image:
      repeating-linear-gradient(0deg, rgba(42,36,29,0.055) 0px, rgba(42,36,29,0.055) 1px, transparent 1px, transparent 36px),
      repeating-linear-gradient(90deg, rgba(42,36,29,0.055) 0px, rgba(42,36,29,0.055) 1px, transparent 1px, transparent 36px);
    color: var(--ink);
    font-family: var(--font-body);
  }
  ::selection { background: var(--seal); color: #fff; }
  :focus-visible { outline: 2px solid var(--seal); outline-offset: 3px; }
}

@layer components {
`

// Remove original :root and html,body rules that we replaced
css = css.replace(/:root\{[\s\S]*?\}/, '')
css = css.replace(/\*\{box-sizing:border-box;\}/, '')
css = css.replace(/html,body\{[\s\S]*?font-family:var\(--font-body\);\s*\}/, '')
css = css.replace(/::selection\{[^}]+\}/, '')
css = css.replace(/:focus-visible\{[^}]+\}/, '')

const indexCss = theme + css + '\n}\n'

fs.mkdirSync(path.join(root, 'src'), { recursive: true })
fs.writeFileSync(path.join(root, 'src', 'index.css'), indexCss)
console.log('wrote index.css')

// --- Slides ---
const slideRe = /<section class="slide"([^>]*)>([\s\S]*?)<\/section>/g
const slides = []
let m
while ((m = slideRe.exec(html)) !== null) {
  slides.push({ attrs: m[1].trim(), body: m[2] })
}
if (slides.length !== 18) {
  console.warn('expected 18 slides, got', slides.length)
}

const slidesDir = path.join(root, 'src', 'components', 'slides')
fs.mkdirSync(slidesDir, { recursive: true })

// Parse with regex that captures full class (e.g. "slide storm-slide")
const slideRe2 = /<section class="(slide[^"]*)"([^>]*)>([\s\S]*?)<\/section>/g
const slides2 = []
while ((m = slideRe2.exec(html)) !== null) {
  slides2.push({ className: m[1], attrs: m[2].trim(), body: m[3] })
}
console.log('slides2', slides2.length)

const imports = []
const renderList = []

slides2.forEach((slide, i) => {
  const name = SLIDE_NAMES[i] || `Slide${String(i + 1).padStart(2, '0')}`
  const isCostorm = slide.body.includes('data-costorm-tab')

  let styleProp = ''
  if (slide.attrs.includes('style=')) {
    const sm = slide.attrs.match(/style="([^"]*)"/)
    if (sm) {
      const entries = sm[1]
        .split(';')
        .map((x) => x.trim())
        .filter(Boolean)
        .map((pair) => {
          const idx = pair.indexOf(':')
          const key = pair.slice(0, idx).trim()
          const val = pair.slice(idx + 1).trim()
          const camel = key.replace(/-([a-z])/g, (_, c) => c.toUpperCase())
          return `${camel}: '${val}'`
        })
      styleProp = ` style={{ ${entries.join(', ')} }}`
    }
  }

  let bodyJsx = htmlToJsx(slide.body)

  if (isCostorm) {
    // Replace static tabs with CoStormTabs component usage - leave structure, wrap in component file differently
    // We'll generate a special component that uses useState
    const file = `import { useState } from 'react'

export default function ${name}() {
  const [tab, setTab] = useState<'transcript' | 'result'>('transcript')

  return (
    <section className="${slide.className}"${styleProp}>
${transformCostorm(bodyJsx)}
    </section>
  )
}
`
    fs.writeFileSync(path.join(slidesDir, `${name}.tsx`), file)
  } else {
    const file = `export default function ${name}() {
  return (
    <section className="${slide.className}"${styleProp}>
${bodyJsx}
    </section>
  )
}
`
    fs.writeFileSync(path.join(slidesDir, `${name}.tsx`), file)
  }
  imports.push(`import ${name} from './${name}'`)
  renderList.push(`  ${name},`)
})

function transformCostorm(bodyJsx) {
  // Convert tab buttons to onClick handlers
  let s = bodyJsx
  s = s.replace(
    /<button className="costorm-tab active" data-costorm-tab="transcript" aria-selected="true">对话实录<\/button>/,
    `<button type="button" className={\`costorm-tab\${tab === 'transcript' ? ' active' : ''}\`} aria-selected={tab === 'transcript'} onClick={() => setTab('transcript')}>对话实录</button>`,
  )
  s = s.replace(
    /<button className="costorm-tab" data-costorm-tab="result" aria-selected="false">结构化产出<\/button>/,
    `<button type="button" className={\`costorm-tab\${tab === 'result' ? ' active' : ''}\`} aria-selected={tab === 'result'} onClick={() => setTab('result')}>结构化产出</button>`,
  )
  s = s.replace(
    /<div className="costorm-panel active" data-costorm-panel="transcript">/,
    `<div className={\`costorm-panel\${tab === 'transcript' ? ' active' : ''}\`}>`,
  )
  s = s.replace(
    /<div className="costorm-panel" data-costorm-panel="result">/,
    `<div className={\`costorm-panel\${tab === 'result' ? ' active' : ''}\`}>`,
  )
  return s
}

const indexTsx = `${imports.join('\n')}

export const slides = [
${renderList.join('\n')}
] as const

export const TOTAL_SLIDES = slides.length
`
fs.writeFileSync(path.join(slidesDir, 'index.ts'), indexTsx)
console.log('wrote', slides2.length, 'slides')
console.log('costorm at', slides2.findIndex((s) => s.body.includes('data-costorm-tab')))
