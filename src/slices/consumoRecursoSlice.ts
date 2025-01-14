import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import {
  listConsumoRecursosService,
  addConsumoRecursoService,
  updateConsumoRecursoService,
  deleteConsumoRecursoService,
  listConsumoRecursosByConsumoIdService,
} from '../services/consumoRecursoService';
import {
  ConsumoRecursoResponse,
  ConsumoRecursoState,
  AddConsumoRecursoInput,
  UpdateConsumoRecursoInput
} from '../types/consumoRecurso';

const initialState: ConsumoRecursoState = {
  consumoRecursos: [],
  loading: false,
  error: null,
};

export const fetchConsumoRecursos = createAsyncThunk(
  'consumoRecursos/fetchConsumoRecursos',
  async (_, { rejectWithValue }) => {
    try {
      return await listConsumoRecursosService();
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Error desconocido');
    }
  }
);

export const fetchConsumoRecursosByConsumoId = createAsyncThunk(
  'consumoRecursos/fetchConsumoRecursosByConsumoId',
  async (consumoId: string, { rejectWithValue }) => {
    try {
      return await listConsumoRecursosByConsumoIdService(consumoId);
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Error desconocido');
    }
  }
);

export const addConsumoRecurso = createAsyncThunk(
  'consumoRecursos/addConsumoRecurso',
  async (consumoRecursoData: AddConsumoRecursoInput, { rejectWithValue }) => {
    try {
      return await addConsumoRecursoService(consumoRecursoData);
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Error desconocido');
    }
  }
);

export const updateConsumoRecurso = createAsyncThunk(
  'consumoRecursos/updateConsumoRecurso',
  async (consumoRecursoData: UpdateConsumoRecursoInput, { rejectWithValue }) => {
    try {
      return await updateConsumoRecursoService(consumoRecursoData);
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Error desconocido');
    }
  }
);

export const deleteConsumoRecurso = createAsyncThunk(
  'consumoRecursos/deleteConsumoRecurso',
  async (id: string, { rejectWithValue }) => {
    try {
      return await deleteConsumoRecursoService(id);
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Error desconocido');
    }
  }
);

const consumoRecursoSlice = createSlice({
  name: 'consumoRecursos',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchConsumoRecursos.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchConsumoRecursos.fulfilled, (state, action: PayloadAction<ConsumoRecursoResponse[]>) => {
        state.loading = false;
        state.consumoRecursos = action.payload;
      })
      .addCase(fetchConsumoRecursos.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(addConsumoRecurso.fulfilled, (state, action: PayloadAction<ConsumoRecursoResponse>) => {
        state.consumoRecursos.push(action.payload);
      })
      .addCase(updateConsumoRecurso.fulfilled, (state, action: PayloadAction<ConsumoRecursoResponse>) => {
        const index = state.consumoRecursos.findIndex(cr => cr.id === action.payload.id);
        if (index !== -1) {
          state.consumoRecursos[index] = action.payload;
        }
      })
      .addCase(deleteConsumoRecurso.fulfilled, (state, action: PayloadAction<string>) => {
        state.consumoRecursos = state.consumoRecursos.filter(cr => cr.id !== action.payload);
      });
  },
});

export const consumoRecursoReducer = consumoRecursoSlice.reducer;

