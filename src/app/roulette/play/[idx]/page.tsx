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
import { fetchPlayableRouletteData } from '@/util/fetchUtil';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Params } from 'next/dist/shared/lib/router/utils/route-matcher';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

export default function Play({ params }: { params: Params }) {
    const dispatch = useDispatch();
    const supabase = createClientComponentClient<Database>();
    const roulette = useSelector(({ roulette }: RootState) => roulette);
    const router = useRouter();
    const { idx } = params;

    useEffect(() => {
        fetchPlayableRouletteData(idx, supabase).then(result => {
            if (!result) {
                alert('룰렛이 존재하지 않습니다.');
                return router.replace('/');
            }
            dispatch(roulettePlayReset(result));
        });
    }, [dispatch, supabase, idx, router]);

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
