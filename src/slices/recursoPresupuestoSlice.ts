import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import {
  listRecursosPresupuestoService,
  getRecursoPresupuestoService,
  addRecursoPresupuestoService,
  updateRecursoPresupuestoService,
  deleteRecursoPresupuestoService
} from '../services/recursoPresupuestoService';

interface RecursoPresupuesto {
  id_recurso: string;
  nombre: string;
  id_unidad: string;
  id_clase: string;
  id_tipo: string;
  id_recurso_app: string;
  precio_referencial: number;
  fecha_actualizacion: string;
}

interface RecursoPresupuestoState {
  recursosPresupuesto: RecursoPresupuesto[];
  selectedRecursoPresupuesto: RecursoPresupuesto | null;
  loading: boolean;
  error: string | null;
}

const initialState: RecursoPresupuestoState = {
  recursosPresupuesto: [],
  selectedRecursoPresupuesto: null,
  loading: false,
  error: null,
};

export const fetchRecursosPresupuesto = createAsyncThunk(
  'recursoPresupuesto/fetchRecursosPresupuesto',
  async (_, { rejectWithValue }) => {
    try {
      return await listRecursosPresupuestoService();
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const getRecursoPresupuesto = createAsyncThunk(
  'recursoPresupuesto/getRecursoPresupuesto',
  async (id: string, { rejectWithValue }) => {
    try {
      return await getRecursoPresupuestoService(id);
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const addRecursoPresupuesto = createAsyncThunk(
  'recursoPresupuesto/addRecursoPresupuesto',
  async (data: {
    idUnidad: string;
    idClase: string;
    idTipo: string;
    idRecursoApp: string;
    nombre: string;
    precioReferencial: number;
  }, { rejectWithValue }) => {
    try {
      return await addRecursoPresupuestoService(data);
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const updateRecursoPresupuesto = createAsyncThunk(
  'recursoPresupuesto/updateRecursoPresupuesto',
  async (data: {
    idRecurso: string;
    precioReferencial?: number;
    nombre?: string;
    idRecursoApp?: string;
    idTipo?: string;
    idClase?: string;
    idUnidad?: string;
  }, { rejectWithValue }) => {
    try {
      return await updateRecursoPresupuestoService(data);
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const deleteRecursoPresupuesto = createAsyncThunk(
  'recursoPresupuesto/deleteRecursoPresupuesto',
  async (id: string, { rejectWithValue }) => {
    try {
      return await deleteRecursoPresupuestoService(id);
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

const recursoPresupuestoSlice = createSlice({
  name: 'recursoPresupuesto',
  initialState,
  reducers: {
    clearErrors: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchRecursosPresupuesto.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRecursosPresupuesto.fulfilled, (state, action: PayloadAction<RecursoPresupuesto[]>) => {
        state.loading = false;
        state.recursosPresupuesto = action.payload;
      })
      .addCase(fetchRecursosPresupuesto.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(getRecursoPresupuesto.fulfilled, (state, action: PayloadAction<RecursoPresupuesto>) => {
        state.loading = false;
        state.selectedRecursoPresupuesto = action.payload;
      })
      .addCase(addRecursoPresupuesto.fulfilled, (state, action: PayloadAction<RecursoPresupuesto>) => {
        state.loading = false;
        state.recursosPresupuesto.push(action.payload);
      })
      .addCase(updateRecursoPresupuesto.fulfilled, (state, action: PayloadAction<RecursoPresupuesto>) => {
        state.loading = false;
        const index = state.recursosPresupuesto.findIndex(
          recurso => recurso.id_recurso === action.payload.id_recurso
        );
        if (index !== -1) {
          state.recursosPresupuesto[index] = action.payload;
        }
      })
      .addCase(deleteRecursoPresupuesto.fulfilled, (state, action: PayloadAction<{ id_recurso: string }>) => {
        state.loading = false;
        state.recursosPresupuesto = state.recursosPresupuesto.filter(
          recurso => recurso.id_recurso !== action.payload.id_recurso
        );
      });
  },
});

export const { clearErrors } = recursoPresupuestoSlice.actions;
export const recursoPresupuestoReducer = recursoPresupuestoSlice.reducer;
