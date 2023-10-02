'use client';

import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store/configureStore';
import styles from './Roulette.module.css';
import { IRouletteState, rouletteSpinReset } from '@/store/rouletteSlice';

export default function RouletteResultDisplay() {
    const roulette = useSelector((state: RootState) => state.roulette);
    const dispatch = useDispatch();

    if (!(roulette.mode !== 'IDLE' && roulette.display && roulette.resultSection !== null)) return <></>;

    const section = (roulette as IRouletteState<'EDIT' | 'PLAY'>).section;
    const result = section[roulette.resultSection];

    return (
        <div className={styles['roulette-result-display']}>
            <div className={styles['roulette-result-display-content']}>{result.content}</div>
            <button
                className="text-2xl"
                onClick={() => {
                    dispatch(rouletteSpinReset());
                }}
            >
                확인
            </button>
        </div>
    );
}
