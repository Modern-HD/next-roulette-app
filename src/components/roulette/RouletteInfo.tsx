'use client';

import { RootState } from '@/store/configureStore';
import { IRouletteState } from '@/store/rouletteSlice';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

interface Props {
    isInfo: boolean;
    closeInfo: () => void;
}

export default function RouletteInfo({ isInfo, closeInfo }: Props) {
    const roulette = useSelector((state: RootState) => state.roulette) as IRouletteState<'PLAY'>;
    const supabase = createClientComponentClient();
    const [writer, setWriter] = useState<string>();

    useEffect(() => {
        const getData = async () => {
            const { data } = await supabase.from('user').select('nick_name').eq('idx', roulette.set.user_idx).single();
            data && setWriter(data.nick_name);
        };
        roulette.mode === 'PLAY' && getData();
    }, [supabase, roulette]);

    if (roulette.mode !== 'PLAY') return <></>;
    return (
        <div
            className={`absolute top-0 left-0 w-full h-full bg-black bg-opacity-80 text-white transition-all
            ${isInfo ? 'pointer-events-auto' : 'pointer-events-none'}
            ${isInfo ? 'opacity-100' : 'opacity-0'}`}
        >
            <div className="absolute top-0 end-0 mt-4 mr-5 text-3xl cursor-pointer">
                <FontAwesomeIcon icon={faXmark} onClick={closeInfo} />
            </div>
            <div className="flex flex-col h-full p-5">
                <div className="mb-0">
                    <h5 className="text-xl font-bold mb-1">{roulette.set.title}</h5>
                </div>
                <div className="mb-5 text-lg font-bold">{writer}</div>
                <div className="flex-1 flex mb-3">{roulette.set.description}</div>
                <div>{roulette.set.play_count}회 플레이 됨</div>
            </div>
        </div>
    );
}
