import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { 
  listSolicitudAlmacenesService, 
  addSolicitudAlmacenService, 
  updateSolicitudAlmacenService, 
  deleteSolicitudAlmacenService 
} from '../services/solicitudAlmacenService';

interface SolicitudAlmacen {
  id: string;
  usuario_id: string;
  requerimiento_id: string;
  almacen_origen_id: string;
  almacen_destino_id: string;
  fecha: string;
}

interface SolicitudAlmacenState {
  solicitudes: SolicitudAlmacen[];
  loading: boolean;
  error: string | null;
}

const initialState: SolicitudAlmacenState = {
  solicitudes: [],
  loading: false,
  error: null,
};

const handleError = (error: unknown): string => {
  if (error instanceof Error) return error.message;
  return String(error);
};

export const fetchSolicitudAlmacenes = createAsyncThunk(
  'solicitudAlmacen/fetchSolicitudAlmacenes',
  async (_, { rejectWithValue }) => {
    try {
      return await listSolicitudAlmacenesService();
    } catch (error) {
      return rejectWithValue(handleError(error));
    }
  }
);

export const addSolicitudAlmacen = createAsyncThunk(
  'solicitudAlmacen/addSolicitudAlmacen',
  async (solicitudData: { requerimientoId: string; usuarioId: string; almacenOrigenId: string; almacenDestinoId: string; fecha: Date }, { rejectWithValue }) => {
    try {
      return await addSolicitudAlmacenService(solicitudData);
    } catch (error) {
      return rejectWithValue(handleError(error));
    }
  }
);

export const updateSolicitudAlmacen = createAsyncThunk(
  'solicitudAlmacen/updateSolicitudAlmacen',
  async (solicitudData: { updateSolicitudAlmacenId: string; usuarioId: string; requerimientoId: string; almacenOrigenId: string; almacenDestinoId: string; fecha: Date }, { rejectWithValue }) => {
    try {
      return await updateSolicitudAlmacenService(solicitudData);
    } catch (error) {
      return rejectWithValue(handleError(error));
    }
  }
);

export const deleteSolicitudAlmacen = createAsyncThunk(
  'solicitudAlmacen/deleteSolicitudAlmacen',
  async (id: string, { rejectWithValue }) => {
    try {
      return await deleteSolicitudAlmacenService(id);
    } catch (error) {
      return rejectWithValue(handleError(error));
    }
  }
);

const solicitudAlmacenSlice = createSlice({
  name: 'solicitudAlmacen',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSolicitudAlmacenes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSolicitudAlmacenes.fulfilled, (state, action: PayloadAction<SolicitudAlmacen[]>) => {
        state.loading = false;
        state.solicitudes = action.payload;
      })
      .addCase(fetchSolicitudAlmacenes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(addSolicitudAlmacen.fulfilled, (state, action: PayloadAction<SolicitudAlmacen>) => {
        state.solicitudes.push(action.payload);
      })
      .addCase(updateSolicitudAlmacen.fulfilled, (state, action: PayloadAction<SolicitudAlmacen>) => {
        const index = state.solicitudes.findIndex(sol => sol.id === action.payload.id);
        if (index !== -1) {
          state.solicitudes[index] = action.payload;
        }
      })
      .addCase(deleteSolicitudAlmacen.fulfilled, (state, action: PayloadAction<{ id: string }>) => {
        state.solicitudes = state.solicitudes.filter(sol => sol.id !== action.payload.id);
      });
  },
});

export const solicitudAlmacenReducer = solicitudAlmacenSlice.reducer;
