import { integer, pgTable, serial, timestamp, varchar } from 'drizzle-orm/pg-core';
import user from './user';
import rouletteSet from './rouletteSet';

const playData = pgTable('play_data', {
    idx: serial('idx').primaryKey().notNull(),
    user_idx: integer('user_idx')
        .notNull()
        .references(() => user.idx),
    roulette_set_idx: integer('roulette_set_idx')
        .notNull()
        .references(() => rouletteSet.idx),
    ko: varchar('ko', { length: 50 }).notNull(),
    en: varchar('en', { length: 50 }).notNull(),
    created_at: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

export default playData;
