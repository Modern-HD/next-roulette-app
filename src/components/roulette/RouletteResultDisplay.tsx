'use client';

import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store/configureStore';
import styles from './Roulette.module.css';
import { IRouletteState, rouletteHistoryUpdate, rouletteSpinReset } from '@/store/rouletteSlice';
import { useRef } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

export default function RouletteResultDisplay() {
    const roulette = useSelector((state: RootState) => state.roulette);
    const displayRef = useRef<null | HTMLDivElement>(null);
    const supabase = createClientComponentClient();
    const dispatch = useDispatch();
    if (!(roulette.mode !== 'IDLE' && roulette.display && roulette.resultSection !== null)) return <></>;

    const section = (roulette as IRouletteState<'EDIT' | 'PLAY'>).section;
    const result = section[roulette.resultSection];

    const onClose = () => {
        displayRef.current?.classList.remove(styles['result-fade-in']);
        displayRef.current?.classList.add(styles['result-fade-out']);
        if (roulette.mode === 'PLAY') {
            supabase
                .from('play_data')
                .select()
                .eq('roulette_set_idx', (roulette as IRouletteState<'PLAY'>).set.idx)
                .order('idx', { ascending: false })
                .limit(30)
                .then(result => {
                    const { data } = result;
                    dispatch(rouletteHistoryUpdate(data || []));
                });
        }
        setTimeout(() => dispatch(rouletteSpinReset()), 300);
    };

    return (
        <div
            id="roulette-result-modal-root"
            className="fixed top-0 left-0 w-full h-full"
            onClick={(e: React.MouseEvent<HTMLDivElement>) => {
                if (!(e.target instanceof HTMLDivElement)) return;
                if (e.target.id !== 'roulette-result-modal-root') return;
                onClose();
            }}
        >
            <div
                ref={displayRef}
                className={['roulette-result-display', 'result-fade-in'].map(cn => styles[cn]).join(' ')}
            >
                <div className={styles['roulette-result-display-content']}>{result.content}</div>
                <button className="text-2xl" onClick={onClose}>
                    확인
                </button>
            </div>
        </div>
    );
}
