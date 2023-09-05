import { integer, pgTable, serial, timestamp } from 'drizzle-orm/pg-core';
import user from './user';
import rouletteSection from './rouletteSection';

const playData = pgTable('play_data', {
    idx: serial('idx').primaryKey().notNull(),
    user_idx: integer('user_idx')
        .notNull()
        .references(() => user.idx),
    result_section: integer('result_section')
        .notNull()
        .references(() => rouletteSection.idx),
    created_at: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

export default playData;
