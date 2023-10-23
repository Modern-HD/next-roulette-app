'use client';

import styles from './Roulette.module.css';
import RouletteSection, { RouletteSectionProps } from './RouletteSection';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store/configureStore';
import {
    IRouletteState,
    rouletteDemoPlay,
    roulettePlay,
    roulettePlayPretreatment,
    roulettePlayReset,
    rouletteResultDisplay,
} from '@/store/rouletteSlice';
import { useEffect, useRef } from 'react';
import { fetchConfig, fetchingPlayableRouletteData } from '@/util/fetchUtil';
import { IRoulettePlayRequest, IRoulettePlayResponse } from '@/app/api/roulette/play/route';
import IResponse from '@/interface/IResponse';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Database } from '@/interface/IDatabase';
import { useRouter } from 'next/navigation';

export default function Roulette() {
    const roulette = useSelector((state: RootState) => state.roulette);
    const supabase = createClientComponentClient<Database>();
    const router = useRouter();
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

    const onPlay = async () => {
        if (roulette.section && roulette.section.length < 2) return;
        if (roulette.spinning) return;
        if (roulette.mode === 'EDIT') dispatch(rouletteDemoPlay());
        if (roulette.mode === 'PLAY') {
            dispatch(roulettePlayPretreatment());
            const res = await fetch(
                '/api/roulette/play',
                fetchConfig<IRoulettePlayRequest>('POST', {
                    idx: (roulette as IRouletteState<'PLAY'>).set.idx,
                    rouletteSetUpdated: (roulette as IRouletteState<'PLAY'>).set.updated_at,
                }),
            );
            const body: IResponse<IRoulettePlayResponse | undefined> = await res.json();
            if (body.code !== '00') {
                alert(body.msg);
                if (body.code === '02') {
                    return fetchingPlayableRouletteData((roulette as IRouletteState<'PLAY'>).set.idx, supabase).then(
                        result => {
                            if (!result) return router.replace('/');
                            dispatch(roulettePlayReset(result));
                        },
                    );
                }
                return router.replace('/');
            }
            if (body.code === '00' && body.data) {
                dispatch(roulettePlay(body.data));
            }
        }
    };

    return (
        <div className="relative">
            <div className={styles['roulette-root']} ref={rouletteRef} onClick={onPlay}>
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
