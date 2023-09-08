'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { RsItem } from './RouletteSetCardList';

interface Props {
    data: RsItem;
}

export default function RouletteSetCardItem({
    data: {
        idx,
        title,
        description,
        play_count,
        user: { nick_name },
    },
}: Props) {
    const [isMouseOver, setMouseOver] = useState(false);

    return (
        <div
            className="bg-slate-100 rounded-2xl shadow-sm relative overflow-hidden select-none"
            onMouseOver={() => {
                setMouseOver(true);
            }}
            onMouseOut={() => {
                setMouseOver(false);
            }}
            style={{ width: 300, height: 400, minWidth: 300, minHeight: 400 }}
        >
            <div className="h-full flex flex-col py-5 px-5">
                <div>
                    <h5 className="text-lg font-bold">{title}</h5>
                </div>
                <div className="flex-1 flex justify-center items-center">
                    <Image src={'/roulette_preview.png'} alt={''} width={200} height={200} />
                </div>
                <div>{description}</div>
            </div>

            <div
                className={`
                    bg-black bg-opacity-80 text-white w-full h-full
                    absolute top-0 p-5 transition-all
                    ${isMouseOver ? 'pointer-events-auto' : 'pointer-events-none'}
                    ${isMouseOver ? 'opacity-100' : 'opacity-0'}
                `}
            >
                <div className="flex flex-col h-full">
                    <div className="mb-0">
                        <h5 className="text-lg font-bold">{title}</h5>
                    </div>
                    <div className="mb-5 font-bold">{nick_name}</div>
                    <div className="flex-1 flex mb-3">{description}</div>
                    <div className="flex flex-col gap-2">
                        <Link
                            className="bg-white text-black px-2 py-2 rounded-sm mx-auto text-center"
                            style={{ width: 150 }}
                            href={`/roulette/play/${idx}`}
                        >
                            플레이
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
