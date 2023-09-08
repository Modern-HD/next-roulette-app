'use client';

import styles from '@/components/side-bar/SideBar.module.css';
import { RootState, useAppDispatch } from '@/store/configureStore';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { useSelector } from 'react-redux';
import { modalClose } from '@/store/modalSlice';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Database } from '@/interface/IDatabase';
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { getUser } from '@/util/auth/authUtil';
import IUser from '@/interface/IUser';
import { logoutAction } from '@/util/server-actions/signAction';

export default function SideBar() {
    const { sideBar: sideBarOpen } = useSelector((state: RootState) => state.modal);
    const [user, setUser] = useState<null | Pick<IUser, 'idx' | 'nick_name'>>();
    const supabase = createClientComponentClient<Database>();
    const dispatch = useAppDispatch();

    useEffect(() => {
        getUser(supabase).then(userData => {
            if (!userData) return;
            setUser({ idx: userData.idx, nick_name: userData.nick_name });
        });
    }, [dispatch, sideBarOpen, supabase]);

    return (
        <>
            <aside
                className={styles['side-bar']}
                style={{
                    transform: sideBarOpen ? '' : 'translateX(-100%)',
                    pointerEvents: sideBarOpen ? 'auto' : 'none',
                }}
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
                {!user && (
                    <Link className="text-center border-t-2 py-2 border-gray-300 cursor-pointer block" href={'/join'}>
                        회원 가입
                    </Link>
                )}
                {user && <div className="text-center border-t-2 py-2 border-gray-300 block">{user.nick_name}</div>}
                {user && (
                    <Link className="text-center border-t-2 py-2 border-gray-300 block" href={'/mypage'}>
                        마이페이지
                    </Link>
                )}
                {user && (
                    <form action={logoutAction}>
                        <button className="text-center border-t-2 py-2 border-gray-300 block w-full">로그아웃</button>
                    </form>
                )}
            </aside>
            <div
                className="absolute top-0 left-0 w-full h-full"
                style={{ pointerEvents: sideBarOpen ? 'auto' : 'none', zIndex: 1054 }}
                onClick={() => {
                    dispatch(modalClose('sideBar'));
                }}
            ></div>
        </>
    );
}
