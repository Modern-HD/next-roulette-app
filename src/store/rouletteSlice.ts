import IRouletteSection from '@/interface/IRouletteSection';
import IRouletteSet from '@/interface/IRouletteSet';
import { PayloadAction, createSlice } from '@reduxjs/toolkit';

type Mode = 'IDLE' | 'EDIT' | 'PLAY';
type RouletteState<T extends Mode> = T extends 'IDLE'
    ? {
          mode: T;
          set?: undefined;
          section?: undefined;
      }
    : T extends 'EDIT'
    ? {
          mode: T;
          set: Partial<IRouletteSet>;
          section: Partial<IRouletteSection>[];
      }
    : T extends 'PLAY'
    ? {
          mode: T;
      } & RoulettePlayResetPayload
    : undefined;

type RoulettePlayResetPayload = {
    set: IRouletteSet;
    section: IRouletteSection[];
};

const initialState: RouletteState<Mode> = {
    mode: 'IDLE',
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
        rouletteEditReset(state: RouletteState<Mode>) {
            state.mode = 'EDIT';
            state.set = {};
            state.section = [];
        },
        roulettePlayReset(state: RouletteState<Mode>, action: PayloadAction<RoulettePlayResetPayload>) {
            state.mode = 'PLAY';
            state.set = action.payload.set;
            state.section = action.payload.section;
        },
    },
});

export const { rouletteReset, rouletteEditReset, roulettePlayReset } = rouletteSlice.actions;
export default rouletteSlice.reducer;
