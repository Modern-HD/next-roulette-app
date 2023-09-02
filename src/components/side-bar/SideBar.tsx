'use client';

import styles from '@/components/side-bar/SideBar.module.css';
import { RootState, useAppDispatch } from '@/store/configureStore';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { useSelector } from 'react-redux';
import { modalClose } from '@/store/modalSlice';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Database } from '@/interface/IDatabase';
import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function SideBar() {
    const { sideBar: sideBarOpen } = useSelector((state: RootState) => state.modal);
    const [user, setUser] = useState<null | { idx: number; nickName: string }>();
    const supabase = createClientComponentClient<Database>();
    const dispatch = useAppDispatch();

    useEffect(() => {
        const getData = async () => {
            const { data: sesData } = await supabase.auth.getUser();
            if (!sesData || !sesData.user) return;
            const { data: userData } = await supabase
                .from('user')
                .select('*')
                .eq('uuid', sesData.user?.id);
            if (!userData || !userData[0]) return;
            setUser({ idx: userData[0].idx, nickName: userData[0].nick_name });
        };
        getData();
    }, [sideBarOpen, supabase]);

    return (
        <aside
            className={styles['side-bar']}
            style={{ transform: sideBarOpen ? '' : 'translateX(-100%)', pointerEvents: sideBarOpen ? 'auto' : 'none' }}
        >
            <div className="text-right mb-4 m-2">
                <FontAwesomeIcon
                    icon={faXmark}
                    className={styles['close-icon']}
                    onClick={() => dispatch(modalClose('sideBar'))}
                />
            </div>
            {!user && (
                <Link className="text-center border-t-2 py-2 border-gray-300 cursor-pointer block" href={'/login'}>
                    로그인
                </Link>
            )}
            {user && (
                <Link className="text-center border-t-2 py-2 border-gray-300 block" href={'/mypage'}>
                    마이페이지
                </Link>
            )}
            {user && (
                <Link className="text-center border-t-2 py-2 border-gray-300 block" href={'/auth/logout'}>
                    로그아웃
                </Link>
            )}
        </aside>
    );
}
