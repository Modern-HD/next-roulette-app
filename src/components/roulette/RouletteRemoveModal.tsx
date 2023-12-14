'use client';

import IResponse from '@/interface/IResponse';
import { RootState } from '@/store/configureStore';
import { IRouletteState } from '@/store/rouletteSlice';
import { faCircleNotch } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useSelector } from 'react-redux';

interface Props {
    onClose: () => void;
}

export default function RouletteRemoveModal({ onClose }: Props) {
    const router = useRouter();
    const roulette = useSelector((state: RootState) => state.roulette) as IRouletteState<'EDIT'>;
    const [titleInput, setTitleInput] = useState<string>('');
    const [isBlock, setBlock] = useState<boolean>(false);
    const onTitleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTitleInput(e.target.value);
    };

    const removeDataToServer = async () => {
        if (titleInput !== `${roulette.set.title} 삭제` || !roulette.set.idx) return;
        setBlock(true);
        const res = await fetch(`/api/roulette/delete/${roulette.set.idx}`, { method: 'DELETE' });
        if (res.status !== 200) return alert('오류가 발생하였습니다.');
        const data = (await res.json().catch(() => alert('오류가 발생하였습니다.'))) as IResponse | undefined;
        if (!data) return;
        if (data.result === 'success' && data.code === '00') {
            alert(data.msg);
            router.replace(`/`);
            return true;
        }
        return alert(data.msg);
    };

    const onSubmitBtnClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        if (!(e.target instanceof HTMLButtonElement)) return;
        e.target.disabled === true;
        removeDataToServer().then(result => {
            if (result) return;
            if (!(e.target instanceof HTMLButtonElement)) return;
            e.target.disabled === false;
            setBlock(false);
        });
    };

    return (
        <div className="absolute-center bg-white rounded-lg overflow-hidden shadow">
            <div className="bg-red-400 text-white font-bold text-2xl text-center py-3">삭제하기</div>
            <div className="p-3 md:p-10 text-center">
                <p className="text-gray-600">정말로 룰렛을 삭제하시겠습니까?</p>
                <p className="text-gray-600 mb-4">룰렛을 삭제하려면 아래와 같이 입력해주세요.</p>
                <p className="w-full p-2 mb-4 rounded-xl text-red-600 text-xl font-bold">{roulette.set.title} 삭제</p>
                <input
                    className="w-full p-1 mb-5 border-zinc-400 border rounded-lg text-center"
                    onChange={onTitleInputChange}
                    placeholder={`${roulette.set.title} 삭제`}
                />
                <div className="flex justify-center gap-3">
                    {titleInput === `${roulette.set.title} 삭제` && (
                        <button
                            className="text-center px-4 py-1 rounded-lg shadow text-xl cursor-pointer bg-red-400 text-white"
                            onClick={onSubmitBtnClick}
                        >
                            삭제
                        </button>
                    )}
                    {titleInput !== `${roulette.set.title} 삭제` && (
                        <button className="text-center px-4 py-1 rounded-lg shadow text-xl cursor-default bg-zinc-400 text-white">
                            삭제
                        </button>
                    )}
                    <button
                        className="text-center px-4 py-1 rounded-lg shadow text-xl cursor-pointer text-orange-500 border-orange-400 border-2"
                        onClick={onClose}
                    >
                        취소
                    </button>
                </div>
            </div>
            {isBlock && (
                <div className="absolute top-0 left-0 w-full h-full bg-white bg-opacity-50">
                    <div className="absolute-center text-center text-gray-500">
                        <FontAwesomeIcon
                            icon={faCircleNotch}
                            className="animate-spin"
                            style={{ width: 50, height: 50 }}
                        />
                        <h2 className="text-2xl font-bold">삭제 중</h2>
                    </div>
                </div>
            )}
        </div>
    );
}
