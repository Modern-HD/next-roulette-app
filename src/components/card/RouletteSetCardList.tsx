'use client';

import { Database } from '@/interface/IDatabase';
import IRouletteSet from '@/interface/IRouletteSet';
import IUser from '@/interface/IUser';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useEffect, useState } from 'react';
import RouletteSetCardItem from './RouletteSetCardItem';
import IRouletteSection from '@/interface/IRouletteSection';

export type RsItem = Pick<IRouletteSet, 'idx' | 'title' | 'description' | 'play_count'> & {
    user: Pick<IUser, 'nick_name'>;
    roulette_section: Pick<IRouletteSection, 'content' | 'weight' | 'location'>[];
};

export default function RouletteSetCardList({ search }: { search?: string }) {
    const supabase = createClientComponentClient<Database>();
    const [rsList, setRsList] = useState<RsItem[] | undefined>(undefined);
    useEffect(() => {
        const getData = async () => {
            const query = `idx, title, description, play_count
            , user ( nick_name )
            , roulette_section (
                content,
                weight,
                location
            )`;
            const { data } = search
                ? await supabase.from('roulette_set').select(query).like('title', `%${search}%`)
                : await supabase.from('roulette_set').select(query);
            data && setRsList(data as RsItem[]);
        };
        getData();
    }, [supabase, search]);
    return (
        <div className="flex w-full flex-wrap overflow-y-scroll justify-around md:justify-between hide-scroll gap-4 md:h-4/6 lg:h-3/4 xl:h-5/6">
            {rsList && rsList.map((el, i) => <RouletteSetCardItem data={el} key={i} />)}
            {rsList && rsList.length === 0 && <div className="text-2xl text-white">검색 결과가 없습니다.</div>}
        </div>
    );
}
