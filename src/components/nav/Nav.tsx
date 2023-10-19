'use client';

import styles from '@/components/nav/Nav.module.css';

interface Props {
    leftBtn?: JSX.Element;
    title?: string;
    rightBtn?: JSX.Element;
    className?: string;
}

export default function Nav({ leftBtn, title, rightBtn, className }: Props) {
    return (
        <nav className={'text-white text-bold text-2xl pt-4 px-0 ' + (className ? className : '')}>
            <div className="flex justify-between">
                <div className={styles['nav-icon']}>{leftBtn}</div>
                <div>{title}</div>
                <div className={styles['nav-icon']}>{rightBtn}</div>
            </div>
        </nav>
    );
}
