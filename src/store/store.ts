import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { userReducer } from '../slices/userSlice';
import { cargoReducer } from '../slices/cargoSlice';
import { tipoRecursoReducer } from '../slices/tipoRecursoSlice';
import { recursoReducer } from '../slices/recursoSlice';

export const store = configureStore({
    reducer: {
        user: userReducer,
        cargo: cargoReducer,
        tipoRecurso: tipoRecursoReducer,
        recurso: recursoReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

setupListeners(store.dispatch);