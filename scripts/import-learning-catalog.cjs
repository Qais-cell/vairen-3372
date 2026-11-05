// Generate a NEW data-only migration; never overwrite an existing migration.
// Fetch only public video metadata. Videos remain hosted by the original publishers.
const fs = require('node:fs')
const path = require('node:path')
const vm = require('node:vm')
const ts = require('typescript')
const input = fs.readFileSync(path.join(__dirname, '../db/seeds/learning.ts'), 'utf8')
const code = ts.transpileModule(input, { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText
const sandbox = { exports: {} }
vm.runInNewContext(code, sandbox)
const { seedCourses, seedLessons } = sandbox.exports
const sql = (value) =>
  `'${(typeof value === 'string' ? value : JSON.stringify(value)).replaceAll("'", "''")}'`
async function main() {
  const name = process.argv[2]
  if (!/^\d{14}_seed_learning_catalog$/.test(name || ''))
    throw new Error('Pass a new YYYYMMDDHHMMSS_seed_learning_catalog migration name.')
  const destination = path.join(__dirname, '../netlify/database/migrations', `${name}.sql`)
  if (fs.existsSync(destination)) throw new Error('Migration already exists; choose a new name.')
  for (const course of seedCourses) {
    const url = `https://www.youtube.com/oembed?url=${encodeURIComponent(course.sourceUrl)}&format=json`
    const response = await fetch(url, { signal: AbortSignal.timeout(20000) })
    if (!response.ok) throw new Error(`Source metadata unavailable for ${course.id}`)
    const metadata = await response.json()
    if (typeof metadata.title !== 'string' || !metadata.html?.includes(course.videoId))
      throw new Error(`Invalid source for ${course.id}`)
    course.sourceTitle = metadata.title
    // Preserve the original channel as the source attribution.
    course.provider = metadata.author_name
    console.log(`Verified ${course.id}`)
  }
  const columns = [
    'id',
    'title',
    'summary',
    'category',
    'level',
    'profession_ids',
    'provider',
    'source_title',
    'source_url',
    'video_id',
    'image_path',
    'visual_prompt',
    'prerequisites',
    'outcomes',
  ]
  const values = seedCourses.map((c) => [
    c.id,
    c.title,
    c.summary,
    c.category,
    c.level,
    c.professionIds,
    c.provider,
    c.sourceTitle,
    c.sourceUrl,
    c.videoId,
    c.imagePath,
    c.visualPrompt,
    c.prerequisites,
    c.outcomes,
  ])
  const lessonValues = seedLessons.map((l) => [l.id, l.courseId, l.position, l.kind, l.title, l.content])
  const literal = (value) => (typeof value === 'number' ? String(value) : sql(value))
  const content = `-- Public source metadata and original Vairen study companions. Video content is embedded, not copied.\nINSERT INTO learning_courses (${columns.join(', ')}) VALUES\n${values.map((row) => `(${row.map(literal).join(', ')})`).join(',\n')};\n\nINSERT INTO learning_lessons (id, course_id, position, kind, title, content) VALUES\n${lessonValues.map((row) => `(${row.map(literal).join(', ')})`).join(',\n')};\n`
  fs.writeFileSync(destination, content, { flag: 'wx' })
  console.log(`Created data migration for ${seedCourses.length} courses and ${seedLessons.length} lessons.`)
}
main().catch(() => {
  console.error(
    'Catalog import failed; no existing migration was changed. Check source availability and the new migration name.',
  )
  process.exitCode = 1
})
