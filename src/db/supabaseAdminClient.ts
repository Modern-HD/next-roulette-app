import { Database } from '@/interface/IDatabase';
import { createClient } from '@supabase/supabase-js';

const supabaseAdminClient = createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
        auth: {
            autoRefreshToken: false,
            persistSession: false,
        },
    },
);

export const supabaseAdminAPI = supabaseAdminClient.auth.admin;
export default supabaseAdminClient;
