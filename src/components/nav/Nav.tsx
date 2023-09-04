'use client';

import { faBars, faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styles from '@/components/nav/Nav.module.css';
import { useAppDispatch } from '@/store/configureStore';
import { modalToggle } from '@/store/modalSlice';

interface Props {
    leftBtn: JSX.Element;
    title: string;
    rightBtn: JSX.Element;
}

export default function Nav() {
    const dispatch = useAppDispatch();
    return (
        <nav className="container-box text-white text-bold text-2xl pt-4">
            <div className="flex justify-between">
                <div onClick={() => dispatch(modalToggle('sideBar'))}>
                    <FontAwesomeIcon icon={faBars} className={styles['nav-icon']} />
                </div>
                <div>룰렛</div>
                <FontAwesomeIcon icon={faMagnifyingGlass} className={styles['nav-icon']} />
            </div>
        </nav>
    );
}
