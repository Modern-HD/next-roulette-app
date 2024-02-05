'use client';

import IPlayData from '@/interface/IPlayData';
import IRouletteSection from '@/interface/IRouletteSection';
import IRouletteSet from '@/interface/IRouletteSet';
import { rouletteEditReset, rouletteModifyReset, roulettePlayReset } from '@/store/rouletteSlice';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';

interface Props {
    children?: React.ReactNode;
    rouletteData?: { set: IRouletteSet; section: IRouletteSection[]; playData?: IPlayData[] };
    type: 'CREATE' | 'PLAY' | 'MODIFY';
}

export default function RouletteResetProvider({ children, rouletteData, type }: Props) {
    const dispatch = useDispatch();
    const router = useRouter();

    useEffect(() => {
        if (type === 'CREATE') {
            dispatch(rouletteEditReset());
            return;
        }
        if (!rouletteData) {
            alert('룰렛이 존재하지 않거나 사용할 수 없는 룰렛입니다.');
            return router.replace('/');
        }
        if (type === 'PLAY' && rouletteData.playData) {
            dispatch(
                roulettePlayReset(
                    rouletteData as { set: IRouletteSet; section: IRouletteSection[]; playData: IPlayData[] },
                ),
            );
        }
        if (type === 'MODIFY') dispatch(rouletteModifyReset(rouletteData));
    }, [router, rouletteData, type, dispatch]);

    return children;
}
