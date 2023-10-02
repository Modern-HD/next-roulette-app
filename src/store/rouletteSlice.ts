import IRouletteSection from '@/interface/IRouletteSection';
import IRouletteSet from '@/interface/IRouletteSet';
import { PayloadAction, createSlice } from '@reduxjs/toolkit';

type RouletteMode = 'IDLE' | 'EDIT' | 'PLAY';

type Section<T> = T extends 'EDIT'
    ? Omit<IRouletteSection, 'roulette_set_idx' | 'location' | 'idx' | 'created_at' | 'updated_at'>[]
    : T extends 'PLAY'
    ? IRouletteSection[]
    : undefined;

type Set<T> = T extends 'EDIT'
    ? Omit<IRouletteSet, 'idx' | 'created_at' | 'updated_at' | 'user_idx' | 'play_count'>
    : T extends 'PLAY'
    ? IRouletteSet[]
    : undefined;

type RoulettePlayResetPayload = Pick<IRouletteState<'PLAY'>, 'set' | 'section'>;

export interface IRouletteState<T extends RouletteMode> {
    mode: T;
    set: Set<T>;
    section: Section<T>;
    editSectionIdx: number;
    spinning: boolean;
    resultSection: null | number;
    deg: number;
    speed: number;
    display: boolean;
}

const initialState: IRouletteState<RouletteMode> = {
    mode: 'IDLE',
    set: undefined,
    section: undefined,
    editSectionIdx: -1,
    spinning: false,
    resultSection: null,
    deg: 0,
    speed: 8,
    display: false,
};

const rouletteSlice = createSlice({
    name: 'roulette',
    initialState,
    reducers: {
        rouletteReset() {
            return { ...initialState };
        },
        rouletteEditReset() {
            return {
                ...initialState,
                mode: 'EDIT',
                set: { title: '', description: '', public: false, category_idx: 0 },
                section: [
                    {
                        content: '새 항목 1',
                        weight: 10000,
                    },
                    {
                        content: '새 항목 2',
                        weight: 10000,
                    },
                ],
            };
        },
        roulettePlayReset(state: IRouletteState<RouletteMode>, action: PayloadAction<RoulettePlayResetPayload>) {
            return {
                ...initialState,
                mode: 'PLAY',
                set: action.payload.set,
                section: action.payload.section,
            };
        },
        rouletteAddSection(state: IRouletteState<RouletteMode>) {
            if (state.mode !== 'EDIT') return state;
            const editState = state as IRouletteState<'EDIT'>;
            editState.section.push({
                content: `새 항목 ${editState.section.length + 1}`,
                weight: 10000,
            });
            return editState;
        },
        rouletteRemoveSection(state: IRouletteState<RouletteMode>, action: PayloadAction<number>) {
            if (state.mode !== 'EDIT') return state;
            if (state.spinning) return state;
            const editState = state as IRouletteState<'EDIT'>;
            if (editState.section.length < 3) {
                alert('항목은 최소 2개 이상이여야 합니다.');
                return editState;
            }
            editState.section.splice(action.payload, 1);
            return editState;
        },
        rouletteEditSection(state: IRouletteState<RouletteMode>, action: PayloadAction<number>) {
            if (state.mode !== 'EDIT') return state;
            if (state.spinning) return state;
            state.editSectionIdx = action.payload;
        },
        rouletteModifySection(
            state: IRouletteState<RouletteMode>,
            action: PayloadAction<
                Partial<Pick<IRouletteSection, 'weight' | 'content'>> & Pick<IRouletteSection, 'idx'>
            >,
        ) {
            if (state.mode !== 'EDIT') return state;
            if (state.spinning) return state;
            const editState = state as IRouletteState<'EDIT'>;
            const { idx, weight, content } = action.payload;
            if (weight !== undefined) {
                if (weight <= 0) {
                    alert('배율은 0 이상이여야 합니다!');
                    return editState;
                }
                editState.section[idx].weight = weight;
            }
            if (content !== undefined) {
                if (content === '') {
                    alert('내용을 입력해주세요!');
                    return editState;
                }
                if (content.length > 50) {
                    alert('내용은 50자 이하여야 합니다.');
                    return editState;
                }
                editState.section[idx].content = content;
            }
            editState.editSectionIdx = -1;
            return editState;
        },
        rouletteDemoPlay(state: IRouletteState<RouletteMode>) {
            if (!(state.mode === 'EDIT')) return;
            if (state.spinning) return;
            const editState = state as IRouletteState<'EDIT'>;
            const totalWeight = editState.section.reduce((acc, cur) => acc + cur.weight, 0);
            const randomNum = Math.floor(Math.random() * totalWeight) + 1;
            const resultSection = [...editState.section].reduce<number>((acc, cur, i, arr) => {
                acc -= cur.weight;
                if (acc > 0) return acc;
                arr.splice(1);
                return i;
            }, randomNum);
            editState.editSectionIdx = -1;
            editState.spinning = true;
            editState.resultSection = resultSection;
            editState.display = false;
            editState.deg = 3600 - (randomNum / totalWeight) * 360;
            return editState;
        },
        rouletteSpinReset(state: IRouletteState<RouletteMode>) {
            if (!(state.mode === 'EDIT')) return;
            const editState = state as IRouletteState<'EDIT'>;
            editState.spinning = false;
            editState.deg = editState.deg % 360;
            editState.display = false;
        },
        rouletteResultDisplay(state: IRouletteState<RouletteMode>) {
            if (!state.spinning) return;
            return {
                ...state,
                display: true,
            };
        },
    },
});

export const {
    rouletteReset,
    rouletteEditReset,
    roulettePlayReset,
    rouletteAddSection,
    rouletteRemoveSection,
    rouletteEditSection,
    rouletteModifySection,
    rouletteDemoPlay,
    rouletteSpinReset,
    rouletteResultDisplay,
} = rouletteSlice.actions;
export default rouletteSlice.reducer;
