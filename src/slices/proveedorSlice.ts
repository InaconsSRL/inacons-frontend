import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { listProveedoresService, addProveedorService, updateProveedorService } from '../services/proveedorService';

interface Proveedor {
  id: string;
  razon_social: string;
  ruc: string;
}

interface ProveedorState {
  proveedores: Proveedor[];
  loading: boolean;
  error: string | null;
}

const initialState: ProveedorState = {
  proveedores: [],
  loading: false,
  error: null,
};

const handleError = (error: unknown): string => {
  if (error instanceof Error) return error.message;
  return String(error);
};

export const fetchProveedores = createAsyncThunk(
  'proveedor/fetchProveedores',
  async (_, { rejectWithValue }) => {
    try {
      return await listProveedoresService();
    } catch (error) {
      return rejectWithValue(handleError(error));
    }
  }
);

export const addProveedor = createAsyncThunk(
  'proveedor/addProveedor',
  async (proveedorData: { razon_social: string; ruc: string }, { rejectWithValue }) => {
    try {
      return await addProveedorService(proveedorData);
    } catch (error) {
      return rejectWithValue(handleError(error));
    }
  }
);

export const updateProveedor = createAsyncThunk(
  'proveedor/updateProveedor',
  async (proveedor: Proveedor, { rejectWithValue }) => {
    try {
      return await updateProveedorService(proveedor);
    } catch (error) {
      return rejectWithValue(handleError(error));
    }
  }
);

const proveedorSlice = createSlice({
  name: 'proveedor',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProveedores.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProveedores.fulfilled, (state, action: PayloadAction<Proveedor[]>) => {
        state.loading = false;
        state.proveedores = action.payload;
      })
      .addCase(fetchProveedores.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(addProveedor.fulfilled, (state, action: PayloadAction<Proveedor>) => {
        state.proveedores.push(action.payload);
      })
      .addCase(updateProveedor.fulfilled, (state, action: PayloadAction<Proveedor>) => {
        const index = state.proveedores.findIndex(proveedor => proveedor.id === action.payload.id);
        if (index !== -1) {
          state.proveedores[index] = action.payload;
        }
      });
  },
});

export const proveedorReducer = proveedorSlice.reducer;