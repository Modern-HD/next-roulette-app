'use client';

import BackBtn from '@/components/button/BackBtn';
import HomeBtn from '@/components/button/HomeBtn';
import Nav from '@/components/nav/Nav';
import Roulette from '@/components/roulette/Roulette';
import RouletteHistory from '@/components/roulette/RouletteHistory';
import RouletteResultDisplay from '@/components/roulette/RouletteResultDisplay';
import { Database } from '@/interface/IDatabase';
import { RootState } from '@/store/configureStore';
import { roulettePlayReset } from '@/store/rouletteSlice';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Params } from 'next/dist/shared/lib/router/utils/route-matcher';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

export default function Play({ params }: { params: Params }) {
    const dispatch = useDispatch();
    const supabase = createClientComponentClient<Database>();
    const roulette = useSelector(({ roulette }: RootState) => roulette);
    const { idx } = params;

    useEffect(() => {
        const getData = async () => {
            const { data: set } = await supabase.from('roulette_set').select().eq('idx', idx).single();
            const { data: section } = await supabase
                .from('roulette_section')
                .select()
                .eq('roulette_set_idx', idx)
                .order('location');
            const { data: playData } = await supabase
                .from('play_data')
                .select()
                .eq('roulette_set_idx', idx)
                .order('idx', { ascending: false })
                .limit(30);
            if (!(set && section)) return;
            dispatch(roulettePlayReset({ set, section, playData: playData || [] }));
        };
        getData();
    }, [dispatch, supabase, idx]);

    return (
        <>
            <div className="flex flex-col h-full">
                <Nav
                    leftBtn={<BackBtn />}
                    title={roulette.set?.title}
                    rightBtn={<HomeBtn />}
                    className="mb-10 md:mb-0"
                />
                <div className="flex-1 flex flex-col md:flex-row items-center">
                    <div className="w-full md:w-1/2 overflow-hidden">
                        <Roulette />
                    </div>
                    <div className="h-full w-full md:flex-1 flex justify-center items-center">
                        <RouletteHistory />
                    </div>
                </div>
            </div>
            <RouletteResultDisplay />
        </>
    );
}
