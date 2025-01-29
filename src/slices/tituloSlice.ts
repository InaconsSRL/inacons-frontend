import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import {
  listTitulosService,
  getTitulosByPresupuestoService,
  getTituloService,
  addTituloService,
  updateTituloService,
  deleteTituloService
} from '../services/tituloService';
import { DetallePartida } from './detallePartidaSlice';

// Interface para el listado simple
export interface Titulo {
  id_titulo: string;
  id_presupuesto: string;
  id_titulo_padre: string | null;
  id_titulo_plantilla: string | null;
  item: string;
  descripcion: string;
  parcial: number;
  fecha_creacion: string;
  id_especialidad: string;
  nivel: number;
  orden: number;
  tipo: string;
  detallePartida?: DetallePartida;
}


interface TituloState {
  titulos: Titulo[];
  selectedTitulo: Titulo| null;
  loading: boolean;
  error: string | null;
  titulosPorPresupuesto: { [key: string]: Titulo[] };
}

const initialState: TituloState = {
  titulos: [],
  selectedTitulo: null,
  loading: false,
  error: null,
  titulosPorPresupuesto: {},
};

export const fetchTitulos = createAsyncThunk(
  'titulo/fetchTitulos',
  async (_, { rejectWithValue }) => {
    try {
      return await listTitulosService();
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const getTitulosByPresupuesto = createAsyncThunk(
  'titulo/getTitulosByPresupuesto',
  async (id_presupuesto: string, { rejectWithValue }) => {
    try {
      return await getTitulosByPresupuestoService(id_presupuesto);
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const getTitulo = createAsyncThunk(
  'titulo/getTitulo',
  async (id_titulo: string, { rejectWithValue }) => {
    try {
      return await getTituloService(id_titulo);
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const addTitulo = createAsyncThunk(
  'titulo/addTitulo',
  async (data: Titulo, { rejectWithValue }) => {
    try {
      return await addTituloService(data);
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const updateTitulo = createAsyncThunk(
  'titulo/updateTitulo',
  async (data: Titulo, { rejectWithValue }) => {
    try {
      return await updateTituloService(data);
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const deleteTitulo = createAsyncThunk(
  'titulo/deleteTitulo',
  async (id_titulo: string, { rejectWithValue }) => {
    try {
      return await deleteTituloService(id_titulo);
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

const tituloSlice = createSlice({
  name: 'titulo',
  initialState,
  reducers: {
    clearErrors: (state) => {
      state.error = null;
    },
    getTitulosFromCache: (state, action: PayloadAction<string>) => {
      state.loading = true;  // Agregar loading incluso al obtener del cache
      const titulosCache = state.titulosPorPresupuesto[action.payload];
      if (titulosCache) {
        state.titulos = titulosCache;
      }
      state.loading = false;  // Finalizar loading
    },
    // Nuevo reducer para actualizar el detalle de partida en un título
    updateTituloDetallePartida: (state, action: PayloadAction<{
      id_presupuesto: string;
      id_titulo: string;
      detallePartida: DetallePartida;
    }>) => {      
      // Actualizar en la lista principal de títulos
      const titulo = state.titulos.find(t => t.id_titulo === action.payload.id_titulo);
      if (titulo) {
        titulo.detallePartida = action.payload.detallePartida;
      }
    
      // Actualizar en el cache de títulos por presupuesto
      if (state.titulosPorPresupuesto[action.payload.id_presupuesto]) {
        const tituloEnCache = state.titulosPorPresupuesto[action.payload.id_presupuesto]
          .find(t => t.id_titulo === action.payload.id_titulo);
        if (tituloEnCache) {
          tituloEnCache.detallePartida = action.payload.detallePartida;
        }
      }
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch Titulos
      .addCase(fetchTitulos.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTitulos.fulfilled, (state, action: PayloadAction<Titulo[]>) => {
        state.loading = false;
        state.titulos = action.payload;
      })
      .addCase(fetchTitulos.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Get Titulos By Presupuesto
      .addCase(getTitulosByPresupuesto.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getTitulosByPresupuesto.fulfilled, (state, action: PayloadAction<Titulo[], string, { arg: string }>) => {
        state.loading = false;
        state.titulos = action.payload;
        // Guardar en cache
        if (action.meta.arg) { // action.meta.arg contiene el id_presupuesto
          state.titulosPorPresupuesto[action.meta.arg] = action.payload;
        }
      })
      .addCase(getTitulosByPresupuesto.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Get Single Titulo
      .addCase(getTitulo.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getTitulo.fulfilled, (state, action: PayloadAction<Titulo>) => {
        state.loading = false;
        state.selectedTitulo = action.payload;
      })
      .addCase(getTitulo.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Add Titulo
      .addCase(addTitulo.pending, (state) => {
        state.loading = true;
      })
      .addCase(addTitulo.fulfilled, (state, action: PayloadAction<Titulo>) => {
        state.loading = false;
        state.selectedTitulo = action.payload;
      })
      .addCase(addTitulo.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Update Titulo
      .addCase(updateTitulo.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateTitulo.fulfilled, (state, action: PayloadAction<Titulo>) => {
        state.loading = false;
        const index = state.titulos.findIndex(t => t.id_titulo === action.payload.id_titulo);
        if (index !== -1) {
          state.titulos[index] = action.payload;
          // Actualizar el cache si existe para este presupuesto
          if (action.payload.id_presupuesto && state.titulosPorPresupuesto[action.payload.id_presupuesto]) {
            const cacheIndex = state.titulosPorPresupuesto[action.payload.id_presupuesto]
              .findIndex(t => t.id_titulo === action.payload.id_titulo);
            if (cacheIndex !== -1) {
              state.titulosPorPresupuesto[action.payload.id_presupuesto][cacheIndex] = action.payload;
            }
          }
        }
      })
      .addCase(updateTitulo.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Delete Titulo
      .addCase(deleteTitulo.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteTitulo.fulfilled, (state, action: PayloadAction<{ id_titulo: string; id_presupuesto: string }>) => {
        state.loading = false;
        state.titulos = state.titulos.filter(t => t.id_titulo !== action.payload.id_titulo);
        // Actualizar el cache si existe para este presupuesto
        if (action.payload.id_presupuesto && state.titulosPorPresupuesto[action.payload.id_presupuesto]) {
          state.titulosPorPresupuesto[action.payload.id_presupuesto] = 
            state.titulosPorPresupuesto[action.payload.id_presupuesto]
              .filter(t => t.id_titulo !== action.payload.id_titulo);
        }
      })
      .addCase(deleteTitulo.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearErrors, getTitulosFromCache, updateTituloDetallePartida } = tituloSlice.actions;
export const tituloReducer = tituloSlice.reducer;
