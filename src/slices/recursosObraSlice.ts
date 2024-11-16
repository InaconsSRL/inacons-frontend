import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { 
  listRecursosObraService, 
  listRecursosObraPorObraService,
  addRecursoObraService, 
  updateRecursoObraService, 
  deleteRecursoObraService 
} from '../services/recursosObraService';

interface RecursoObra {
  id: string;
  obra_id: string;
  recurso_id: string;
  cantidad: number;
  costo: number;
  bodega_id: string;
}

interface RecursosObraState {
  recursosObra: RecursoObra[];
  loading: boolean;
  error: string | null;
}

const initialState: RecursosObraState = {
  recursosObra: [],
  loading: false,
  error: null,
};

export const fetchRecursosObra = createAsyncThunk(
  'recursosObra/fetchRecursosObra',
  async (_, { rejectWithValue }) => {
    try {
      return await listRecursosObraService();
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const fetchRecursosObraPorObra = createAsyncThunk(
  'recursosObra/fetchRecursosObraPorObra',
  async (obraId: string, { rejectWithValue }) => {
    try {
      return await listRecursosObraPorObraService(obraId);
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const addRecursoObra = createAsyncThunk(
  'recursosObra/addRecursoObra',
  async (data: Omit<RecursoObra, 'id'>, { rejectWithValue }) => {
    try {
      return await addRecursoObraService(data);
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const updateRecursoObra = createAsyncThunk(
  'recursosObra/updateRecursoObra',
  async (data: Partial<RecursoObra> & { id: string }, { rejectWithValue }) => {
    try {
      return await updateRecursoObraService(data);
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const deleteRecursoObra = createAsyncThunk(
  'recursosObra/deleteRecursoObra',
  async (id: string, { rejectWithValue }) => {
    try {
      await deleteRecursoObraService(id);
      return { id };
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

const recursosObraSlice = createSlice({
  name: 'recursosObra',
  initialState,
  reducers: {
    clearErrors: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchRecursosObra.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchRecursosObra.fulfilled, (state, action) => {
        state.recursosObra = action.payload;
        state.loading = false;
      })
      .addCase(fetchRecursosObraPorObra.fulfilled, (state, action) => {
        state.recursosObra = action.payload;
        state.loading = false;
      })
      .addCase(addRecursoObra.fulfilled, (state, action) => {
        state.recursosObra.push(action.payload);
      })
      .addCase(updateRecursoObra.fulfilled, (state, action) => {
        const index = state.recursosObra.findIndex(item => item.id === action.payload.id);
        if (index !== -1) {
          state.recursosObra[index] = action.payload;
        }
      })
      .addCase(deleteRecursoObra.fulfilled, (state, action) => {
        state.recursosObra = state.recursosObra.filter(item => item.id !== action.payload.id);
      });
  }
});

export const { clearErrors } = recursosObraSlice.actions;
export const recursosObraReducer = recursosObraSlice.reducer;