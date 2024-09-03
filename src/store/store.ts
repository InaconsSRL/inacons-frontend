import { configureStore } from '@reduxjs/toolkit';
   import { setupListeners } from '@reduxjs/toolkit/query';
   import { userReducer } from '../slices/userSlice'; 

   export const store = configureStore({
       reducer: {
           user: userReducer, // Agrega los  slices qu|e vas crenado  aquí
       },
   });
  export type RootState = ReturnType<typeof store.getState>;

   setupListeners(store.dispatch); 

