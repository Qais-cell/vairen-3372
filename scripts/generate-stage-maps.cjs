// Original, resolution-independent diagrams based on Vairen's bilingual study notes.
const fs = require('node:fs')
const vm = require('node:vm')
const ts = require('typescript')
const sandbox = { exports: {} }
vm.runInNewContext(ts.transpileModule(fs.readFileSync('db/seeds/learning.ts', 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText, sandbox)
const { seedCourses, seedLessons } = sandbox.exports
const escape = value => value.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;')
fs.mkdirSync('public/images/stages', { recursive: true })
for (const lesson of seedLessons) {
  const course = seedCourses.find(c => c.id === lesson.courseId)
  for (const locale of ['en', 'ar']) {
    const ar = locale === 'ar'
    const sections = lesson.content.sections
    const height = 300 + sections.length * 110
    const rows = sections.map((section, i) => {
      const y = 260 + i * 110
      return `<path d="M72 ${y}v110" stroke="#345247" stroke-width="2"/><rect x="48" y="${y - 24}" width="48" height="48" rx="14" fill="#233d32" stroke="#9ac7a6"/><text x="72" y="${y + 6}" text-anchor="middle" fill="#b9debb" font-size="18">${i + 1}</text><rect x="120" y="${y - 35}" width="1010" height="72" rx="16" fill="#182a23"/><text x="${ar ? 1095 : 148}" y="${y + 8}" text-anchor="${ar ? 'end' : 'start'}" direction="${ar ? 'rtl' : 'ltr'}" fill="#e7eee8" font-size="24">${escape(section.title[locale])}</text>`
    }).join('')
    fs.writeFileSync(`public/images/stages/${lesson.id}-${locale}.svg`, `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="${height}" viewBox="0 0 1200 ${height}" role="img"><title>${escape(lesson.title[locale])}</title><rect width="1200" height="${height}" rx="28" fill="#101d18"/><g font-family="sans-serif"><text x="60" y="60" fill="#a9c9af" font-size="18">VAIREN / ${String(lesson.position).padStart(2, '0')}</text><text x="${ar ? 1140 : 60}" y="120" direction="${ar ? 'rtl' : 'ltr'}" text-anchor="${ar ? 'end' : 'start'}" fill="#f0f3ec" font-size="30">${escape(lesson.title[locale])}</text><text x="${ar ? 1140 : 60}" y="168" direction="${ar ? 'rtl' : 'ltr'}" text-anchor="${ar ? 'end' : 'start'}" fill="#a9bcb0" font-size="21">${escape(course.title[locale])}</text>${rows}</g></svg>`)
  }
}
console.log(`Generated ${seedLessons.length * 2} bilingual stage diagrams.`)
