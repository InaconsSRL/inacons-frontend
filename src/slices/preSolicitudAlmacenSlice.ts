
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import {
  listPreSolicitudesService,
  addPreSolicitudService,
  updatePreSolicitudService,
  deletePreSolicitudService,
} from '../services/preSolicitudAlmacenService';

interface PreSolicitudAlmacen {
  id: string;
  requerimiento_id: string;
  fecha: Date;
  usuario_id: string;
  almacen_id: string;
}

interface PreSolicitudAlmacenState {
  preSolicitudes: PreSolicitudAlmacen[];
  loading: boolean;
  error: string | null;
}

const initialState: PreSolicitudAlmacenState = {
  preSolicitudes: [],
  loading: false,
  error: null,
};

export const fetchPreSolicitudes = createAsyncThunk(
  'preSolicitudAlmacen/fetchPreSolicitudes',
  async (_, { rejectWithValue }) => {
    try {
      return await listPreSolicitudesService();
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const addPreSolicitud = createAsyncThunk(
  'preSolicitudAlmacen/addPreSolicitud',
  async (data: Omit<PreSolicitudAlmacen, 'id'>, { rejectWithValue }) => {
    try {
      return await addPreSolicitudService(data);
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const updatePreSolicitud = createAsyncThunk(
  'preSolicitudAlmacen/updatePreSolicitud',
  async (data: Partial<PreSolicitudAlmacen> & { id: string }, { rejectWithValue }) => {
    try {
      return await updatePreSolicitudService(data);
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const deletePreSolicitud = createAsyncThunk(
  'preSolicitudAlmacen/deletePreSolicitud',
  async (id: string, { rejectWithValue }) => {
    try {
      await deletePreSolicitudService(id);
      return id;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

const preSolicitudAlmacenSlice = createSlice({
  name: 'preSolicitudAlmacen',
  initialState,
  reducers: {
    clearErrors: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPreSolicitudes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPreSolicitudes.fulfilled, (state, action: PayloadAction<PreSolicitudAlmacen[]>) => {
        state.loading = false;
        state.preSolicitudes = action.payload;
      })
      .addCase(fetchPreSolicitudes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(addPreSolicitud.fulfilled, (state, action: PayloadAction<PreSolicitudAlmacen>) => {
        state.preSolicitudes.push(action.payload);
      })
      .addCase(updatePreSolicitud.fulfilled, (state, action: PayloadAction<PreSolicitudAlmacen>) => {
        const index = state.preSolicitudes.findIndex(item => item.id === action.payload.id);
        if (index !== -1) {
          state.preSolicitudes[index] = action.payload;
        }
      })
      .addCase(deletePreSolicitud.fulfilled, (state, action: PayloadAction<string>) => {
        state.preSolicitudes = state.preSolicitudes.filter(item => item.id !== action.payload);
      });
  },
});

export const { clearErrors } = preSolicitudAlmacenSlice.actions;
export const preSolicitudAlmacenReducer = preSolicitudAlmacenSlice.reducer;