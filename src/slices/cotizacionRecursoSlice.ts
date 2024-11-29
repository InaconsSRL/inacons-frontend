//getCotizacionRecursoForCotizacionIdService añadido exitosamente 2.0
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import {
  listCotizacionRecursoService,
  getCotizacionRecursoService,
  getCotizacionRecursoForCotizacionIdService,
  addCotizacionRecursoService,
  updateCotizacionRecursoService,
  deleteCotizacionRecursoService,
} from '../services/cotizacionRecursoService';


interface CotizacionRecurso {
  id: string;
  cantidad: number;
  atencion: string;
  costo: number;
  total: number;
  cotizacion_id: {
    codigo_cotizacion: string;
    aprobacion: string;
  };
  recurso_id: {
    id: string;
    codigo: string;
    nombre: string;
    descripcion: string;
    fecha: string;
    cantidad: number;
    precio_actual: number;
    vigente: boolean;
    unidad_id: string;
    imagenes: {
      file: string;
    }[];
  };
}

interface CotizacionRecursoState {
  cotizacionRecursos: CotizacionRecurso[];
  selectedCotizacionRecurso: CotizacionRecurso | null;
  loading: boolean;
  error: string | null;
}

const initialState: CotizacionRecursoState = {
  cotizacionRecursos: [],
  selectedCotizacionRecurso: null,
  loading: false,
  error: null,
};

export const fetchCotizacionRecursos = createAsyncThunk(
  'cotizacionRecurso/fetchCotizacionRecursos',
  async (_, { rejectWithValue }) => {
    try {
      return await listCotizacionRecursoService();
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const addCotizacionRecurso = createAsyncThunk(
  'cotizacionRecurso/addCotizacionRecurso',
  async (cotizacionRecursoData: { cantidad: number; atencion: string; costo: number; total: number; cotizacion_id: string; recurso_id: string }, { rejectWithValue }) => {
    try {
      return await addCotizacionRecursoService(cotizacionRecursoData);
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const updateCotizacionRecurso = createAsyncThunk(
  'cotizacionRecurso/updateCotizacionRecurso',
  async (cotizacionRecurso: { id: string; cantidad: number; atencion: string; costo: number; total: number; cotizacion_id: string; recurso_id: string }, { rejectWithValue }) => {
    try {
      return await updateCotizacionRecursoService(cotizacionRecurso);
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const getCotizacionRecurso = createAsyncThunk(
  'cotizacionRecurso/getCotizacionRecurso',
  async (id: string, { rejectWithValue }) => {
    try {
      return await getCotizacionRecursoService(id);
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const deleteCotizacionRecurso = createAsyncThunk(
  'cotizacionRecurso/deleteCotizacionRecurso',
  async (id: string, { rejectWithValue }) => {
    try {
      // El service ahora retorna el ID
      const deletedId = await deleteCotizacionRecursoService(id);
      return deletedId;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const fetchCotizacionRecursoForCotizacionId = createAsyncThunk(
  'cotizacionRecurso/getCotizacionRecursoForCotizacionId',
  async (id: string, { rejectWithValue }) => {
    try {
      return await getCotizacionRecursoForCotizacionIdService(id);
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

const cotizacionRecursoSlice = createSlice({
  name: 'cotizacionRecurso',
  initialState,
  reducers: {
    clearErrors: (state) => {
      state.error = null;
    },
    clearCotizacionRecursos: (state) => {
      state.cotizacionRecursos = [];
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCotizacionRecursos.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCotizacionRecursos.fulfilled, (state, action: PayloadAction<CotizacionRecurso[]>) => {
        state.loading = false;
        state.cotizacionRecursos = action.payload;
      })
      .addCase(fetchCotizacionRecursos.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(addCotizacionRecurso.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addCotizacionRecurso.fulfilled, (state, action: PayloadAction<CotizacionRecurso>) => {
        state.loading = false;
        state.cotizacionRecursos.push(action.payload);
        state.error = null;
      })
      .addCase(addCotizacionRecurso.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(updateCotizacionRecurso.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCotizacionRecurso.fulfilled, (state, action: PayloadAction<CotizacionRecurso>) => {
        state.loading = false;
        const index = state.cotizacionRecursos.findIndex(
          (recurso) => recurso.id === action.payload.id
        );
        if (index !== -1) {
          state.cotizacionRecursos[index] = action.payload;
        }
        state.error = null;
      })
      .addCase(updateCotizacionRecurso.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(deleteCotizacionRecurso.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteCotizacionRecurso.fulfilled, (state, action: PayloadAction<string>) => {
        state.loading = false;
        // Filtramos el recurso eliminado usando el ID retornado
        state.cotizacionRecursos = state.cotizacionRecursos.filter(
          recurso => recurso.id !== action.payload
        );
        state.error = null;
      })
      .addCase(deleteCotizacionRecurso.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchCotizacionRecursoForCotizacionId.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCotizacionRecursoForCotizacionId.fulfilled, (state, action: PayloadAction<CotizacionRecurso[]>) => {
        state.loading = false;
        state.cotizacionRecursos = action.payload;
        state.error = null;
      })
      .addCase(fetchCotizacionRecursoForCotizacionId.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearErrors, clearCotizacionRecursos } = cotizacionRecursoSlice.actions;
export const cotizacionRecursoReducer = cotizacionRecursoSlice.reducer;