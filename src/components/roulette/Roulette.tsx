'use client';

import styles from './Roulette.module.css';
import RouletteSection, { RouletteSectionProps } from './RouletteSection';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store/configureStore';
import { IRouletteState, rouletteDemoPlay, rouletteResultDisplay, rouletteSpinReset } from '@/store/rouletteSlice';
import { useEffect, useRef } from 'react';

export default function Roulette() {
    const roulette = useSelector((state: RootState) => state.roulette);
    const dispatch = useDispatch();
    const rouletteRef = useRef<null | HTMLDivElement>(null);

    const totalWeight =
        roulette.mode !== 'IDLE'
            ? (roulette as IRouletteState<'EDIT'>).section.reduce((acc: number, cur) => acc + cur.weight, 0)
            : 0;

    useEffect(() => {
        if (!rouletteRef.current) return;
        if (!roulette.spinning) {
            rouletteRef.current.style.transition = 'none';
            rouletteRef.current.style.transform = `rotate(${roulette.deg}deg)`;
            return;
        }
        rouletteRef.current.style.transition = `${roulette.speed}s`;
        rouletteRef.current.style.transform = `rotate(${roulette.deg}deg)`;
        !roulette.display &&
            setTimeout(
                () => {
                    if (roulette.mode === 'IDLE') return;
                    if (!roulette.spinning) return;
                    const { resultSection } = roulette as IRouletteState<'EDIT' | 'PLAY'>;
                    if (resultSection === null) return;
                    dispatch(rouletteResultDisplay());
                },
                roulette.speed * 1000 + 1000,
            );
    }, [roulette, dispatch]);

    return (
        <div className="relative">
            <div
                className={styles['roulette-root']}
                ref={rouletteRef}
                onClick={() => {
                    if (roulette.section && roulette.section.length < 2) return;
                    if (roulette.spinning) return;
                    roulette.mode === 'EDIT' && dispatch(rouletteDemoPlay());
                }}
            >
                <div className={styles['roulette-pad']}></div>
                {roulette.mode !== 'IDLE' &&
                    (roulette as IRouletteState<'EDIT'>).section
                        .reduce<Omit<RouletteSectionProps, 'totalWeight'>[]>((acc, cur, i) => {
                            acc.push({
                                accWeight: cur.weight + (i === 0 ? 0 : acc[i - 1].accWeight),
                                data: { location: i, ...cur },
                            });
                            return acc;
                        }, [])
                        .map((el, i) => (
                            <RouletteSection
                                totalWeight={totalWeight}
                                data={el.data}
                                accWeight={el.accWeight - el.data.weight}
                                key={i}
                            />
                        ))}
                <div className={styles['roulette-center']}></div>
                {!roulette.spinning && roulette.resultSection === null && (
                    <div className={styles['roulette-tooltip']}>룰렛을 클릭하여 돌리기</div>
                )}
            </div>
            <div className={styles['roulette-arrow']}></div>
        </div>
    );
}
