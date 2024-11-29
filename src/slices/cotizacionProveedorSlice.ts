import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  listCotizacionProveedores,
  listCotizacionProveedoresByCotizacionId,
  addCotizacionProveedor as addCotizacionProveedorService,
  updateCotizacionProveedor as updateCotizacionProveedorService,
  deleteCotizacionProveedor as deleteCotizacionProveedorService,
} from '../services/cotizacionProveedorService';

interface Proveedor {
  id: string;
  ruc: string;
  razon_social: string;
  nombre_comercial: string;
}

interface CotizacionProveedor {
  id: string;
  cotizacion_id: {
    id: string;
  };
  proveedor_id: Proveedor;
  estado: string;
  fecha_inicio: string;
  fecha_fin: string;
  entrega: string;
  c_pago: string;
  observaciones: string;
}

interface CotizacionProveedorState {
  cotizacionProveedores: CotizacionProveedor[];
  loading: boolean;
  error: string | null;
}

const initialState: CotizacionProveedorState = {
  cotizacionProveedores: [],
  loading: false,
  error: null,
};

export const fetchCotizacionProveedores = createAsyncThunk(
  'cotizacionProveedor/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      return await listCotizacionProveedores();
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const fetchCotizacionProveedoresByCotizacionId = createAsyncThunk(
  'cotizacionProveedor/fetchByCotizacionId',
  async (cotizacionId: string, { rejectWithValue }) => {
    try {
      return await listCotizacionProveedoresByCotizacionId(cotizacionId);
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const addCotizacionProveedor = createAsyncThunk(
  'cotizacionProveedor/add',
  async (data: {
    cotizacionId: string;
    proveedor_id: string;
    estado: string;
    fecha_inicio: Date;
    fecha_fin: Date;
    entrega: Date;
    c_pago: string;
    observaciones: string;
  }, { rejectWithValue }) => {
    try {
      const formattedData = {
        ...data,
        fecha_inicio: data.fecha_inicio.toISOString(),
        fecha_fin: data.fecha_fin.toISOString(),
        entrega: data.entrega.toISOString(),
      };
      return await addCotizacionProveedorService(formattedData);
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const updateCotizacionProveedor = createAsyncThunk(
  'cotizacionProveedor/update',
  async (data: {
    id: string;
    cotizacion_id?: string;
    proveedor_id?: string;
    estado?: string;
    fecha_inicio?: Date;
    fecha_fin?: Date;
    entrega?: Date;
    c_pago?: string;
    observaciones?: string;
  }, { rejectWithValue }) => {
    try {
      const formattedData = {
        ...data,
        fecha_inicio: data.fecha_inicio?.toISOString(),
        fecha_fin: data.fecha_fin?.toISOString(),
        entrega: data.entrega?.toISOString(),
      };
      return await updateCotizacionProveedorService(formattedData);
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const deleteCotizacionProveedor = createAsyncThunk(
  'cotizacionProveedor/delete',
  async (id: string, { rejectWithValue }) => {
    try {
      await deleteCotizacionProveedorService(id);
      return id;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

const cotizacionProveedorSlice = createSlice({
  name: 'cotizacionProveedor',
  initialState,
  reducers: {
    clearErrors: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCotizacionProveedores.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCotizacionProveedores.fulfilled, (state, action) => {
        state.loading = false;
        state.cotizacionProveedores = action.payload;
        state.error = null;
      })
      .addCase(fetchCotizacionProveedores.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchCotizacionProveedoresByCotizacionId.fulfilled, (state, action) => {
        state.cotizacionProveedores = action.payload;
        state.error = null;
      })
      .addCase(addCotizacionProveedor.fulfilled, (state, action) => {
        state.cotizacionProveedores.push(action.payload);
        state.error = null;
      })
      .addCase(updateCotizacionProveedor.fulfilled, (state, action) => {
        const index = state.cotizacionProveedores.findIndex(
          (item) => item.id === action.payload.id
        );
        if (index !== -1) {
          state.cotizacionProveedores[index] = action.payload;
        }
        state.error = null;
      })
      .addCase(deleteCotizacionProveedor.fulfilled, (state, action) => {
        state.cotizacionProveedores = state.cotizacionProveedores.filter(
          (item) => item.id !== action.payload
        );
        state.error = null;
      });
  },
});

export const { clearErrors } = cotizacionProveedorSlice.actions;
export const cotizacionProveedorReducer = cotizacionProveedorSlice.reducer;
