'use client';

import Link from 'next/link';
import { useState } from 'react';
import { RsItem } from './RouletteSetCardList';
import styles from './Card.module.css';
import RouletteMiniMap from './RouletteMiniMap';
import RouletteMiniMapItem from './RouletteMiniMapItem';

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
        roulette_section,
    },
}: Props) {
    const [isMouseOver, setMouseOver] = useState(false);
    const sortedItems =
        roulette_section.length > 20 ? roulette_section : [...roulette_section].sort((a, b) => b.weight - a.weight);
    return (
        <div
            className={styles['roulette-set-card-item']}
            onMouseOver={() => {
                setMouseOver(true);
            }}
            onMouseOut={() => {
                setMouseOver(false);
            }}
            style={{ width: 300, height: 250, minWidth: 300, minHeight: 250 }}
        >
            <div className="h-full flex flex-col p-4">
                <div>
                    <h5 className="text-lg font-bold">{title}</h5>
                </div>
                <div className="overflow-hidden text-ellipsis whitespace-nowrap">{description}</div>
                <div className="flex-1 flex flex-row items-center gap-2">
                    <div style={{ width: 150, height: 150 }}>
                        <RouletteMiniMap section={roulette_section} />
                    </div>
                    <div className="flex-1 flex flex-col h-full overflow-hidden py-2">
                        {sortedItems.slice(0, 6).map((el, i) => (
                            <RouletteMiniMapItem data={el} key={i} />
                        ))}
                    </div>
                </div>
            </div>

            <div
                className={`
                    bg-black bg-opacity-80 text-white w-full h-full
                    absolute top-0 p-5 transition-all z-10
                    ${isMouseOver ? 'pointer-events-auto' : 'pointer-events-none'}
                    ${isMouseOver ? 'opacity-100' : 'opacity-0'}
                `}
            >
                <div className="flex flex-col h-full">
                    <div className="mb-0">
                        <h5 className="text-lg font-bold">{title}</h5>
                    </div>
                    <div className="mb-4 font-bold">{nick_name}</div>
                    <div className="flex-1 flex mb-3 overflow-y-scroll hide-scroll">{description}</div>
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
