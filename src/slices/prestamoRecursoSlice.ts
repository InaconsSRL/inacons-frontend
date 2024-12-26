import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import {
  listPrestamoRecursosService,
  addPrestamoRecursoService,
  updatePrestamoRecursoService,
  deletePrestamoRecursoService,
} from '../services/prestamoRecursoService';

// Interfaces

interface Prestamo {
  id: string;
}

interface ObraBodegaRecurso {
  id: string;
}

export interface PrestamoRecurso {
  id: string;
  cantidad: number;
  observaciones?: string;
  prestamo_id: Prestamo;
  obrabodega_recurso_id: ObraBodegaRecurso;
}

interface PrestamoRecursoState {
  prestamoRecursos: PrestamoRecurso[];
  loading: boolean;
  error: string | null;
}

// Initial state
const initialState: PrestamoRecursoState = {
  prestamoRecursos: [],
  loading: false,
  error: null,
};

// Thunks
export const fetchPrestamoRecursos = createAsyncThunk(
  'prestamoRecursos/fetchPrestamoRecursos',
  async (_, { rejectWithValue }) => {
    try {
      return await listPrestamoRecursosService();
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Error desconocido');
    }
  }
);

export const addPrestamoRecurso = createAsyncThunk(
  'prestamoRecursos/addPrestamoRecurso',
  async (prestamoRecursoData: {
    cantidad: number;
    prestamoId: string;
    obrabodegaRecursoId: string;
    observaciones?: string;
  }, { rejectWithValue }) => {
    try {
      return await addPrestamoRecursoService(prestamoRecursoData);
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Error desconocido');
    }
  }
);

export const updatePrestamoRecurso = createAsyncThunk(
  'prestamoRecursos/updatePrestamoRecurso',
  async (prestamoRecursoData: {
    id: string;
    prestamoId: string;
    obrabodegaRecursoId: string;
    cantidad: number;
    observaciones?: string;
  }, { rejectWithValue }) => {
    try {
      return await updatePrestamoRecursoService(prestamoRecursoData);
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Error desconocido');
    }
  }
);

export const deletePrestamoRecurso = createAsyncThunk(
  'prestamoRecursos/deletePrestamoRecurso',
  async (id: string, { rejectWithValue }) => {
    try {
      return await deletePrestamoRecursoService(id);
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Error desconocido');
    }
  }
);

// Slice
const prestamoRecursoSlice = createSlice({
  name: 'prestamoRecursos',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch prestamo recursos
      .addCase(fetchPrestamoRecursos.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPrestamoRecursos.fulfilled, (state, action: PayloadAction<PrestamoRecurso[]>) => {
        state.loading = false;
        state.prestamoRecursos = action.payload;
      })
      .addCase(fetchPrestamoRecursos.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Add prestamo recurso
      .addCase(addPrestamoRecurso.fulfilled, (state, action: PayloadAction<PrestamoRecurso>) => {
        state.prestamoRecursos.push(action.payload);
      })
      // Update prestamo recurso
      .addCase(updatePrestamoRecurso.fulfilled, (state, action: PayloadAction<PrestamoRecurso>) => {
        const index = state.prestamoRecursos.findIndex(pr => pr.id === action.payload.id);
        if (index !== -1) {
          state.prestamoRecursos[index] = action.payload;
        }
      })
      // Delete prestamo recurso
      .addCase(deletePrestamoRecurso.fulfilled, (state, action: PayloadAction<string>) => {
        state.prestamoRecursos = state.prestamoRecursos.filter(pr => pr.id !== action.payload);
      });
  },
});

export default prestamoRecursoSlice.reducer;
