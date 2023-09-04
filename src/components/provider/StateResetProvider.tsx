'use client';

import { modalClose } from '@/store/modalSlice';
import { usePathname } from 'next/navigation';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';

export default function StateResetProvider({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(modalClose('sideBar'));
    }, [pathname, dispatch]);
    return <>{children}</>;
}
