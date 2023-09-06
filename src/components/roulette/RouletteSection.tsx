import IRouletteSection from '@/interface/IRouletteSection';
import styles from './Roulette.module.css';

export interface RouletteSectionProps {
    totalWeight: number;
    accWeight: number;
    data: Pick<IRouletteSection, 'weight' | 'content' | 'location'>;
}

const color = ['#88C5FA', '#95E2EC', '#FFF9BE', '#FAD6DD', '#D0C6E9', '#FFA477'];

export default function RouletteSection({ totalWeight, accWeight, data }: RouletteSectionProps) {
    const wDeg = (data.weight / totalWeight) * 360;
    const sDeg = (accWeight / totalWeight) * 360;
    return (
        <>
            <div
                className={styles['roulette-section']}
                style={{
                    background: `conic-gradient(${
                        color[data.location % color.length]
                    } ${wDeg}deg, #ffffff00 ${wDeg}deg)`,
                    transform: `rotate(${sDeg}deg)`,
                }}
            ></div>
            <div className="w-full h-full absolute top-0 z-10" style={{ transform: `rotate(${wDeg + 90 + sDeg}deg)` }}>
                <hr className={styles['roulette-border']}></hr>
            </div>
            {/* <div className="absolute text-right font-bold text-2xl z-10">{data.content}</div> */}
        </>
    );
}
