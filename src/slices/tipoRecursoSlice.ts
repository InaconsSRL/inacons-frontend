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

// Thunks
export const fetchTiposRecurso = createAsyncThunk(
  'tipoRecurso/fetchTiposRecurso',
  async (_, { rejectWithValue }) => {
    try {
      return await listTipoRecursoService();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const addTipoRecurso = createAsyncThunk(
  'tipoRecurso/addTipoRecurso',
  async (tipoRecursoData: { nombre: string }, { rejectWithValue }) => {
    try {
      console.log(tipoRecursoData)
      return await addTipoRecursoService(tipoRecursoData);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateTipoRecurso = createAsyncThunk(
  'tipoRecurso/updateTipoRecurso',
  async (tipoRecurso: TipoRecurso, { rejectWithValue }) => {
    try {
      
      console.log(tipoRecurso)
      return await updateTipoRecursoService(tipoRecurso);      
    } catch (error) {
      return rejectWithValue(error.message);
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
        console.log(state)
      })
      .addCase(updateTipoRecurso.fulfilled, (state, action: PayloadAction<TipoRecurso>) => {
        console.log(state)
        const index = state.tiposRecurso.findIndex(tipoRecurso => tipoRecurso.id === action.payload.id);
        if (index !== -1) {
          state.tiposRecurso[index] = action.payload;
        }
      });
  },
});

export const tipoRecursoReducer = tipoRecursoSlice.reducer;