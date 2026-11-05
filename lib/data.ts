type Localized = { en: string; ar: string }

export type Profession = {
  id: string
  title: Localized
  field: Localized
  demand: 'very' | 'high' | 'medium'
  salary: string
  growth: string
  skills: { name: Localized; weight: number }[]
}

export type Course = {
  id: string
  code: string
  title: Localized
  summary: Localized
  category: 'systems' | 'ai' | 'cloud' | 'security'
  level: 'beginner' | 'intermediate' | 'advanced'
  modules: number
  hours: number
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
    skills: [s('Python', 'بايثون', 95), s('Deep Learning', 'التعلم العميق', 88), s('MLOps', 'عمليات تعلم الآلة', 72), s('Statistics', 'الإحصاء', 80)],
  },
  {
    id: 'backend-engineer',
    title: { en: 'Backend Engineer', ar: 'مهندس الواجهة الخلفية' },
    field: { en: 'Software Engineering', ar: 'هندسة البرمجيات' },
    demand: 'high',
    salary: '$138k',
    growth: '+22%',
    skills: [s('Distributed Systems', 'الأنظمة الموزعة', 85), s('SQL', 'SQL', 90), s('Go / Node.js', 'Go / Node.js', 82), s('API Design', 'تصميم الواجهات البرمجية', 88)],
  },
  {
    id: 'cloud-architect',
    title: { en: 'Cloud Architect', ar: 'مهندس معماري سحابي' },
    field: { en: 'Cloud Infrastructure', ar: 'البنية السحابية' },
    demand: 'very',
    salary: '$171k',
    growth: '+28%',
    skills: [s('AWS / GCP', 'AWS / GCP', 92), s('Networking', 'الشبكات', 80), s('Terraform', 'Terraform', 78), s('Cost Optimization', 'تحسين التكاليف', 70)],
  },
  {
    id: 'security-analyst',
    title: { en: 'Security Analyst', ar: 'محلل أمن المعلومات' },
    field: { en: 'Cybersecurity', ar: 'الأمن السيبراني' },
    demand: 'very',
    salary: '$124k',
    growth: '+33%',
    skills: [s('Threat Detection', 'كشف التهديدات', 90), s('SIEM', 'SIEM', 78), s('Incident Response', 'الاستجابة للحوادث', 85), s('Linux', 'لينكس', 75)],
  },
  {
    id: 'devops-engineer',
    title: { en: 'DevOps Engineer', ar: 'مهندس DevOps' },
    field: { en: 'Platform Engineering', ar: 'هندسة المنصات' },
    demand: 'high',
    salary: '$141k',
    growth: '+21%',
    skills: [s('Kubernetes', 'Kubernetes', 88), s('CI/CD', 'التكامل والنشر المستمر', 92), s('Observability', 'المراقبة', 76), s('Scripting', 'البرمجة النصية', 80)],
  },
  {
    id: 'data-engineer',
    title: { en: 'Data Engineer', ar: 'مهندس البيانات' },
    field: { en: 'Data Platforms', ar: 'منصات البيانات' },
    demand: 'high',
    salary: '$135k',
    growth: '+24%',
    skills: [s('Spark', 'Spark', 82), s('Data Modeling', 'نمذجة البيانات', 88), s('Airflow', 'Airflow', 74), s('SQL', 'SQL', 94)],
  },
  {
    id: 'product-designer',
    title: { en: 'Product Designer', ar: 'مصمم المنتجات' },
    field: { en: 'Design', ar: 'التصميم' },
    demand: 'medium',
    salary: '$118k',
    growth: '+13%',
    skills: [s('Interaction Design', 'تصميم التفاعل', 90), s('Prototyping', 'النماذج الأولية', 85), s('User Research', 'أبحاث المستخدمين', 78), s('Design Systems', 'أنظمة التصميم', 82)],
  },
  {
    id: 'mobile-engineer',
    title: { en: 'Mobile Engineer', ar: 'مهندس تطبيقات الجوال' },
    field: { en: 'Software Engineering', ar: 'هندسة البرمجيات' },
    demand: 'high',
    salary: '$132k',
    growth: '+19%',
    skills: [s('Swift / Kotlin', 'Swift / Kotlin', 90), s('React Native', 'React Native', 76), s('Performance', 'الأداء', 80), s('App Architecture', 'معمارية التطبيقات', 84)],
  },
  {
    id: 'ai-researcher',
    title: { en: 'AI Research Scientist', ar: 'باحث في الذكاء الاصطناعي' },
    field: { en: 'Artificial Intelligence', ar: 'الذكاء الاصطناعي' },
    demand: 'very',
    salary: '$185k',
    growth: '+40%',
    skills: [s('Linear Algebra', 'الجبر الخطي', 92), s('PyTorch', 'PyTorch', 90), s('Research Writing', 'الكتابة البحثية', 78), s('Experimentation', 'التجريب', 86)],
  },
  {
    id: 'blockchain-engineer',
    title: { en: 'Blockchain Engineer', ar: 'مهندس البلوك تشين' },
    field: { en: 'Distributed Ledgers', ar: 'السجلات الموزعة' },
    demand: 'medium',
    salary: '$146k',
    growth: '+12%',
    skills: [s('Solidity', 'Solidity', 84), s('Cryptography', 'التشفير', 80), s('Rust', 'Rust', 72), s('Protocol Design', 'تصميم البروتوكولات', 76)],
  },
]

export const courses: Course[] = [
  {
    id: 'os-internals',
    code: 'SYS-101',
    title: { en: 'Operating System Internals', ar: 'أساسيات أنظمة التشغيل' },
    summary: { en: 'Processes, memory, schedulers and file systems from first principles.', ar: 'العمليات والذاكرة والجدولة وأنظمة الملفات من المبادئ الأولى.' },
    category: 'systems',
    level: 'intermediate',
    modules: 12,
    hours: 28,
  },
  {
    id: 'distributed-systems',
    code: 'SYS-240',
    title: { en: 'Distributed Systems Design', ar: 'تصميم الأنظمة الموزعة' },
    summary: { en: 'Consensus, replication, partitioning and failure-tolerant architecture.', ar: 'الإجماع والنسخ والتقسيم والمعمارية المقاومة للأعطال.' },
    category: 'systems',
    level: 'advanced',
    modules: 14,
    hours: 36,
  },
  {
    id: 'llm-engineering',
    code: 'AI-210',
    title: { en: 'LLM Application Engineering', ar: 'هندسة تطبيقات النماذج اللغوية' },
    summary: { en: 'Retrieval, tool use, evaluation and deploying language models at scale.', ar: 'الاسترجاع واستخدام الأدوات والتقييم ونشر النماذج اللغوية على نطاق واسع.' },
    category: 'ai',
    level: 'intermediate',
    modules: 10,
    hours: 22,
  },
  {
    id: 'neural-networks',
    code: 'AI-101',
    title: { en: 'Neural Networks Foundations', ar: 'أسس الشبكات العصبية' },
    summary: { en: 'Backpropagation, optimization and building networks from scratch.', ar: 'الانتشار العكسي والتحسين وبناء الشبكات من الصفر.' },
    category: 'ai',
    level: 'beginner',
    modules: 8,
    hours: 16,
  },
  {
    id: 'cloud-native',
    code: 'CLD-150',
    title: { en: 'Cloud Native Infrastructure', ar: 'البنية التحتية السحابية الأصلية' },
    summary: { en: 'Containers, Kubernetes, service meshes and infrastructure as code.', ar: 'الحاويات وKubernetes وشبكات الخدمات والبنية كرمز.' },
    category: 'cloud',
    level: 'intermediate',
    modules: 11,
    hours: 26,
  },
  {
    id: 'serverless',
    code: 'CLD-080',
    title: { en: 'Serverless Architecture', ar: 'المعمارية بدون خوادم' },
    summary: { en: 'Event-driven compute, edge runtimes and cost-aware design.', ar: 'الحوسبة القائمة على الأحداث وبيئات الحافة والتصميم الواعي بالتكلفة.' },
    category: 'cloud',
    level: 'beginner',
    modules: 7,
    hours: 12,
  },
  {
    id: 'offensive-security',
    code: 'SEC-300',
    title: { en: 'Offensive Security Practice', ar: 'ممارسة الأمن الهجومي' },
    summary: { en: 'Reconnaissance, exploitation and responsible disclosure in lab environments.', ar: 'الاستطلاع والاستغلال والإفصاح المسؤول في بيئات المختبر.' },
    category: 'security',
    level: 'advanced',
    modules: 13,
    hours: 34,
  },
  {
    id: 'secure-engineering',
    code: 'SEC-120',
    title: { en: 'Secure Software Engineering', ar: 'هندسة البرمجيات الآمنة' },
    summary: { en: 'Threat modeling, authentication and hardening production systems.', ar: 'نمذجة التهديدات والمصادقة وتحصين أنظمة الإنتاج.' },
    category: 'security',
    level: 'intermediate',
    modules: 9,
    hours: 18,
  },
]

export const courseCategories: Record<Course['category'], Localized> = {
  systems: { en: 'Systems', ar: 'الأنظمة' },
  ai: { en: 'AI', ar: 'الذكاء الاصطناعي' },
  cloud: { en: 'Cloud', ar: 'السحابة' },
  security: { en: 'Security', ar: 'الأمن' },
}
