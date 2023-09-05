import { Config } from 'drizzle-kit';
import * as dotenv from 'dotenv';
dotenv.config();

export default {
    schema: './src/db/schema/*.ts',
    out: './drizzle',
    driver: 'pg',
    dbCredentials: {
        host: process.env.DATABASE_HOST!,
        database: process.env.DATABASE_DATABASE!,
        user: process.env.DATABASE_USER!,
        password: process.env.DATABASE_PASSWORD!,
        port: parseInt(process.env.DATABASE_PORT!),
    },
} satisfies Config;
