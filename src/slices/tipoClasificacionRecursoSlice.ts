import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { listClasificacionesRecursoService, addClasificacionRecursoService, updateClasificacionRecursoService } from '../services/tipoClasificacionRecursoService';

// Interfaces
interface ClasificacionRecurso {
  id: string;
  nombre: string;
  parentId: string | null;
}

interface ClasificacionRecursoState {
  clasificacionesRecurso: ClasificacionRecurso[];
  loading: boolean;
  error: string | null;
}

// Estado inicial
const initialState: ClasificacionRecursoState = {
  clasificacionesRecurso: [],
  loading: false,
  error: null,
};

// Función auxiliar para manejar errores
const handleError = (error: unknown): string => {
  if (error instanceof Error) return error.message;
  return String(error);
};

// Thunks
export const fetchClasificacionesRecurso = createAsyncThunk(
  'clasificacionRecurso/fetchClasificacionesRecurso',
  async (_, { rejectWithValue }) => {
    try {
      return await listClasificacionesRecursoService();
    } catch (error) {
      return rejectWithValue(handleError(error));
    }
  }
);

export const addClasificacionRecurso = createAsyncThunk(
  'clasificacionRecurso/addClasificacionRecurso',
  async (clasificacionRecursoData: { nombre: string; parentId: string | null }, { rejectWithValue }) => {
    try {
      return await addClasificacionRecursoService(clasificacionRecursoData);
    } catch (error) {
      return rejectWithValue(handleError(error));
    }
  }
);

export const updateClasificacionRecurso = createAsyncThunk(
  'clasificacionRecurso/updateClasificacionRecurso',
  async (clasificacionRecurso: ClasificacionRecurso, { rejectWithValue }) => {
    try {
      return await updateClasificacionRecursoService(clasificacionRecurso);
    } catch (error) {
      return rejectWithValue(handleError(error));
    }
  }
);

// Slice
const tipoClasificacionRecursoSlice = createSlice({
  name: 'clasificacionRecurso',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchClasificacionesRecurso.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchClasificacionesRecurso.fulfilled, (state, action: PayloadAction<ClasificacionRecurso[]>) => {
        state.loading = false;
        state.clasificacionesRecurso = action.payload;
      })
      .addCase(fetchClasificacionesRecurso.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(addClasificacionRecurso.fulfilled, (state, action: PayloadAction<ClasificacionRecurso>) => {
        state.clasificacionesRecurso.push(action.payload);
      })
      .addCase(updateClasificacionRecurso.fulfilled, (state, action: PayloadAction<ClasificacionRecurso>) => {
        const index = state.clasificacionesRecurso.findIndex(clasificacionRecurso => clasificacionRecurso.id === action.payload.id);
        if (index !== -1) {
          state.clasificacionesRecurso[index] = action.payload;
        }
      });
  },
});

export const tipoClasificacionRecursoReducer = tipoClasificacionRecursoSlice.reducer;