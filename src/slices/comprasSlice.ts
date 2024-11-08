import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { listComprasService, addCompraService, updateCompraService, getCompraService, deleteCompraService } from '../services/comprasService';

interface Compra {
  id: string;
  proveedor_id: string;
  usuario_id: string;
  orden_compra_id: string;
  fecha: string;
}

interface CompraState {
  compras: Compra[];
  selectedCompra: Compra | null;
  loading: boolean;
  error: string | null;
}

const initialState: CompraState = {
  compras: [],
  selectedCompra: null,
  loading: false,
  error: null,
};

const handleError = (error: unknown): string => {
  if (error instanceof Error) return error.message;
  return String(error);
};

export const fetchCompras = createAsyncThunk(
  'compra/fetchCompras',
  async (_, { rejectWithValue }) => {
    try {
      return await listComprasService();
    } catch (error) {
      return rejectWithValue(handleError(error));
    }
  }
);

export const getCompra = createAsyncThunk(
  'compra/getCompra',
  async (id: string, { rejectWithValue }) => {
    try {
      return await getCompraService(id);
    } catch (error) {
      return rejectWithValue(handleError(error));
    }
  }
);

export const addCompra = createAsyncThunk(
  'compra/addCompra',
  async (compraData: { proveedor_id: string; usuario_id: string; orden_compra_id: string }, { rejectWithValue }) => {
    try {
      return await addCompraService(compraData);
    } catch (error) {
      return rejectWithValue(handleError(error));
    }
  }
);

export const updateCompra = createAsyncThunk(
  'compra/updateCompra',
  async (compra: { id: string; proveedor_id?: string; usuario_id?: string; orden_compra_id?: string; fecha?: string }, { rejectWithValue }) => {
    try {
      return await updateCompraService(compra);
    } catch (error) {
      return rejectWithValue(handleError(error));
    }
  }
);

export const deleteCompra = createAsyncThunk(
  'compra/deleteCompra',
  async (id: string, { rejectWithValue }) => {
    try {
      return await deleteCompraService(id);
    } catch (error) {
      return rejectWithValue(handleError(error));
    }
  }
);

const compraSlice = createSlice({
  name: 'compra',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCompras.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCompras.fulfilled, (state, action: PayloadAction<Compra[]>) => {
        state.loading = false;
        state.compras = action.payload;
      })
      .addCase(fetchCompras.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(getCompra.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getCompra.fulfilled, (state, action: PayloadAction<Compra>) => {
        state.loading = false;
        state.selectedCompra = action.payload;
      })
      .addCase(getCompra.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(addCompra.fulfilled, (state, action: PayloadAction<Compra>) => {
        state.compras.push(action.payload);
      })
      .addCase(updateCompra.fulfilled, (state, action: PayloadAction<Compra>) => {
        const index = state.compras.findIndex(comp => comp.id === action.payload.id);
        if (index !== -1) {
          state.compras[index] = action.payload;
        }
      })
      .addCase(deleteCompra.fulfilled, (state, action: PayloadAction<{id: string}>) => {
        state.compras = state.compras.filter(comp => comp.id !== action.payload.id);
      });
  },
});

export const compraReducer = compraSlice.reducer;
