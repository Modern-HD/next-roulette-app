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
}

const initialState: IRouletteState<RouletteMode> = {
    mode: 'IDLE',
    set: undefined,
    section: undefined,
};

const rouletteSlice = createSlice({
    name: 'roulette',
    initialState,
    reducers: {
        rouletteReset(state) {
            state.mode = 'IDLE';
            state.set = undefined;
            state.section = undefined;
        },
        rouletteEditReset(state: IRouletteState<RouletteMode>) {
            state.mode = 'EDIT';
            state.set = { title: '', description: '', public: false, category_idx: 0 };
            state.section = [
                {
                    content: '새 항목 1',
                    weight: 10000,
                },
                {
                    content: '새 항목 2',
                    weight: 10000,
                },
            ];
        },
        roulettePlayReset(state: IRouletteState<RouletteMode>, action: PayloadAction<RoulettePlayResetPayload>) {
            state.mode = 'PLAY';
            state.set = action.payload.set;
            state.section = action.payload.section;
        },
        rouletteAddSection(state: IRouletteState<RouletteMode>) {
            if (state.mode !== 'EDIT') return state;
            (state as IRouletteState<'EDIT'>).section?.push({
                content: `새 항목 ${state.section!.length + 1}`,
                weight: 10000,
            });
            return state;
        },
        rouletteRemoveSection(state: IRouletteState<RouletteMode>, action: PayloadAction<number>) {
            if (state.mode !== 'EDIT') return state;
            if (state.section && state.section.length < 3) {
                alert('항목은 최소 2개 이상이여야 합니다.');
                return state;
            }
            (state as IRouletteState<'EDIT'>).section?.splice(action.payload, 1);
            return state;
        },
    },
});

export const { rouletteReset, rouletteEditReset, roulettePlayReset, rouletteAddSection, rouletteRemoveSection } =
    rouletteSlice.actions;
export default rouletteSlice.reducer;
