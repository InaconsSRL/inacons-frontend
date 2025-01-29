import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import {
  listTiposService,
  getTipoService,
  addTipoService,
  updateTipoService,
  deleteTipoService
} from '../services/tipoService';

interface Tipo {
  id_tipo: string;
  descripcion: string;
  codigo: string;
}

interface TipoState {
  tipos: Tipo[];
  selectedTipo: Tipo | null;
  loading: boolean;
  error: string | null;
}

const initialState: TipoState = {
  tipos: [],
  selectedTipo: null,
  loading: false,
  error: null,
};

export const fetchTipos = createAsyncThunk(
  'tipo/fetchTipos',
  async (_, { rejectWithValue }) => {
    try {
      return await listTiposService();
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const getTipo = createAsyncThunk(
  'tipo/getTipo',
  async (id: string, { rejectWithValue }) => {
    try {
      return await getTipoService(id);
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const addTipo = createAsyncThunk(
  'tipo/addTipo',
  async (data: { descripcion: string; codigo: string }, { rejectWithValue }) => {
    try {
      return await addTipoService(data);
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const updateTipo = createAsyncThunk(
  'tipo/updateTipo',
  async (data: { id_tipo: string; descripcion?: string; codigo?: string }, { rejectWithValue }) => {
    try {
      return await updateTipoService(data);
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const deleteTipo = createAsyncThunk(
  'tipo/deleteTipo',
  async (id: string, { rejectWithValue }) => {
    try {
      return await deleteTipoService(id);
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

const tipoSlice = createSlice({
  name: 'tipo',
  initialState,
  reducers: {
    clearErrors: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTipos.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTipos.fulfilled, (state, action: PayloadAction<Tipo[]>) => {
        state.loading = false;
        state.tipos = action.payload;
      })
      .addCase(fetchTipos.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(getTipo.fulfilled, (state, action: PayloadAction<Tipo>) => {
        state.loading = false;
        state.selectedTipo = action.payload;
      })
      .addCase(addTipo.fulfilled, (state, action: PayloadAction<Tipo>) => {
        state.loading = false;
        state.tipos.push(action.payload);
      })
      .addCase(updateTipo.fulfilled, (state, action: PayloadAction<Tipo>) => {
        state.loading = false;
        const index = state.tipos.findIndex(tipo => tipo.id_tipo === action.payload.id_tipo);
        if (index !== -1) {
          state.tipos[index] = action.payload;
        }
      })
      .addCase(deleteTipo.fulfilled, (state, action: PayloadAction<{ id_tipo: string }>) => {
        state.loading = false;
        state.tipos = state.tipos.filter(tipo => tipo.id_tipo !== action.payload.id_tipo);
      });
  },
});

export const { clearErrors } = tipoSlice.actions;
export const tipoReducer = tipoSlice.reducer;
