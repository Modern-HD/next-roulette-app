'use client';

import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { usePathname, useRouter } from 'next/navigation';

export default function BackBtn({ className }: { className?: string }) {
    const router = useRouter();
    const pathname = usePathname();
    return (
        <button
            onClick={() => {
                if (
                    !pathname.startsWith('/roulette/create') ||
                    confirm('현재 페이지를 벗어나면 현재 작업물을 잃을 수 있습니다.\n정말로 이동하시겠습니까?')
                )
                    return router.back();
            }}
        >
            <FontAwesomeIcon icon={faArrowLeft} className={className} />
        </button>
    );
}
