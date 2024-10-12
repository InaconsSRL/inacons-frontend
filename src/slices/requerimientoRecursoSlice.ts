import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { getRequerimientoRecursoByRequerimientoId, addRequerimientoRecurso as addRequerimientoRecursoService, deleteRequerimientoRecurso as deleteRequerimientoRecursoService } from '../services/requerimientoRecursoService';

interface RequerimientoRecurso {
  id: string;
  requerimiento_id: string;
  recurso_id: string;
  cantidad: number;
  cantidad_aprobada: number | null;
  estado: string;
  tipo_solicitud: string;
  presupuestado: boolean;
  nombre: string;
  codigo: string;
}

interface RequerimientoRecursoState {
  requerimientoRecursos: RequerimientoRecurso[];
  loading: boolean;
  error: string | null;
}

const initialState: RequerimientoRecursoState = {
  requerimientoRecursos: [],
  loading: false,
  error: null,
};

export const fetchRequerimientoRecursos = createAsyncThunk(
  'requerimientoRecurso/fetchRequerimientoRecursos',
  async (requerimientoId: string, { rejectWithValue }) => {
    try {
      const response = await getRequerimientoRecursoByRequerimientoId(requerimientoId);
      return response;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const addRequerimientoRecurso = createAsyncThunk(
  'requerimientoRecurso/addRequerimientoRecurso',
  async (data: { requerimiento_id: string; recurso_id: string; cantidad: number }, { rejectWithValue }) => {
    try {
      const response = await addRequerimientoRecursoService(data);
      return response;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const deleteRequerimientoRecurso = createAsyncThunk(
  'requerimientoRecurso/deleteRequerimientoRecurso',
  async (id: string, { rejectWithValue }) => {
    try {
      await deleteRequerimientoRecursoService(id);
      return id;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

const requerimientoRecursoSlice = createSlice({
  name: 'requerimientoRecurso',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchRequerimientoRecursos.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRequerimientoRecursos.fulfilled, (state, action: PayloadAction<RequerimientoRecurso[]>) => {
        state.loading = false;
        state.requerimientoRecursos = action.payload;
      })
      .addCase(fetchRequerimientoRecursos.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(addRequerimientoRecurso.fulfilled, (state, action: PayloadAction<RequerimientoRecurso>) => {
        state.requerimientoRecursos.push(action.payload);
      })
      .addCase(deleteRequerimientoRecurso.fulfilled, (state, action: PayloadAction<string>) => {
        state.requerimientoRecursos = state.requerimientoRecursos.filter(
          (recurso) => recurso.id !== action.payload
        );
      });
  },
});

export const requerimientoRecursoReducer = requerimientoRecursoSlice.reducer;