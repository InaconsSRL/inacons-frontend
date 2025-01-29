import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import {
  listPreciosRecursoProyectoService,
  getPreciosByRecursoComposicionApuService,
  getPrecioRecursoProyectoService,
  addPrecioRecursoProyectoService,
  updatePrecioRecursoProyectoService,
  deletePrecioRecursoProyectoService
} from '../services/precioRecursoProyectoService';

export interface PrecioRecursoProyecto {
  id_prp: string;
  id_proyecto: string;
  id_rec_comp_apu: string;
  precio: number;
  fecha_creacion: string;
}

interface PrecioRecursoProyectoState {
  preciosRecursoProyecto: PrecioRecursoProyecto[];
  selectedPrecioRecursoProyecto: PrecioRecursoProyecto | null;
  preciosByRecurso: PrecioRecursoProyecto[];
  loading: boolean;
  error: string | null;
}

const initialState: PrecioRecursoProyectoState = {
  preciosRecursoProyecto: [],
  selectedPrecioRecursoProyecto: null,
  preciosByRecurso: [],
  loading: false,
  error: null,
};

export const fetchPreciosRecursoProyecto = createAsyncThunk(
  'precioRecursoProyecto/fetchPreciosRecursoProyecto',
  async (_, { rejectWithValue }) => {
    try {
      return await listPreciosRecursoProyectoService();
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const getPreciosByRecursoComposicionApu = createAsyncThunk(
  'precioRecursoProyecto/getPreciosByRecursoComposicionApu',
  async (id_rec_comp_apu: string, { rejectWithValue }) => {
    try {
      return await getPreciosByRecursoComposicionApuService(id_rec_comp_apu);
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const getPrecioRecursoProyecto = createAsyncThunk(
  'precioRecursoProyecto/getPrecioRecursoProyecto',
  async (id: string, { rejectWithValue }) => {
    try {
      return await getPrecioRecursoProyectoService(id);
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const addPrecioRecursoProyecto = createAsyncThunk(
  'precioRecursoProyecto/addPrecioRecursoProyecto',
  async (data: { id_proyecto: string; id_rec_comp_apu: string; precio: number }, { rejectWithValue }) => {
    try {
      return await addPrecioRecursoProyectoService(data);
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const updatePrecioRecursoProyecto = createAsyncThunk(
  'precioRecursoProyecto/updatePrecioRecursoProyecto',
  async (data: { id_prp: string; precio: number }, { rejectWithValue }) => {
    try {
      return await updatePrecioRecursoProyectoService(data);
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const deletePrecioRecursoProyecto = createAsyncThunk(
  'precioRecursoProyecto/deletePrecioRecursoProyecto',
  async (id: string, { rejectWithValue }) => {
    try {
      return await deletePrecioRecursoProyectoService(id);
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

const precioRecursoProyectoSlice = createSlice({
  name: 'precioRecursoProyecto',
  initialState,
  reducers: {
    clearErrors: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch PreciosRecursoProyecto
      .addCase(fetchPreciosRecursoProyecto.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPreciosRecursoProyecto.fulfilled, (state, action: PayloadAction<PrecioRecursoProyecto[]>) => {
        state.loading = false;
        state.preciosRecursoProyecto = action.payload;
      })
      .addCase(fetchPreciosRecursoProyecto.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Get PreciosByRecursoComposicionApu
      .addCase(getPreciosByRecursoComposicionApu.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getPreciosByRecursoComposicionApu.fulfilled, (state, action: PayloadAction<PrecioRecursoProyecto[]>) => {
        state.loading = false;
        state.preciosByRecurso = action.payload;
      })
      .addCase(getPreciosByRecursoComposicionApu.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Get PrecioRecursoProyecto
      .addCase(getPrecioRecursoProyecto.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getPrecioRecursoProyecto.fulfilled, (state, action: PayloadAction<PrecioRecursoProyecto>) => {
        state.loading = false;
        state.selectedPrecioRecursoProyecto = action.payload;
      })
      .addCase(getPrecioRecursoProyecto.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Add PrecioRecursoProyecto
      .addCase(addPrecioRecursoProyecto.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addPrecioRecursoProyecto.fulfilled, (state, action: PayloadAction<PrecioRecursoProyecto>) => {
        state.loading = false;
        state.preciosRecursoProyecto.push(action.payload);
      })
      .addCase(addPrecioRecursoProyecto.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Update PrecioRecursoProyecto
      .addCase(updatePrecioRecursoProyecto.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updatePrecioRecursoProyecto.fulfilled, (state, action: PayloadAction<PrecioRecursoProyecto>) => {
        state.loading = false;
        const index = state.preciosRecursoProyecto.findIndex(p => p.id_prp === action.payload.id_prp);
        if (index !== -1) {
          state.preciosRecursoProyecto[index] = action.payload;
        }
      })
      .addCase(updatePrecioRecursoProyecto.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Delete PrecioRecursoProyecto
      .addCase(deletePrecioRecursoProyecto.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deletePrecioRecursoProyecto.fulfilled, (state, action: PayloadAction<{ id_prp: string }>) => {
        state.loading = false;
        state.preciosRecursoProyecto = state.preciosRecursoProyecto.filter(p => p.id_prp !== action.payload.id_prp);
      })
      .addCase(deletePrecioRecursoProyecto.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearErrors } = precioRecursoProyectoSlice.actions;
export default precioRecursoProyectoSlice.reducer;
