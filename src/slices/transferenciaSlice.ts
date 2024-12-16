import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { 
  listTransferenciasService, 
  addTransferenciaService, 
  updateTransferenciaService, 
  deleteTransferenciaService 
} from '../services/transferenciaService';
import { EstadoTransferencia } from '../pages/Tranferencias/types';

interface Movimiento {
  id: string;
  nombre: string;
  descripcion: string;
  tipo: string;
}

interface Movilidad {
  id: string;
  denominacion: string;
  descripcion: string;
}

interface Usuario {
  id: string;
  apellidos: string;
  nombres: string;
}

export interface TransferenciaData {
  usuario_id: string;
  fecha: Date;
  movimiento_id: string;
  movilidad_id: string;
  estado?: EstadoTransferencia;
}

export interface Transferencia {
  id: string;
  fecha: Date;
  estado?: EstadoTransferencia;
  movimiento_id: Movimiento;
  movilidad_id: Movilidad;
  usuario_id: Usuario;
}

interface TransferenciaState {
  transferencias: Transferencia[];
  loading: boolean;
  error: string | null;
}

const initialState: TransferenciaState = {
  transferencias: [],
  loading: false,
  error: null,
};

export const fetchTransferencias = createAsyncThunk(
  'transferencia/fetchTransferencias',
  async (_, { rejectWithValue }) => {
    try {
      return await listTransferenciasService();
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const addTransferencia = createAsyncThunk(
  'transferencia/addTransferencia',
  async (data: { 
    usuario_id: string; 
    fecha: Date; 
    movimiento_id: string; 
    movilidad_id: string;
    estado?: EstadoTransferencia;
  }, { rejectWithValue }) => {
    try {
      return await addTransferenciaService(data);
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const updateTransferencia = createAsyncThunk(
  'transferencia/updateTransferencia',
  async (data: { 
    id: string; 
    usuario_id?: string; 
    fecha?: Date; 
    movimiento_id?: string; 
    movilidad_id?: string;
    estado?: EstadoTransferencia;
  }, { rejectWithValue }) => {
    try {
      return await updateTransferenciaService(data);
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const deleteTransferencia = createAsyncThunk(
  'transferencia/deleteTransferencia',
  async (id: string, { rejectWithValue }) => {
    try {
      await deleteTransferenciaService(id);
      return id;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

const transferenciaSlice = createSlice({
  name: 'transferencia',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTransferencias.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTransferencias.fulfilled, (state, action: PayloadAction<Transferencia[]>) => {
        state.loading = false;
        state.transferencias = action.payload;
      })
      .addCase(fetchTransferencias.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(addTransferencia.fulfilled, (state, action: PayloadAction<Transferencia>) => {
        state.transferencias.push(action.payload);
      })
      .addCase(updateTransferencia.fulfilled, (state, action: PayloadAction<Transferencia>) => {
        const index = state.transferencias.findIndex(t => t.id === action.payload.id);
        if (index !== -1) {
          state.transferencias[index] = action.payload;
        }
      })
      .addCase(deleteTransferencia.fulfilled, (state, action: PayloadAction<string>) => {
        state.transferencias = state.transferencias.filter(t => t.id !== action.payload);
      });
  },
});

export const transferenciaReducer = transferenciaSlice.reducer;
