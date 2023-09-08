import IRouletteSection from '@/interface/IRouletteSection';
import styles from './Roulette.module.css';
import { sectionColor } from '@/util/rouletteUtil';

export interface RouletteSectionProps {
    totalWeight: number;
    accWeight: number;
    data: Pick<IRouletteSection, 'weight' | 'content' | 'location'>;
}

export default function RouletteSection({ totalWeight, accWeight, data }: RouletteSectionProps) {
    const wDeg = Math.round((data.weight / totalWeight) * 360 * 1000) / 1000;
    const aDeg = Math.round((accWeight / totalWeight) * 360 * 1000) / 1000;
    return (
        <>
            <div
                className={styles['roulette-section']}
                style={{
                    background: `conic-gradient(${sectionColor(data.location)} ${wDeg}deg, #ffffff00 ${wDeg}deg)`,
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
