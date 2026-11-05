// Generate the bilingual, code-native educational assets from the career catalog.
const fs = require('node:fs')
const vm = require('node:vm')
const ts = require('typescript')
const compiled = ts.transpileModule(fs.readFileSync('lib/data.ts', 'utf8'), {
  compilerOptions: { module: ts.ModuleKind.CommonJS },
}).outputText
const sandbox = { exports: {} }
vm.runInNewContext(compiled, sandbox)
const { professions } = sandbox.exports
const escape = (value) =>
  value.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;')
const contexts = {
  'ml-engineer': [
    ['Prepare training data', 'Train & evaluate', 'Deploy a model', 'Measure uncertainty'],
    ['إعداد بيانات التدريب', 'التدريب والتقييم', 'نشر النموذج', 'قياس عدم اليقين'],
  ],
  'backend-engineer': [
    ['Handle service failures', 'Model application data', 'Build server logic', 'Define service contracts'],
    ['معالجة أعطال الخدمات', 'نمذجة بيانات التطبيق', 'بناء منطق الخادم', 'تعريف عقود الخدمات'],
  ],
  'cloud-architect': [
    [
      'Choose cloud services',
      'Connect environments',
      'Automate infrastructure',
      'Balance cost & reliability',
    ],
    ['اختيار الخدمات السحابية', 'ربط البيئات', 'أتمتة البنية التحتية', 'موازنة التكلفة والموثوقية'],
  ],
  'security-analyst': [
    [
      'Identify suspicious activity',
      'Analyze security events',
      'Contain & recover',
      'Inspect system activity',
    ],
    ['رصد النشاط المشبوه', 'تحليل الأحداث الأمنية', 'الاحتواء والتعافي', 'فحص نشاط النظام'],
  ],
  'devops-engineer': [
    ['Orchestrate containers', 'Automate delivery', 'Trace system health', 'Automate routine tasks'],
    ['تنسيق الحاويات', 'أتمتة التسليم', 'تتبع سلامة الأنظمة', 'أتمتة المهام المتكررة'],
  ],
  'data-engineer': [
    ['Process large datasets', 'Design data structures', 'Schedule pipelines', 'Transform & query data'],
    ['معالجة البيانات الكبيرة', 'تصميم هياكل البيانات', 'جدولة خطوط المعالجة', 'تحويل البيانات واستعلامها'],
  ],
  'product-designer': [
    ['Map user journeys', 'Test a design idea', 'Understand user needs', 'Create reusable patterns'],
    [
      'رسم رحلات المستخدم',
      'اختبار فكرة تصميم',
      'فهم احتياجات المستخدم',
      'إنشاء أنماط قابلة لإعادة الاستخدام',
    ],
  ],
  'mobile-engineer': [
    [
      'Build native experiences',
      'Share application logic',
      'Profile & optimize',
      'Separate responsibilities',
    ],
    ['بناء تجارب أصلية', 'مشاركة منطق التطبيق', 'قياس الأداء وتحسينه', 'فصل المسؤوليات'],
  ],
  'ai-researcher': [
    ['Understand model math', 'Implement experiments', 'Communicate findings', 'Compare hypotheses'],
    ['فهم رياضيات النماذج', 'تنفيذ التجارب', 'شرح النتائج', 'مقارنة الفرضيات'],
  ],
  'blockchain-engineer': [
    [
      'Write smart contracts',
      'Understand trust models',
      'Build efficient programs',
      'Define consensus rules',
    ],
    ['كتابة العقود الذكية', 'فهم نماذج الثقة', 'بناء برامج فعالة', 'تعريف قواعد الإجماع'],
  ],
}
fs.mkdirSync('public/images/learning', { recursive: true })
for (const p of professions)
  for (const locale of ['en', 'ar']) {
    const ar = locale === 'ar'
    const title = escape(p.title[locale])
    const nodes = p.skills
      .map((skill, i) => {
        const x = i % 2 ? 730 : 50
        const y = i < 2 ? 205 : 390
        const name = escape(skill.name[locale])
        const desc = escape(contexts[p.id][ar ? 1 : 0][i])
        return `<g><rect x="${x}" y="${y}" width="420" height="140" rx="20" fill="#fff" stroke="#c7d6c6"/><circle cx="${x + 38}" cy="${y + 38}" r="17" fill="#e6eee3"/><text x="${x + 38}" y="${y + 44}" text-anchor="middle" font-size="15" fill="#3f7250">${i + 1}</text><text x="${ar ? x + 390 : x + 70}" y="${y + 48}" text-anchor="${ar ? 'end' : 'start'}" font-size="${name.length > 24 ? 21 : 24}" font-weight="600" fill="#183a2a">${name}</text><text x="${ar ? x + 390 : x + 28}" y="${y + 100}" text-anchor="${ar ? 'end' : 'start'}" font-size="19" fill="#5a6c5e">${desc}</text></g>`
      })
      .join('')
    const phases = ar
      ? ['الأساسيات', 'مشروع تطبيقي', 'ملف الأعمال']
      : ['FOUNDATIONS', 'APPLIED PROJECT', 'PORTFOLIO']
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="720" viewBox="0 0 1200 720" role="img" aria-labelledby="title desc"><title id="title">${title}</title><desc id="desc">${escape(p.skills.map((s) => s.name[locale]).join(', '))}</desc><defs><pattern id="grid" width="36" height="36" patternUnits="userSpaceOnUse"><circle cx="1" cy="1" r="1" fill="#b6c9b2" opacity=".4"/></pattern></defs><rect width="1200" height="720" fill="#edf2e9"/><rect width="1200" height="720" fill="url(#grid)"/><g font-family="'IBM Plex Sans Arabic', 'Manrope', sans-serif"><text x="${ar ? 1140 : 60}" y="65" text-anchor="${ar ? 'end' : 'start'}" font-size="16" letter-spacing="2" fill="#54705a">${ar ? 'فايرين / خريطة تعلم المهنة' : 'VAIREN / CAREER LEARNING MAP'}</text><text x="${ar ? 1140 : 60}" y="130" text-anchor="${ar ? 'end' : 'start'}" font-size="43" font-weight="600" fill="#183a2a">${title}</text><path d="M470 275H530Q600 275 600 345V395Q600 460 530 460H470M730 275H670Q600 275 600 345M730 460H670Q600 460 600 395" fill="none" stroke="#8eae93" stroke-width="2"/><circle cx="600" cy="368" r="50" fill="#244a34"/><text x="600" y="378" text-anchor="middle" font-size="27" font-weight="600" fill="#eff4e9">${p.avatar}</text>${nodes}<path d="M250 624H950" stroke="#a5bea6" stroke-width="2"/>${phases
      .map((label, i) => {
        const x = ar ? 990 - i * 390 : 210 + i * 390
        return `<rect x="${x - 160}" y="594" width="320" height="60" rx="30" fill="${i === 2 ? '#244a34' : '#fff'}" stroke="#b8cbb5"/><text x="${x}" y="632" text-anchor="middle" font-size="18" fill="${i === 2 ? '#eff4e9' : '#244a34'}">${label}</text>`
      })
      .join('')}</g></svg>`
    fs.writeFileSync(`public/images/learning/${p.id}-${locale}.svg`, svg)
  }
console.log(`Generated ${professions.length * 2} bilingual career learning maps.`)
