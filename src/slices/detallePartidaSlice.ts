import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import {
  listDetallesPartidaService,
  getDetallesPartidaByTituloService,
  addDetallePartidaService,
  updateDetallePartidaService,
  deleteDetallePartidaService,
} from '../services/detallePartidaService';

interface DetallePartida {
  id_detalle_partida: string;
  id_unidad: string;
  id_titulo: string;
  metrado: number;
  precio: number;
  jornada: number;
}

interface DetallePartidaState {
  detallesPartida: DetallePartida[];
  selectedDetallePartida: DetallePartida | null;
  loading: boolean;
  error: string | null;
}

const initialState: DetallePartidaState = {
  detallesPartida: [],
  selectedDetallePartida: null,
  loading: false,
  error: null,
};

export const fetchDetallesPartida = createAsyncThunk(
  'detallePartida/fetchDetallesPartida',
  async (_, { rejectWithValue }) => {
    try {
      return await listDetallesPartidaService();
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const getDetallesPartidaByTitulo = createAsyncThunk(
  'detallePartida/getDetallesPartidaByTitulo',
  async (idTitulo: string, { rejectWithValue }) => {
    try {
      return await getDetallesPartidaByTituloService(idTitulo);
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

// Agregar interfaces para los inputs
interface CreateDetallePartidaInput {
  idUnidad: string;
  idTitulo: string;
  metrado: number;
  precio: number;
  jornada: number;
}

interface UpdateDetallePartidaInput {
  idDetallePartida: string;
  idUnidad?: string;
  metrado?: number;
  precio?: number;
  jornada?: number;
}

export const addDetallePartida = createAsyncThunk(
  'detallePartida/addDetallePartida',
  async (data: CreateDetallePartidaInput, { rejectWithValue }) => {
    try {
      return await addDetallePartidaService(data);
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const updateDetallePartida = createAsyncThunk(
  'detallePartida/updateDetallePartida',
  async (data: UpdateDetallePartidaInput, { rejectWithValue }) => {
    try {
      return await updateDetallePartidaService(data);
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const deleteDetallePartida = createAsyncThunk(
  'detallePartida/deleteDetallePartida',
  async (idDetallePartida: string, { rejectWithValue }) => {
    try {
      return await deleteDetallePartidaService(idDetallePartida);
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

const detallePartidaSlice = createSlice({
  name: 'detallePartida',
  initialState,
  reducers: {
    clearErrors: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Detalles Partida
      .addCase(fetchDetallesPartida.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDetallesPartida.fulfilled, (state, action: PayloadAction<DetallePartida[]>) => {
        state.loading = false;
        state.detallesPartida = action.payload;
      })
      .addCase(fetchDetallesPartida.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Get Detalles Partida By Titulo
      .addCase(getDetallesPartidaByTitulo.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getDetallesPartidaByTitulo.fulfilled, (state, action: PayloadAction<DetallePartida[]>) => {
        state.loading = false;
        state.detallesPartida = action.payload;
      })
      .addCase(getDetallesPartidaByTitulo.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Add Detalle Partida
      .addCase(addDetallePartida.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addDetallePartida.fulfilled, (state, action: PayloadAction<DetallePartida>) => {
        state.loading = false;
        state.detallesPartida.push(action.payload);
      })
      .addCase(addDetallePartida.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Update Detalle Partida
      .addCase(updateDetallePartida.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateDetallePartida.fulfilled, (state, action: PayloadAction<DetallePartida>) => {
        state.loading = false;
        const index = state.detallesPartida.findIndex(
          (detalle) => detalle.id_detalle_partida === action.payload.id_detalle_partida
        );
        if (index !== -1) {
          state.detallesPartida[index] = action.payload;
        }
      })
      .addCase(updateDetallePartida.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Delete Detalle Partida
      .addCase(deleteDetallePartida.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteDetallePartida.fulfilled, (state, action: PayloadAction<{ id_detalle_partida: string }>) => {
        state.loading = false;
        state.detallesPartida = state.detallesPartida.filter(
          (detalle) => detalle.id_detalle_partida !== action.payload.id_detalle_partida
        );
      })
      .addCase(deleteDetallePartida.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearErrors } = detallePartidaSlice.actions;
export const detallePartidaReducer = detallePartidaSlice.reducer;
