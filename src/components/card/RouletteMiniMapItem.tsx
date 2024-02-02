import IRouletteSection from '@/interface/IRouletteSection';
import styles from './Card.module.css';
import { sectionColor } from '@/util/rouletteUtil';

interface Props {
    data: Pick<IRouletteSection, 'weight' | 'content' | 'location'>;
}

export default function RouletteMiniMapItem({ data: { weight, content, location } }: Props) {
    return (
        <div className="flex flex-row items-center gap-2">
            <div className={styles['roulette-item-color']} style={{ backgroundColor: sectionColor(location) }}></div>
            <div className="flex-1 overflow-hidden text-ellipsis whitespace-nowrap">{content}</div>
        </div>
    );
}
