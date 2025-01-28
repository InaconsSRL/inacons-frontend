import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { 
  IProyecto, 
  IPresupuesto, 
  ITitulo,
  IComposicionApu 
} from '../types/PresupuestosTypes';

interface ActiveDataState {
  activeProyecto: IProyecto | null;
  activePresupuesto: IPresupuesto | null;
  activeTitulo: ITitulo | null;
  activeComposicionApu: IComposicionApu | null;
}

const initialState: ActiveDataState = {
  activeProyecto: null,
  activePresupuesto: null,
  activeTitulo: null,
  activeComposicionApu: null
};

const activeDataSlice = createSlice({
  name: 'activeData',
  initialState,
  reducers: {
    // Setters para cada elemento activo
    setActiveProyecto: (state, action: PayloadAction<IProyecto | null>) => {
      state.activeProyecto = action.payload;
    },
    setActivePresupuesto: (state, action: PayloadAction<IPresupuesto | null>) => {
      state.activePresupuesto = action.payload;
    },
    setActiveTitulo: (state, action: PayloadAction<ITitulo | null>) => {
      state.activeTitulo = action.payload;
    },
    setActiveComposicionApu: (state, action: PayloadAction<IComposicionApu | null>) => {
      state.activeComposicionApu = action.payload;
    },

    // Actualizar elementos activos
    updateActiveProyecto: (state, action: PayloadAction<Partial<IProyecto>>) => {
      if (state.activeProyecto) {
        state.activeProyecto = { ...state.activeProyecto, ...action.payload };
      }
    },
    updateActivePresupuesto: (state, action: PayloadAction<Partial<IPresupuesto>>) => {
      if (state.activePresupuesto) {
        state.activePresupuesto = { ...state.activePresupuesto, ...action.payload };
      }
    },
    updateActiveTitulo: (state, action: PayloadAction<ITitulo | null>) => {
      state.activeTitulo = action.payload;
    },
    updateActiveComposicionApu: (state, action: PayloadAction<Partial<IComposicionApu>>) => {
      if (state.activeComposicionApu) {
        state.activeComposicionApu = { ...state.activeComposicionApu, ...action.payload };
      }
    },

    // Limpiar elementos específicos
    clearActiveProyecto: (state) => {
      state.activeProyecto = null;
    },
    clearActivePresupuesto: (state) => {
      state.activePresupuesto = null;
    },
    clearActiveTitulo: (state) => {
      state.activeTitulo = null;
    },
    clearActiveComposicionApu: (state) => {
      state.activeComposicionApu = null;
    },

    // Limpiar todo
    clearAllActiveData: (state) => {
      state.activeProyecto = null;
      state.activePresupuesto = null;
      state.activeTitulo = null;
      state.activeComposicionApu = null;
    },

    // Limpiar elementos dependientes
    clearDependentData: (state, action: PayloadAction<'proyecto' | 'presupuesto' | 'titulo' | 'tituloPartida'>) => {
      switch (action.payload) {
        case 'proyecto':
          state.activePresupuesto = null;
          state.activeTitulo = null;
          state.activeComposicionApu = null;
          break;
        case 'presupuesto':
          state.activeTitulo = null;
          state.activeComposicionApu = null;
          break;
        case 'titulo':
          state.activeComposicionApu = null;
          break;
        case 'tituloPartida':
          state.activeComposicionApu = null;
          break;
      }
    }
  }
});

export const {
  setActiveProyecto,
  setActivePresupuesto,
  setActiveTitulo,
  setActiveComposicionApu,
  updateActiveProyecto,
  updateActivePresupuesto,
  updateActiveTitulo,
  updateActiveComposicionApu,
  clearActiveProyecto,
  clearActivePresupuesto,
  clearActiveTitulo,
  clearActiveComposicionApu,
  clearAllActiveData,
  clearDependentData
} = activeDataSlice.actions;

export default activeDataSlice.reducer;
