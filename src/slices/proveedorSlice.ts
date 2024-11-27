import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { listProveedoresService, addProveedorService, updateProveedorService, getProveedorByIdService } from '../services/proveedorService';

export interface Proveedor {
  id: string;
  razon_social: string;
  ruc: string;
  direccion?: string;
  nombre_comercial?: string;
  rubro?: string;
  estado?: string;
  contactos?: Contacto[];
  mediosPago?: MedioPago[];
}

export interface ProveedorInput {
  razon_social: string;
  ruc: string;
  direccion?: string;
  nombre_comercial?: string;
  rubro?: string;
  estado?: string;
}

export interface Contacto {
  id: string;
  nombres: string;
  apellidos: string;
  cargo: string;
  telefono: string;
}

export interface MedioPago {
  id: string;
  cuenta_bcp: string;
  cuenta_bbva: string;
  yape: string;
}

export interface ProveedorState {
  proveedores: Proveedor[];
  selectedProveedor: Proveedor | null;
  loading: boolean;
  error: string | null;
}

const initialState: ProveedorState = {
  proveedores: [],
  selectedProveedor: null,
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
      const proveedores = await listProveedoresService();
      return proveedores; // Ya no necesitamos acceder a .proveedores
    } catch (error) {
      return rejectWithValue(handleError(error));
    }
  }
);

export const addProveedor = createAsyncThunk(
  'proveedor/addProveedor',
  async (proveedorData: ProveedorInput, { rejectWithValue }) => {
    try {
      if (!proveedorData.razon_social || !proveedorData.ruc) {
        throw new Error('Razón social y RUC son requeridos');
      }
      return await addProveedorService(proveedorData);
    } catch (error) {
      return rejectWithValue(handleError(error));
    }
  }
);

export const updateProveedor = createAsyncThunk(
  'proveedor/updateProveedor',
  async (proveedor: Partial<Proveedor> & { id: string }, { rejectWithValue }) => {
    try {
      return await updateProveedorService(proveedor);
    } catch (error) {
      return rejectWithValue(handleError(error));
    }
  }
);

export const getProveedorById = createAsyncThunk(
  'proveedor/getProveedorById',
  async (id: string, { rejectWithValue }) => {
    try {
      return await getProveedorByIdService(id);
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
      })
      .addCase(getProveedorById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getProveedorById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedProveedor = action.payload;
      })
      .addCase(getProveedorById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const proveedorReducer = proveedorSlice.reducer;