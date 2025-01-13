import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import {
  listConsumosService,
  addConsumoService,
  updateConsumoService,
  deleteConsumoService
} from '../services/consumoService';

interface Cargo {
  id: string;
  nombre: string;
  descripcion: string;
  gerarquia: string;
}

interface Personal {
  id: string;
  nombres: string;
  apellidos: string;
  telefono: string;
  telefono_secundario: string;
  dni: string;
  cargo_id: Cargo;
}

interface Usuario {
  id: string;
  nombres: string;
  apellidos: string;
}

interface ObraBodega {
  id: string;
  nombre: string;
}

interface TransferenciaDetalle {
  id: string;
  referencia_id: string;
  referencia: string;
}

export interface ConsumoOutput {
  id: string;
  fecha: Date;
  almacenero_id: Usuario;
  responsable_id: Usuario;
  obra_id: ObraBodega;
  personal_id: Personal;
  estado: string;
  transferencia_detalle_id: TransferenciaDetalle;
}

export interface ConsumoInput {
  fecha: Date;
  almaceneroId: string;
  responsableId: string;
  obraId: string;
  personalId: string;
  estado: string;
  transferenciaDetalleId: string;
}

export interface ConsumoUpdateInput {
  id: string;
  fecha?: Date;
  almaceneroId?: string;
  responsableId?: string;
  obraId?: string;
  personalId?: string;
  estado?: string;
  transferenciaDetalleId?: string;
}

interface ConsumoState {
  consumos: ConsumoOutput[];
  loading: boolean;
  error: string | null;
}

const initialState: ConsumoState = {
  consumos: [],
  loading: false,
  error: null,
};

// Thunks
export const fetchConsumos = createAsyncThunk(
  'consumo/fetchConsumos',
  async (_, { rejectWithValue }) => {
    try {
      return await listConsumosService();
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Error desconocido');
    }
  }
);

export const addConsumo = createAsyncThunk(
  'consumo/addConsumo',
  async (consumoData: ConsumoInput, { rejectWithValue }) => {
    try {
      return await addConsumoService(consumoData);
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Error desconocido');
    }
  }
);

export const updateConsumo = createAsyncThunk(
  'consumo/updateConsumo',
  async (consumoData: ConsumoUpdateInput, { rejectWithValue }) => {
    try {
      return await updateConsumoService(consumoData);
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Error desconocido');
    }
  }
);

export const deleteConsumo = createAsyncThunk(
  'consumo/deleteConsumo',
  async (id: string, { rejectWithValue }) => {
    try {
      await deleteConsumoService(id);
      return id;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Error desconocido');
    }
  }
);

const consumoSlice = createSlice({
  name: 'consumo',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch consumos
      .addCase(fetchConsumos.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchConsumos.fulfilled, (state, action: PayloadAction<ConsumoOutput[]>) => {
        state.loading = false;
        state.consumos = action.payload;
      })
      .addCase(fetchConsumos.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Add consumo
      .addCase(addConsumo.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addConsumo.fulfilled, (state, action: PayloadAction<ConsumoOutput>) => {
        state.loading = false;
        state.consumos.push(action.payload);
      })
      .addCase(addConsumo.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Update consumo
      .addCase(updateConsumo.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateConsumo.fulfilled, (state, action: PayloadAction<ConsumoOutput>) => {
        state.loading = false;
        const index = state.consumos.findIndex(c => c.id === action.payload.id);
        if (index !== -1) {
          state.consumos[index] = action.payload;
        }
      })
      .addCase(updateConsumo.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Delete consumo
      .addCase(deleteConsumo.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteConsumo.fulfilled, (state, action: PayloadAction<string>) => {
        state.loading = false;
        state.consumos = state.consumos.filter(c => c.id !== action.payload);
      })
      .addCase(deleteConsumo.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError } = consumoSlice.actions;
export const consumoReducer = consumoSlice.reducer;
