'use client';

import { Database } from '@/interface/IDatabase';
import IRouletteSet from '@/interface/IRouletteSet';
import IUser from '@/interface/IUser';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useEffect, useState } from 'react';
import RouletteSetCardItem from './RouletteSetCardItem';

export type RsItem = Pick<IRouletteSet, 'idx' | 'title' | 'description' | 'play_count'> & {
    user: Pick<IUser, 'nick_name'>;
};

export default function RouletteSetCardList() {
    const supabase = createClientComponentClient<Database>();
    const [rsList, setRsList] = useState<RsItem[]>([]);
    useEffect(() => {
        const getData = async () => {
            const { data } = await supabase
                .from('roulette_set')
                .select('idx, title, description, play_count, user ( nick_name )');
            data && setRsList(data as RsItem[]);
        };
        getData();
    }, [supabase]);
    return <div>{rsList && rsList.map((el, i) => <RouletteSetCardItem data={el} key={i} />)}</div>;
}
