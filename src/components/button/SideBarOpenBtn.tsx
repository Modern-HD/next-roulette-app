'use client';

import { useAppDispatch } from '@/store/configureStore';
import { modalToggle } from '@/store/modalSlice';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default function SideBarOpenBtn({ className }: { className?: string }) {
    const dispatch = useAppDispatch();
    return (
        <button onClick={() => dispatch(modalToggle('sideBar'))}>
            <FontAwesomeIcon icon={faBars} className={className} />
        </button>
    );
}
