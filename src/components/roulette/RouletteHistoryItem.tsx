'use client';

import IPlayData from '@/interface/IPlayData';

export default function RouletteHistoryItem({ data: { content, created_at } }: { data: IPlayData }) {
    const now = new Date();
    const createdAt = new Date(created_at);
    const difference = now.getTime() - createdAt.getTime();
    let timeStr = '';

    if (difference >= 1000 * 60 * 60 * 24 * 7) {
        timeStr = `${createdAt.getFullYear()}-${lPad(createdAt.getMonth())}-${lPad(createdAt.getDay())}`;
    } else if (difference >= 1000 * 60 * 60 * 24) {
        timeStr = `${Math.floor(difference / (1000 * 60 * 60 * 24))}일 전`;
    } else if (difference >= 1000 * 60 * 60) {
        timeStr = `${Math.floor(difference / (1000 * 60 * 60))}시간 전`;
    } else if (difference >= 1000 * 60) {
        timeStr = `${Math.floor(difference / (1000 * 60))}분 전`;
    } else {
        timeStr = `${Math.floor(difference / 1000)}초 전`;
    }

    return (
        <div className="flex flex-row justify-around py-2">
            <div className="font-bold w-6/12 text-center text-ellipsis overflow-hidden whitespace-nowrap px-1">
                {content.trim()}
            </div>
            <div className="text-gray-600 w-6/12 text-center px-1">{timeStr}</div>
        </div>
    );
}

function lPad(value: number) {
    return value < 10 ? `0${value}` : value;
}
