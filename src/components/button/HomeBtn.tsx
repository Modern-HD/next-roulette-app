'use client';

import { faHome } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useRouter } from 'next/navigation';

export default function HomeBtn({ className }: { className?: string }) {
    const router = useRouter();
    return (
        <button
            onClick={() => {
                router.push('/');
            }}
        >
            <FontAwesomeIcon icon={faHome} className={className} />
        </button>
    );
}
