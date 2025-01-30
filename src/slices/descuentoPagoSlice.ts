import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import {
  listOrdenPagoDescuentosService,
  addOrdenPagoDescuentoService,
  updateOrdenPagoDescuentoService,
  deleteOrdenPagoDescuentoService,
  getDescuentosByOrdenPagoService, 
  OrdenPagoDescuentoInput
} from '../services/descuentoPagoService';

// Definición de la interfaz principal
export interface OrdenPagoDescuento {
  id: string;
  orden_pago_id: {
    id: string;
    codigo: string;
    monto_solicitado: number;
    tipo_moneda: string;
    tipo_pago: string;
    estado: string;
    observaciones: string;
    comprobante: string;
    fecha: string;
  };
  codigo: string;
  monto: number;
  tipo: string;
  detalle: string;
  usuario_id: {
    id: string;
    nombres: string;
    apellidos: string;
    dni: string;
    usuario: string;
    contrasenna: string;
    rol_id: string;
  };
  estado: string;  // Add this line
}

// Interfaz para el estado
interface OrdenPagoDescuentoState {
  descuentos: OrdenPagoDescuento[];
  loading: boolean;
  error: string | null;
}

// Estado inicial
const initialState: OrdenPagoDescuentoState = {
  descuentos: [],
  loading: false,
  error: null,
};

// Thunks
export const fetchDescuentos = createAsyncThunk(
  'descuentoPago/fetchDescuentos',
  async (_, { rejectWithValue }) => {
    try {
      return await listOrdenPagoDescuentosService();
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const addDescuento = createAsyncThunk(
  'descuentoPago/addDescuento',
  async (descuento: OrdenPagoDescuentoInput, { rejectWithValue }) => {
    try {
      return await addOrdenPagoDescuentoService(descuento);
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const updateDescuento = createAsyncThunk(
  'descuentoPago/updateDescuento',
  async ({ id, ...data }: OrdenPagoDescuentoInput & { id: string }, { rejectWithValue }) => {
    try {
      return await updateOrdenPagoDescuentoService(id, data);
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const deleteDescuento = createAsyncThunk(
  'descuentoPago/deleteDescuento',
  async (id: string, { rejectWithValue }) => {
    try {
      await deleteOrdenPagoDescuentoService(id);
      return { id };
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const fetchDescuentosByOrdenPago = createAsyncThunk(
  'descuentoPago/fetchDescuentosByOrdenPago',
  async (ordenPagoId: string, { rejectWithValue }) => {
    try {
      return await getDescuentosByOrdenPagoService(ordenPagoId);
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

// Slice
const descuentoPagoSlice = createSlice({
  name: 'descuentoPago',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch descuentos
      .addCase(fetchDescuentos.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDescuentos.fulfilled, (state, action: PayloadAction<OrdenPagoDescuento[]>) => {
        state.loading = false;
        state.descuentos = action.payload;
      })
      .addCase(fetchDescuentos.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Add descuento
      .addCase(addDescuento.fulfilled, (state, action: PayloadAction<OrdenPagoDescuento>) => {
        state.descuentos.push(action.payload);
      })
      // Update descuento
      .addCase(updateDescuento.fulfilled, (state, action: PayloadAction<OrdenPagoDescuento>) => {
        const index = state.descuentos.findIndex(item => item.id === action.payload.id);
        if (index !== -1) {
          state.descuentos[index] = action.payload;
        }
      })
      // Delete descuento
      .addCase(deleteDescuento.fulfilled, (state, action: PayloadAction<{ id: string }>) => {
        state.descuentos = state.descuentos.filter(item => item.id !== action.payload.id);
      })

       // Agregamos los casos para fetchDescuentosByOrdenPago
      .addCase(fetchDescuentosByOrdenPago.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDescuentosByOrdenPago.fulfilled, (state, action: PayloadAction<OrdenPagoDescuento[]>) => {
        state.loading = false;
        state.descuentos = action.payload;
      })
      .addCase(fetchDescuentosByOrdenPago.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });      
  },
});

export const descuentoPagoReducer = descuentoPagoSlice.reducer;
