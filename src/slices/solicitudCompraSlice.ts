
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { 
  listSolicitudesComprasService, 
  getSolicitudCompraService,
  addSolicitudCompraService,
  updateSolicitudCompraService,
  deleteSolicitudCompraService
} from '../services/solicitudCompraService';

interface Usuario {
  id: string;
  nombres: string;
  apellidos: string;
}

interface Requerimiento {
  id: string;
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
  usuario_id: Usuario;
  fecha: string;
}

interface SolicitudCompraState {
  solicitudes: SolicitudCompra[];
  selectedSolicitud: SolicitudCompra | null;
  loading: boolean;
  error: string | null;
}

const initialState: SolicitudCompraState = {
  solicitudes: [],
  selectedSolicitud: null,
  loading: false,
  error: null,
};

export const fetchSolicitudesCompras = createAsyncThunk(
  'solicitudCompra/fetchSolicitudes',
  async () => {
    return await listSolicitudesComprasService();
  }
);

export const getSolicitudCompra = createAsyncThunk(
  'solicitudCompra/getSolicitud',
  async (id: string) => {
    return await getSolicitudCompraService(id);
  }
);

export const addSolicitudCompra = createAsyncThunk(
  'solicitudCompra/addSolicitud',
  async (data: { requerimientoId: string; usuarioId: string; fecha: Date }) => {
    return await addSolicitudCompraService(data);
  }
);

export const updateSolicitudCompra = createAsyncThunk(
  'solicitudCompra/updateSolicitud',
  async (data: { id: string; requerimientoId?: string; usuarioId?: string; fecha?: Date }) => {
    return await updateSolicitudCompraService(data);
  }
);

export const deleteSolicitudCompra = createAsyncThunk(
  'solicitudCompra/deleteSolicitud',
  async (id: string) => {
    await deleteSolicitudCompraService(id);
    return id;
  }
);

const solicitudCompraSlice = createSlice({
  name: 'solicitudCompra',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSolicitudesCompras.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchSolicitudesCompras.fulfilled, (state, action: PayloadAction<SolicitudCompra[]>) => {
        state.loading = false;
        state.solicitudes = action.payload;
        state.error = null;
      })
      .addCase(fetchSolicitudesCompras.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Error al cargar las solicitudes';
      })
      .addCase(getSolicitudCompra.fulfilled, (state, action: PayloadAction<SolicitudCompra>) => {
        state.selectedSolicitud = action.payload;
      })
      .addCase(addSolicitudCompra.fulfilled, (state, action: PayloadAction<SolicitudCompra>) => {
        state.solicitudes.push(action.payload);
      })
      .addCase(updateSolicitudCompra.fulfilled, (state, action: PayloadAction<SolicitudCompra>) => {
        const index = state.solicitudes.findIndex(s => s.id === action.payload.id);
        if (index !== -1) {
          state.solicitudes[index] = action.payload;
        }
      })
      .addCase(deleteSolicitudCompra.fulfilled, (state, action: PayloadAction<string>) => {
        state.solicitudes = state.solicitudes.filter(s => s.id !== action.payload);
      });
  },
});

export const solicitudCompraReducer = solicitudCompraSlice.reducer;