import type { LearningCourse, LearningLesson } from '../lib/learning'
import {
  boolean,
  integer,
  jsonb,
  pgTable,
  primaryKey,
  text,
  timestamp,
  unique,
  uuid,
} from 'drizzle-orm/pg-core'

export const preferences = pgTable('visitor_preferences', {
  id: uuid('id').primaryKey(),
  locale: text('locale').notNull().default('en'),
  theme: text('theme').notNull().default('dark'),
  reducedMotion: boolean('reduced_motion').notNull().default(false),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
})

export const learningCourses = pgTable('learning_courses', {
  id: text('id').primaryKey(),
  title: jsonb('title').$type<LearningCourse['title']>().notNull(),
  summary: jsonb('summary').$type<LearningCourse['summary']>().notNull(),
  category: text('category').$type<LearningCourse['category']>().notNull(),
  level: text('level').$type<LearningCourse['level']>().notNull(),
  professionIds: jsonb('profession_ids').$type<string[]>().notNull(),
  provider: text('provider').notNull(),
  sourceTitle: text('source_title').notNull(),
  sourceUrl: text('source_url').notNull(),
  videoId: text('video_id').notNull(),
  imagePath: text('image_path').notNull(),
  visualPrompt: jsonb('visual_prompt').$type<LearningCourse['visualPrompt']>().notNull(),
  prerequisites: jsonb('prerequisites').$type<LearningCourse['prerequisites']>().notNull(),
  outcomes: jsonb('outcomes').$type<LearningCourse['outcomes']>().notNull(),
})
export const learningLessons = pgTable(
  'learning_lessons',
  {
    id: text('id').primaryKey(),
    courseId: text('course_id')
      .notNull()
      .references(() => learningCourses.id, { onDelete: 'cascade' }),
    position: integer('position').notNull(),
    kind: text('kind').$type<LearningLesson['kind']>().notNull(),
    title: jsonb('title').$type<LearningLesson['title']>().notNull(),
    content: jsonb('content').$type<LearningLesson['content']>().notNull(),
  },
  (table) => [unique('learning_lesson_position').on(table.courseId, table.position)],
)
export const learningProgress = pgTable(
  'learning_progress',
  {
    visitorId: uuid('visitor_id').notNull(),
    lessonId: text('lesson_id')
      .notNull()
      .references(() => learningLessons.id, { onDelete: 'cascade' }),
    completedAt: timestamp('completed_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [primaryKey({ columns: [table.visitorId, table.lessonId] })],
)
