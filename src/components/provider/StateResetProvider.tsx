'use client';

import { modalClose } from '@/store/modalSlice';
import { rouletteReset } from '@/store/rouletteSlice';
import { usePathname } from 'next/navigation';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';

export default function StateResetProvider({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(modalClose('sideBar'));
        dispatch(rouletteReset());
    }, [pathname, dispatch]);
    return <>{children}</>;
}
