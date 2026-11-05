// Initial catalog for the database migration. Runtime learning data comes from Netlify Database.
// Publisher videos remain embedded on YouTube; the bilingual study companions below are Vairen originals.
import type { LearningCourse, LearningLesson, Localized, QuizQuestion } from '../../lib/learning'
const l = (en: string, ar: string): Localized => ({ en, ar })
type Track = {
  id: string
  title: Localized
  summary: Localized
  category: LearningCourse['category']
  level: LearningCourse['level']
  roles: string[]
  video: string
  source: string
  provider: string
  prerequisites: Localized
  concepts: { title: Localized; body: Localized }[]
  project: { title: Localized; body: Localized }[]
  questions: QuizQuestion[]
}
const q = (
  question: Localized,
  options: Localized[],
  answer: number,
  explanation: Localized,
): QuizQuestion => ({ question, options, answer, explanation })
const tracks: Track[] = [
  {
    id: 'python-foundations',
    title: l('Python: from first program to useful tools', 'بايثون: من البرنامج الأول إلى أدوات مفيدة'),
    summary: l(
      'A complete beginner video course with a practical guide to functions, collections and reliable input handling.',
      'دورة فيديو كاملة للمبتدئين مع دليل عملي للدوال والمجموعات ومعالجة المدخلات بشكل موثوق.',
    ),
    category: 'systems',
    level: 'beginner',
    roles: ['backend-engineer', 'data-engineer', 'ml-engineer', 'ai-researcher'],
    video: 'rfscVS0vtbw',
    source: 'Learn Python - Full Course for Beginners [Tutorial]',
    provider: 'freeCodeCamp.org',
    prerequisites: l(
      'No programming experience required. Install Python 3 and a text editor to complete the exercises.',
      'لا تحتاج إلى خبرة برمجية. ثبّت بايثون 3 ومحرر نصوص لتنفيذ التمارين.',
    ),
    concepts: [
      {
        title: l('Values, types and decisions', 'القيم والأنواع والقرارات'),
        body: l(
          'A variable binds a name to a value. Strings represent text; integers represent whole numbers. input() returns text even when a person types digits. Convert deliberately with int() or float(), and handle ValueError when conversion fails. Use if / elif / else to choose a branch. Test empty input and zero separately rather than assuming every value behaves like a positive number.',
          'يربط المتغير اسماً بقيمة. تمثل السلاسل النصوص والأعداد الصحيحة القيم الكاملة. تعيد input() نصاً حتى عند كتابة أرقام. حوّل القيم صراحة باستخدام int() أو float()، وتعامل مع ValueError عند فشل التحويل. استخدم if وelif وelse لاختيار الفرع المناسب. اختبر النص الفارغ والصفر بشكل منفصل بدلاً من افتراض أن كل قيمة عدد موجب.',
        ),
      },
      {
        title: l('Collections and reusable functions', 'المجموعات والدوال القابلة لإعادة الاستخدام'),
        body: l(
          'Use a list for ordered entries and a dictionary for lookup by key. A loop processes each entry without duplicating logic. Put one responsibility in each function: accept inputs as parameters and return a result instead of relying on global variables. Keep printing separate from calculation so the same function can serve a command-line tool, an API or a test.',
          'استخدم القائمة للعناصر المرتبة والقاموس للوصول بالمفتاح. تعالج الحلقة كل عنصر دون تكرار المنطق. اجعل لكل دالة مسؤولية واحدة: مرّر المدخلات كمعاملات وأعد النتيجة بدلاً من الاعتماد على متغيرات عامة. افصل الطباعة عن الحساب كي تعمل الدالة نفسها في أداة سطر أوامر أو واجهة برمجية أو اختبار.',
        ),
      },
      {
        title: l('Files, errors and reproducibility', 'الملفات والأخطاء وقابلية التكرار'),
        body: l(
          'Open a file with a context manager so it closes after use. Catch the specific errors you can recover from; a bare except can hide bugs. Describe dependencies and the command needed to run your program in a README. A small test that checks a known input and output is more valuable than manually trying only the happy path.',
          'افتح الملف باستخدام مدير سياق كي يغلق بعد الاستخدام. التقط الأخطاء المحددة التي تستطيع معالجتها؛ فقد يخفي except العام عيوباً برمجية. دوّن الاعتماديات وأمر تشغيل البرنامج في README. اختبار صغير لمدخل وخرج معروفين أفضل من تجربة الحالة الناجحة وحدها يدوياً.',
        ),
      },
    ],
    project: [
      {
        title: l('Build an expense summarizer', 'ابنِ ملخصاً للمصروفات'),
        body: l(
          'Create a function that accepts a list of expense dictionaries with category and amount. Validate that each amount is numeric and nonnegative. Return totals grouped by category and a grand total. Start with three categories and at least six entries; do not embed business logic in input prompts.',
          'أنشئ دالة تستقبل قائمة مصروفات تحتوي على الفئة والمبلغ. تحقق من أن كل مبلغ رقمي وغير سالب. أعد الإجمالي بحسب الفئة والإجمالي العام. ابدأ بثلاث فئات وستة عناصر على الأقل؛ ولا تضع منطق المعالجة داخل مطالبات الإدخال.',
        ),
      },
      {
        title: l('Verify and explain', 'تحقق واشرح'),
        body: l(
          'Test an empty list, a zero amount, an invalid amount and repeated categories. Show the expected totals for a small fixture. Add a README with setup steps and one sample run. Explain why dictionaries are useful here and what you would change to support several currencies.',
          'اختبر قائمة فارغة ومبلغاً صفرياً ومبلغاً غير صالح وفئات متكررة. وضّح الإجماليات المتوقعة لبيانات صغيرة. أضف README بخطوات التشغيل ومثال واحد. اشرح فائدة القواميس وما الذي تغيره لدعم عدة عملات.',
        ),
      },
    ],
    questions: [
      q(
        l('What does input() return?', 'ماذا تعيد input()؟'),
        [
          l('Always an integer', 'عدداً صحيحاً دائماً'),
          l('A string', 'سلسلة نصية'),
          l('A dictionary', 'قاموساً'),
        ],
        1,
        l(
          'Convert the returned string explicitly when a number is required.',
          'حوّل النص الناتج صراحة عند الحاجة إلى رقم.',
        ),
      ),
      q(
        l('Which design makes calculation easy to test?', 'أي تصميم يجعل اختبار الحساب سهلاً؟'),
        [
          l('A function that receives values and returns a result', 'دالة تستقبل قيماً وتعيد نتيجة'),
          l('Reading global variables inside every function', 'قراءة متغيرات عامة داخل كل دالة'),
          l('Catching all exceptions without reporting them', 'التقاط جميع الأخطاء دون الإبلاغ عنها'),
        ],
        0,
        l(
          'Explicit inputs and outputs isolate the calculation from the interface.',
          'تعزل المدخلات والمخرجات الصريحة الحساب عن الواجهة.',
        ),
      ),
    ],
  },
  {
    id: 'computer-science',
    title: l('Computer science with Harvard CS50', 'علوم الحاسوب مع Harvard CS50'),
    summary: l(
      'Explore the complete CS50 video, then practice algorithmic reasoning, memory and web fundamentals.',
      'شاهد فيديو CS50 الكامل ثم طبّق التفكير الخوارزمي ومفاهيم الذاكرة وأساسيات الويب.',
    ),
    category: 'systems',
    level: 'beginner',
    roles: ['backend-engineer', 'mobile-engineer', 'blockchain-engineer'],
    video: '8mAITcNt710',
    source: 'Harvard CS50 – Full Computer Science University Course',
    provider: 'freeCodeCamp.org · Harvard CS50',
    prerequisites: l(
      'Comfort using a computer; no prior programming required. The video is long: study it across several sessions.',
      'إجادة استخدام الحاسوب دون اشتراط خبرة برمجية. الفيديو طويل؛ قسم مشاهدته إلى جلسات متعددة.',
    ),
    concepts: [
      {
        title: l('Algorithms and representation', 'الخوارزميات وتمثيل البيانات'),
        body: l(
          'An algorithm is a precise sequence of steps with defined inputs and outputs. The same information can have different representations: bytes, text, images or structured records. Start by specifying the problem and small examples before choosing a language. A clear algorithm should terminate and handle boundary inputs such as an empty collection.',
          'الخوارزمية تسلسل دقيق من الخطوات بمدخلات ومخرجات محددة. يمكن تمثيل المعلومات نفسها كبايتات أو نصوص أو صور أو سجلات منظمة. ابدأ بتحديد المشكلة وأمثلة صغيرة قبل اختيار اللغة. ينبغي أن تنتهي الخوارزمية وتعالج الحالات الحدية مثل المجموعة الفارغة.',
        ),
      },
      {
        title: l('Data structures and complexity', 'هياكل البيانات والتعقيد'),
        body: l(
          'An array offers indexed access; a linked structure trades direct indexing for different insertion and allocation behavior. Binary search requires sorted data and repeatedly halves the search range. Big-O describes how work grows with input size, not a guarantee of runtime in milliseconds. Compare algorithms using both correctness and the operations they perform.',
          'تتيح المصفوفة وصولاً بالفهرس؛ بينما تختلف البنى المترابطة في الإدراج وتخصيص الذاكرة. يتطلب البحث الثنائي بيانات مرتبة ويقسم مجال البحث إلى نصفين. تصف Big-O نمو العمل مع حجم المدخلات، وليست ضماناً لزمن بالمللي ثانية. قارن الخوارزميات من حيث الصحة والعمليات التي تنفذها.',
        ),
      },
      {
        title: l('From memory to web systems', 'من الذاكرة إلى أنظمة الويب'),
        body: l(
          'Memory has a lifetime: a value must remain valid while code uses it. Higher-level languages automate parts of memory management but do not remove the need to reason about references and state. In a web system, distinguish a browser interface, a server handling requests and a database storing records. Validate data at the server boundary even if the interface already validates it.',
          'للذاكرة عمر استخدام؛ يجب أن تبقى القيمة صالحة ما دام الكود يستعملها. تؤتمت اللغات الأعلى مستوى أجزاء من إدارة الذاكرة دون إلغاء ضرورة فهم المراجع والحالة. ميّز في الويب بين واجهة المتصفح والخادم الذي يعالج الطلبات وقاعدة البيانات التي تحفظ السجلات. تحقق من البيانات عند حدود الخادم حتى مع التحقق في الواجهة.',
        ),
      },
    ],
    project: [
      {
        title: l('Compare two search algorithms', 'قارن خوارزميتي بحث'),
        body: l(
          'Implement linear search and binary search over a sorted list of integers. Count comparisons instead of measuring only wall-clock time. Run both on lists of increasing size and targets at the beginning, middle, end and outside the list.',
          'نفّذ البحث الخطي والثنائي على قائمة أعداد مرتبة. احسب المقارنات بدلاً من قياس زمن التشغيل وحده. جرّبهما على قوائم متزايدة الحجم وأهداف في البداية والوسط والنهاية وخارج القائمة.',
        ),
      },
      {
        title: l('Document the tradeoff', 'وثّق المفاضلة'),
        body: l(
          'Include tests for an empty list, one element and duplicate values. State whether your implementation returns any match or the first match. Explain why binary search is inappropriate on an unsorted list, and include the cost of sorting when comparing approaches.',
          'أضف اختبارات للقائمة الفارغة والعنصر الواحد والقيم المتكررة. حدد هل يعيد التنفيذ أي تطابق أم أول تطابق. اشرح لماذا لا يناسب البحث الثنائي قائمة غير مرتبة، واحتسب تكلفة الترتيب عند المقارنة.',
        ),
      },
    ],
    questions: [
      q(
        l('What does binary search require?', 'ماذا يتطلب البحث الثنائي؟'),
        [
          l('Sorted data', 'بيانات مرتبة'),
          l('Randomly ordered data', 'بيانات عشوائية الترتيب'),
          l('A network connection', 'اتصالاً بالشبكة'),
        ],
        0,
        l(
          'Ordering lets the algorithm discard half the remaining range.',
          'يسمح الترتيب باستبعاد نصف المجال المتبقي.',
        ),
      ),
      q(
        l('What does Big-O describe?', 'ماذا تصف Big-O؟'),
        [
          l('Exact milliseconds on every computer', 'المللي ثانية بدقة على كل حاسوب'),
          l('How work grows as input size grows', 'كيف ينمو العمل مع حجم المدخلات'),
          l('The number of programming languages used', 'عدد لغات البرمجة المستخدمة'),
        ],
        1,
        l(
          'Hardware and implementation still affect actual runtime.',
          'تؤثر الأجهزة وطريقة التنفيذ في الزمن الفعلي.',
        ),
      ),
    ],
  },
  {
    id: 'javascript-foundations',
    title: l('JavaScript programming foundations', 'أساسيات البرمجة بجافاسكربت'),
    summary: l(
      'A complete introduction to JavaScript with focused practice in functions, objects and transformations.',
      'مقدمة كاملة لجافاسكربت مع تدريب على الدوال والكائنات وتحويل البيانات.',
    ),
    category: 'systems',
    level: 'beginner',
    roles: ['backend-engineer', 'mobile-engineer', 'blockchain-engineer'],
    video: 'PkZNo7MFNFg',
    source: 'Learn JavaScript - Full Course for Beginners',
    provider: 'freeCodeCamp.org',
    prerequisites: l(
      'A browser console or a recent Node.js installation. No framework knowledge is required.',
      'وحدة تحكم المتصفح أو إصدار حديث من Node.js، دون الحاجة إلى معرفة إطار عمل.',
    ),
    concepts: [
      {
        title: l('Scope, values and equality', 'النطاق والقيم والمساواة'),
        body: l(
          'Use const when a binding will not be reassigned and let when it will. const does not make an object immutable. Prefer strict equality so comparison does not silently coerce types. An undefined property is different from a deliberate null value; decide how your functions handle each case.',
          'استخدم const عندما لن يعاد إسناد الاسم وlet عند الحاجة لإسناده. لا تجعل const الكائن غير قابل للتغيير. فضّل المساواة الصارمة لتجنب تحويل الأنواع ضمنياً. تختلف الخاصية undefined عن القيمة null المقصودة؛ حدد كيف تتعامل الدالة مع كل حالة.',
        ),
      },
      {
        title: l('Functions and collection transformations', 'الدوال وتحويل المجموعات'),
        body: l(
          'A function should state what it accepts and returns. Use map to transform entries and filter to retain entries satisfying a condition. Array methods that return a new array can make state changes easier to reason about. Avoid changing the original objects unexpectedly: copying an array does not deeply copy the objects inside it.',
          'ينبغي أن يتضح ما تستقبله الدالة وما تعيده. استخدم map لتحويل العناصر وfilter للاحتفاظ بما يحقق شرطاً. تسهّل الطرق التي تعيد مصفوفة جديدة فهم تغير الحالة. تجنب تعديل الكائنات الأصلية على نحو غير متوقع؛ فنسخ المصفوفة لا ينسخ الكائنات داخلها بعمق.',
        ),
      },
      {
        title: l('Validate boundaries', 'تحقق من حدود البيانات'),
        body: l(
          'Treat data from a form or network as untrusted input. Check expected types and ranges before using values in a calculation. Return a meaningful error rather than allowing NaN to spread through the result. Keep DOM rendering separate from the function that computes your result, so the computation can run in a browser or on a server.',
          'تعامل مع بيانات النماذج والشبكة كمدخلات تحتاج إلى تحقق. افحص الأنواع والمدى قبل استخدامها في الحساب. أعد خطأ ذا معنى بدلاً من انتشار NaN في النتائج. افصل رسم DOM عن دالة الحساب كي تعمل في المتصفح أو الخادم.',
        ),
      },
    ],
    project: [
      {
        title: l('Build a job shortlist', 'ابنِ قائمة وظائف مختارة'),
        body: l(
          'Create an array of job objects with title, location and requiredSkills. Write functions to filter by location, normalize skill names and return jobs matching at least two selected skills. Keep the original array unchanged.',
          'أنشئ مصفوفة وظائف تضم المسمى والموقع والمهارات المطلوبة. اكتب دوال للتصفية بالموقع وتوحيد أسماء المهارات وإعادة الوظائف المطابقة لمهارتين مختارتين على الأقل. أبقِ المصفوفة الأصلية دون تغيير.',
        ),
      },
      {
        title: l('Check edge cases', 'افحص الحالات الحدية'),
        body: l(
          'Test missing skills, mixed capitalization, an empty shortlist and repeated skills. Decide how to handle unknown locations. Write examples showing each transformation and explain where validation belongs if the same logic is later placed behind an API.',
          'اختبر المهارات الناقصة واختلاف حالة الأحرف والقائمة الفارغة والمهارات المتكررة. حدد كيفية التعامل مع المواقع المجهولة. اكتب أمثلة لكل تحويل واشرح مكان التحقق إن نُقل المنطق إلى واجهة برمجية.',
        ),
      },
    ],
    questions: [
      q(
        l('Does const prevent changing a property of an object?', 'هل تمنع const تغيير خاصية كائن؟'),
        [
          l('Yes, all properties become frozen', 'نعم، تتجمد جميع الخصائص'),
          l('No, it prevents reassignment of the binding', 'لا، تمنع إعادة إسناد الاسم'),
          l('Only inside an array', 'داخل المصفوفة فقط'),
        ],
        1,
        l(
          'Object immutability requires a separate design decision.',
          'عدم قابلية الكائن للتغيير قرار تصميم منفصل.',
        ),
      ),
      q(
        l('Which method selects entries matching a condition?', 'أي طريقة تختار العناصر المطابقة لشرط؟'),
        [l('filter', 'filter'), l('map', 'map'), l('join', 'join')],
        0,
        l(
          'filter retains matching entries; map transforms entries.',
          'تحتفظ filter بالعناصر المطابقة بينما تحول map العناصر.',
        ),
      ),
    ],
  },
  {
    id: 'sql-data',
    title: l('SQL and relational data', 'SQL والبيانات العلائقية'),
    summary: l(
      'Learn the complete SQL video course and build a small, queryable recruitment dataset.',
      'تعلّم من دورة SQL الكاملة وابنِ مجموعة بيانات توظيف صغيرة قابلة للاستعلام.',
    ),
    category: 'data',
    level: 'intermediate',
    roles: ['data-engineer', 'backend-engineer'],
    video: 'HXV3zeQKqGY',
    source: 'SQL Tutorial - Full Database Course for Beginners',
    provider: 'freeCodeCamp.org',
    prerequisites: l(
      'Basic data concepts. Use a local practice database with fictional records.',
      'مفاهيم أولية عن البيانات. استخدم قاعدة تدريب محلية بسجلات افتراضية.',
    ),
    concepts: [
      {
        title: l('Model records and relationships', 'نمذجة السجلات والعلاقات'),
        body: l(
          'A table models one kind of record. A primary key identifies a row; a foreign key connects related rows and can enforce referential integrity. Separate candidates, jobs and applications rather than repeating candidate details for every application. Decide which columns may be null and which values must be unique before importing records.',
          'يمثل الجدول نوعاً واحداً من السجلات. يعرّف المفتاح الأساسي الصف، ويربط المفتاح الخارجي الصفوف ويمكنه فرض التكامل المرجعي. افصل المرشحين والوظائف والطلبات بدلاً من تكرار معلومات المرشح لكل طلب. حدد الأعمدة التي تسمح بالقيم الفارغة والقيم الفريدة قبل استيراد السجلات.',
        ),
      },
      {
        title: l('Query, join and aggregate', 'الاستعلام والربط والتجميع'),
        body: l(
          'SELECT chooses columns and WHERE filters rows before grouping. JOIN combines records according to a condition; an inner join omits unmatched rows while a left join can preserve them. GROUP BY forms groups for aggregate calculations, and HAVING filters aggregated groups. A join can multiply rows, so count the right identifier rather than assuming one input row produces one output row.',
          'تختار SELECT الأعمدة وترشح WHERE الصفوف قبل التجميع. يدمج JOIN السجلات وفق شرط؛ يستبعد الربط الداخلي غير المتطابق وقد يحافظ الربط الأيسر عليه. تكوّن GROUP BY مجموعات للحسابات التجميعية، وترشح HAVING المجموعات بعد التجميع. قد يضاعف الربط الصفوف؛ لذا احسب المعرّف الصحيح ولا تفترض تطابق عدد المدخلات والمخرجات.',
        ),
      },
      {
        title: l('Change data safely', 'تعديل البيانات بشكل موثوق'),
        body: l(
          'Use transactions when several changes must succeed together. Parameterized queries keep values separate from SQL syntax. Indexes can speed selected reads but add write and storage costs; inspect the query plan instead of indexing every column. Explicitly define ordering when result order matters: a table has no guaranteed default order.',
          'استخدم المعاملات عندما يجب أن تنجح عدة تعديلات معاً. تفصل الاستعلامات ذات المعاملات القيم عن صيغة SQL. قد تسرّع الفهارس قراءات محددة لكنها تزيد تكلفة الكتابة والتخزين؛ افحص خطة الاستعلام بدلاً من فهرسة كل عمود. عرّف الترتيب صراحة عند الحاجة إليه؛ فالجدول لا يملك ترتيباً افتراضياً مضموناً.',
        ),
      },
    ],
    project: [
      {
        title: l('Create a recruitment dataset', 'أنشئ بيانات توظيف'),
        body: l(
          'Design candidates, jobs and applications tables with primary and foreign keys. Insert fictional records including a job with no applications. Write a query for applications per job, including jobs with zero applications, and a second query for candidates who applied to more than one job.',
          'صمّم جداول المرشحين والوظائف والطلبات بمفاتيح أساسية وخارجية. أضف سجلات افتراضية تتضمن وظيفة بلا طلبات. اكتب استعلاماً لعدد الطلبات لكل وظيفة شاملاً الصفر، وآخر للمرشحين الذين تقدموا لأكثر من وظيفة.',
        ),
      },
      {
        title: l('Explain correctness', 'اشرح صحة النتائج'),
        body: l(
          'Show the expected result for each query. Demonstrate how counting a nullable joined column differs from COUNT(*). Add a uniqueness rule preventing the same candidate from applying to the same job twice. Explain a transaction that creates an application and an associated audit record together.',
          'اعرض النتيجة المتوقعة لكل استعلام. وضّح الفرق بين عد عمود قابل للفراغ بعد الربط وCOUNT(*). أضف قاعدة فريدة لمنع تكرار طلب المرشح للوظيفة نفسها. اشرح معاملة تنشئ الطلب وسجل تدقيقه معاً.',
        ),
      },
    ],
    questions: [
      q(
        l('Which join can retain jobs with no applications?', 'أي ربط قد يحتفظ بوظائف بلا طلبات؟'),
        [
          l('INNER JOIN only', 'INNER JOIN فقط'),
          l('LEFT JOIN from jobs', 'LEFT JOIN بدءاً من الوظائف'),
          l('A join without a condition', 'ربط بلا شرط'),
        ],
        1,
        l(
          'The preserved left side includes unmatched jobs.',
          'يتضمن الجانب الأيسر المحفوظ الوظائف غير المتطابقة.',
        ),
      ),
      q(
        l('Why parameterize a query?', 'لماذا نستخدم معاملات الاستعلام؟'),
        [
          l('To separate input values from SQL syntax', 'لفصل قيم المدخلات عن صيغة SQL'),
          l('To automatically create an index', 'لإنشاء فهرس تلقائياً'),
          l('To guarantee sorted results', 'لضمان ترتيب النتائج'),
        ],
        0,
        l(
          'Parameters prevent values from being interpreted as query syntax.',
          'تمنع المعاملات تفسير القيم كجزء من صيغة الاستعلام.',
        ),
      ),
    ],
  },
  {
    id: 'machine-learning',
    title: l('Machine learning: evaluate before you deploy', 'تعلم الآلة: قيّم قبل النشر'),
    summary: l(
      'Study a complete introductory ML course, then practice splitting data and comparing a model with a baseline.',
      'ادرس دورة كاملة في أساسيات تعلم الآلة ثم تدرب على تقسيم البيانات ومقارنة النموذج بخط أساس.',
    ),
    category: 'ai',
    level: 'intermediate',
    roles: ['ml-engineer', 'ai-researcher', 'data-engineer'],
    video: 'i_LwzRVP7bg',
    source: 'Machine Learning for Everybody – Full Course',
    provider: 'freeCodeCamp.org',
    prerequisites: l(
      'Basic Python, arithmetic and familiarity with tabular data.',
      'أساسيات بايثون والحساب والتعامل مع البيانات الجدولية.',
    ),
    concepts: [
      {
        title: l('Frame a prediction problem', 'صياغة مشكلة التنبؤ'),
        body: l(
          'Supervised learning uses examples with a target. Classification predicts a category while regression predicts a numeric value. Define what one row represents and when its features become available. A feature derived from the eventual outcome causes leakage if that information would not exist at prediction time.',
          'يستخدم التعلم الخاضع للإشراف أمثلة لها هدف. يتنبأ التصنيف بفئة والانحدار بقيمة رقمية. حدد ما يمثله الصف ومتى تتاح خصائصه. تتسبب خاصية مشتقة من النتيجة النهائية بتسرب البيانات إذا لم تكن متاحة وقت التنبؤ.',
        ),
      },
      {
        title: l('Separate training from evaluation', 'فصل التدريب عن التقييم'),
        body: l(
          'Training data fits model parameters; validation data helps select settings; a final test set estimates performance on unseen examples. Fit preprocessing only on training data, then apply the learned transformation to other splits. For time-dependent data, evaluate using a time-respecting split instead of shuffling information from the future into training.',
          'تستخدم بيانات التدريب لضبط المعاملات، والتحقق لاختيار الإعدادات، والاختبار النهائي لتقدير الأداء على أمثلة جديدة. اضبط المعالجة المسبقة على بيانات التدريب فقط ثم طبّقها على البقية. في البيانات الزمنية استخدم تقسيماً يحترم الزمن بدلاً من خلط معلومات المستقبل ضمن التدريب.',
        ),
      },
      {
        title: l('Use metrics and baselines', 'استخدام المقاييس وخطوط الأساس'),
        body: l(
          'Start with a simple baseline such as predicting the majority class. Accuracy can be misleading with rare positive cases. Precision describes how many predicted positives are correct; recall describes how many real positives are found. Choose metrics according to the cost of mistakes and inspect errors by meaningful groups before recommending deployment.',
          'ابدأ بخط أساس بسيط مثل توقع الفئة الأكثر شيوعاً. قد تضلل الدقة العامة عندما تكون الحالات الإيجابية نادرة. تصف Precision نسبة الصحيح بين المتوقع إيجابياً، وRecall نسبة الإيجابيات الحقيقية التي عُثر عليها. اختر المقاييس وفق تكلفة الخطأ وافحص الأخطاء بحسب مجموعات ذات معنى قبل اقتراح النشر.',
        ),
      },
    ],
    project: [
      {
        title: l('Build a reproducible baseline', 'ابنِ خط أساس قابلًا للتكرار'),
        body: l(
          'Use a public practice dataset with a documented target. Create train, validation and test splits. Fit a baseline and one simple model using only training data. Record preprocessing steps, the split seed and the evaluation metric in a notebook.',
          'استخدم بيانات تدريب عامة بهدف موثق. أنشئ تقسيمات التدريب والتحقق والاختبار. درّب خط أساس ونموذجاً بسيطاً على بيانات التدريب وحدها. وثق المعالجة المسبقة وبذرة التقسيم ومقياس التقييم في دفتر عمل.',
        ),
      },
      {
        title: l('Review errors, not only a score', 'راجع الأخطاء لا الدرجة وحدها'),
        body: l(
          'Show a confusion matrix or a residual plot as appropriate. Describe at least three wrong predictions and possible data-quality issues. State what the metric does not establish and one condition under which the model should not be used.',
          'اعرض مصفوفة التباس أو مخطط بواقي بحسب المهمة. صف ثلاثة توقعات خاطئة على الأقل ومشكلات محتملة في جودة البيانات. حدد ما لا يثبته المقياس وحالة واحدة لا ينبغي استخدام النموذج فيها.',
        ),
      },
    ],
    questions: [
      q(
        l('Where should a scaler be fitted?', 'على أي بيانات يُضبط مقياس الخصائص؟'),
        [
          l('The entire dataset before splitting', 'كامل البيانات قبل التقسيم'),
          l('Training data only', 'بيانات التدريب فقط'),
          l('Only the final test set', 'مجموعة الاختبار النهائية فقط'),
        ],
        1,
        l(
          'Using test information to fit preprocessing leaks information into training.',
          'يؤدي استخدام بيانات الاختبار لضبط المعالجة إلى تسرب المعلومات.',
        ),
      ),
      q(
        l(
          'Which metric measures how many real positives are found?',
          'أي مقياس يوضح نسبة الإيجابيات الحقيقية المكتشفة؟',
        ),
        [
          l('Recall', 'Recall'),
          l('Training loss alone', 'خسارة التدريب وحدها'),
          l('Dataset size', 'حجم البيانات'),
        ],
        0,
        l(
          'Recall is true positives divided by all actual positives.',
          'Recall هو الإيجابيات الصحيحة مقسوماً على كل الإيجابيات الفعلية.',
        ),
      ),
    ],
  },
  {
    id: 'pytorch-deep-learning',
    title: l('Deep learning with PyTorch', 'التعلم العميق باستخدام PyTorch'),
    summary: l(
      'A complete long-form PyTorch course with a study companion on training loops, evaluation and reproducible experiments.',
      'دورة PyTorch كاملة وطويلة مع دليل لحلقات التدريب والتقييم والتجارب القابلة للتكرار.',
    ),
    category: 'ai',
    level: 'advanced',
    roles: ['ml-engineer', 'ai-researcher'],
    video: 'Z_ikDlimN6A',
    source: 'Learn PyTorch for deep learning in a day. Literally.',
    provider: 'Daniel Bourke',
    prerequisites: l(
      'Python, tensors, basic ML evaluation and an environment with PyTorch installed. A GPU is optional for a small project.',
      'بايثون والموترات وتقييم تعلم الآلة وبيئة تحتوي PyTorch. بطاقة رسومية اختيارية للمشروع الصغير.',
    ),
    concepts: [
      {
        title: l('Tensors, shapes and devices', 'الموترات والأبعاد والأجهزة'),
        body: l(
          'A tensor has a shape, dtype and device. Write expected input and output shapes before implementing a layer. Broadcasting can make an incorrect operation run without raising an error, so assert important dimensions. Move the model and its inputs to the same device and avoid unnecessary transfers inside the training loop.',
          'للموتر شكل ونوع بيانات وجهاز. اكتب أبعاد المدخلات والمخرجات قبل تنفيذ الطبقة. قد يسمح البث بتنفيذ عملية خاطئة دون خطأ برمجي؛ لذا تحقق من الأبعاد المهمة. ضع النموذج ومدخلاته على الجهاز نفسه وتجنب النقل غير الضروري داخل حلقة التدريب.',
        ),
      },
      {
        title: l('The training loop', 'حلقة التدريب'),
        body: l(
          'A typical step clears accumulated gradients, computes predictions, evaluates loss, backpropagates and updates parameters. Gradients accumulate unless cleared intentionally. Loss describes the optimization objective, not necessarily the metric users care about. Keep a validation pass separate from parameter updates and monitor both training and validation curves.',
          'تمسح الخطوة المعتادة التدرجات المتراكمة وتحسب التوقعات والخسارة ثم تنفذ الانتشار العكسي وتحدث المعاملات. تتراكم التدرجات ما لم تمسحها عمداً. تصف الخسارة هدف التحسين ولا تطابق دائماً مقياس المستخدم. افصل التحقق عن تحديث المعاملات وراقب منحنيي التدريب والتحقق.',
        ),
      },
      {
        title: l('Evaluation and experiment records', 'التقييم وتوثيق التجارب'),
        body: l(
          'model.eval() changes behavior of layers such as dropout; it does not disable gradient recording. Use a no-gradient context for inference. Save architecture assumptions and preprocessing alongside weights. Record seeds and library versions, while recognizing that exact reproducibility can vary by hardware and operation.',
          'تغيّر model.eval() سلوك طبقات مثل dropout لكنها لا توقف تسجيل التدرجات. استخدم سياقاً دون تدرجات للاستدلال. احفظ افتراضات المعمارية والمعالجة المسبقة مع الأوزان. وثّق البذور وإصدارات المكتبات مع مراعاة أن التطابق الكامل قد يختلف بحسب الأجهزة والعمليات.',
        ),
      },
    ],
    project: [
      {
        title: l('Train a compact classifier', 'درّب مصنفاً صغيراً'),
        body: l(
          'Choose a small public image dataset and document its license. Build a simple baseline and one compact neural network. Print the tensor shapes in a single diagnostic batch, then train with a separate validation set. Keep compute modest and save the best validation checkpoint.',
          'اختر بيانات صور عامة صغيرة ووثّق ترخيصها. ابنِ خط أساس وشبكة عصبية صغيرة. اعرض أبعاد الموترات لدفعة تشخيص واحدة ثم درّب باستخدام مجموعة تحقق منفصلة. اجعل الحساب محدوداً واحفظ أفضل نقطة تحقق وفق التقييم.',
        ),
      },
      {
        title: l('Make inference repeatable', 'اجعل الاستدلال قابلاً للتكرار'),
        body: l(
          'Load the saved weights into a fresh model instance. Run evaluation with the same preprocessing, model.eval() and no-gradient context. Compare one batch with the previous run and explain why comparing training-mode predictions could produce different outputs.',
          'حمّل الأوزان المحفوظة في نسخة جديدة من النموذج. نفّذ التقييم بالمعالجة نفسها مع model.eval() وسياق دون تدرجات. قارن دفعة بالتشغيل السابق واشرح لماذا قد تختلف المخرجات عند المقارنة في وضع التدريب.',
        ),
      },
    ],
    questions: [
      q(
        l('Does model.eval() disable gradient tracking?', 'هل توقف model.eval() تتبع التدرجات؟'),
        [
          l('Yes, always', 'نعم دائماً'),
          l('No, use a no-gradient context as well', 'لا، استخدم أيضاً سياقاً دون تدرجات'),
          l('Only on CPU', 'على المعالج فقط'),
        ],
        1,
        l(
          'Evaluation mode and gradient tracking are independent controls.',
          'وضع التقييم وتتبع التدرجات آليتان مستقلتان.',
        ),
      ),
      q(
        l(
          'Why clear gradients during ordinary training steps?',
          'لماذا نمسح التدرجات في خطوات التدريب المعتادة؟',
        ),
        [
          l('They accumulate by default', 'لأنها تتراكم افتراضياً'),
          l('To delete the model weights', 'لحذف أوزان النموذج'),
          l('To resize the training data', 'لتغيير حجم بيانات التدريب'),
        ],
        0,
        l(
          'Accumulation is useful when intentional, but otherwise changes the update.',
          'يفيد التراكم عند قصده؛ وإلا فإنه يغير التحديث.',
        ),
      ),
    ],
  },
  {
    id: 'google-cloud',
    title: l('Google Cloud infrastructure', 'البنية التحتية على Google Cloud'),
    summary: l(
      'Study cloud infrastructure through a complete Associate Cloud Engineer preparation video and a system-design exercise.',
      'ادرس البنية السحابية عبر فيديو كامل للاستعداد لمهندس السحابة المساعد وتمرين لتصميم نظام.',
    ),
    category: 'cloud',
    level: 'intermediate',
    roles: ['cloud-architect', 'devops-engineer'],
    video: 'jpno8FSqpc8',
    source: 'Google Cloud Associate Cloud Engineer Course - Pass the Exam!',
    provider: 'freeCodeCamp.org',
    prerequisites: l(
      'Basic networking and command-line knowledge. Exercises can be completed as diagrams without a paid cloud account. The recording may use older console screens.',
      'أساسيات الشبكات وسطر الأوامر. يمكن إتمام التمارين كمخططات دون حساب سحابي مدفوع. قد يعرض التسجيل واجهات تحكم أقدم.',
    ),
    concepts: [
      {
        title: l('Resource boundaries and identity', 'حدود الموارد والهوية'),
        body: l(
          'Separate projects and environments so development changes do not affect production by accident. IAM answers who can perform which action on which resource. Grant only the permissions needed for a workload, prefer workload identities over long-lived credentials, and distinguish a human user from a service account. Network rules and identity permissions address different boundaries.',
          'افصل المشاريع والبيئات كي لا تؤثر تعديلات التطوير في الإنتاج بالخطأ. تجيب IAM عن هوية من يستطيع تنفيذ إجراء على مورد. امنح الحمل الصلاحيات اللازمة فقط، وفضّل هوية حمل العمل على بيانات اعتماد طويلة العمر، وميّز المستخدم البشري عن حساب الخدمة. تعالج قواعد الشبكة وصلاحيات الهوية حدوداً مختلفة.',
        ),
      },
      {
        title: l('Choose services by workload', 'اختيار الخدمات بحسب الحمل'),
        body: l(
          'A virtual machine gives operating-system control while a managed runtime removes some operational responsibilities. A managed database still requires decisions about schema, backups and access. Consider availability zones, failure recovery and data transfer costs when sketching architecture. A budget notification reports spending; it is not necessarily a hard spending cap.',
          'تمنح الآلة الافتراضية تحكماً بنظام التشغيل بينما تقلل البيئة المدارة بعض المسؤوليات التشغيلية. تظل قاعدة البيانات المدارة بحاجة لقرارات حول المخطط والنسخ والوصول. راعِ نطاقات التوافر والتعافي وتكلفة نقل البيانات عند التصميم. يبلغ تنبيه الميزانية عن الإنفاق ولا يمثل بالضرورة حداً يوقفه.',
        ),
      },
    ],
    project: [
      {
        title: l('Design a small learning platform', 'صمّم منصة تعلم صغيرة'),
        body: l(
          'Draw a browser, application service, object store and managed database. Mark which connections are public and which require an authenticated workload. Choose a region and state what data needs a backup. No paid deployment is required.',
          'ارسم متصفحاً وخدمة تطبيق ومخزن ملفات وقاعدة بيانات مدارة. حدد الاتصالات العامة والتي تتطلب هوية حمل عمل. اختر منطقة وحدد البيانات التي تحتاج إلى نسخة احتياطية. لا يلزم نشر مدفوع.',
        ),
      },
      {
        title: l('Write an operational review', 'اكتب مراجعة تشغيلية'),
        body: l(
          'Describe what happens if the application process or one zone fails. Identify the least-privilege permissions for the app and list the main cost drivers. Explain how you would restore a backup and test it rather than assuming a backup guarantees recovery.',
          'صف ما يحدث عند فشل عملية التطبيق أو نطاق توافر. حدد أقل صلاحيات يحتاجها التطبيق وأبرز عوامل التكلفة. اشرح استعادة النسخة الاحتياطية واختبارها بدلاً من افتراض أن وجودها يضمن التعافي.',
        ),
      },
    ],
    questions: [
      q(
        l('What does IAM primarily control?', 'ما الذي تتحكم به IAM أساساً؟'),
        [
          l('Permissions on resources', 'الصلاحيات على الموارد'),
          l('Only image resolution', 'دقة الصور فقط'),
          l('The application programming language', 'لغة برمجة التطبيق'),
        ],
        0,
        l(
          'Identity and access management defines who can do what.',
          'تحدد إدارة الهوية والوصول من يستطيع تنفيذ أي إجراء.',
        ),
      ),
      q(
        l('Does a budget alert always stop spending?', 'هل يوقف تنبيه الميزانية الإنفاق دائماً؟'),
        [
          l('Yes', 'نعم'),
          l('No, alerts and hard enforcement are different', 'لا، يختلف التنبيه عن المنع الفعلي'),
          l('Only when the browser is open', 'عند فتح المتصفح فقط'),
        ],
        1,
        l(
          'Check the provider controls instead of treating an alert as a cap.',
          'تحقق من أدوات الجهة بدلاً من اعتبار التنبيه سقفاً ملزماً.',
        ),
      ),
    ],
  },
  {
    id: 'docker',
    title: l('Docker: package and run applications', 'Docker: تحزيم التطبيقات وتشغيلها'),
    summary: l(
      'A complete Docker introduction supported by a practical guide to images, containers and durable data.',
      'مقدمة كاملة في Docker مع دليل عملي للصور والحاويات والبيانات الدائمة.',
    ),
    category: 'cloud',
    level: 'beginner',
    roles: ['devops-engineer', 'backend-engineer', 'cloud-architect'],
    video: 'fqMOX6JJhGo',
    source: 'Docker Tutorial for Beginners - A Full DevOps Course on How to Run Applications in Containers',
    provider: 'freeCodeCamp.org',
    prerequisites: l(
      'Basic terminal commands and a small application. Docker is needed only for the practical exercise.',
      'أوامر الطرفية الأساسية وتطبيق صغير. تحتاج Docker للتمرين العملي فقط.',
    ),
    concepts: [
      {
        title: l('Images and running containers', 'الصور والحاويات المشغلة'),
        body: l(
          'An image is a versioned package used to create containers. A container is a running instance with its own writable layer; changing that layer does not rebuild the image. A Dockerfile describes repeatable build steps. Copy dependency manifests before frequently changing source files to make useful build caching possible.',
          'الصورة حزمة ذات إصدار تستخدم لإنشاء الحاويات. الحاوية نسخة مشغلة بطبقة كتابة خاصة؛ ولا يؤدي تعديلها إلى إعادة بناء الصورة. يصف Dockerfile خطوات بناء قابلة للتكرار. انسخ ملفات الاعتماديات قبل الملفات كثيرة التغيير للاستفادة من التخزين المؤقت للبناء.',
        ),
      },
      {
        title: l('Ports, volumes and configuration', 'المنافذ ووحدات التخزين والإعدادات'),
        body: l(
          'A service listening inside a container is not automatically reachable on the host. Publish the required port intentionally. Use a volume for data that must outlive a container, and keep runtime configuration separate from the image. Do not bake credentials into an image: deleting a file in a later layer may not remove it from earlier layers.',
          'لا تصبح الخدمة داخل الحاوية متاحة على المضيف تلقائياً؛ انشر المنفذ المطلوب عمداً. استخدم وحدة تخزين للبيانات التي يجب أن تبقى بعد الحاوية، وافصل إعدادات التشغيل عن الصورة. لا تضمّن بيانات الاعتماد في الصورة؛ فحذف ملف في طبقة لاحقة قد لا يزيله من الطبقات السابقة.',
        ),
      },
    ],
    project: [
      {
        title: l('Containerize a small service', 'ضع خدمة صغيرة في حاوية'),
        body: l(
          'Create a minimal HTTP service with a health endpoint. Write a Dockerfile using a specific base version, install dependencies and run as a non-root user where supported. Build the image locally and publish only the application port.',
          'أنشئ خدمة HTTP صغيرة بنقطة فحص صحة. اكتب Dockerfile بإصدار أساس محدد وثبّت الاعتماديات وشغّل بمستخدم غير جذر متى أمكن. ابنِ الصورة محلياً وانشر منفذ التطبيق فقط.',
        ),
      },
      {
        title: l('Verify replacement behavior', 'تحقق من سلوك الاستبدال'),
        body: l(
          'Stop and replace the container, then confirm what happens to files written inside it. Repeat using a volume for a sample data file. Document the build and run commands and explain why a successful image build alone does not prove the service is healthy.',
          'أوقف الحاوية واستبدلها ثم تحقق مما يحدث للملفات المكتوبة داخلها. كرر باستخدام وحدة تخزين لملف بيانات تجريبي. وثّق أوامر البناء والتشغيل واشرح لماذا لا يثبت نجاح بناء الصورة سلامة الخدمة.',
        ),
      },
    ],
    questions: [
      q(
        l('Which object is the running instance?', 'ما العنصر الذي يمثل النسخة المشغلة؟'),
        [l('A Dockerfile', 'Dockerfile'), l('A container', 'الحاوية'), l('An image tag', 'وسم الصورة')],
        1,
        l('Containers are created from images.', 'تُنشأ الحاويات انطلاقاً من الصور.'),
      ),
      q(
        l('Where should persistent application files live?', 'أين تحفظ ملفات التطبيق الدائمة؟'),
        [
          l('Only in the disposable container layer', 'في طبقة الحاوية المؤقتة فقط'),
          l(
            'In a deliberately configured persistent volume or service',
            'في وحدة أو خدمة تخزين دائمة مضبوطة عمداً',
          ),
          l('In the image build log', 'في سجل بناء الصورة'),
        ],
        1,
        l(
          'Replacing a container should not erase durable application data.',
          'يجب ألا يمحو استبدال الحاوية بيانات التطبيق الدائمة.',
        ),
      ),
    ],
  },
  {
    id: 'kubernetes',
    title: l('Kubernetes application operations', 'تشغيل التطبيقات باستخدام Kubernetes'),
    summary: l(
      'Study the complete Kubernetes video and design a resilient deployment with health checks and controlled rollouts.',
      'ادرس فيديو Kubernetes الكامل وصمّم نشراً مرناً بفحوص صحة وتحديثات مدروسة.',
    ),
    category: 'cloud',
    level: 'advanced',
    roles: ['devops-engineer', 'cloud-architect'],
    video: 'X48VuDVv0do',
    source: 'Kubernetes Tutorial for Beginners [FULL COURSE in 4 Hours]',
    provider: 'TechWorld with Nana',
    prerequisites: l(
      'Comfort with containers, networking and YAML. The video introduces Kubernetes; this pathway adds an advanced operations exercise.',
      'إجادة الحاويات والشبكات وYAML. يقدّم الفيديو Kubernetes، ويضيف هذا المسار تمرين تشغيل متقدماً.',
    ),
    concepts: [
      {
        title: l('Desired state and reconciliation', 'الحالة المطلوبة والمصالحة'),
        body: l(
          'A Deployment declares the desired number and template of pods. Controllers repeatedly compare desired state with observed state and act to reduce the difference. Treat pods as replaceable rather than permanent hosts. A Service gives a stable discovery boundary while pod addresses may change.',
          'يعلن Deployment العدد المطلوب وقالب وحدات pod. تقارن المتحكمات باستمرار الحالة المطلوبة بالمرصودة وتتخذ إجراءات لتقليص الفرق. تعامل مع pod كعنصر قابل للاستبدال لا كمضيف دائم. تتيح Service حد اكتشاف ثابتاً بينما قد تتغير عناوين الوحدات.',
        ),
      },
      {
        title: l('Health and controlled delivery', 'الصحة والتسليم المدروس'),
        body: l(
          'Readiness determines whether a pod should receive traffic. Liveness decides when an unhealthy container should be restarted, while a startup probe can protect a slow startup from premature checks. Resource requests guide scheduling; limits bound some resource use. A rollout needs observable success criteria and a rollback plan, not only an updated image tag.',
          'تحدد الجاهزية هل تستقبل الوحدة المرور. تحدد الحيوية متى تعاد الحاوية غير السليمة، وقد يحمي فحص بدء التشغيل الإقلاع البطيء من الفحوص المبكرة. توجه طلبات الموارد الجدولة وتحد الحدود بعض الاستخدام. يحتاج التحديث معايير نجاح قابلة للرصد وخطة تراجع، لا مجرد وسم صورة جديد.',
        ),
      },
    ],
    project: [
      {
        title: l('Design a resilient deployment', 'صمّم نشراً مرناً'),
        body: l(
          'Write manifests for a small stateless application with two replicas and a Service. Define readiness and liveness endpoints, requests and limits. Use a local practice cluster if available, or review the manifests as a design exercise.',
          'اكتب ملفات تعريف لتطبيق صغير عديم الحالة بنسختين وService. عرّف فحوص الجاهزية والحيوية وطلبات الموارد وحدودها. استخدم عنقود تدريب محلياً إن توفر أو راجع الملفات كتمرين تصميم.',
        ),
      },
      {
        title: l('Plan a failed rollout', 'خطط لتحديث يفشل'),
        body: l(
          'Describe how a bad readiness check would affect traffic and what events or logs you would inspect. Specify the deployment conditions that trigger rollback. Explain why increasing replicas does not itself solve a broken application or guarantee multi-zone availability.',
          'صف أثر فحص جاهزية خاطئ في المرور والأحداث والسجلات التي تفحصها. حدد شروط النشر التي تستدعي التراجع. اشرح لماذا لا تصلح زيادة النسخ تطبيقاً معطلاً ولا تضمن التوافر عبر نطاقات متعددة.',
        ),
      },
    ],
    questions: [
      q(
        l('Which probe controls whether a pod receives traffic?', 'أي فحص يتحكم باستقبال pod للمرور؟'),
        [
          l('Readiness', 'الجاهزية'),
          l('Image build', 'بناء الصورة'),
          l('A source-code formatter', 'منسق الكود'),
        ],
        0,
        l(
          'A pod can be running while not ready to serve requests.',
          'قد تكون الوحدة مشغلة لكنها غير جاهزة لتقديم الطلبات.',
        ),
      ),
      q(
        l('What does a controller reconcile?', 'ماذا يصالح المتحكم؟'),
        [
          l('Desired and observed state', 'الحالة المطلوبة والمرصودة'),
          l('Only local editor settings', 'إعدادات المحرر المحلي فقط'),
          l('Video playback speed', 'سرعة الفيديو'),
        ],
        0,
        l(
          'Reconciliation continually works toward the declared state.',
          'تسعى المصالحة باستمرار لتحقيق الحالة المعلنة.',
        ),
      ),
    ],
  },
  {
    id: 'linux',
    title: l('Linux and command-line foundations', 'أساسيات لينكس وسطر الأوامر'),
    summary: l(
      'A full Linux course with a study guide to files, permissions, processes and system observation.',
      'دورة لينكس كاملة مع دليل للملفات والصلاحيات والعمليات ومراقبة النظام.',
    ),
    category: 'security',
    level: 'beginner',
    roles: ['security-analyst', 'devops-engineer', 'cloud-architect'],
    video: 'sWbUDq4S6Y8',
    source: 'Introduction to Linux – Full Course for Beginners',
    provider: 'freeCodeCamp.org',
    prerequisites: l(
      'A disposable local Linux environment or virtual machine for practice.',
      'بيئة لينكس محلية قابلة للاستبدال أو آلة افتراضية للتدريب.',
    ),
    concepts: [
      {
        title: l('Files, streams and composition', 'الملفات والتدفقات والتركيب'),
        body: l(
          'An absolute path starts at the filesystem root; a relative path depends on the current directory. Standard input, output and error let small commands compose through pipes. Quote paths containing spaces and inspect a command before running it. Practice on copied sample files so mistakes do not affect personal data.',
          'يبدأ المسار المطلق من جذر نظام الملفات ويعتمد النسبي على المجلد الحالي. تسمح تدفقات الإدخال والإخراج والخطأ بتركيب الأوامر عبر الأنابيب. ضع المسارات المحتوية على مسافات بين علامتي اقتباس وافهم الأمر قبل تشغيله. تدرب على نسخ ملفات تجريبية كي لا تؤثر الأخطاء في بياناتك.',
        ),
      },
      {
        title: l('Permissions and processes', 'الصلاحيات والعمليات'),
        body: l(
          'File permissions distinguish owner, group and others, with read, write and execute flags. Execute permission on a directory has a different role from execute permission on a file. A process has a PID, an owner and resources. Diagnose with logs and process information before restarting or terminating a service; avoid using broad elevated privileges for routine work.',
          'تميّز صلاحيات الملفات بين المالك والمجموعة والآخرين وأذونات القراءة والكتابة والتنفيذ. تختلف وظيفة إذن تنفيذ المجلد عن الملف. للعملية معرّف PID ومالك وموارد. شخّص بالسجلات ومعلومات العمليات قبل إعادة التشغيل أو الإنهاء، وتجنب الصلاحيات المرتفعة الواسعة في العمل المعتاد.',
        ),
      },
    ],
    project: [
      {
        title: l('Inspect a practice system', 'افحص نظام تدريب'),
        body: l(
          'Create a sample directory with a log file and a text report. Use commands to count lines, filter selected messages and write a summary to a new file. Change permissions only on the sample files and explain each flag.',
          'أنشئ مجلد عينات بملف سجل وتقرير نصي. استخدم الأوامر لعد الأسطر وتصفية رسائل محددة وكتابة ملخص في ملف جديد. غيّر الصلاحيات على ملفات العينات فقط واشرح كل إذن.',
        ),
      },
      {
        title: l('Write a diagnostic runbook', 'اكتب دليل تشخيص'),
        body: l(
          'List how to inspect disk usage, running processes and a service log without changing the system. Distinguish observation commands from destructive changes. Include the PID-based steps you would use to stop only a process you started.',
          'اكتب كيفية فحص استخدام القرص والعمليات وسجل خدمة دون تعديل النظام. ميّز أوامر الرصد عن التغييرات الحذفية. أضف خطوات تستخدم PID لإيقاف العملية التي بدأتَها وحدها.',
        ),
      },
    ],
    questions: [
      q(
        l('What identifies a running process?', 'ما الذي يعرّف عملية مشغلة؟'),
        [l('PID', 'PID'), l('Only the filename extension', 'امتداد الملف فقط'), l('A CSS class', 'فئة CSS')],
        0,
        l('A PID can target a specific process.', 'يمكن استخدام PID لاستهداف عملية محددة.'),
      ),
      q(
        l('Who is covered by the owner permission bits?', 'من تشمل أذونات المالك؟'),
        [
          l('Every visitor to a website', 'كل زائر لموقع'),
          l('The file owner', 'مالك الملف'),
          l('Only the browser', 'المتصفح فقط'),
        ],
        1,
        l(
          'Owner, group and others have separate permission sets.',
          'للمالك والمجموعة والآخرين مجموعات أذونات منفصلة.',
        ),
      ),
    ],
  },
  {
    id: 'security-labs',
    title: l('Security fundamentals and ethical practice', 'أساسيات الأمن والممارسة الأخلاقية'),
    summary: l(
      'A complete ethical-hacking video paired with a defensive study guide and an isolated lab-report exercise.',
      'فيديو كامل للاختبار الأخلاقي مع دليل دفاعي وتمرين تقرير مختبر معزول.',
    ),
    category: 'security',
    level: 'intermediate',
    roles: ['security-analyst'],
    video: 'fNzpcB7ODxQ',
    source: 'Ethical Hacking in 12 Hours - Full Course - Learn to Hack!',
    provider: 'The Cyber Mentors',
    prerequisites: l(
      'Linux and networking fundamentals. Practical activity is limited to systems you own or have explicit permission to test.',
      'أساسيات لينكس والشبكات. يقتصر التطبيق على أنظمة تملكها أو لديك إذن صريح لاختبارها.',
    ),
    concepts: [
      {
        title: l('Scope and evidence', 'النطاق والأدلة'),
        body: l(
          'Define the systems, time window and allowed actions before a security assessment. Good evidence records what was observed and how to reproduce it in the authorized environment. Separate an observation from an inference. An open port is not automatically a vulnerability; exposure, software behavior and compensating controls matter.',
          'حدد الأنظمة والفترة الزمنية والإجراءات المسموحة قبل التقييم الأمني. تسجل الأدلة الجيدة ما لوحظ وكيف يعاد إنتاجه في البيئة المصرح بها. افصل الملاحظة عن الاستنتاج. لا يمثل المنفذ المفتوح ثغرة تلقائياً؛ فالتعرض وسلوك البرنامج والضوابط التعويضية عوامل مهمة.',
        ),
      },
      {
        title: l('Risk and remediation', 'المخاطر والمعالجة'),
        body: l(
          'A useful finding connects a weakness to a realistic impact and a specific remediation. Prioritize by exposure and consequence, not only an automated score. Keep credentials and personal data out of reports. Recommend verification steps so a team can confirm the fix without repeating an unnecessary intrusive test.',
          'يربط الاكتشاف المفيد نقطة الضعف بأثر واقعي ومعالجة محددة. رتّب الأولوية وفق التعرض والعواقب لا درجة آلية وحدها. أبقِ بيانات الاعتماد والبيانات الشخصية خارج التقارير. اقترح خطوات تحقق تمكّن الفريق من تأكيد الإصلاح دون تكرار اختبار تدخلي غير لازم.',
        ),
      },
    ],
    project: [
      {
        title: l('Create an authorized lab plan', 'أنشئ خطة مختبر مصرح'),
        body: l(
          'Draw a local training network containing fictional services. Write scope, allowed observation tasks, stop conditions and evidence-handling rules. Do not test public systems. Identify one hypothetical misconfiguration and describe how a defender could detect and correct it.',
          'ارسم شبكة تدريب محلية بخدمات افتراضية. اكتب النطاق ومهام الرصد المسموحة وشروط التوقف وقواعد التعامل مع الأدلة. لا تختبر أنظمة عامة. حدد خطأ إعداد افتراضياً وصف كيفية كشفه وتصحيحه دفاعياً.',
        ),
      },
      {
        title: l('Write a finding and retest', 'اكتب اكتشافاً وخطة إعادة تحقق'),
        body: l(
          'Prepare a finding with summary, evidence, impact, affected lab component and remediation. Remove any sensitive sample values. Add a retest checklist that checks the configuration change and expected normal operation.',
          'أعد اكتشافاً يتضمن ملخصاً وأدلة وأثراً ومكون المختبر المتأثر والمعالجة. أزل القيم الحساسة من العينات. أضف قائمة إعادة تحقق تفحص تعديل الإعداد واستمرار التشغيل الطبيعي المتوقع.',
        ),
      },
    ],
    questions: [
      q(
        l('When may you assess a system?', 'متى يجوز تقييم نظام؟'),
        [
          l('Whenever its address is public', 'بمجرد كون عنوانه عاماً'),
          l('Within explicit authorization and agreed scope', 'ضمن إذن صريح ونطاق متفق عليه'),
          l('Only if a tool finds it automatically', 'إذا عثرت عليه أداة تلقائياً فقط'),
        ],
        1,
        l(
          'Technical reachability does not establish authorization.',
          'لا تعني إمكانية الوصول التقني وجود إذن.',
        ),
      ),
      q(
        l('What makes a finding actionable?', 'ما الذي يجعل الاكتشاف قابلاً للمعالجة؟'),
        [
          l('A dramatic title without evidence', 'عنوان مثير بلا أدلة'),
          l('Evidence, impact and a specific remediation', 'أدلة وأثر ومعالجة محددة'),
          l('A screenshot alone', 'لقطة شاشة وحدها'),
        ],
        1,
        l(
          'The team needs enough context to prioritize and verify a fix.',
          'يحتاج الفريق سياقاً كافياً لترتيب الأولوية والتحقق من الإصلاح.',
        ),
      ),
    ],
  },
  {
    id: 'figma-design',
    title: l('UI/UX: from wireframe to prototype', 'تصميم الواجهات والتجربة: من التخطيط إلى النموذج'),
    summary: l(
      'A complete Figma design tutorial with an original workflow for research, interaction and accessible prototypes.',
      'شرح تصميم كامل باستخدام Figma مع منهج للبحث والتفاعل والنماذج القابلة للوصول.',
    ),
    category: 'design',
    level: 'beginner',
    roles: ['product-designer'],
    video: 'c9Wg6Cb_YlU',
    source: 'UI / UX Design Tutorial – Wireframe, Mockup & Design in Figma',
    provider: 'freeCodeCamp.org',
    prerequisites: l(
      'A Figma account is useful for the exercise; paper sketches work for the first stage.',
      'يفيد حساب Figma للتطبيق؛ وتكفي الرسوم الورقية للمرحلة الأولى.',
    ),
    concepts: [
      {
        title: l('Start with the user task', 'ابدأ بمهمة المستخدم'),
        body: l(
          'A wireframe communicates structure before visual polish. Define the user, goal and context, then map the shortest clear path to completing the task. Separate a research observation from your assumption. Include empty, loading and error states in the flow instead of designing only a populated success screen.',
          'يوضح المخطط الهيكل قبل التجميل البصري. حدد المستخدم والهدف والسياق ثم ارسم أقصر مسار واضح لإنجاز المهمة. افصل ملاحظة البحث عن افتراضك. ضمّن حالات الفراغ والتحميل والخطأ بدلاً من تصميم شاشة نجاح ممتلئة وحدها.',
        ),
      },
      {
        title: l('Components and accessible interaction', 'المكونات والتفاعل القابل للوصول'),
        body: l(
          'Reusable components keep labels, spacing and behavior consistent. Design focus and selected states, not only hover. Use readable contrast and meaningful text labels rather than color alone to communicate status. A clickable prototype tests whether people understand the flow; it does not prove the implementation is accessible without testing the real interface.',
          'تحافظ المكونات القابلة لإعادة الاستخدام على اتساق التسميات والمسافات والسلوك. صمّم حالتي التركيز والتحديد لا التحويم وحده. استخدم تبايناً مقروءاً وتسميات ذات معنى بدلاً من اللون وحده للحالة. يختبر النموذج القابل للنقر فهم المسار، لكنه لا يثبت قابلية التطبيق للوصول دون اختبار الواجهة الحقيقية.',
        ),
      },
    ],
    project: [
      {
        title: l('Design a course enrollment flow', 'صمّم مسار الالتحاق بدورة'),
        body: l(
          'Sketch a course list, course overview and lesson view. Define what the learner needs at each step. Create low-fidelity wireframes, then a reusable button and course-card component. Include a no-results state and a failed-loading state.',
          'ارسم قائمة دورات ونظرة عامة وصفحة درس. حدد حاجة المتعلم في كل خطوة. أنشئ مخططات أولية ثم مكون زر وبطاقة دورة قابلين لإعادة الاستخدام. ضمّن حالة بلا نتائج وأخرى لفشل التحميل.',
        ),
      },
      {
        title: l('Test comprehension', 'اختبر الفهم'),
        body: l(
          'Ask a willing participant to find a beginner course and open its first lesson using the prototype. Record where they hesitate without leading them. Revise one confusing interaction and document the evidence behind the change.',
          'اطلب من مشارك راغب العثور على دورة مبتدئة وفتح أول درس في النموذج. سجل مواضع التردد دون توجيه الإجابات. عدّل تفاعلاً مربكاً ووثّق الأدلة وراء التغيير.',
        ),
      },
    ],
    questions: [
      q(
        l('What is the main purpose of an early wireframe?', 'ما الهدف الأساسي من المخطط الأولي؟'),
        [
          l('Communicate structure and flow', 'توضيح الهيكل والمسار'),
          l('Prove production performance', 'إثبات أداء الإنتاج'),
          l('Replace all user research', 'استبدال أبحاث المستخدمين'),
        ],
        0,
        l(
          'Low-fidelity structure makes early changes less costly.',
          'يجعل الهيكل الأولي التغييرات المبكرة أقل تكلفة.',
        ),
      ),
      q(
        l('Should color alone communicate an error?', 'هل يكفي اللون وحده لتوضيح الخطأ؟'),
        [
          l('Yes', 'نعم'),
          l('No, include a meaningful label or other cue', 'لا، أضف تسمية أو إشارة ذات معنى'),
          l('Only on small screens', 'على الشاشات الصغيرة فقط'),
        ],
        1,
        l(
          'Text and other cues make status understandable beyond color perception.',
          'تجعل النصوص والإشارات الأخرى الحالة مفهومة دون الاعتماد على إدراك اللون.',
        ),
      ),
    ],
  },
  {
    id: 'kotlin-mobile',
    title: l('Kotlin foundations for mobile engineers', 'أساسيات Kotlin لمهندسي الجوال'),
    summary: l(
      'A complete Kotlin programming course with exercises on null safety, data models and state transitions.',
      'دورة Kotlin كاملة مع تمارين على أمان القيم الفارغة ونماذج البيانات وانتقالات الحالة.',
    ),
    category: 'mobile',
    level: 'beginner',
    roles: ['mobile-engineer'],
    video: 'EExSSotojVI',
    source: 'Learn Kotlin Programming – Full Course for Beginners',
    provider: 'freeCodeCamp.org',
    prerequisites: l(
      'A Kotlin playground or local Kotlin environment. This is a language foundation, not a complete Android app-development certification.',
      'بيئة Kotlin محلية أو ساحة تجريب. هذه أساسيات اللغة وليست شهادة متكاملة لتطوير أندرويد.',
    ),
    concepts: [
      {
        title: l('Nullability and explicit models', 'القيم الفارغة والنماذج الصريحة'),
        body: l(
          'Kotlin distinguishes nullable and non-null types. A safe call handles a nullable receiver without forcing a crash; a non-null assertion should not replace reasoning about missing values. Data classes describe value-like records. Model the states your application can actually enter rather than combining several booleans that allow impossible combinations.',
          'تميّز Kotlin بين الأنواع القابلة للفراغ وغيرها. يعالج الاستدعاء الآمن قيمة قابلة للفراغ دون فرض انهيار؛ ولا ينبغي أن يحل تأكيد عدم الفراغ محل فهم البيانات الناقصة. تصف data class سجلات القيم. مثّل حالات التطبيق الفعلية بدلاً من جمع متغيرات منطقية تسمح بتراكيب مستحيلة.',
        ),
      },
      {
        title: l('Functions and immutable transformations', 'الدوال والتحويلات دون تعديل الأصل'),
        body: l(
          'Use val for bindings that are not reassigned, while remembering that the referenced object may still be mutable. Express transformations with functions that receive values and return new values. Keep network or UI side effects outside core calculation logic. This separation helps a mobile app survive lifecycle changes without losing track of state ownership.',
          'استخدم val للأسماء التي لا يعاد إسنادها مع تذكر أن الكائن المشار إليه قد يبقى قابلاً للتعديل. عبّر عن التحويلات بدوال تستقبل قيماً وتعيد قيماً جديدة. افصل آثار الشبكة والواجهة عن الحساب الأساسي. يساعد الفصل تطبيق الجوال على التعامل مع دورة الحياة وفهم ملكية الحالة.',
        ),
      },
    ],
    project: [
      {
        title: l('Model a learning screen', 'نمذج شاشة تعلم'),
        body: l(
          'Create Kotlin data types for a course and lesson. Represent screen states such as loading, loaded and failed using explicit types. Write a function that marks a lesson complete and returns an updated model without changing the original input.',
          'أنشئ أنواع بيانات Kotlin للدورة والدرس. مثّل حالات الشاشة كالتحميل والنجاح والفشل بأنواع صريحة. اكتب دالة تضع علامة إنجاز على درس وتعيد نموذجاً محدّثاً دون تغيير المدخل الأصلي.',
        ),
      },
      {
        title: l('Exercise state boundaries', 'اختبر حدود الحالة'),
        body: l(
          'Test an empty course, an unknown lesson ID and marking the same lesson twice. Decide how progress is calculated when there are no lessons. Explain which layer should save progress and which layer should only display it.',
          'اختبر دورة فارغة ومعرّف درس مجهولاً وتعليم الدرس نفسه مرتين. حدد حساب التقدم عند غياب الدروس. اشرح الطبقة التي تحفظ التقدم وتلك التي تعرضه فقط.',
        ),
      },
    ],
    questions: [
      q(
        l('What does a nullable type express?', 'عمّ يعبّر النوع القابل للفراغ؟'),
        [
          l('A value may be absent', 'قد تكون القيمة غائبة'),
          l('The value is always a string', 'القيمة نص دائماً'),
          l('The application is offline', 'التطبيق غير متصل'),
        ],
        0,
        l('Nullability makes missing data explicit in the type.', 'يجعل النوع احتمال غياب البيانات صريحاً.'),
      ),
      q(
        l('Does val guarantee a deeply immutable object?', 'هل تضمن val كائناً غير قابل للتعديل بعمق؟'),
        [
          l('Yes', 'نعم'),
          l('No, it prevents reassignment of the binding', 'لا، تمنع إعادة إسناد الاسم'),
          l('Only for network requests', 'لطلبات الشبكة فقط'),
        ],
        1,
        l(
          'The referenced collection or object can still be mutable.',
          'قد يبقى الكائن أو المجموعة المشار إليها قابلاً للتعديل.',
        ),
      ),
    ],
  },
  {
    id: 'blockchain-engineering',
    title: l('Solidity and full-stack Web3 engineering', 'Solidity وهندسة Web3 المتكاملة'),
    summary: l(
      'A complete 32-hour publisher course with a companion on contract state, transactions and testing.',
      'دورة كاملة مدتها 32 ساعة من الناشر مع دليل لحالة العقود والمعاملات والاختبار.',
    ),
    category: 'blockchain',
    level: 'advanced',
    roles: ['blockchain-engineer'],
    video: 'gyMwXuJrbJQ',
    source: 'Learn Blockchain, Solidity, and Full Stack Web3 Development with JavaScript – 32-Hour Course',
    provider: 'freeCodeCamp.org',
    prerequisites: l(
      'JavaScript and software testing fundamentals. Use a local development network and test accounts only; tooling in the recording may differ from current versions.',
      'أساسيات جافاسكربت واختبار البرمجيات. استخدم شبكة تطوير محلية وحسابات اختبار فقط؛ قد تختلف أدوات التسجيل عن الإصدارات الحالية.',
    ),
    concepts: [
      {
        title: l('State, transactions and trust', 'الحالة والمعاملات والثقة'),
        body: l(
          'A contract defines state and the rules for changing it. A read call and a state-changing transaction have different execution and confirmation behavior. Transactions can fail and state changes must satisfy the contract rules. A network transaction identifier is not proof that an application-level goal was achieved; inspect the outcome and emitted events.',
          'يعرّف العقد الحالة وقواعد تغييرها. يختلف تنفيذ استدعاء القراءة وتأكيده عن معاملة تغيّر الحالة. قد تفشل المعاملة ويجب أن تحقق التغييرات قواعد العقد. لا يثبت معرّف المعاملة وحده نجاح هدف التطبيق؛ افحص النتيجة والأحداث المصدرة.',
        ),
      },
      {
        title: l('Test invariants and access boundaries', 'اختبار الثوابت وحدود الوصول'),
        body: l(
          'Specify properties that must hold across every valid sequence of calls. Check who may change sensitive state and how unexpected input is rejected. External calls create control-flow risk, so think carefully about updating state and interacting with other contracts. A local test suite is useful evidence, but it is not a substitute for an independent security review before handling real assets.',
          'حدد الخصائص التي يجب أن تصح عبر كل تسلسل استدعاءات صالح. تحقق ممن يغيّر الحالة الحساسة وكيف ترفض المدخلات غير المتوقعة. تنشئ الاستدعاءات الخارجية مخاطر في تدفق التحكم؛ فكر في ترتيب تحديث الحالة والتفاعل مع العقود. الاختبارات المحلية دليل مفيد لكنها لا تستبدل مراجعة أمنية مستقلة قبل التعامل مع أصول حقيقية.',
        ),
      },
    ],
    project: [
      {
        title: l('Build a local completion registry', 'ابنِ سجل إنجاز محلياً'),
        body: l(
          'On a local development chain, design a registry where an authorized issuer records completion for a learner address and course ID. Reject unauthorized writes and duplicate entries. Emit an event and create tests for success and failure paths. Do not put personal learner data on a public chain.',
          'على سلسلة تطوير محلية، صمّم سجلاً تسجل فيه جهة مخولة إنجاز عنوان متعلم لدورة. ارفض الكتابات غير المخولة والسجلات المتكررة. أصدر حدثاً واكتب اختبارات النجاح والفشل. لا تضع بيانات شخصية للمتعلمين على سلسلة عامة.',
        ),
      },
      {
        title: l('Explain the trust model', 'اشرح نموذج الثقة'),
        body: l(
          'Describe what a registry entry proves and what it does not prove about skill or identity. Explain key loss, issuer revocation and contract upgrade decisions. Document dependencies and test-network setup without including account credentials.',
          'صف ما يثبته سجل الإنجاز وما لا يثبته عن المهارة أو الهوية. اشرح فقدان المفاتيح وإلغاء صلاحية الجهة وقرارات ترقية العقد. وثّق الاعتماديات وإعداد شبكة الاختبار دون بيانات اعتماد الحساب.',
        ),
      },
    ],
    questions: [
      q(
        l(
          'Does a transaction ID alone prove an operation succeeded?',
          'هل يثبت معرّف المعاملة وحده نجاح العملية؟',
        ),
        [
          l('Always', 'دائماً'),
          l('No, inspect execution outcome', 'لا، افحص نتيجة التنفيذ'),
          l('Only in a browser', 'في المتصفح فقط'),
        ],
        1,
        l(
          'A submitted transaction can fail or produce an unexpected outcome.',
          'قد تفشل المعاملة المقدمة أو تنتج نتيجة غير متوقعة.',
        ),
      ),
      q(
        l('Where should this project be practiced?', 'أين ينفذ هذا المشروع التدريبي؟'),
        [
          l('On a local development chain with test accounts', 'على سلسلة تطوير محلية بحسابات اختبار'),
          l('Directly with real user assets', 'مباشرة بأصول مستخدمين حقيقية'),
          l('In a public document containing private keys', 'في مستند عام يحوي مفاتيح خاصة'),
        ],
        0,
        l(
          'A disposable local environment supports repeatable learning without real assets.',
          'تتيح البيئة المحلية القابلة للاستبدال تعلماً متكرراً دون أصول حقيقية.',
        ),
      ),
    ],
  },
]

export const seedCourses: LearningCourse[] = tracks.map((track) => ({
  id: track.id,
  title: track.title,
  summary: track.summary,
  category: track.category,
  level: track.level,
  professionIds: track.roles,
  provider: track.provider,
  sourceTitle: track.source,
  sourceUrl: `https://www.youtube.com/watch?v=${track.video}`,
  videoId: track.video,
  imagePath: `/images/careers/${track.roles[0]}.jpg`,
  prerequisites: track.prerequisites,
  outcomes: track.concepts.map((concept) => concept.title),
  visualPrompt: l(
    `Create a 16:9 educational diagram for "${track.title.en}". Explain ${track.concepts.map((c) => c.title.en).join(' and ')}. Show inputs, decisions and outputs, then a small example from "${track.project[0].title.en}". Use numbered annotations, clear vector shapes, forest-green accents and accessible contrast. Label in English. No invented statistics or provider logos.`,
    `صمّم مخططاً تعليمياً بنسبة 16:9 لدورة «${track.title.ar}». اشرح ${track.concepts.map((c) => c.title.ar).join(' و')}. وضّح المدخلات والقرارات والمخرجات ثم مثالاً من «${track.project[0].title.ar}». استخدم تعليقات مرقمة وأشكالاً متجهة واضحة ولمسات خضراء وتبايناً مقروءاً وتسميات عربية. دون إحصاءات مختلقة أو شعارات الجهات.`,
  ),
}))
export const seedLessons: LearningLesson[] = tracks.flatMap((track) => [
  {
    id: `${track.id}-watch`,
    courseId: track.id,
    position: 0,
    kind: 'video' as const,
    title: l('Watch the complete source course', 'شاهد دورة المصدر كاملة'),
    content: {
      introduction: l(
        'Play the complete publisher video here. Pause and resume with the player controls; lesson completion is marked manually after studying.',
        'شغّل فيديو الناشر الكامل هنا. أوقف واستأنف من أدوات المشغل؛ توضع علامة إنجاز الدرس يدوياً بعد الدراسة.',
      ),
      sections: [
        { title: l('Before watching', 'قبل المشاهدة'), body: track.prerequisites },
        {
          title: l('Study actively', 'ادرس بتفاعل'),
          body: l(
            'Work through examples in your own environment rather than only watching. Write down unfamiliar terms and record useful timestamps in your notes. Explain each major idea without looking at the recording, then use the next lessons to consolidate and practice it.',
            'نفّذ الأمثلة في بيئتك بدلاً من المشاهدة وحدها. دوّن المصطلحات الجديدة والأوقات المفيدة في ملاحظاتك. اشرح الأفكار الأساسية دون الرجوع للتسجيل، ثم استخدم الدروس التالية لترسيخها وتطبيقها.',
          ),
        },
      ],
    },
  },
  {
    id: `${track.id}-concepts`,
    courseId: track.id,
    position: 1,
    kind: 'reading' as const,
    title: l('Understand the core concepts', 'افهم المفاهيم الأساسية'),
    content: { introduction: track.summary, sections: track.concepts },
  },
  {
    id: `${track.id}-practice`,
    courseId: track.id,
    position: 2,
    kind: 'practice' as const,
    title: track.project[0].title,
    content: {
      introduction: l(
        'Turn the ideas into evidence of your understanding. Complete the exercise and keep a short explanation of your decisions.',
        'حوّل الأفكار إلى دليل على فهمك. نفّذ التمرين واحتفظ بشرح موجز لقراراتك.',
      ),
      sections: track.project,
    },
  },
  {
    id: `${track.id}-check`,
    courseId: track.id,
    position: 3,
    kind: 'quiz' as const,
    title: l('Check your understanding', 'اختبر فهمك'),
    content: {
      introduction: l(
        'Choose an answer for each question and check the explanations. You can retry; these checks support learning and do not issue a provider certificate.',
        'اختر إجابة لكل سؤال وراجع التفسير. يمكنك إعادة المحاولة؛ تدعم هذه الأسئلة التعلم ولا تمنح شهادة من الجهة الأصلية.',
      ),
      sections: [],
      questions: track.questions,
    },
  },
])
