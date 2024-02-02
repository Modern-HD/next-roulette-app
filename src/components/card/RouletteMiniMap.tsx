import styles from './Card.module.css';
import IRouletteSection from '@/interface/IRouletteSection';
import RouletteMiniMapSection, { RouletteMiniMapSectionProps } from './RouletteMiniMapSection';

interface Props {
    section: Pick<IRouletteSection, 'content' | 'weight' | 'location'>[];
}

export default function RouletteMiniMap({ section }: Props) {
    const totalWeight = section.reduce((acc, cur) => acc + cur.weight, 0);
    return (
        <div className="relative">
            <div className={styles['roulette-root']}>
                <div className={styles['roulette-pad']}></div>
                {section
                    .reduce<Omit<RouletteMiniMapSectionProps, 'totalWeight'>[]>((acc, cur, i) => {
                        acc.push({
                            data: { weight: cur.weight, location: cur.location },
                            accWeight: cur.weight + (i === 0 ? 0 : acc[i - 1].accWeight),
                        });
                        return acc;
                    }, [])
                    .map((el, i) => (
                        <RouletteMiniMapSection
                            totalWeight={totalWeight}
                            data={el.data}
                            accWeight={el.accWeight - el.data.weight}
                            key={i}
                        />
                    ))}
            </div>
        </div>
    );
}
