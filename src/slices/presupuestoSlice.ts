import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import {
  listPresupuestosService,
  getPresupuestoService,
  getPresupuestosByProyectoService,
  addPresupuestoService,
  updatePresupuestoService,
  deletePresupuestoService
} from '../services/presupuestoService';

export interface Presupuesto {
  id_presupuesto: string;
  id_proyecto: string;
  costo_directo: number;
  fecha_creacion: string;
  monto_igv: number;
  monto_utilidad: number;
  nombre_presupuesto: string;
  numeracion_presupuesto: number;
  parcial_presupuesto: number;
  observaciones: string;
  porcentaje_igv: number;
  porcentaje_utilidad: number;
  plazo: number;
  ppto_base: number;
  ppto_oferta: number;
  total_presupuesto: number;
}

// Nuevo tipo para la creación de presupuestos
export type CreatePresupuestoInput = Omit<Presupuesto, 'id_presupuesto' | 'fecha_creacion' >;

interface PresupuestoState {
  presupuestos: Presupuesto[];
  selectedPresupuesto: Presupuesto | null;
  presupuestosByProyecto: Presupuesto[];
  loading: boolean;
  error: string | null;
}

const initialState: PresupuestoState = {
  presupuestos: [],
  selectedPresupuesto: null,
  presupuestosByProyecto: [],
  loading: false,
  error: null,
};

export const fetchPresupuestos = createAsyncThunk(
  'presupuesto/fetchPresupuestos',
  async (_, { rejectWithValue }) => {
    try {
      return await listPresupuestosService();
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const getPresupuesto = createAsyncThunk(
  'presupuesto/getPresupuesto',
  async (id: string, { rejectWithValue }) => {
    try {
      return await getPresupuestoService(id);
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const getPresupuestosByProyecto = createAsyncThunk(
  'presupuesto/getPresupuestosByProyecto',
  async (idProyecto: string, { rejectWithValue }) => {
    try {
      return await getPresupuestosByProyectoService(idProyecto);
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

// Modificar la definición del thunk addPresupuesto
export const addPresupuesto = createAsyncThunk(
  'presupuesto/addPresupuesto',
  async (data: CreatePresupuestoInput, { rejectWithValue }) => {
    try {
      return await addPresupuestoService(data);
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const updatePresupuesto = createAsyncThunk(
  'presupuesto/updatePresupuesto',
  async (data: Presupuesto, { rejectWithValue }) => {
    try {
      return await updatePresupuestoService(data);
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

// Modificar la definición del thunk deletePresupuesto para devolver el ID eliminado
export const deletePresupuesto = createAsyncThunk(
  'presupuesto/deletePresupuesto',
  async (id: string, { rejectWithValue }) => {
    try {
      await deletePresupuestoService(id);
      return id; // Retornamos el ID del presupuesto eliminado
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

const presupuestoSlice = createSlice({
  name: 'presupuesto',
  initialState,
  reducers: {
    clearErrors: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Presupuestos
      .addCase(fetchPresupuestos.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPresupuestos.fulfilled, (state, action: PayloadAction<Presupuesto[]>) => {
        state.loading = false;
        state.presupuestos = action.payload;
      })
      .addCase(fetchPresupuestos.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Get Presupuesto
      .addCase(getPresupuesto.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getPresupuesto.fulfilled, (state, action: PayloadAction<Presupuesto>) => {
        state.loading = false;
        state.selectedPresupuesto = action.payload;
      })
      .addCase(getPresupuesto.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Get Presupuestos By Proyecto
      .addCase(getPresupuestosByProyecto.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getPresupuestosByProyecto.fulfilled, (state, action: PayloadAction<Presupuesto[]>) => {
        state.loading = false;
        // Reemplazar los presupuestos existentes del proyecto con los nuevos
        const otherPresupuestos = state.presupuestos.filter(
          p => p.id_proyecto !== action.payload[0]?.id_proyecto
        );
        state.presupuestos = [...otherPresupuestos, ...action.payload];
        state.presupuestosByProyecto = action.payload;
      })
      .addCase(getPresupuestosByProyecto.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Add Presupuesto
      .addCase(addPresupuesto.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addPresupuesto.fulfilled, (state, action: PayloadAction<Presupuesto>) => {
        state.loading = false;
        state.presupuestos.push(action.payload);
      })
      .addCase(addPresupuesto.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Update Presupuesto
      .addCase(updatePresupuesto.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updatePresupuesto.fulfilled, (state, action: PayloadAction<Presupuesto>) => {
        state.loading = false;
        const index = state.presupuestos.findIndex(p => p.id_presupuesto === action.payload.id_presupuesto);
        if (index !== -1) {
          state.presupuestos[index] = action.payload;
        }
      })
      .addCase(updatePresupuesto.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Delete Presupuesto
      .addCase(deletePresupuesto.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deletePresupuesto.fulfilled, (state, action: PayloadAction<string>) => {
        state.loading = false;
        state.presupuestos = state.presupuestos.filter(p => p.id_presupuesto !== action.payload);
        state.presupuestosByProyecto = state.presupuestosByProyecto.filter(p => p.id_presupuesto !== action.payload);
        if (state.selectedPresupuesto?.id_presupuesto === action.payload) {
          state.selectedPresupuesto = null;
        }
      })
      .addCase(deletePresupuesto.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearErrors } = presupuestoSlice.actions;

export default presupuestoSlice.reducer;
