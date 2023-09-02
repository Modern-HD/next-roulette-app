import RouletteCard from '@/components/card/RouletteSetCard';
import Nav from '@/components/nav/Nav';
import SideBar from '@/components/side-bar/SideBar';
import { Database } from '@/interface/IDatabase';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { use } from 'react';

export default function Home() {
    const supabase = createServerComponentClient<Database>({ cookies });
    const { data: rouletteList } = use(
        supabase.from('roulette_set').select('idx, title, description, play_count, user ( nick_name )'),
    );
    return (
        <main className="h-full bg-default">
            <div className="container-box h-full">
                <SideBar />
                <div className="h-full flex flex-col pb-5">
                    <Nav />
                    <div className="flex-1 flex justify-start items-center">ㅇㅇ</div>
                    <div>
                        {
                            // @ts-expect-error
                            rouletteList && rouletteList.map((el, i) => el.user && <RouletteCard data={el} key={i} />)
                        }
                    </div>
                </div>
            </div>
        </main>
    );
}
