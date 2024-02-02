import IRouletteSection from '@/interface/IRouletteSection';
import styles from './Card.module.css';
import { sectionColor } from '@/util/rouletteUtil';

export interface RouletteMiniMapSectionProps {
    totalWeight: number;
    accWeight: number;
    data: Pick<IRouletteSection, 'weight' | 'location'>;
}

export default function RouletteMiniMapSection({ totalWeight, accWeight, data }: RouletteMiniMapSectionProps) {
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
        </>
    );
}
