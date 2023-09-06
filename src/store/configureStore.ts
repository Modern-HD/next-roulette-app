import { configureStore } from '@reduxjs/toolkit';
import { useDispatch } from 'react-redux';
import modalReducer from '@/store/modalSlice';
import rouletteReducer from '@/store/rouletteSlice';

const store = configureStore({
    reducer: { modal: modalReducer, roulette: rouletteReducer },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch: () => AppDispatch = useDispatch;
export default store;
