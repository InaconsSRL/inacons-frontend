import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import {
  listMovilidadesService,
  addMovilidadService,
  updateMovilidadService,
  deleteMovilidadService
} from '../services/movilidadService';

interface Movilidad {
  id: string;
  denominacion: string;
  descripcion?: string;
}

interface MovilidadState {
  movilidades: Movilidad[];
  loading: boolean;
  error: string | null;
}

const initialState: MovilidadState = {
  movilidades: [],
  loading: false,
  error: null,
};

export const fetchMovilidades = createAsyncThunk(
  'movilidad/fetchMovilidades',
  async (_, { rejectWithValue }) => {
    try {
      return await listMovilidadesService();
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const addMovilidad = createAsyncThunk(
  'movilidad/addMovilidad',
  async (movilidadData: { denominacion: string; descripcion?: string }, { rejectWithValue }) => {
    try {
      return await addMovilidadService(movilidadData);
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const updateMovilidad = createAsyncThunk(
  'movilidad/updateMovilidad',
  async ({ id, data }: { id: string; data: Partial<Movilidad> }, { rejectWithValue }) => {
    try {
      return await updateMovilidadService(id, data);
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const deleteMovilidad = createAsyncThunk(
  'movilidad/deleteMovilidad',
  async (id: string, { rejectWithValue }) => {
    try {
      await deleteMovilidadService(id);
      return id;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

const movilidadSlice = createSlice({
  name: 'movilidad',
  initialState,
  reducers: {
    clearErrors: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMovilidades.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMovilidades.fulfilled, (state, action: PayloadAction<Movilidad[]>) => {
        state.loading = false;
        state.movilidades = action.payload;
      })
      .addCase(fetchMovilidades.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(addMovilidad.fulfilled, (state, action: PayloadAction<Movilidad>) => {
        state.movilidades.push(action.payload);
      })
      .addCase(updateMovilidad.fulfilled, (state, action: PayloadAction<Movilidad>) => {
        const index = state.movilidades.findIndex(mov => mov.id === action.payload.id);
        if (index !== -1) {
          state.movilidades[index] = action.payload;
        }
      })
      .addCase(deleteMovilidad.fulfilled, (state, action: PayloadAction<string>) => {
        state.movilidades = state.movilidades.filter(mov => mov.id !== action.payload);
      });
  },
});

export const { clearErrors } = movilidadSlice.actions;
export const movilidadReducer = movilidadSlice.reducer;
