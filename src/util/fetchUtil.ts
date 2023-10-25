import { Database } from '@/interface/IDatabase';
import { SupabaseClient } from '@supabase/supabase-js';

export function fetchConfig<T>(method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE', body: T) {
    return {
        method,
        headers: {
            'Content-Type': 'application/json;charset=utf-8',
        },
        body: JSON.stringify(body),
    };
}

export async function fetchPlayableRouletteData(rouletteSetIdx: number, supabase: SupabaseClient<Database>) {
    const { data: set } = await supabase.from('roulette_set').select().eq('idx', rouletteSetIdx).single();
    const { data: section } = await supabase
        .from('roulette_section')
        .select()
        .eq('roulette_set_idx', rouletteSetIdx)
        .order('location');
    if (!(set && section)) return;
    const playData = await fetchRoulettePlayHistoryData(rouletteSetIdx, supabase);
    return { set, section, playData };
}

export async function fetchRoulettePlayHistoryData(rouletteSetIdx: number, supabase: SupabaseClient<Database>) {
    const { data: playData } = await supabase
        .from('play_data')
        .select()
        .eq('roulette_set_idx', rouletteSetIdx)
        .order('idx', { ascending: false })
        .limit(30);
    return playData || [];
}
