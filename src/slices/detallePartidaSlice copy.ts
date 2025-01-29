import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import {
  listDetallesPartidaService,
  getDetallesPartidaByTituloService,
  addDetallePartidaService,
  updateDetallePartidaService,
  deleteDetallePartidaService,
} from '../services/detallePartidaService';
import { RootState } from '../store/store';

export interface DetallePartida {
  id_detalle_partida: string;
  id_unidad: string;
  id_titulo: string;
  metrado: number;
  precio: number;
  jornada: number;
}

interface DetallePartidaState {
  detallePartida: DetallePartida | null;
  loading: boolean;
  error: string | null;
}

const initialState: DetallePartidaState = {
  detallePartida: null,
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
  async (id_titulo: string, { rejectWithValue }) => {
    try {
      return await getDetallesPartidaByTituloService(id_titulo);
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

// Agregar interfaces para los inputs
interface CreateDetallePartidaInput {
  id_unidad: string;
  id_titulo: string;
  metrado: number;
  precio: number;
  jornada: number;
}

interface UpdateDetallePartidaInput {
  id_detalle_partida: string;
  id_unidad?: string;
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

//TodoBien

export const updateDetallePartida = createAsyncThunk(
  'detallePartida/updateDetallePartida',
  async (data: UpdateDetallePartidaInput, { rejectWithValue, dispatch, getState }) => {
    try {
      const response = await updateDetallePartidaService(data);
      
      // Extraer los datos correctamente de la respuesta
      const updatedDetallePartida = response.updateDetallePartida;

      const state = getState() as RootState;
      const idPresupuesto = state.activeData.activePresupuesto?.id_presupuesto;
      const idTitulo = state.activeData.activeTitulo?.id_titulo;
      
      if (updatedDetallePartida && idPresupuesto && idTitulo) {
        
        dispatch({
          type: 'titulo/updateTituloDetallePartida',
          payload: {
            id_presupuesto: idPresupuesto,
            id_titulo: idTitulo,
            detallePartida: updatedDetallePartida
          }
        });
      }
      
      return updatedDetallePartida;
    } catch (error) {
      console.error('❌ Error en updateDetallePartida:', error);
      return rejectWithValue((error as Error).message);
    }
  }
);

export const deleteDetallePartida = createAsyncThunk(
  'detallePartida/deleteDetallePartida',
  async (id_detalle_partida: string, { rejectWithValue }) => {
    try {
      return await deleteDetallePartidaService(id_detalle_partida);
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
      .addCase(fetchDetallesPartida.fulfilled, (state, action: PayloadAction<DetallePartida>) => {
        state.loading = false;
        state.detallePartida = action.payload;
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
      .addCase(getDetallesPartidaByTitulo.fulfilled, (state, action: PayloadAction<DetallePartida>) => {
        state.loading = false;
        state.detallePartida = action.payload;
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
        state.detallePartida = action.payload;
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
        console.log('💾 Actualizando estado con:', action.payload);
        state.loading = false;
        state.detallePartida = action.payload;
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
      .addCase(deleteDetallePartida.fulfilled, (state) => {
        state.loading = false;
        state.detallePartida = null;
      })
      .addCase(deleteDetallePartida.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearErrors } = detallePartidaSlice.actions;
export const detallePartidaReducer = detallePartidaSlice.reducer;
