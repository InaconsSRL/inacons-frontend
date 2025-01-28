import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import {
  listTitulosService,
  getTitulosByPresupuestoService,
  getTituloService,
  addTituloService,
  updateTituloService,
  deleteTituloService
} from '../services/tituloService';

// Interface para el listado simple
export interface TituloBasic {
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
}

// Interface para consultas detalladas
interface DetallePartida {
  id_detalle_partida: string;
  id_unidad: string;
  id_titulo: string;
  metrado: number;
  precio: number;
  jornada: number;
}

export interface TituloDetailed extends TituloBasic {
  detallePartida: DetallePartida[];
}

interface TituloState {
  titulos: TituloBasic[];
  selectedTitulo: TituloDetailed | null;
  loading: boolean;
  error: string | null;
  titulosPorPresupuesto: { [key: string]: TituloBasic[] };
  lastSync: { [key: string]: string }; // Guardará la fecha de última sincronización por presupuesto
}

const initialState: TituloState = {
  titulos: [],
  selectedTitulo: null,
  loading: false,
  error: null,
  titulosPorPresupuesto: {},
  lastSync: {},
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
  async (idPresupuesto: string, { rejectWithValue }) => {
    try {
      return await getTitulosByPresupuestoService(idPresupuesto);
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const getTitulo = createAsyncThunk(
  'titulo/getTitulo',
  async (idTitulo: string, { rejectWithValue }) => {
    try {
      return await getTituloService(idTitulo);
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const addTitulo = createAsyncThunk(
  'titulo/addTitulo',
  async (data: TituloBasic, { rejectWithValue }) => {
    try {
      return await addTituloService(data);
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const updateTitulo = createAsyncThunk(
  'titulo/updateTitulo',
  async (data: TituloBasic, { rejectWithValue }) => {
    try {
      return await updateTituloService(data);
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const deleteTitulo = createAsyncThunk(
  'titulo/deleteTitulo',
  async (idTitulo: string, { rejectWithValue }) => {
    try {
      return await deleteTituloService(idTitulo);
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
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch Titulos
      .addCase(fetchTitulos.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchTitulos.fulfilled, (state, action: PayloadAction<TituloBasic[]>) => {
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
      })
      .addCase(getTitulosByPresupuesto.fulfilled, (state, action: PayloadAction<TituloDetailed[], string, { arg: string }>) => {
        state.loading = false;
        state.titulos = action.payload;
        // Guardar en cache
        if (action.meta.arg) { // action.meta.arg contiene el idPresupuesto
          state.titulosPorPresupuesto[action.meta.arg] = action.payload;
          state.lastSync[action.meta.arg] = new Date().toLocaleString();
        }
      })
      .addCase(getTitulosByPresupuesto.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Get Single Titulo
      .addCase(getTitulo.pending, (state) => {
        state.loading = true;
      })
      .addCase(getTitulo.fulfilled, (state, action: PayloadAction<TituloDetailed>) => {
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
      .addCase(addTitulo.fulfilled, (state, action: PayloadAction<TituloDetailed>) => {
        state.loading = false;
        state.titulos.push(action.payload);
      })
      .addCase(addTitulo.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Update Titulo
      .addCase(updateTitulo.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateTitulo.fulfilled, (state, action: PayloadAction<TituloDetailed>) => {
        state.loading = false;
        const index = state.titulos.findIndex(t => t.id_titulo === action.payload.id_titulo);
        if (index !== -1) {
          state.titulos[index] = action.payload;
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
      .addCase(deleteTitulo.fulfilled, (state, action: PayloadAction<{ id_titulo: string }>) => {
        state.loading = false;
        state.titulos = state.titulos.filter(t => t.id_titulo !== action.payload.id_titulo);
      })
      .addCase(deleteTitulo.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearErrors, getTitulosFromCache } = tituloSlice.actions;
export const tituloReducer = tituloSlice.reducer;
