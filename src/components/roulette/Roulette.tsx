'use client';

import { useEffect, useState } from 'react';
import styles from './Roulette.module.css';
import IRouletteSection from '@/interface/IRouletteSection';
import RouletteSection, { RouletteSectionProps } from './RouletteSection';

export default function Roulette() {
    const [rscList, setRscList] = useState<Pick<IRouletteSection, 'weight' | 'content'>[]>([]);

    useEffect(() => {
        const a: Pick<IRouletteSection, 'weight' | 'content'> = {
            weight: 10000,
            content: '1번이요',
        };
        const b: Pick<IRouletteSection, 'weight' | 'content'> = {
            weight: 5000,
            content: '2번이요',
        };
        const c: Pick<IRouletteSection, 'weight' | 'content'> = {
            weight: 3333,
            content: '2번이요',
        };
        setRscList([{ ...a }, { ...b }, { ...a }, { ...b }, { ...b }, { ...c }]);
    }, []);

    if (rscList.length < 1) return <></>;

    const totalWeight = rscList.reduce((acc, cur) => acc + cur.weight, 0);
    return (
        <div className={styles['roulette-root']}>
            <div className={styles['roulette-pad']}></div>
            {rscList
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
