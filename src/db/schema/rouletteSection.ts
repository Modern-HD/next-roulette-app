import { integer, pgTable, serial, timestamp, varchar } from 'drizzle-orm/pg-core';
import rouletteSet from './rouletteSet';

const rouletteSection = pgTable('roulette_section', {
    idx: serial('idx').primaryKey().notNull(),
    roulette_set_idx: integer('roulette_set_idx')
        .notNull()
        .references(() => rouletteSet.idx)
        .notNull(),
    content: varchar('content').notNull(),
    weight: integer('weight').default(10000).notNull(),
    location: integer('location').notNull(),
    created_at: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updated_at: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

export default rouletteSection;
