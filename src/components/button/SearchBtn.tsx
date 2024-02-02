'use client';

import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function SearchBtn({ className }: { className?: string }) {
    const [isModalOpen, setModalOpen] = useState<boolean>(false);
    const [title, setTitle] = useState<string>('');
    const router = useRouter();
    return (
        <div className="relative">
            <FontAwesomeIcon
                icon={faMagnifyingGlass}
                className={className}
                onClick={() => {
                    setModalOpen(!isModalOpen);
                }}
            />
            {isModalOpen && (
                <form
                    className="absolute top-full right-0 bg-orange-300 p-3 rounded-xl flex gap-3 mt-1 text-lg shadow"
                    onSubmit={(e: React.FormEvent) => {
                        e.preventDefault();
                        if (!title) return alert('검색어를 입력해주세요.');
                        router.push(`/search/${title}`);
                    }}
                >
                    <input
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                            setTitle(e.target.value);
                        }}
                        className=" text-black rounded-sm"
                        type="text"
                    />
                    <button type="submit" className="bg-white text-orange-400 whitespace-nowrap px-1 rounded-md">
                        검색
                    </button>
                </form>
            )}
        </div>
    );
}
