type Localized = { en: string; ar: string }

export type Profession = {
  id: string
  title: Localized
  field: Localized
  demand: 'very' | 'high' | 'medium'
  salary: string
  growth: string
  accent: string
  avatar: string
  skills: { name: Localized; weight: number }[]
}

const s = (en: string, ar: string, weight: number) => ({ name: { en, ar }, weight })

export const professions: Profession[] = [
  {
    id: 'ml-engineer',
    title: { en: 'Machine Learning Engineer', ar: 'مهندس تعلم الآلة' },
    field: { en: 'Artificial Intelligence', ar: 'الذكاء الاصطناعي' },
    demand: 'very',
    salary: '$162k',
    growth: '+36%',
    accent: '#a78bfa',
    avatar: 'ML',
    skills: [
      s('Python', 'بايثون', 95),
      s('Deep Learning', 'التعلم العميق', 88),
      s('MLOps', 'عمليات تعلم الآلة', 72),
      s('Statistics', 'الإحصاء', 80),
    ],
  },
  {
    id: 'backend-engineer',
    title: { en: 'Backend Engineer', ar: 'مهندس الواجهة الخلفية' },
    field: { en: 'Software Engineering', ar: 'هندسة البرمجيات' },
    demand: 'high',
    salary: '$138k',
    growth: '+22%',
    accent: '#38bdf8',
    avatar: 'BE',
    skills: [
      s('Distributed Systems', 'الأنظمة الموزعة', 85),
      s('SQL', 'SQL', 90),
      s('Go / Node.js', 'Go / Node.js', 82),
      s('API Design', 'تصميم الواجهات البرمجية', 88),
    ],
  },
  {
    id: 'cloud-architect',
    title: { en: 'Cloud Architect', ar: 'مهندس معماري سحابي' },
    field: { en: 'Cloud Infrastructure', ar: 'البنية السحابية' },
    demand: 'very',
    salary: '$171k',
    growth: '+28%',
    accent: '#34d399',
    avatar: 'CA',
    skills: [
      s('AWS / GCP', 'AWS / GCP', 92),
      s('Networking', 'الشبكات', 80),
      s('Terraform', 'Terraform', 78),
      s('Cost Optimization', 'تحسين التكاليف', 70),
    ],
  },
  {
    id: 'security-analyst',
    title: { en: 'Security Analyst', ar: 'محلل أمن المعلومات' },
    field: { en: 'Cybersecurity', ar: 'الأمن السيبراني' },
    demand: 'very',
    salary: '$124k',
    growth: '+33%',
    accent: '#fb7185',
    avatar: 'SA',
    skills: [
      s('Threat Detection', 'كشف التهديدات', 90),
      s('SIEM', 'SIEM', 78),
      s('Incident Response', 'الاستجابة للحوادث', 85),
      s('Linux', 'لينكس', 75),
    ],
  },
  {
    id: 'devops-engineer',
    title: { en: 'DevOps Engineer', ar: 'مهندس DevOps' },
    field: { en: 'Platform Engineering', ar: 'هندسة المنصات' },
    demand: 'high',
    salary: '$141k',
    growth: '+21%',
    accent: '#fbbf24',
    avatar: 'DO',
    skills: [
      s('Kubernetes', 'Kubernetes', 88),
      s('CI/CD', 'التكامل والنشر المستمر', 92),
      s('Observability', 'المراقبة', 76),
      s('Scripting', 'البرمجة النصية', 80),
    ],
  },
  {
    id: 'data-engineer',
    title: { en: 'Data Engineer', ar: 'مهندس البيانات' },
    field: { en: 'Data Platforms', ar: 'منصات البيانات' },
    demand: 'high',
    salary: '$135k',
    growth: '+24%',
    accent: '#f97316',
    avatar: 'DE',
    skills: [
      s('Spark', 'Spark', 82),
      s('Data Modeling', 'نمذجة البيانات', 88),
      s('Airflow', 'Airflow', 74),
      s('SQL', 'SQL', 94),
    ],
  },
  {
    id: 'product-designer',
    title: { en: 'Product Designer', ar: 'مصمم المنتجات' },
    field: { en: 'Design', ar: 'التصميم' },
    demand: 'medium',
    salary: '$118k',
    growth: '+13%',
    accent: '#f472b6',
    avatar: 'PD',
    skills: [
      s('Interaction Design', 'تصميم التفاعل', 90),
      s('Prototyping', 'النماذج الأولية', 85),
      s('User Research', 'أبحاث المستخدمين', 78),
      s('Design Systems', 'أنظمة التصميم', 82),
    ],
  },
  {
    id: 'mobile-engineer',
    title: { en: 'Mobile Engineer', ar: 'مهندس تطبيقات الجوال' },
    field: { en: 'Software Engineering', ar: 'هندسة البرمجيات' },
    demand: 'high',
    salary: '$132k',
    growth: '+19%',
    accent: '#818cf8',
    avatar: 'ME',
    skills: [
      s('Swift / Kotlin', 'Swift / Kotlin', 90),
      s('React Native', 'React Native', 76),
      s('Performance', 'الأداء', 80),
      s('App Architecture', 'معمارية التطبيقات', 84),
    ],
  },
  {
    id: 'ai-researcher',
    title: { en: 'AI Research Scientist', ar: 'باحث في الذكاء الاصطناعي' },
    field: { en: 'Artificial Intelligence', ar: 'الذكاء الاصطناعي' },
    demand: 'very',
    salary: '$185k',
    growth: '+40%',
    accent: '#c084fc',
    avatar: 'AR',
    skills: [
      s('Linear Algebra', 'الجبر الخطي', 92),
      s('PyTorch', 'PyTorch', 90),
      s('Research Writing', 'الكتابة البحثية', 78),
      s('Experimentation', 'التجريب', 86),
    ],
  },
  {
    id: 'blockchain-engineer',
    title: { en: 'Blockchain Engineer', ar: 'مهندس البلوك تشين' },
    field: { en: 'Distributed Ledgers', ar: 'السجلات الموزعة' },
    demand: 'medium',
    salary: '$146k',
    growth: '+12%',
    accent: '#2dd4bf',
    avatar: 'BC',
    skills: [
      s('Solidity', 'Solidity', 84),
      s('Cryptography', 'التشفير', 80),
      s('Rust', 'Rust', 72),
      s('Protocol Design', 'تصميم البروتوكولات', 76),
    ],
  },
]

export function professionImage(id: string) {
  return `/images/careers/${id}.jpg`
}
export function professionPrompt(p: Profession, locale: 'en' | 'ar') {
  const skills = p.skills.map((s) => s.name[locale]).join(locale === 'ar' ? '، ' : ', ')
  return locale === 'ar'
    ? `صمّم ملصقاً تعليمياً احترافياً بنسبة 16:9 عن مهنة «${p.title.ar}» في مجال ${p.field.ar}. ارسم أربع وحدات بصرية مترابطة تشرح ${skills} بأمثلة من العمل اليومي. وضّح مساراً من الأساسيات إلى مشروع تطبيقي ثم ملف أعمال. استخدم رسوماً متجهة واضحة وألواناً هادئة وتبايناً مقروءاً وعناوين عربية من اليمين إلى اليسار. تجنب الشعارات والأرقام والإحصاءات المختلقة.`
    : `Create a professional 16:9 educational poster for a ${p.title.en} in ${p.field.en}. Illustrate four connected skill modules: ${skills}, using concrete examples from daily work. Show a progression from foundations to an applied project and a professional portfolio. Use clear vector illustrations, restrained colors, accessible contrast and readable English labels. No logos or invented statistics.`
}
