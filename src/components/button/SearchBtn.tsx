import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default function SearchBtn({ className }: { className?: string }) {
    return <FontAwesomeIcon icon={faMagnifyingGlass} className={className} />;
}
