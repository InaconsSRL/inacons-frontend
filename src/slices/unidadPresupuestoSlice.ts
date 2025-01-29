import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import {
  listUnidadesPresupuestoService,
  getUnidadPresupuestoService,
  addUnidadPresupuestoService,
  updateUnidadPresupuestoService,
  deleteUnidadPresupuestoService
} from '../services/unidadPresupuestoService';

interface UnidadPresupuesto {
  id_unidad: string;
  abreviatura_unidad: string;
  descripcion: string;
}

interface UnidadPresupuestoState {
  unidadesPresupuesto: UnidadPresupuesto[];
  selectedUnidadPresupuesto: UnidadPresupuesto | null;
  loading: boolean;
  error: string | null;
}

const initialState: UnidadPresupuestoState = {
  unidadesPresupuesto: [],
  selectedUnidadPresupuesto: null,
  loading: false,
  error: null,
};

export const fetchUnidadesPresupuesto = createAsyncThunk(
  'unidadPresupuesto/fetchUnidadesPresupuesto',
  async (_, { rejectWithValue }) => {
    try {
      return await listUnidadesPresupuestoService();
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const getUnidadPresupuesto = createAsyncThunk(
  'unidadPresupuesto/getUnidadPresupuesto',
  async (id: string, { rejectWithValue }) => {
    try {
      return await getUnidadPresupuestoService(id);
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

// Renombrar para consistencia
interface CreateUnidadPresupuestoInput {
  abreviatura_unidad: string;
  descripcion: string;
}

// Modificar el tipo de addUnidadPresupuesto
export const addUnidadPresupuesto = createAsyncThunk(
  'unidadPresupuesto/addUnidadPresupuesto',
  async (data: CreateUnidadPresupuestoInput, { rejectWithValue }) => {
    try {
      return await addUnidadPresupuestoService(data);
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const updateUnidadPresupuesto = createAsyncThunk(
  'unidadPresupuesto/updateUnidadPresupuesto',
  async (data: { id_unidad: string; descripcion?: string; abreviatura_unidad?: string }, { rejectWithValue }) => {
    try {
      return await updateUnidadPresupuestoService(data);
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const deleteUnidadPresupuesto = createAsyncThunk(
  'unidadPresupuesto/deleteUnidadPresupuesto',
  async (id: string, { rejectWithValue }) => {
    try {
      return await deleteUnidadPresupuestoService(id);
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

const unidadPresupuestoSlice = createSlice({
  name: 'unidadPresupuesto',
  initialState,
  reducers: {
    clearErrors: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUnidadesPresupuesto.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUnidadesPresupuesto.fulfilled, (state, action: PayloadAction<UnidadPresupuesto[]>) => {
        state.loading = false;
        state.unidadesPresupuesto = action.payload;
      })
      .addCase(fetchUnidadesPresupuesto.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(getUnidadPresupuesto.fulfilled, (state, action: PayloadAction<UnidadPresupuesto>) => {
        state.loading = false;
        state.selectedUnidadPresupuesto = action.payload;
      })
      .addCase(addUnidadPresupuesto.fulfilled, (state, action: PayloadAction<UnidadPresupuesto>) => {
        state.loading = false;
        state.unidadesPresupuesto.push(action.payload);
      })
      .addCase(updateUnidadPresupuesto.fulfilled, (state, action: PayloadAction<UnidadPresupuesto>) => {
        state.loading = false;
        const index = state.unidadesPresupuesto.findIndex(unidad => unidad.id_unidad === action.payload.id_unidad);
        if (index !== -1) {
          state.unidadesPresupuesto[index] = action.payload;
        }
      })
      .addCase(deleteUnidadPresupuesto.fulfilled, (state, action: PayloadAction<{ id_unidad: string }>) => {
        state.loading = false;
        state.unidadesPresupuesto = state.unidadesPresupuesto.filter(
          unidad => unidad.id_unidad !== action.payload.id_unidad
        );
      });
  },
});

export const { clearErrors } = unidadPresupuestoSlice.actions;
export const unidadPresupuestoReducer = unidadPresupuestoSlice.reducer;
