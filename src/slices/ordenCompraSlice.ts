import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { listOrdenComprasService, addOrdenCompraService, updateOrdenCompraService, deleteOrdenCompraService, OrdenCompraUpdate } from '../services/ordenCompraService';

interface OrdenCompra {
  id: string;
  codigo_orden: string;
  cotizacion_id: string;
  estado: boolean;
  descripcion: string;
  fecha_ini: string;
  fecha_fin: string;
}

interface OrdenCompraState {
  ordenCompras: OrdenCompra[];
  loading: boolean;
  error: string | null;
}

const initialState: OrdenCompraState = {
  ordenCompras: [],
  loading: false,
  error: null,
};

export const fetchOrdenCompras = createAsyncThunk(
  'ordenCompra/fetchOrdenCompras',
  async () => {
    return await listOrdenComprasService();
  }
);

export const addOrdenCompra = createAsyncThunk(
  'ordenCompra/addOrdenCompra',
  async (ordenCompra: Omit<OrdenCompra, 'id'>) => {
    return await addOrdenCompraService(ordenCompra);
  }
);

export const updateOrdenCompra = createAsyncThunk(
  'ordenCompra/updateOrdenCompra',
  async (ordenCompra: OrdenCompraUpdate) => {
    console.log('updateOrdenCompra', ordenCompra);
    return await updateOrdenCompraService(ordenCompra);
  }
);

export const deleteOrdenCompra = createAsyncThunk(
  'ordenCompra/deleteOrdenCompra',
  async (id: string) => {
    await deleteOrdenCompraService(id);
    return id;
  }
);

const ordenCompraSlice = createSlice({
  name: 'ordenCompra',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrdenCompras.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrdenCompras.fulfilled, (state, action: PayloadAction<OrdenCompra[]>) => {
        state.loading = false;
        state.ordenCompras = action.payload;
      })
      .addCase(fetchOrdenCompras.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Error al cargar órdenes de compra';
      })
      .addCase(addOrdenCompra.fulfilled, (state, action: PayloadAction<OrdenCompra>) => {
        state.ordenCompras.push(action.payload);
      })
      .addCase(updateOrdenCompra.fulfilled, (state, action: PayloadAction<OrdenCompra>) => {
        const index = state.ordenCompras.findIndex(oc => oc.id === action.payload.id);
        if (index !== -1) {
          state.ordenCompras[index] = action.payload;
        }
      })
      .addCase(deleteOrdenCompra.fulfilled, (state, action: PayloadAction<string>) => {
        state.ordenCompras = state.ordenCompras.filter(oc => oc.id !== action.payload);
      });
  },
});

export const ordenCompraReducer = ordenCompraSlice.reducer;
