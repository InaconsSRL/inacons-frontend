import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { listOrdenCompraRecursosService, addOrdenCompraRecursoService, updateOrdenCompraRecursoService, deleteOrdenCompraRecursoService } from '../services/ordenCompraRecursosService';

interface OrdenCompraRecurso {
  id: string;
  orden_compra_id: string;
  id_recurso: string;
  costo_real: number;
  costo_aproximado: number;
  estado: string;
}

interface OrdenCompraRecursoState {
  ordenCompraRecursos: OrdenCompraRecurso[];
  loading: boolean;
  error: string | null;
}

const initialState: OrdenCompraRecursoState = {
  ordenCompraRecursos: [],
  loading: false,
  error: null,
};

const handleError = (error: unknown): string => {
  if (error instanceof Error) return error.message;
  return String(error);
};

export const fetchOrdenCompraRecursos = createAsyncThunk(
  'ordenCompraRecursos/fetchOrdenCompraRecursos',
  async (_, { rejectWithValue }) => {
    try {
      return await listOrdenCompraRecursosService();
    } catch (error) {
      return rejectWithValue(handleError(error));
    }
  }
);

export const addOrdenCompraRecurso = createAsyncThunk(
  'ordenCompraRecursos/addOrdenCompraRecurso',
  async (data: Omit<OrdenCompraRecurso, 'id'>, { rejectWithValue }) => {
    try {
      return await addOrdenCompraRecursoService(data);
    } catch (error) {
      return rejectWithValue(handleError(error));
    }
  }
);

export const updateOrdenCompraRecurso = createAsyncThunk(
  'ordenCompraRecursos/updateOrdenCompraRecurso',
  async (data: OrdenCompraRecurso, { rejectWithValue }) => {
    try {
      return await updateOrdenCompraRecursoService(data);
    } catch (error) {
      return rejectWithValue(handleError(error));
    }
  }
);

export const deleteOrdenCompraRecurso = createAsyncThunk(
  'ordenCompraRecursos/deleteOrdenCompraRecurso',
  async (id: string, { rejectWithValue }) => {
    try {
      return await deleteOrdenCompraRecursoService(id);
    } catch (error) {
      return rejectWithValue(handleError(error));
    }
  }
);

const ordenCompraRecursosSlice = createSlice({
  name: 'ordenCompraRecursos',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrdenCompraRecursos.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrdenCompraRecursos.fulfilled, (state, action: PayloadAction<OrdenCompraRecurso[]>) => {
        state.loading = false;
        state.ordenCompraRecursos = action.payload;
      })
      .addCase(fetchOrdenCompraRecursos.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(addOrdenCompraRecurso.fulfilled, (state, action: PayloadAction<OrdenCompraRecurso>) => {
        state.ordenCompraRecursos.push(action.payload);
      })
      .addCase(updateOrdenCompraRecurso.fulfilled, (state, action: PayloadAction<OrdenCompraRecurso>) => {
        const index = state.ordenCompraRecursos.findIndex(item => item.id === action.payload.id);
        if (index !== -1) {
          state.ordenCompraRecursos[index] = action.payload;
        }
      })
      .addCase(deleteOrdenCompraRecurso.fulfilled, (state, action: PayloadAction<{ id: string }>) => {
        state.ordenCompraRecursos = state.ordenCompraRecursos.filter(item => item.id !== action.payload.id);
      });
  },
});

export const ordenCompraRecursosReducer = ordenCompraRecursosSlice.reducer;
