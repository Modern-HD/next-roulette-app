'use client';

import IUser from '@/interface/IUser';
import { RootState } from '@/store/configureStore';
import { IRouletteState, rouletteAddSection, rouletteEditReset, rouletteRemoveSection } from '@/store/rouletteSlice';
import { getUser } from '@/util/auth/authUtil';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

export default function RouletteEditor() {
    const roulette = useSelector((state: RootState) => state.roulette) as IRouletteState<'IDLE' | 'EDIT'>;
    const [user, setUser] = useState<null | Pick<IUser, 'idx' | 'nick_name'>>();
    const dispatch = useDispatch();
    const supabase = createClientComponentClient();

    useEffect(() => {
        dispatch(rouletteEditReset());
        getUser(supabase).then(result => {
            result && setUser(result);
        });
    }, [dispatch, supabase]);

    if (roulette.mode === 'IDLE') return <></>;

    return (
        <div className="bg-default w-10/12 lg:w-8/12 rounded-lg overflow-hidden flex-col shadow-lg">
            <div className=" text-white text-center text-2xl font-bold py-2">룰렛 항목</div>
            <div className="bg-white p-0">
                {(roulette as IRouletteState<'EDIT'>).section.length < 1 && (
                    <div className="text-center py-2">항목이 없습니다.</div>
                )}
                {(roulette as IRouletteState<'EDIT'>).section.length > 0 &&
                    roulette.section?.map((el, i) => (
                        <div key={i} className="text-center py-2">
                            {el.content} |{' '}
                            <button
                                onClick={() => {
                                    dispatch(rouletteRemoveSection(i));
                                }}
                            >
                                삭제
                            </button>
                        </div>
                    ))}
            </div>
            <div className="text-white text-xl font-bold flex justify-around py-2">
                <button
                    onClick={() => {
                        dispatch(rouletteAddSection());
                    }}
                >
                    항목 추가
                </button>
                <button
                    onClick={() => {
                        dispatch(rouletteEditReset());
                    }}
                >
                    초기화
                </button>
                <button className={`${user ? '' : 'text-gray-400'}`}>저장 하기</button>
            </div>
        </div>
    );
}
