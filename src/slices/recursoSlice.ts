import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { listRecursosService, addRecursoService, updateRecursoService } from '../services/recursoService';

// Interfaces
interface Recurso {
  id: string;
  codigo: string;
  nombre: string;
  descripcion: string;
  fecha: string;
  cantidad: number;
  unidad_id: string;
  precio_actual: number;
  presupuesto: boolean;
  tipo_recurso_id: string;
  clasificacion_recurso_id: string;
}

interface RecursoState {
  recursos: Recurso[];
  loading: boolean;
  error: string | null;
}

// Estado inicial
const initialState: RecursoState = {
  recursos: [],
  loading: false,
  error: null,
};

// Función auxiliar para manejar errores
const handleError = (error: unknown): string => {
  if (error instanceof Error) return handleError(error);
  return String(error);
};

// Thunks
export const fetchRecursos = createAsyncThunk(
  'recurso/fetchRecursos',
  async (_, { rejectWithValue }) => {
    try {
      return await listRecursosService();
    } catch (error) {
      return rejectWithValue(handleError(error));
    }
  }
);

export const addRecurso = createAsyncThunk(
  'recurso/addRecurso',
  async (recursoData: Omit<Recurso, 'id' | 'fecha'>, { rejectWithValue }) => {
    try {
      return await addRecursoService(recursoData);
    } catch (error) {
      return rejectWithValue(handleError(error));
    }
  }
);

export const updateRecurso = createAsyncThunk(
  'recurso/updateRecurso',
  async (recursoData: Recurso, { rejectWithValue }) => {
    try {
      return await updateRecursoService(recursoData);
    } catch (error) {
      return rejectWithValue(handleError(error));
    }
  }
);

// Slice
const recursoSlice = createSlice({
  name: 'recurso',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchRecursos.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRecursos.fulfilled, (state, action: PayloadAction<Recurso[]>) => {
        state.loading = false;
        state.recursos = action.payload;
      })
      .addCase(fetchRecursos.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(addRecurso.fulfilled, (state, action: PayloadAction<Recurso>) => {
        state.recursos.push(action.payload);
      })
      .addCase(updateRecurso.fulfilled, (state, action: PayloadAction<Recurso>) => {
        const index = state.recursos.findIndex(recurso => recurso.id === action.payload.id);
        if (index !== -1) {
          state.recursos[index] = action.payload;
        }
      });
  },
});

export const recursoReducer = recursoSlice.reducer;