import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  listCotizacionProveedoresRecursos,
  getCotizacionesByProveedorId,
  addCotizacionProveedoresRecurso as addCotizacionProveedoresRecursoService,
  updateCotizacionProveedoresRecurso as updateCotizacionProveedoresRecursoService,
  deleteCotizacionProveedoresRecurso as deleteCotizacionProveedoresRecursoService,
} from '../services/cotizacionProveedoresRecursoService';

interface Imagen {
  file: string;
}

interface Recurso {
  id: string;
  codigo: string;
  nombre: string;
  descripcion: string;
  cantidad: number;
  precio_actual: number;
  vigente: boolean;
  imagenes: Imagen[];
  unidad_id: string;
}

interface CotizacionProveedor {
  id: string;
}

interface CotizacionProveedoresRecurso {
  id: string;
  cotizacion_proveedor_id: CotizacionProveedor;
  recurso_id: Recurso;
  cantidad: number;
  costo: number;
}

interface CotizacionProveedoresRecursoState {
  cotizacionProveedoresRecursos: CotizacionProveedoresRecurso[];
  loading: boolean;
  error: string | null;
}

const initialState: CotizacionProveedoresRecursoState = {
  cotizacionProveedoresRecursos: [],
  loading: false,
  error: null,
};

export const fetchCotizacionProveedoresRecursos = createAsyncThunk(
  'cotizacionProveedoresRecurso/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      return await listCotizacionProveedoresRecursos();
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const fetchCotizacionesByProveedor = createAsyncThunk(
  'cotizacionProveedoresRecurso/fetchByProveedor',
  async (providerId: string, { rejectWithValue }) => {
    try {
      return await getCotizacionesByProveedorId(providerId);
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const addCotizacionProveedoresRecurso = createAsyncThunk(
  'cotizacionProveedoresRecurso/add',
  async (data: { cotizacion_proveedor_id: string; recurso_id: string; cantidad: number; costo: number }, { rejectWithValue }) => {
    try {
      return await addCotizacionProveedoresRecursoService(data);
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const updateCotizacionProveedoresRecurso = createAsyncThunk(
  'cotizacionProveedoresRecurso/update',
  async (data: { id: string; cotizacion_proveedor_id?: string; recurso_id?: string; cantidad?: number; costo?: number }, { rejectWithValue }) => {
    try {
      return await updateCotizacionProveedoresRecursoService(data);
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const deleteCotizacionProveedoresRecurso = createAsyncThunk(
  'cotizacionProveedoresRecurso/delete',
  async (id: string, { rejectWithValue }) => {
    try {
      await deleteCotizacionProveedoresRecursoService(id);
      return id;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

const cotizacionProveedoresRecursoSlice = createSlice({
  name: 'cotizacionProveedoresRecurso',
  initialState,
  reducers: {
    clearErrors: (state) => {
      state.error = null;
    },
    clearCotizaciones: (state) => {
      state.cotizacionProveedoresRecursos = [];
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCotizacionProveedoresRecursos.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCotizacionProveedoresRecursos.fulfilled, (state, action) => {
        state.loading = false;
        state.cotizacionProveedoresRecursos = action.payload;
      })
      .addCase(fetchCotizacionProveedoresRecursos.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchCotizacionesByProveedor.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCotizacionesByProveedor.fulfilled, (state, action) => {
        state.loading = false;
        // Merge new data with existing data to avoid flickering
        const newData = action.payload;
        const existingIds = new Set(state.cotizacionProveedoresRecursos.map(item => item.id));
        state.cotizacionProveedoresRecursos = [
          ...state.cotizacionProveedoresRecursos,
          ...newData.filter((item: CotizacionProveedoresRecurso) => !existingIds.has(item.id))
        ];
      })
      .addCase(fetchCotizacionesByProveedor.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(addCotizacionProveedoresRecurso.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addCotizacionProveedoresRecurso.fulfilled, (state, action) => {
        state.loading = false;
        state.cotizacionProveedoresRecursos.push(action.payload);
      })
      .addCase(addCotizacionProveedoresRecurso.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(updateCotizacionProveedoresRecurso.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCotizacionProveedoresRecurso.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.cotizacionProveedoresRecursos.findIndex(item => item.id === action.payload.id);
        if (index !== -1) {
          state.cotizacionProveedoresRecursos[index] = action.payload;
        }
      })
      .addCase(updateCotizacionProveedoresRecurso.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(deleteCotizacionProveedoresRecurso.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteCotizacionProveedoresRecurso.fulfilled, (state, action) => {
        state.cotizacionProveedoresRecursos = state.cotizacionProveedoresRecursos.filter(
          (item) => item.id !== action.payload
        );
      });
  },
});

export const { clearErrors, clearCotizaciones } = cotizacionProveedoresRecursoSlice.actions;
export const cotizacionProveedoresRecursoReducer = cotizacionProveedoresRecursoSlice.reducer;