import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import * as preSolicitudAlmacenRecursoService from '../services/preSolicitudAlmacenRecursoService';

interface PreSolicitudAlmacenRecurso {
  id: string;
  pre_solicitud_almacen_id: string;
  recurso_id: string;
  cantidad: number;
}

interface PreSolicitudAlmacenRecursoState {
  recursos: PreSolicitudAlmacenRecurso[];
  loading: boolean;
  error: string | null;
}

const initialState: PreSolicitudAlmacenRecursoState = {
  recursos: [],
  loading: false,
  error: null,
};

export const fetchPreSolicitudAlmacenRecursos = createAsyncThunk(
  'preSolicitudAlmacenRecurso/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      return await preSolicitudAlmacenRecursoService.listPreSolicitudAlmacenRecursos();
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const fetchPreSolicitudAlmacenRecursosByPreSolicitudId = createAsyncThunk(
  'preSolicitudAlmacenRecurso/fetchByPreSolicitudId',
  async (preSolicitudAlmacenId: string, { rejectWithValue }) => {
    try {
      return await preSolicitudAlmacenRecursoService.listPreSolicitudAlmacenRecursosByPreSolicitudId(preSolicitudAlmacenId);
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const fetchPreSolicitudByRequerimiento = createAsyncThunk(
  'preSolicitudAlmacenRecurso/fetchByRequerimiento',
  async (requerimientoId: string, { rejectWithValue }) => {
    try {
      return await preSolicitudAlmacenRecursoService.findPreSolicitudByRequerimiento(requerimientoId);
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const addPreSolicitudAlmacenRecurso = createAsyncThunk(
  'preSolicitudAlmacenRecurso/add',
  async ({ preSolicitudAlmacenId, recursoId, cantidad }: { preSolicitudAlmacenId: string, recursoId: string, cantidad: number }, { rejectWithValue }) => {
    try {
      return await preSolicitudAlmacenRecursoService.addPreSolicitudAlmacenRecurso(preSolicitudAlmacenId, recursoId, cantidad);
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const updatePreSolicitudAlmacenRecurso = createAsyncThunk(
  'preSolicitudAlmacenRecurso/update',
  async ({ id, preSolicitudAlmacenId, recursoId, cantidad }: { id: string, preSolicitudAlmacenId?: string, recursoId?: string, cantidad?: number }, { rejectWithValue }) => {
    try {
      return await preSolicitudAlmacenRecursoService.updatePreSolicitudAlmacenRecurso(id, preSolicitudAlmacenId, recursoId, cantidad);
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const deletePreSolicitudAlmacenRecurso = createAsyncThunk(
  'preSolicitudAlmacenRecurso/delete',
  async (id: string, { rejectWithValue }) => {
    try {
      await preSolicitudAlmacenRecursoService.deletePreSolicitudAlmacenRecurso(id);
      return id;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

const preSolicitudAlmacenRecursoSlice = createSlice({
  name: 'preSolicitudAlmacenRecurso',
  initialState,
  reducers: {
    clearErrors: (state) => {
      state.error = null;
    },
    clearRecursos: (state) => {
      state.recursos = [];
    },
    updateCantidad: (state, action: PayloadAction<{ id: string; cantidad: number }>) => {
      const { id, cantidad } = action.payload;
      const recurso = state.recursos.find(r => r.id === id);
      if (recurso) {
        recurso.cantidad = cantidad;
      }
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    addRecurso: (state, action: PayloadAction<PreSolicitudAlmacenRecurso>) => {
      state.recursos.push(action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch cases
      .addCase(fetchPreSolicitudAlmacenRecursos.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchPreSolicitudAlmacenRecursos.fulfilled, (state, action: PayloadAction<PreSolicitudAlmacenRecurso[]>) => {
        state.loading = false;
        state.recursos = action.payload;
        state.error = null;
      })
      .addCase(fetchPreSolicitudAlmacenRecursos.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || null;
      })
      // Casos para fetchPreSolicitudAlmacenRecursosByPreSolicitudId
      .addCase(fetchPreSolicitudAlmacenRecursosByPreSolicitudId.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchPreSolicitudAlmacenRecursosByPreSolicitudId.fulfilled, (state, action: PayloadAction<PreSolicitudAlmacenRecurso[]>) => {
        state.loading = false;
        state.recursos = action.payload;
        state.error = null;
      })
      .addCase(fetchPreSolicitudAlmacenRecursosByPreSolicitudId.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Casos para fetchPreSolicitudByRequerimiento
      .addCase(fetchPreSolicitudByRequerimiento.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchPreSolicitudByRequerimiento.fulfilled, (state, action) => {
        state.loading = false;
        state.recursos = action.payload.recursos;
        state.error = null;
      })
      .addCase(fetchPreSolicitudByRequerimiento.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Add cases
      .addCase(addPreSolicitudAlmacenRecurso.fulfilled, (state, action) => {
        state.recursos.push(action.payload);
        state.error = null;
      })
      // Update cases
      .addCase(updatePreSolicitudAlmacenRecurso.fulfilled, (state, action) => {
        const index = state.recursos.findIndex(r => r.id === action.payload.id);
        if (index !== -1) {
          state.recursos[index] = action.payload;
        }
        state.error = null;
      })
      // Delete cases
      .addCase(deletePreSolicitudAlmacenRecurso.fulfilled, (state, action) => {
        state.recursos = state.recursos.filter(r => r.id !== action.payload);
        state.error = null;
      });
  },
});

export const { 
  clearErrors, 
  clearRecursos, 
  updateCantidad, 
  setLoading, 
  setError,
  addRecurso 
} = preSolicitudAlmacenRecursoSlice.actions;
export const preSolicitudAlmacenRecursoReducer = preSolicitudAlmacenRecursoSlice.reducer;