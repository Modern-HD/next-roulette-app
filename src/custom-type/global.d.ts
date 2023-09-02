import { SupabaseClient } from '@supabase/supabase-js';

declare global {
    var _supa: SupabaseClient;
}

export {};
