import BackBtn from '@/components/button/BackBtn';
import HomeBtn from '@/components/button/HomeBtn';
import Nav from '@/components/nav/Nav';
import RouletteResetProvider from '@/components/provider/RouletteResetProvider';
import Roulette from '@/components/roulette/Roulette';
import RouletteHistory from '@/components/roulette/RouletteHistory';
import RouletteResultDisplay from '@/components/roulette/RouletteResultDisplay';
import { Database } from '@/interface/IDatabase';
import { fetchPlayableRouletteData } from '@/util/fetchUtil';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { Metadata } from 'next';
import { Params } from 'next/dist/shared/lib/router/utils/route-matcher';
import { cookies } from 'next/headers';
import { use } from 'react';

export const metadata: Metadata = {
    title: '오늘의 룰렛 - 플레이 ',
};

export default function Play({ params }: { params: Params }) {
    cookies().getAll();
    const supabase = createServerComponentClient<Database>({ cookies });
    const { idx } = params;
    const roulette = use(fetchPlayableRouletteData(parseInt(idx), supabase));

    return (
        <RouletteResetProvider rouletteData={roulette} type={'PLAY'}>
            <div className="flex flex-col h-full">
                <Nav
                    leftBtn={<BackBtn />}
                    title={roulette?.set?.title}
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
        </RouletteResetProvider>
    );
}
