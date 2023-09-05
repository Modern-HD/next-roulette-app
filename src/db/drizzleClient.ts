import postgres from 'postgres';
import { drizzle } from 'drizzle-orm/postgres-js';
import config from '@root/drizzle.config';

const client = postgres(config.dbCredentials);
const drizzleClient = drizzle(client);

export default drizzleClient;
