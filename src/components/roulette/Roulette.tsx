'use client';

import styles from './Roulette.module.css';
import RouletteSection, { RouletteSectionProps } from './RouletteSection';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/configureStore';
import { IRouletteState } from '@/store/rouletteSlice';

export default function Roulette() {
    const roulette = useSelector((state: RootState) => state.roulette);

    const totalWeight =
        roulette.mode !== 'IDLE'
            ? (roulette as IRouletteState<'EDIT'>).section.reduce((acc: number, cur) => acc + cur.weight, 0)
            : 0;

    return (
        <div className={styles['roulette-root']}>
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
        </div>
    );
}
