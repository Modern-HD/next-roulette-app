import { serial, timestamp, varchar } from 'drizzle-orm/pg-core';
import { pgTable } from 'drizzle-orm/pg-core';

const category = pgTable('category', {
    idx: serial('idx').primaryKey().notNull(),
    ko: varchar('ko', { length: 50 }).notNull(),
    en: varchar('en', { length: 50 }).notNull(),
    created_at: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

export default category;
