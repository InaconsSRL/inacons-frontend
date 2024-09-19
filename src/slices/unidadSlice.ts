import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { listUnidadService, addUnidadService, updateUnidadService } from '../services/unidadService';

// Interfaces
interface Unidad {
  id: string;
  nombre: string;
}

interface UnidadState {
  unidades: Unidad[];
  loading: boolean;
  error: string | null;
}

// Estado inicial
const initialState: UnidadState = {
  unidades: [],
  loading: false,
  error: null,
};

// Función auxiliar para manejar errores
const handleError = (error: unknown): string => {
  if (error instanceof Error) return error.message;
  return String(error);
};

// Thunks
export const fetchUnidades = createAsyncThunk(
  'unidad/fetchUnidades',
  async (_, { rejectWithValue }) => {
    try {
      return await listUnidadService();
    } catch (error) {
      return rejectWithValue(handleError(error));
    }
  }
);

export const addUnidad = createAsyncThunk(
  'unidad/addUnidad',
  async (unidadData: { nombre: string }, { rejectWithValue }) => {
    try {
      return await addUnidadService(unidadData);
    } catch (error) {
      return rejectWithValue(handleError(error));
    }
  }
);

export const updateUnidad = createAsyncThunk(
  'unidad/updateUnidad',
  async (unidad: Unidad, { rejectWithValue }) => {
    try {
      return await updateUnidadService(unidad);
    } catch (error) {
      return rejectWithValue(handleError(error));
    }
  }
);

// Slice
const unidadSlice = createSlice({
  name: 'unidad',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUnidades.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUnidades.fulfilled, (state, action: PayloadAction<Unidad[]>) => {
        state.loading = false;
        state.unidades = action.payload;
      })
      .addCase(fetchUnidades.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(addUnidad.fulfilled, (state, action: PayloadAction<Unidad>) => {
        state.unidades.push(action.payload);
      })
      .addCase(updateUnidad.fulfilled, (state, action: PayloadAction<Unidad>) => {
        const index = state.unidades.findIndex(unidad => unidad.id === action.payload.id);
        if (index !== -1) {
          state.unidades[index] = action.payload;
        }
      });
  },
});

export const unidadReducer = unidadSlice.reducer;