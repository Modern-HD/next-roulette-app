import { Database } from '@/interface/IDatabase';
import IUser from '@/interface/IUser';
import { SupabaseClient } from '@supabase/supabase-js';

export async function getUser(
    supabase: SupabaseClient<Database>,
): Promise<null | Pick<IUser, 'idx' | 'nick_name' | 'created_at'>> {
    if (!(await supabase.auth.getSession()).data.session) return null;
    const { data: sesData } = await supabase.auth.getUser();
    if (!sesData || !sesData.user) return null;
    const { data: userData } = await supabase
        .from('user')
        .select('idx, nick_name, created_at')
        .eq('uuid', sesData.user?.id);
    if (!userData || !userData[0]) return null;
    return userData[0];
}
