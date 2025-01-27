import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import {
  listArchivosPagoService,
  getArchivosByOrdenPagoService,
  addArchivoPagoService,
  updateArchivoPagoService,
  deleteArchivoPagoService,
  uploadArchivoPagoService,
  ArchivoPago,
  ArchivoPagoInput
} from '../services/archivoPagoService';

interface ArchivoPagoState {
  archivos: ArchivoPago[];
  archivosByOrdenPago: ArchivoPago[];
  loading: boolean;
  error: string | null;
}

const initialState: ArchivoPagoState = {
  archivos: [],
  archivosByOrdenPago: [],
  loading: false,
  error: null
};

// Thunks
export const fetchArchivos = createAsyncThunk(
  'archivoPago/fetchArchivos',
  async (_, { rejectWithValue }) => {
    try {
      return await listArchivosPagoService();
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const fetchArchivosByOrdenPago = createAsyncThunk(
  'archivoPago/fetchArchivosByOrdenPago',
  async (ordenPagoId: string, { rejectWithValue }) => {
    try {
      return await getArchivosByOrdenPagoService(ordenPagoId);
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const addArchivo = createAsyncThunk(
  'archivoPago/addArchivo',
  async (archivo: ArchivoPagoInput, { rejectWithValue }) => {
    try {
      return await addArchivoPagoService(archivo);
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const updateArchivo = createAsyncThunk(
  'archivoPago/updateArchivo',
  async ({ id, ...data }: ArchivoPagoInput & { id: string }, { rejectWithValue }) => {
    try {
      return await updateArchivoPagoService(id, data);
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const deleteArchivo = createAsyncThunk(
  'archivoPago/deleteArchivo',
  async (id: string, { rejectWithValue }) => {
    try {
      await deleteArchivoPagoService(id);
      return { id };
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

// Agregar nuevo thunk para upload
export const uploadArchivo = createAsyncThunk(
  'archivoPago/uploadArchivo',
  async ({ 
    ordenPagoId, 
    userId, 
    file 
  }: { 
    ordenPagoId: string, 
    userId: string, 
    file: File 
  }, { rejectWithValue }) => {
    try {
      return await uploadArchivoPagoService(ordenPagoId, userId, file);
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

const archivoPagoSlice = createSlice({
  name: 'archivoPago',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch archivos
      .addCase(fetchArchivos.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchArchivos.fulfilled, (state, action: PayloadAction<ArchivoPago[]>) => {
        state.loading = false;
        state.archivos = action.payload;
      })
      .addCase(fetchArchivos.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Fetch archivos by orden pago
      .addCase(fetchArchivosByOrdenPago.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchArchivosByOrdenPago.fulfilled, (state, action: PayloadAction<ArchivoPago[]>) => {
        state.loading = false;
        state.archivosByOrdenPago = action.payload;
      })
      .addCase(fetchArchivosByOrdenPago.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Add archivo
      .addCase(addArchivo.fulfilled, (state, action: PayloadAction<ArchivoPago>) => {
        state.archivos.push(action.payload);
      })
      // Update archivo
      .addCase(updateArchivo.fulfilled, (state, action: PayloadAction<ArchivoPago>) => {
        const index = state.archivos.findIndex(item => item.id === action.payload.id);
        if (index !== -1) {
          state.archivos[index] = action.payload;
        }
      })
      // Delete archivo
      .addCase(deleteArchivo.fulfilled, (state, action: PayloadAction<{ id: string }>) => {
        state.archivos = state.archivos.filter(item => item.id !== action.payload.id);
      })
      // Upload archivo
      .addCase(uploadArchivo.fulfilled, (state, action: PayloadAction<ArchivoPago>) => {
        // Si el archivo pertenece a la orden de pago actual, añadirlo a archivosByOrdenPago
        if (state.archivosByOrdenPago.length > 0 && 
            state.archivosByOrdenPago[0].orden_pago_id.id === action.payload.orden_pago_id.id) {
          state.archivosByOrdenPago.push(action.payload);
        }
        // También añadirlo a la lista general
        state.archivos.push(action.payload);
      });
  },
});

export const archivoPagoReducer = archivoPagoSlice.reducer;
