'use client';

import { RootState } from '@/store/configureStore';
import { modalClose } from '@/store/modalSlice';
import { useDispatch, useSelector } from 'react-redux';
import styles from './Roulette.module.css';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useEffect, useState } from 'react';
import { Database } from '@/interface/IDatabase';
import ICategory from '@/interface/ICategory';
import { IRouletteState } from '@/store/rouletteSlice';

export default function RouletteSaveModal() {
    const modal = useSelector((state: RootState) => state.modal);
    const roulette = useSelector((state: RootState) => state.roulette) as IRouletteState<'EDIT'>;
    const supabase = createClientComponentClient<Database>();
    const dispatch = useDispatch();

    const [categoryList, setCategoryList] = useState<Pick<ICategory, 'idx' | 'ko' | 'en'>[]>([]);

    useEffect(() => {
        const getData = async () => {
            const { data } = await supabase.from('category').select('idx, ko, en');
            data && setCategoryList(data);
        };
        getData();
    }, [supabase]);

    if (!(modal.rouletteSave && roulette.mode === 'EDIT')) return <></>;
    return (
        <div
            id="roulette-save-modal"
            className="fixed top-0 left-0 w-full h-full bg-white bg-opacity-50"
            onClick={(e: React.MouseEvent<HTMLDivElement>) => {
                if (!(e.target instanceof HTMLDivElement)) return;
                if (e.target.id !== 'roulette-save-modal') return;
                dispatch(modalClose('rouletteSave'));
            }}
        >
            <div className={styles['roulette-save-modal']}>
                <div className="text-center py-3 text-2xl font-bold text-white bg-orange-400">게시하기</div>
                <form className="bg-white flex-1 flex flex-col p-3 md:p-10">
                    <div className=" text-gray-600">룰렛 이름</div>
                    <input className="border border-orange-400 p-1 rounded-lg mb-2" />
                    <div>
                        <p className=" text-gray-600">카테고리</p>
                        <select defaultValue={0} className="border border-orange-400 p-1 rounded-lg mb-2">
                            <option defaultValue={0} disabled={roulette.set.category_idx !== 0}>
                                선택해주세요.
                            </option>
                            {categoryList.map(el => (
                                <option key={el.idx} defaultValue={el.idx}>
                                    {el.ko}
                                </option>
                            ))}
                        </select>
                    </div>
                </form>
                <div className="flex flex-row gap-2 justify-center py-3">
                    <button className="text-center px-4 py-1 rounded-lg shadow text-xl cursor-pointer text-white bg-orange-400">
                        게시
                    </button>
                    <button
                        className="text-center px-4 py-1 rounded-lg shadow text-xl cursor-pointer text-orange-500 border-orange-400 border-2"
                        onClick={() => {
                            dispatch(modalClose('rouletteSave'));
                        }}
                    >
                        취소
                    </button>
                </div>
            </div>
        </div>
    );
}
