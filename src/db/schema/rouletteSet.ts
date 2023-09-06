import { boolean, integer, pgTable, serial, text, timestamp, varchar } from 'drizzle-orm/pg-core';
import user from './user';
import category from './category';

const rouletteSet = pgTable('roulette_set', {
    idx: serial('idx').primaryKey().notNull(),
    title: varchar('title').notNull(),
    description: text('description').notNull(),
    user_idx: integer('user_idx')
        .notNull()
        .references(() => user.idx),
    play_count: integer('play_count').notNull(),
    category_idx: integer('category_idx')
        .notNull()
        .references(() => category.idx),
    public: boolean('public').default(false).notNull(),
    created_at: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updated_at: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

export default rouletteSet;
