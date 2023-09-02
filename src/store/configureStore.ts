import { configureStore } from '@reduxjs/toolkit';
import { useDispatch } from 'react-redux';
import modalReducer from '@/store/modalSlice';

const store = configureStore({
    reducer: { modal: modalReducer },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch: () => AppDispatch = useDispatch;
export default store;
