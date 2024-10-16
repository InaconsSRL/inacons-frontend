import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { listTipoCostoRecursoService, addTipoCostoRecursoService, updateTipoCostoRecursoService } from '../services/tipoCostoRecursoService';

interface TipoCostoRecurso {
  id: string;
  nombre: string;
}

interface TipoCostoRecursoState {
  tipoCostoRecursos: TipoCostoRecurso[];
  loading: boolean;
  error: string | null;
}

const initialState: TipoCostoRecursoState = {
  tipoCostoRecursos: [],
  loading: false,
  error: null,
};

const handleError = (error: unknown): string => {
  if (error instanceof Error) return error.message;
  return String(error);
};

export const fetchTipoCostoRecursos = createAsyncThunk(
  'tipoCostoRecurso/fetchTipoCostoRecursos',
  async (_, { rejectWithValue }) => {
    try {
      return await listTipoCostoRecursoService();
    } catch (error) {
      return rejectWithValue(handleError(error));
    }
  }
);

export const addTipoCostoRecurso = createAsyncThunk(
  'tipoCostoRecurso/addTipoCostoRecurso',
  async (tipoCostoRecursoData: { nombre: string }, { rejectWithValue }) => {
    try {
      return await addTipoCostoRecursoService(tipoCostoRecursoData);
    } catch (error) {
      return rejectWithValue(handleError(error));
    }
  }
);

export const updateTipoCostoRecurso = createAsyncThunk(
  'tipoCostoRecurso/updateTipoCostoRecurso',
  async (tipoCostoRecurso: TipoCostoRecurso, { rejectWithValue }) => {
    try {
      return await updateTipoCostoRecursoService(tipoCostoRecurso);
    } catch (error) {
      return rejectWithValue(handleError(error));
    }
  }
);

const tipoCostoRecursoSlice = createSlice({
  name: 'tipoCostoRecurso',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTipoCostoRecursos.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTipoCostoRecursos.fulfilled, (state, action: PayloadAction<TipoCostoRecurso[]>) => {
        state.loading = false;
        state.tipoCostoRecursos = action.payload;
      })
      .addCase(fetchTipoCostoRecursos.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(addTipoCostoRecurso.fulfilled, (state, action: PayloadAction<TipoCostoRecurso>) => {
        state.loading = false;
        state.tipoCostoRecursos.push(action.payload);
      })
      .addCase(addTipoCostoRecurso.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(updateTipoCostoRecurso.fulfilled, (state, action: PayloadAction<TipoCostoRecurso>) => {
        state.loading = false;
        const index = state.tipoCostoRecursos.findIndex(tipoCostoRecurso => tipoCostoRecurso.id === action.payload.id);
        if (index !== -1) {
          state.tipoCostoRecursos[index] = action.payload;
        }
      })
      .addCase(updateTipoCostoRecurso.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const tipoCostoRecursoReducer = tipoCostoRecursoSlice.reducer;
