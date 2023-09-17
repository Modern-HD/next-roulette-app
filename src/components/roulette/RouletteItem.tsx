'use client';

import IRouletteSection from '@/interface/IRouletteSection';
import { sectionColor } from '@/util/rouletteUtil';
import styles from './Roulette.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faDownLong, faPen, faRotateLeft, faUpLong, faX } from '@fortawesome/free-solid-svg-icons';
import { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { rouletteEditSection, rouletteModifySection, rouletteRemoveSection } from '@/store/rouletteSlice';
import { RootState } from '@/store/configureStore';

interface Props {
    idx: number;
    data: Omit<IRouletteSection, 'idx' | 'created_at' | 'updated_at' | 'roulette_set_idx' | 'location'>;
}

export default function RouletteItem({ data, idx }: Props) {
    const editIdx = useSelector((state: RootState) => state.roulette.editSectionIdx);
    const isEdit = editIdx === idx;
    const dispatch = useDispatch();
    const contentRef = useRef<null | HTMLInputElement>(null);
    const weightRef = useRef<null | HTMLInputElement>(null);

    useEffect(() => {
        contentRef.current?.focus();
    }, [isEdit]);

    return (
        <div
            className={`flex flex-row justify-between items-center px-2 xs:px-5 py-3 gap-2 xs:gap-5 ${
                isEdit ? 'bg-yellow-200' : ''
            }`}
        >
            <div className={styles['roulette-item-color']} style={{ backgroundColor: sectionColor(idx) }}></div>
            {!isEdit && <div className={styles['roulette-section-item-content']}>{data.content}</div>}
            {isEdit && (
                <input
                    ref={contentRef}
                    type="text"
                    maxLength={20}
                    className={styles['roulette-section-item-content']}
                    defaultValue={data.content}
                />
            )}
            <div className="flex flex-row">
                {!isEdit && <p className="mr-2">× {(data.weight / 10000).toFixed(1)}</p>}
                {isEdit && (
                    <input
                        type="number"
                        ref={weightRef}
                        min={0.1}
                        max={999}
                        className="block"
                        defaultValue={(data.weight / 10000).toFixed(1)}
                    ></input>
                )}
                {!isEdit && (
                    <>
                        <button
                            className="text-gray-400 px-1"
                            onClick={() => {
                                dispatch(rouletteModifySection({ idx, weight: data.weight + 5000 }));
                            }}
                        >
                            <FontAwesomeIcon icon={faUpLong} />
                        </button>
                        <button
                            className="text-gray-400"
                            onClick={() => {
                                dispatch(rouletteModifySection({ idx, weight: data.weight - 5000 }));
                            }}
                        >
                            <FontAwesomeIcon icon={faDownLong} />
                        </button>
                    </>
                )}
            </div>
            <div className="flex flex-row gap-3 text-gray-400">
                {!isEdit && (
                    <>
                        <button
                            onClick={() => {
                                dispatch(rouletteEditSection(idx));
                            }}
                        >
                            <FontAwesomeIcon icon={faPen} />
                        </button>
                        <button
                            onClick={() => {
                                dispatch(rouletteRemoveSection(idx));
                            }}
                        >
                            <FontAwesomeIcon icon={faX} />
                        </button>
                    </>
                )}
                {isEdit && (
                    <>
                        <button
                            onClick={() => {
                                dispatch(
                                    rouletteModifySection({
                                        idx,
                                        weight:
                                            weightRef.current && weightRef.current.value !== ''
                                                ? parseFloat(weightRef.current.value) * 10000
                                                : undefined,
                                        content: contentRef.current ? contentRef.current.value : undefined,
                                    }),
                                );
                            }}
                        >
                            <FontAwesomeIcon icon={faCheck} />
                        </button>
                        <button
                            onClick={() => {
                                dispatch(rouletteEditSection(-1));
                            }}
                        >
                            <FontAwesomeIcon icon={faRotateLeft} />
                        </button>
                    </>
                )}
            </div>
        </div>
    );
}
