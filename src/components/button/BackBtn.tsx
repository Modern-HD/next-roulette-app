'use client';

import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useRouter } from 'next/navigation';

export default function BackBtn({ className }: { className?: string }) {
    const router = useRouter();
    return (
        <button onClick={router.back}>
            <FontAwesomeIcon icon={faArrowLeft} className={className} />
        </button>
    );
}
