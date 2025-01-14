import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { listTipoRecursoService, addTipoRecursoService, updateTipoRecursoService } from '../services/tipoRecursoService';

// Interfaces
interface TipoRecurso {
  id: string;
  nombre: string;
}

interface TipoRecursoState {
  tiposRecurso: TipoRecurso[];
  loading: boolean;
  error: string | null;
}

// Estado inicial
const initialState: TipoRecursoState = {
  tiposRecurso: [],
  loading: false,
  error: null,
};

// Función auxiliar para manejar errores
const handleError = (error: unknown): string => {
  if (error instanceof Error) return error.message;
  return String(error);
};

// Thunks
export const fetchTiposRecurso = createAsyncThunk(
  'tipoRecurso/fetchTiposRecurso',
  async (_, { rejectWithValue }) => {
    try {
      return await listTipoRecursoService();
    } catch (error) {
      return rejectWithValue(handleError(error));
    }
  }
);

export const addTipoRecurso = createAsyncThunk(
  'tipoRecurso/addTipoRecurso',
  async (tipoRecursoData: { nombre: string }, { rejectWithValue }) => {
    try {
      return await addTipoRecursoService(tipoRecursoData);
    } catch (error) {
      return rejectWithValue(handleError(error));
    }
  }
);

export const updateTipoRecurso = createAsyncThunk(
  'tipoRecurso/updateTipoRecurso',
  async (tipoRecurso: TipoRecurso, { rejectWithValue }) => {
    try {
      return await updateTipoRecursoService(tipoRecurso);      
    } catch (error) {
      return rejectWithValue(handleError(error));
    }
  }
);

// Slice
const tipoRecursoSlice = createSlice({
  name: 'tipoRecurso',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTiposRecurso.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTiposRecurso.fulfilled, (state, action: PayloadAction<TipoRecurso[]>) => {
        state.loading = false;
        state.tiposRecurso = action.payload;
      })
      .addCase(fetchTiposRecurso.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(addTipoRecurso.fulfilled, (state, action: PayloadAction<TipoRecurso>) => {
        state.tiposRecurso.push(action.payload);
      })
      .addCase(updateTipoRecurso.fulfilled, (state, action: PayloadAction<TipoRecurso>) => {
        const index = state.tiposRecurso.findIndex(tipoRecurso => tipoRecurso.id === action.payload.id);
        if (index !== -1) {
          state.tiposRecurso[index] = action.payload;
        }
      });
  },
});

export const tipoRecursoReducer = tipoRecursoSlice.reducer;