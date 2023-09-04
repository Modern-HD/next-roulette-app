'use client';

import store from '@/store/configureStore';
import { Provider } from 'react-redux';
import StateResetProvider from './StateResetProvider';

export function ReduxProvider({ children }: { children: React.ReactNode }) {
    return (
        <Provider store={store}>
            <StateResetProvider>{children}</StateResetProvider>
        </Provider>
    );
}
