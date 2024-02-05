import BackBtn from '@/components/button/BackBtn';
import HomeBtn from '@/components/button/HomeBtn';
import Nav from '@/components/nav/Nav';
import Roulette from '@/components/roulette/Roulette';
import RouletteEditor from '@/components/roulette/RouletteEditor';
import RouletteResultDisplay from '@/components/roulette/RouletteResultDisplay';
import RouletteSaveModal from '@/components/roulette/RouletteSaveModal';
import { Database } from '@/interface/IDatabase';
import { fetchModifiableRouletteData } from '@/util/fetchUtil';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { Params } from 'next/dist/shared/lib/router/utils/route-matcher';
import { use } from 'react';
import { cookies } from 'next/headers';
import RouletteResetProvider from '@/components/provider/RouletteResetProvider';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: '오늘의 룰렛 - 수정',
};

export default function Modify({ params }: { params: Params }) {
    cookies().getAll();
    const supabase = createServerComponentClient<Database>({ cookies });
    const { idx } = params;
    const roulette = use(fetchModifiableRouletteData(parseInt(idx), supabase));

    return (
        <RouletteResetProvider rouletteData={roulette} type={'MODIFY'}>
            <div className="flex flex-col h-full">
                <Nav
                    leftBtn={<BackBtn />}
                    title={[roulette?.set?.title, '룰렛 수정'].join(' ')}
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
        </RouletteResetProvider>
    );
}
