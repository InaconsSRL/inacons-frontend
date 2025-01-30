import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Proyecto } from './proyectoSlice';
import { Presupuesto } from './presupuestoSlice';
import { Titulo } from './tituloSlice';

export interface IComposicionApu {
  id_composicion_apu: string;
  id_titulo: string;
  rec_comp_apu?: IRecursoComposicionApu;
  cuadrilla: number;
  cantidad: number;
}

export interface IRecursoComposicionApu {
  id_rec_comp_apu: string;
  nombre: string;
  especificaciones?: string;
  descripcion?: string;
  fecha_creacion: string;
  precio_recurso_proyecto?: IPrecioRecursoProyecto;
  recurso_presupuesto?: RecursoPresupuesto;
  unidad_presupuesto?: UnidadPresupuesto;
  recurso?: RecursoPresupuesto;
  unidad?: UnidadPresupuesto;
}

export interface IPrecioRecursoProyecto {
  id_prp: string;
  id_proyecto: string;
  id_rec_comp_apu: string;
  precio: number;
}

export interface RecursoPresupuesto {
  id_recurso: string;
  id_unidad: string;
  id_clase: string;
  id_tipo: string;
  tipo?: ITipo;
  id_recurso_app: string;
  nombre: string;
  precio_referencial: number;
  fecha_actualizacion: string; // Cambiado de Date a string
}

export interface UnidadPresupuesto {
  id_unidad: string;
  abreviatura_unidad: string;
  descripcion: string;
}

export interface IClase {
  id_clase: string;
  nombre: string;
}

export interface ITipo {
  id_tipo: string;
  descripcion: string;
  codigo: string;
}

interface ActiveDataState {
  activeProyecto: Proyecto | null;
  activePresupuesto: Presupuesto | null;
  activeTitulo: Titulo | null;
  activeComposicionApu: IComposicionApu | null;
  isEditMode: boolean;
}

const initialState: ActiveDataState = {
  activeProyecto: null,
  activePresupuesto: null,
  activeTitulo: null,
  activeComposicionApu: null,
  isEditMode: false,
};

const activeDataSlice = createSlice({
  name: 'activeData',
  initialState,
  reducers: {
    // Setters para cada elemento activo
    setActiveProyecto: (state, action: PayloadAction<Proyecto | null>) => {
      state.activeProyecto = action.payload;
    },
    setActivePresupuesto: (state, action: PayloadAction<Presupuesto | null>) => {
      state.activePresupuesto = action.payload;
    },
    setActiveTitulo: (state, action: PayloadAction<Titulo | null>) => {
      state.activeTitulo = action.payload;
    },
    setActiveComposicionApu: (state, action: PayloadAction<IComposicionApu | null>) => {
      state.activeComposicionApu = action.payload;
    },

    // Actualizar elementos activos
    updateActiveProyecto: (state, action: PayloadAction<Partial<Proyecto>>) => {
      if (state.activeProyecto) {
        state.activeProyecto = { ...state.activeProyecto, ...action.payload };
      }
    },
    updateActivePresupuesto: (state, action: PayloadAction<Partial<Presupuesto>>) => {
      if (state.activePresupuesto) {
        state.activePresupuesto = { ...state.activePresupuesto, ...action.payload };
      }
    },
    updateActiveTitulo: (state, action: PayloadAction<Titulo | null>) => {
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
    },
    setEditMode: (state, action: PayloadAction<boolean>) => {
      state.isEditMode = action.payload;
    },
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
  clearDependentData,
  setEditMode
} = activeDataSlice.actions;

export default activeDataSlice.reducer;
