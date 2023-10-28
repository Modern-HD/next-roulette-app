import { Database } from '@/interface/IDatabase';
import { SupabaseClient } from '@supabase/supabase-js';
import { getUser } from './auth/authUtil';
import { IRouletteState } from '@/store/rouletteSlice';

export function fetchConfig<T>(method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE', body: T, other?: RequestInit) {
    return {
        method,
        headers: {
            'Content-Type': 'application/json;charset=utf-8',
        },
        body: JSON.stringify(body),
        ...other,
    };
}

export async function fetchModifiableRouletteData(rouletteSetIdx: number, supabase: SupabaseClient<Database>) {
    const [{ data: set }, { data: section }, user] = await Promise.all([
        supabase.from('roulette_set').select().eq('idx', rouletteSetIdx).single(),
        supabase.from('roulette_section').select().eq('roulette_set_idx', rouletteSetIdx).order('location'),
        getUser(supabase),
    ]);
    if (!(set && section && user && set.user_idx === user.idx)) return;
    return { set, section };
}

export async function fetchPlayableRouletteData(rouletteSetIdx: number, supabase: SupabaseClient<Database>) {
    const [{ data: set }, { data: section }, playData] = await Promise.all([
        supabase.from('roulette_set').select().eq('idx', rouletteSetIdx).single(),
        supabase.from('roulette_section').select().eq('roulette_set_idx', rouletteSetIdx).order('location'),
        fetchRoulettePlayHistoryData(rouletteSetIdx, supabase),
    ]);
    if (!(set && section)) return;
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

export async function sendRouletteDataToSave({
    set,
    section,
}: {
    set: Pick<IRouletteState<'EDIT'>['set'], 'idx' | 'title' | 'description' | 'category_idx' | 'public'>;
    section: IRouletteState<'EDIT'>['section'];
}) {
    if (!set.idx) delete set.idx;
    return await fetch(
        `/api/roulette/${set.idx ? 'modify' : 'register'}`,
        fetchConfig(set.idx ? 'PUT' : 'POST', {
            set: set,
            section: section.map(({ weight, content }, location) => ({ weight, content, location })),
        }),
    );
}
