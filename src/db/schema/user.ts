import { pgTable, serial, timestamp, uuid, varchar } from 'drizzle-orm/pg-core';

const user = pgTable('user', {
    idx: serial('idx').primaryKey().notNull(),
    uuid: uuid('uuid').notNull(),
    nick_name: varchar('nick_name').notNull(),
    created_at: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updated_at: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

export default user;
