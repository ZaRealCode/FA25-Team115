import { pgTable, text, integer, jsonb, timestamp } from 'drizzle-orm/pg-core';

export const dares = pgTable('dares', {
  id: text('id').primaryKey(),
  roll: integer('roll').notNull(),
  gender: text('gender').notNull(),
  text: text('text').notNull(),
  severity: integer('severity').notNull(),
  date_stage: text('date_stage').notNull(),
  safe_tags: jsonb('safe_tags').$type<string[]>().notNull(),
  visibility: text('visibility').notNull().default('visible'),
  example_stake: text('example_stake'),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull()
});
