'use client';

import { RootState } from '@/store/configureStore';
import { modalClose } from '@/store/modalSlice';
import { useDispatch, useSelector } from 'react-redux';
import styles from './Roulette.module.css';

export default function RouletteSaveModal() {
    const { modal, roulette } = useSelector((state: RootState) => state);
    const dispatch = useDispatch();
    if (!modal.rouletteSave) return <></>;

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
            <div className={styles['roulette-save-modal'] + ' bg-default'}>
                <div className="text-center text-white">룰렛 저장</div>
                <div className="bg-white flex-1">내용</div>
                <div className="text-center text-white">게시하기</div>
            </div>
        </div>
    );
}
