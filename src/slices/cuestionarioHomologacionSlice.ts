import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { 
  listCuestionariosHomologacionService, 
  addCuestionarioHomologacionService,
  updateCuestionarioHomologacionService,
  deleteCuestionarioHomologacionService
} from '../services/cuestionarioHomologacionService';

export interface CuestionarioHomologacion {
  id: string;
  denominacion: string;
}

interface CuestionarioHomologacionState {
  cuestionarios: CuestionarioHomologacion[];
  loading: boolean;
  error: string | null;
}

const initialState: CuestionarioHomologacionState = {
  cuestionarios: [],
  loading: false,
  error: null,
};

export const fetchCuestionarios = createAsyncThunk(
  'cuestionarioHomologacion/fetchCuestionarios',
  async (_, { rejectWithValue }) => {
    try {
      return await listCuestionariosHomologacionService();
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const addCuestionario = createAsyncThunk(
  'cuestionarioHomologacion/addCuestionario',
  async (denominacion: string, { rejectWithValue }) => {
    try {
      return await addCuestionarioHomologacionService(denominacion);
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const updateCuestionario = createAsyncThunk(
  'cuestionarioHomologacion/updateCuestionario',
  async ({ id, denominacion }: { id: string, denominacion: string }, { rejectWithValue }) => {
    try {
      return await updateCuestionarioHomologacionService(id, denominacion);
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const deleteCuestionario = createAsyncThunk(
  'cuestionarioHomologacion/deleteCuestionario',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await deleteCuestionarioHomologacionService(id);
      return response;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

const cuestionarioHomologacionSlice = createSlice({
  name: 'cuestionarioHomologacion',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCuestionarios.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCuestionarios.fulfilled, (state, action: PayloadAction<CuestionarioHomologacion[]>) => {
        state.loading = false;
        state.cuestionarios = action.payload;
      })
      .addCase(fetchCuestionarios.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(addCuestionario.fulfilled, (state, action: PayloadAction<CuestionarioHomologacion>) => {
        state.cuestionarios.push(action.payload);
      })
      .addCase(updateCuestionario.fulfilled, (state, action: PayloadAction<CuestionarioHomologacion>) => {
        const index = state.cuestionarios.findIndex(c => c.id === action.payload.id);
        if (index !== -1) {
          state.cuestionarios[index] = action.payload;
        }
      })
      .addCase(deleteCuestionario.fulfilled, (state, action: PayloadAction<CuestionarioHomologacion>) => {
        state.cuestionarios = state.cuestionarios.filter(c => c.id !== action.payload.id);
      });
  },
});

export const cuestionarioHomologacionReducer = cuestionarioHomologacionSlice.reducer;