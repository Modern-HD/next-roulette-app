import { PayloadAction, createSlice } from '@reduxjs/toolkit';

interface ModalState {
    sideBar: boolean;
}

const initialState: ModalState = {
    sideBar: false,
};

const modalSlice = createSlice({
    name: 'modal',
    initialState,
    reducers: {
        modalOpen(state, action: PayloadAction<keyof ModalState>) {
            state[action.payload] = true;
        },
        modalClose(state, action: PayloadAction<keyof ModalState>) {
            state[action.payload] = false;
        },
        modalToggle(state, action: PayloadAction<keyof ModalState>) {
            state[action.payload] = !state[action.payload];
        },
    },
});

export const { modalOpen, modalClose, modalToggle } = modalSlice.actions;
export default modalSlice.reducer;
