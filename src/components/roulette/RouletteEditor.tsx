'use client';

import IUser from '@/interface/IUser';
import { RootState } from '@/store/configureStore';
import { IRouletteState, rouletteAddSection, rouletteEditReset, rouletteModifyReset } from '@/store/rouletteSlice';
import { getUser } from '@/util/auth/authUtil';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styles from './Roulette.module.css';
import RouletteItem from './RouletteItem';
import { modalOpen } from '@/store/modalSlice';
import { useRouter } from 'next/navigation';
import { fetchModifiableRouletteData } from '@/util/fetchUtil';

export default function RouletteEditor() {
    const roulette = useSelector((state: RootState) => state.roulette) as IRouletteState<'IDLE' | 'EDIT'>;
    const [user, setUser] = useState<null | Pick<IUser, 'idx' | 'nick_name'>>();
    const dispatch = useDispatch();
    const supabase = createClientComponentClient();
    const router = useRouter();

    useEffect(() => {
        getUser(supabase).then(result => {
            setUser(result);
        });
    }, [supabase]);

    if (roulette.mode === 'IDLE') return <></>;

    return (
        <div className="bg-default w-10/12 lg:w-8/12 rounded-lg overflow-hidden flex-col shadow-lg my-5">
            <div className=" text-white text-center text-2xl font-bold py-2">룰렛 항목</div>
            <div className={`hide-scroll ${styles['roulette-section-list']}`}>
                {(roulette as IRouletteState<'EDIT'>).section.length < 1 && (
                    <div className="text-center py-2">항목이 없습니다.</div>
                )}
                {(roulette as IRouletteState<'EDIT'>).section.length > 0 &&
                    roulette.section?.map((el, i) => <RouletteItem data={el} idx={i} key={i} />)}
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
                        if (roulette.spinning) return;
                        if (!confirm('초기화 진행 시 현재 작업물을 잃게됩니다.\n정말로 초기화 하겠습니까?')) return;
                        if (roulette.set?.idx) {
                            fetchModifiableRouletteData(roulette.set.idx, supabase).then(result => {
                                if (!result) {
                                    return alert('통신 중 오류가 발생하였습니다.');
                                }
                                dispatch(rouletteModifyReset(result));
                            });
                        } else {
                            dispatch(rouletteEditReset());
                        }
                    }}
                >
                    초기화
                </button>
                <button
                    onClick={() => {
                        if (user) return dispatch(modalOpen('rouletteSave'));
                        if (user === undefined) return;
                        if (!confirm('로그인 이후 사용할 수 있는 기능입니다.\n로그인 하시겠습니까?')) return;
                        if (!confirm('페이지 이동 시 현재 작업물을 잃게됩니다.\n정말로 이동 하겠습니까?')) return;
                        router.push('/login');
                    }}
                    className={`${user ? '' : 'text-gray-400'}`}
                >
                    {roulette.set?.idx ? '수정하기' : '게시하기'}
                </button>
            </div>
        </div>
    );
}
