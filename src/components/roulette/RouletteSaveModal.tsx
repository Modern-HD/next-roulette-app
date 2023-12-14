'use client';

import { RootState } from '@/store/configureStore';
import { modalClose } from '@/store/modalSlice';
import { useDispatch, useSelector } from 'react-redux';
import styles from './Roulette.module.css';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useEffect, useRef, useState } from 'react';
import { Database } from '@/interface/IDatabase';
import ICategory from '@/interface/ICategory';
import { IRouletteState, rouletteEditSet } from '@/store/rouletteSlice';
import IResponse from '@/interface/IResponse';
import { sendRouletteDataToSave } from '@/util/fetchUtil';
import { useRouter } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleNotch } from '@fortawesome/free-solid-svg-icons';
import RouletteRemoveModal from './RouletteRemoveModal';

export default function RouletteSaveModal() {
    const modal = useSelector((state: RootState) => state.modal);
    const roulette = useSelector((state: RootState) => state.roulette) as IRouletteState<'EDIT'>;
    const supabase = createClientComponentClient<Database>();
    const dispatch = useDispatch();
    const router = useRouter();

    const [categoryList, setCategoryList] = useState<Pick<ICategory, 'idx' | 'ko' | 'en'>[]>([]);
    const [isBlock, setBlock] = useState<boolean>(false);
    const [removeModalOpen, setRemoveModalOpen] = useState<boolean>(false);
    const formRef = useRef<null | HTMLFormElement>(null);

    useEffect(() => {
        const getData = async () => {
            const { data } = await supabase.from('category').select('idx, ko, en');
            data && setCategoryList(data);
        };
        getData();
    }, [supabase]);

    if (!(modal.rouletteSave && roulette.mode === 'EDIT')) return <></>;

    const submit = async () => {
        if (formRef.current === null) return;
        const inputs = formRef.current.elements;
        const { idx, title, description, category_idx, public: isPublic } = roulette.set;
        if (!(title && title.length > 0 && title.length <= 20)) {
            alert('룰렛 이름은 1자 이상, 20자 이하 여야 합니다.');
            const titleInput = inputs.namedItem('title');
            titleInput instanceof HTMLInputElement && titleInput.focus();
            return;
        }
        if (!(typeof description === 'string' || description <= 500)) {
            alert('룰렛 설명은 500자 이하여야 합니다.');
            const descriptionInput = inputs.namedItem('description');
            descriptionInput instanceof HTMLTextAreaElement && descriptionInput.focus();
            return;
        }
        if (!(category_idx > 0 && categoryList.map(({ idx }) => idx).includes(category_idx))) {
            alert('카테고리를 선택해주세요.');
            const categoryInput = inputs.namedItem('category');
            categoryInput instanceof HTMLSelectElement && categoryInput.focus();
            return;
        }
        setBlock(true);
        const res = await sendRouletteDataToSave({
            set: { idx, title, description, category_idx, public: isPublic },
            section: roulette.section,
        });
        if (res.status !== 200) return alert('오류가 발생하였습니다.');
        const data = (await res.json().catch(() => alert('오류가 발생하였습니다.'))) as
            | IResponse<undefined | { setIdx: number }>
            | undefined;
        if (!data) return;
        if (data.result === 'success' && data.code === '00' && data.data?.setIdx) {
            alert(data.msg);
            router.replace(`/roulette/play/${data.data.setIdx}`);
            return true;
        }
        return alert(data.msg);
    };

    const onSubmitBtnClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        if (!(e.target instanceof HTMLButtonElement)) return;
        e.target.disabled === true;
        submit().then(result => {
            if (result) return;
            if (!(e.target instanceof HTMLButtonElement)) return;
            e.target.disabled === false;
            setBlock(false);
        });
    };

    return (
        <div
            id="roulette-save-modal"
            className="fixed top-0 left-0 w-full h-full bg-white bg-opacity-50"
            onClick={(e: React.MouseEvent<HTMLDivElement>) => {
                if (!(e.target instanceof HTMLDivElement)) return;
                if (e.target.id !== 'roulette-save-modal') return;
                if (isBlock) return;
                dispatch(modalClose('rouletteSave'));
            }}
        >
            <div className={styles['roulette-save-modal']}>
                <div className="text-center py-3 text-2xl font-bold text-white bg-orange-400">
                    {roulette.set.idx ? '수정' : '게시'}하기
                </div>
                <form
                    ref={formRef}
                    className="bg-white flex flex-col overflow-y-scroll hide-scroll p-3 md:p-10"
                    style={{ maxHeight: (innerHeight * 2) / 3 }}
                >
                    <div className="mb-2">
                        <p className="text-gray-600">룰렛 이름</p>
                        <input
                            className="border border-orange-400 p-1 rounded-lg w-full"
                            maxLength={20}
                            defaultValue={roulette.set.title}
                            name="title"
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
                            name="description"
                            defaultValue={roulette.set.description}
                            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
                                dispatch(rouletteEditSet({ description: e.target.value }));
                            }}
                        ></textarea>
                    </div>

                    <div className="mb-2">
                        <p className="text-gray-600">카테고리</p>
                        <select
                            className="border border-orange-400 py-1 rounded-lg pe-5"
                            name="category"
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
                <div className="flex flex-row gap-2 justify-center pb-5">
                    <button
                        className="text-center px-4 py-1 rounded-lg shadow text-xl cursor-pointer text-white bg-orange-400"
                        type="button"
                        onClick={onSubmitBtnClick}
                    >
                        {roulette.set.idx ? '수정' : '게시'}
                    </button>
                    {roulette.set.idx && (
                        <button
                            className="text-center px-4 py-1 rounded-lg shadow text-xl cursor-pointer text-white bg-red-400"
                            onClick={() => {
                                setRemoveModalOpen(true);
                            }}
                        >
                            삭제
                        </button>
                    )}
                    <button
                        className="text-center px-4 py-1 rounded-lg shadow text-xl cursor-pointer text-orange-500 border-orange-400 border-2"
                        type="button"
                        onClick={() => {
                            if (isBlock) return;
                            dispatch(modalClose('rouletteSave'));
                        }}
                    >
                        취소
                    </button>
                </div>
                {isBlock && (
                    <div className="absolute top-0 left-0 w-full h-full bg-white bg-opacity-50">
                        <div className="absolute-center text-center text-gray-500">
                            <FontAwesomeIcon
                                icon={faCircleNotch}
                                className="animate-spin"
                                style={{ width: 50, height: 50 }}
                            />
                            <h2 className="text-2xl font-bold">{roulette.set.idx ? '수정 중' : '게시 중'}</h2>
                        </div>
                    </div>
                )}
                {removeModalOpen && <div className="absolute w-full h-full top-0 left-0 bg-white bg-opacity-50"></div>}
                {removeModalOpen && (
                    <RouletteRemoveModal
                        onClose={() => {
                            setRemoveModalOpen(false);
                        }}
                    />
                )}
            </div>
        </div>
    );
}
