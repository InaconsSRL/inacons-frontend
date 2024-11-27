import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import {
  listMediosPagoProveedoresService,
  getMediosPagoByProveedorService,
  addMediosPagoProveedorService,
  updateMediosPagoProveedorService,
  deleteMediosPagoProveedorService,
} from '../services/mediosPagoProveedorService';

interface Proveedor {
  id: string;
  razon_social: string;
  direccion: string;
  nombre_comercial: string;
  ruc: string;
  rubro: string;
  estado: string;
}

interface MediosPagoProveedor {
  id: string;
  proveedor_id: Proveedor;
  cuenta_bcp: string;
  cuenta_bbva: string;
  yape: string;
}

interface MediosPagoProveedorState {
  mediosPago: MediosPagoProveedor[];
  loading: boolean;
  error: string | null;
}

const initialState: MediosPagoProveedorState = {
  mediosPago: [],
  loading: false,
  error: null,
};

export const fetchMediosPagoProveedores = createAsyncThunk(
  'mediosPagoProveedor/fetchAll',
  async () => {
    return await listMediosPagoProveedoresService();
  }
);

export const fetchMediosPagoByProveedor = createAsyncThunk(
  'mediosPagoProveedor/fetchByProveedor',
  async (proveedor_id: string) => {
    return await getMediosPagoByProveedorService(proveedor_id);
  }
);

export const addMediosPagoProveedor = createAsyncThunk(
  'mediosPagoProveedor/add',
  async (data: {
    proveedor_id: string;
    cuenta_bcp?: string;
    cuenta_bbva?: string;
    yape?: string;
  }) => {
    return await addMediosPagoProveedorService(data);
  }
);

export const updateMediosPagoProveedor = createAsyncThunk(
  'mediosPagoProveedor/update',
  async (data: {
    id: string;
    proveedor_id?: string;
    cuenta_bcp?: string;
    cuenta_bbva?: string;
    yape?: string;
  }) => {
    return await updateMediosPagoProveedorService(data);
  }
);

export const deleteMediosPagoProveedor = createAsyncThunk(
  'mediosPagoProveedor/delete',
  async (id: string) => {
    await deleteMediosPagoProveedorService(id);
    return id;
  }
);

const mediosPagoProveedorSlice = createSlice({
  name: 'mediosPagoProveedor',
  initialState,
  reducers: {
    clearErrors: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all
      .addCase(fetchMediosPagoProveedores.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchMediosPagoProveedores.fulfilled, (state, action: PayloadAction<MediosPagoProveedor[]>) => {
        state.loading = false;
        state.mediosPago = action.payload;
      })
      .addCase(fetchMediosPagoProveedores.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Error al cargar medios de pago';
      })
      // Fetch by proveedor
      .addCase(fetchMediosPagoByProveedor.fulfilled, (state, action: PayloadAction<MediosPagoProveedor[]>) => {
        state.mediosPago = action.payload;
      })
      // Add
      .addCase(addMediosPagoProveedor.fulfilled, (state, action: PayloadAction<MediosPagoProveedor>) => {
        state.mediosPago.push(action.payload);
      })
      // Update
      .addCase(updateMediosPagoProveedor.fulfilled, (state, action: PayloadAction<MediosPagoProveedor>) => {
        const index = state.mediosPago.findIndex(mp => mp.id === action.payload.id);
        if (index !== -1) {
          state.mediosPago[index] = action.payload;
        }
      })
      // Delete
      .addCase(deleteMediosPagoProveedor.fulfilled, (state, action: PayloadAction<string>) => {
        state.mediosPago = state.mediosPago.filter(mp => mp.id !== action.payload);
      });
  },
});

export const { clearErrors } = mediosPagoProveedorSlice.actions;
export const mediosPagoProveedorReducer = mediosPagoProveedorSlice.reducer;