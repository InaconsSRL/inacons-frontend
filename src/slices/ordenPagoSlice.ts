import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import {
  listOrdenPagosService,
  addOrdenPagoService,
  updateOrdenPagoService,
  deleteOrdenPagoService,
  getOrdenPagoByOrdenCompraService,
  OrdenPagoInput,
  OrdenPagoByOrdenCompra
} from '../services/ordenPagoService';

export interface IOrdenPago {
  _id: string;
  codigo: string;
  monto_solicitado: number;
  tipo_moneda: string;
  tipo_pago: string;
  estado: string;
  comprobante?: string; // Hacemos el campo opcional aquí
  orden_compra: {
    codigo_orden: string;
    id?: string;  // Hacer id opcional
  };
  usuario_id: {
    nombres: string;
    id: string;
  };
  fecha?: string;
  observaciones?: string;
}

interface OrdenCompraId {
  id: string;
  codigo_orden: string;
}

export interface OrdenPago {
  id: string;
  codigo: string;
  monto_solicitado: number;
  tipo_moneda: string;
  tipo_pago: string;
  estado: string;
  comprobante?: string;
  orden_compra: any;
  orden_compra_id: OrdenCompraId;
  usuario_id: {
    id: string;
    nombres: string;
    apellidos: string;
    dni: string;
    usuario: string;
  };
}

interface OrdenPagoState {
  ordenPagos: OrdenPago[];
  ordenPagosByOrdenCompra: OrdenPagoByOrdenCompra[];
  loading: boolean;
  error: string | null;
  loadingByOrdenCompra: boolean;
  errorByOrdenCompra: string | null;
}

const initialState: OrdenPagoState = {
  ordenPagos: [],
  ordenPagosByOrdenCompra: [],
  loading: false,
  error: null,
  loadingByOrdenCompra: false,
  errorByOrdenCompra: null
};

// Thunks existentes
export const fetchOrdenPagos = createAsyncThunk(
  'ordenPago/fetchOrdenPagos',
  async (_, { rejectWithValue }) => {
    try {
      return await listOrdenPagosService();
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

// Nuevo Thunk para obtener órdenes de pago por orden de compra
export const fetchOrdenPagosByOrdenCompra = createAsyncThunk(
  'ordenPago/fetchOrdenPagosByOrdenCompra',
  async (ordenCompraId: string, { rejectWithValue }) => {
    try {
      return await getOrdenPagoByOrdenCompraService(ordenCompraId);
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const addOrdenPago = createAsyncThunk(
  'ordenPago/addOrdenPago',
  async (ordenPago: OrdenPagoInput, { rejectWithValue }) => {
    try {
      return await addOrdenPagoService(ordenPago);
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const updateOrdenPago = createAsyncThunk(
  'ordenPago/updateOrdenPago',
  async ({ id, ...data }: OrdenPagoInput & { id: string }, { rejectWithValue }) => {
    try {
      const response = await updateOrdenPagoService(id, data);
      return response;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const deleteOrdenPago = createAsyncThunk(
  'ordenPago/deleteOrdenPago',
  async (id: string, { rejectWithValue }) => {
    try {
      await deleteOrdenPagoService(id);
      return { id };
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

const ordenPagoSlice = createSlice({
  name: 'ordenPago',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch orden pagos
      .addCase(fetchOrdenPagos.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrdenPagos.fulfilled, (state, action: PayloadAction<OrdenPago[]>) => {
        state.loading = false;
        state.ordenPagos = action.payload;
      })
      .addCase(fetchOrdenPagos.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Fetch orden pagos by orden compra
      .addCase(fetchOrdenPagosByOrdenCompra.pending, (state) => {
        state.loadingByOrdenCompra = true;
        state.errorByOrdenCompra = null;
      })
      .addCase(fetchOrdenPagosByOrdenCompra.fulfilled, (state, action: PayloadAction<OrdenPagoByOrdenCompra[]>) => {
        state.loadingByOrdenCompra = false;
        state.ordenPagosByOrdenCompra = action.payload;
      })
      .addCase(fetchOrdenPagosByOrdenCompra.rejected, (state, action) => {
        state.loadingByOrdenCompra = false;
        state.errorByOrdenCompra = action.payload as string;
      })
      // Add orden pago
      .addCase(addOrdenPago.fulfilled, (state, action: PayloadAction<OrdenPago>) => {
        state.ordenPagos.push(action.payload);
      })
      // Update orden pago
      .addCase(updateOrdenPago.fulfilled, (state, action: PayloadAction<OrdenPago>) => {
        const index = state.ordenPagos.findIndex(item => item.id === action.payload.id);
        if (index !== -1) {
          state.ordenPagos[index] = action.payload;
        }
      })
      // Delete orden pago
      .addCase(deleteOrdenPago.fulfilled, (state, action: PayloadAction<{ id: string }>) => {
        state.ordenPagos = state.ordenPagos.filter(item => item.id !== action.payload.id);
      });
  },
});

// Exportar el selector
// export const selectOrdenPagoById = (state: RootState, id: string) => 
//   state.ordenPago.items.find(item => item.id === id);

export const ordenPagoReducer = ordenPagoSlice.reducer;
