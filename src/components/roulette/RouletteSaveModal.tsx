'use client';

import { RootState } from '@/store/configureStore';
import { modalClose } from '@/store/modalSlice';
import { useDispatch, useSelector } from 'react-redux';
import styles from './Roulette.module.css';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useEffect, useState } from 'react';
import { Database } from '@/interface/IDatabase';
import ICategory from '@/interface/ICategory';
import { IRouletteState, rouletteEditSet } from '@/store/rouletteSlice';
import IResponse from '@/interface/IResponse';

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

    const onSubmit = async () => {
        const { title, description, category_idx, public: isPublic } = roulette.set;
        const res = (await fetch('/api/roulette/register', {
            method: 'post',
            headers: {
                'Content-Type': 'application/json;charset=utf-8',
            },
            body: JSON.stringify({
                set: { title, description, category_idx, public: isPublic },
                section: roulette.section.map(({ weight, content }, location) => ({ weight, content, location })),
            }),
        }).then(result => result.json())) as IResponse;
    };

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
                <form
                    className="bg-white flex flex-col overflow-y-scroll hide-scroll p-3 md:p-10"
                    style={{ maxHeight: (innerHeight * 2) / 3 }}
                >
                    <div className="mb-2">
                        <p className="text-gray-600">룰렛 이름</p>
                        <input
                            className="border border-orange-400 p-1 rounded-lg w-full"
                            maxLength={20}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                dispatch(rouletteEditSet({ title: e.target.value }));
                            }}
                        />
                    </div>

                    <div className="mb-2">
                        <p className="text-gray-600">룰렛 설명</p>
                        <textarea
                            className="border border-orange-400 p-1 rounded-lg w-full"
                            style={{ minHeight: 58 }}
                            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
                                dispatch(rouletteEditSet({ description: e.target.value }));
                            }}
                        ></textarea>
                    </div>

                    <div className="mb-2">
                        <p className="text-gray-600">카테고리</p>
                        <select
                            className="border border-orange-400 py-1 rounded-lg pe-5"
                            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                                dispatch(rouletteEditSet({ category_idx: parseInt(e.target.value) }));
                            }}
                        >
                            <option value={0} disabled={roulette.set.category_idx !== 0}>
                                선택해주세요.
                            </option>
                            {categoryList.map(el => (
                                <option key={el.idx} value={el.idx}>
                                    {el.ko}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="mb-2">
                        <p className="text-gray-600">공개 여부</p>
                        <div className="flex flex-row">
                            <div className="border border-orange-400 flex flex-row rounded-lg overflow-hidden">
                                <button
                                    type="button"
                                    className={[
                                        styles['roulette-public-btn'],
                                        roulette.set.public ? 'bg-orange-400 text-white font-bold' : 'text-orange-400',
                                    ].join(' ')}
                                    onClick={() => {
                                        dispatch(rouletteEditSet({ public: true }));
                                    }}
                                >
                                    공개
                                </button>
                                <button
                                    type="button"
                                    className={[
                                        styles['roulette-public-btn'],
                                        !roulette.set.public ? 'bg-orange-400 text-white font-bold' : 'text-orange-400',
                                    ].join(' ')}
                                    onClick={() => {
                                        dispatch(rouletteEditSet({ public: false }));
                                    }}
                                >
                                    비공개
                                </button>
                            </div>
                        </div>
                    </div>
                </form>
                <div className="flex flex-row gap-2 justify-center py-3">
                    <button
                        className="text-center px-4 py-1 rounded-lg shadow text-xl cursor-pointer text-white bg-orange-400"
                        onClick={onSubmit}
                    >
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
