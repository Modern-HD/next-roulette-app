import IRouletteSection from '@/interface/IRouletteSection';
import styles from './Roulette.module.css';

export interface RouletteSectionProps {
    totalWeight: number;
    accWeight: number;
    data: Pick<IRouletteSection, 'weight' | 'content' | 'location'>;
}

const color = ['#88C5FA', '#95E2EC', '#FFF9BE', '#FAD6DD', '#D0C6E9', '#FFA477'];

export default function RouletteSection({ totalWeight, accWeight, data }: RouletteSectionProps) {
    const wDeg = Math.round((data.weight / totalWeight) * 360 * 1000) / 1000;
    const aDeg = Math.round((accWeight / totalWeight) * 360 * 1000) / 1000;
    return (
        <>
            <div
                className={styles['roulette-section']}
                style={{
                    background: `conic-gradient(${
                        color[data.location % color.length]
                    } ${wDeg}deg, #ffffff00 ${wDeg}deg)`,
                    transform: `rotate(${aDeg}deg)`,
                }}
            ></div>
            <div className="w-full h-full absolute top-0 z-10" style={{ transform: `rotate(${wDeg + 90 + aDeg}deg)` }}>
                <hr className={styles['roulette-border']}></hr>
            </div>
            <div
                className="w-full h-full absolute top-0 z-20"
                style={{ transform: `rotate(${wDeg / 2 + 90 + aDeg}deg)` }}
            >
                <div className={styles['roulette-content']}>
                    <p className="text-md md:text-xl xl:text-3xl" style={{ transform: `rotate(180deg)` }}>
                        {data.content}
                    </p>
                </div>
            </div>
        </>
    );
}
