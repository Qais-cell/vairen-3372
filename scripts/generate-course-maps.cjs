const fs = require('node:fs')
const vm = require('node:vm')
const ts = require('typescript')
const path = require('node:path')
const source = fs.readFileSync(path.join(__dirname, '../db/seeds/learning.ts'), 'utf8')
const sandbox = { exports: {} }
vm.runInNewContext(
  ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText,
  sandbox,
)
const escape = (value) =>
  value.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;')
const destination = path.join(__dirname, '../public/images/courses')
fs.mkdirSync(destination, { recursive: true })
for (const course of sandbox.exports.seedCourses)
  for (const locale of ['en', 'ar']) {
    const ar = locale === 'ar'
    const title = escape(course.title[locale])
    const labels = ar
      ? ['شاهد وافهم', 'طبّق واختبر', 'اشرح قراراتك']
      : ['WATCH & UNDERSTAND', 'BUILD & TEST', 'EXPLAIN YOUR CHOICES']
    const nodes = course.outcomes
      .map((outcome, index) => {
        const y = 195 + index * 83
        const text = escape(outcome[locale])
        return `<g><path d="M150 ${y + 28}H220" stroke="#8da78f" stroke-width="2"/><circle cx="150" cy="${y + 28}" r="8" fill="#386747"/><rect x="220" y="${y}" width="690" height="58" rx="16" fill="#fff" stroke="#c2d3bf"/><text x="${ar ? 880 : 245}" y="${y + 37}" text-anchor="${ar ? 'end' : 'start'}" font-size="${text.length > 40 ? 19 : 23}" fill="#25432f">${index + 1}. ${text}</text></g>`
      })
      .join('')
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1000" height="580" viewBox="0 0 1000 580" role="img" aria-labelledby="title"><title id="title">${title}</title><defs><pattern id="dots" width="30" height="30" patternUnits="userSpaceOnUse"><circle cx="1" cy="1" r="1" fill="#a0b59c" opacity=".35"/></pattern></defs><rect width="1000" height="580" fill="#edf2e9"/><rect width="1000" height="580" fill="url(#dots)"/><g font-family="'IBM Plex Sans Arabic', 'Manrope', sans-serif"><text x="${ar ? 930 : 70}" y="58" text-anchor="${ar ? 'end' : 'start'}" font-size="15" letter-spacing="2" fill="#527457">${ar ? 'فايرين / خريطة الدورة' : 'VAIREN / COURSE MAP'}</text><text x="${ar ? 930 : 70}" y="120" text-anchor="${ar ? 'end' : 'start'}" font-size="${title.length > 45 ? 29 : 34}" font-weight="600" fill="#1c3d28">${title}</text><path d="M150 178V${195 + (course.outcomes.length - 1) * 83 + 28}" stroke="#8da78f" stroke-width="2"/>${nodes}<path d="M170 495H830" stroke="#9cb49c" stroke-width="2"/>${labels
      .map((text, index) => {
        const x = ar ? 820 - index * 320 : 180 + index * 320
        return `<rect x="${x - 140}" y="468" width="280" height="56" rx="28" fill="${index === 2 ? '#244a34' : '#fff'}" stroke="#bbceb6"/><text x="${x}" y="503" text-anchor="middle" font-size="16" fill="${index === 2 ? '#f1f6ec' : '#244a34'}">${text}</text>`
      })
      .join('')}</g></svg>`
    fs.writeFileSync(path.join(destination, `${course.id}-${locale}.svg`), svg)
  }
console.log(`Generated ${sandbox.exports.seedCourses.length * 2} course-specific learning diagrams.`)
