import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { userReducer } from '../slices/userSlice';
import { cargoReducer } from '../slices/cargoSlice';

export const store = configureStore({
    reducer: {
        user: userReducer,
        cargo: cargoReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

setupListeners(store.dispatch);