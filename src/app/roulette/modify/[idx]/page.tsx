'use client';

import BackBtn from '@/components/button/BackBtn';
import HomeBtn from '@/components/button/HomeBtn';
import Nav from '@/components/nav/Nav';
import Roulette from '@/components/roulette/Roulette';
import RouletteEditor from '@/components/roulette/RouletteEditor';
import RouletteResultDisplay from '@/components/roulette/RouletteResultDisplay';
import RouletteSaveModal from '@/components/roulette/RouletteSaveModal';
import { Database } from '@/interface/IDatabase';
import { RootState } from '@/store/configureStore';
import { rouletteModifyReset } from '@/store/rouletteSlice';
import { fetchModifiableRouletteData } from '@/util/fetchUtil';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Params } from 'next/dist/shared/lib/router/utils/route-matcher';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

export default function Modify({ params }: { params: Params }) {
    const dispatch = useDispatch();
    const supabase = createClientComponentClient<Database>();
    const roulette = useSelector(({ roulette }: RootState) => roulette);
    const router = useRouter();
    const { idx } = params;

    useEffect(() => {
        fetchModifiableRouletteData(idx, supabase).then(result => {
            if (!result) {
                alert('룰렛이 존재하지 않거나 수정할 수 없는 룰렛입니다.');
                return router.replace('/');
            }
            dispatch(rouletteModifyReset(result));
        });
    }, [dispatch, supabase, idx, router]);

    return (
        <>
            <div className="flex flex-col h-full">
                <Nav
                    leftBtn={<BackBtn />}
                    title={[roulette.set?.title, '룰렛 수정'].join(' ')}
                    rightBtn={<HomeBtn />}
                    className="mb-10 md:mb-0"
                />
                <div className="flex-1 flex flex-col md:flex-row items-center">
                    <div className="w-full md:w-1/2 overflow-hidden">
                        <Roulette />
                    </div>
                    <div className="h-full w-full md:flex-1 flex justify-center items-center">
                        <RouletteEditor />
                    </div>
                </div>
            </div>
            <RouletteResultDisplay />
            <RouletteSaveModal />
        </>
    );
}
