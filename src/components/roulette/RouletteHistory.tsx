'use client';

import { useEffect, useState } from 'react';
import styles from './Roulette.module.css';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/configureStore';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { getUser } from '@/util/auth/authUtil';
import { IRouletteState } from '@/store/rouletteSlice';
import Link from 'next/link';

export default function RouletteHistory() {
    const roulette = useSelector((state: RootState) => state.roulette) as IRouletteState<'PLAY'>;
    const [user, setUser] = useState<null | { idx: number; nick_name: string }>();
    const supabase = createClientComponentClient();

    useEffect(() => {
        getUser(supabase).then(result => setUser(result));
    }, [supabase]);

    if (roulette.mode !== 'PLAY') return <></>;

    return (
        <div className="bg-default w-10/12 lg:w-8/12 rounded-lg overflow-hidden flex-col shadow-lg my-5">
            <div className=" text-white text-center text-2xl font-bold py-2">플레이 기록</div>
            <div className={`hide-scroll ${styles['roulette-section-list']}`}>
                {user === null && (
                    <div className="h-full w-full relative">
                        <div className="absolute-center w-full text-center">
                            <p className="mb-3">로그인 하면 플레이 기록이 저장됩니다.</p>
                            <Link className="bg-orange-400 px-3 py-2 font-bold text-white rounded-lg" href={'/login'}>
                                로그인 하기
                            </Link>
                        </div>
                    </div>
                )}
                {user && roulette.playData.length === 0 && (
                    <div className="h-full w-full relative">
                        <div className="absolute-center w-full text-center">플레이 기록이 존재하지 않습니다.</div>
                    </div>
                )}
                {user &&
                    roulette.playData.length > 0 &&
                    roulette.playData.map((el, i) => <div key={i}>{el.content}</div>)}
            </div>
            <div className="text-white text-xl font-bold flex justify-around py-2">
                <button>룰렛 정보</button>
                <button className={`${user && user.idx === roulette.set.user_idx ? '' : 'text-gray-400'}`}>
                    수정하기
                </button>
            </div>
        </div>
    );
}
