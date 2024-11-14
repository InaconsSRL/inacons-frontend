
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { listCotizacionesService, addCotizacionService, updateCotizacionService, getCotizacionService, deleteCotizacionService } from '../services/cotizacionService';

interface Usuario {
  id: string;
  nombres: string;
  apellidos: string;
}

interface Proveedor {
  id: string;
  razon_social: string;
  direccion: string;
  nombre_comercial: string;
  ruc: string;
}

interface Requerimiento {
  id: string;
  usuario_id: string;
  usuario: string;
  presupuesto_id: string;
  fecha_solicitud: string;
  fecha_final: string;
  estado_atencion: string;
  sustento: string;
  obra_id: string;
  codigo: string;
}

interface SolicitudCompra {
  id: string;
  requerimiento_id: Requerimiento;
  fecha: string;
  usuario_id: Usuario;
}

interface Cotizacion {
  id: string;
  codigo_cotizacion: string;
  proveedor_id: Proveedor;
  usuario_id: Usuario;
  solicitud_compra_id: SolicitudCompra;
  aprobacion: boolean;
}

interface CotizacionState {
  cotizaciones: Cotizacion[];
  selectedCotizacion: Cotizacion | null;
  loading: boolean;
  error: string | null;
}

const initialState: CotizacionState = {
  cotizaciones: [],
  selectedCotizacion: null,
  loading: false,
  error: null,
};

export const fetchCotizaciones = createAsyncThunk(
  'cotizacion/fetchCotizaciones',
  async (_, { rejectWithValue }) => {
    try {
      return await listCotizacionesService();
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Error desconocido');
    }
  }
);

export const addCotizacion = createAsyncThunk(
  'cotizacion/addCotizacion',
  async (data: { codigo_cotizacion: string; proveedor_id: string; usuario_id: string; solicitud_compra_id: string; aprobacion: boolean }, { rejectWithValue }) => {
    try {
      return await addCotizacionService(data);
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Error desconocido');
    }
  }
);

export const updateCotizacion = createAsyncThunk(
  'cotizacion/updateCotizacion',
  async (data: { id: string; codigo_cotizacion: string; proveedor_id: string; usuario_id: string; solicitud_compra_id: string; aprobacion: boolean }, { rejectWithValue }) => {
    try {
      return await updateCotizacionService(data);
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Error desconocido');
    }
  }
);

export const getCotizacion = createAsyncThunk(
  'cotizacion/getCotizacion',
  async (id: string, { rejectWithValue }) => {
    try {
      return await getCotizacionService(id);
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Error desconocido');
    }
  }
);

export const deleteCotizacion = createAsyncThunk(
  'cotizacion/deleteCotizacion',
  async (id: string, { rejectWithValue }) => {
    try {
      return await deleteCotizacionService(id);
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Error desconocido');
    }
  }
);

const cotizacionSlice = createSlice({
  name: 'cotizacion',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch cases
      .addCase(fetchCotizaciones.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCotizaciones.fulfilled, (state, action: PayloadAction<Cotizacion[]>) => {
        state.loading = false;
        state.cotizaciones = action.payload;
      })
      .addCase(fetchCotizaciones.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Add, Update, Get, Delete cases...
      // ...existing code pattern for other cases...
  },
});

export const cotizacionReducer = cotizacionSlice.reducer;