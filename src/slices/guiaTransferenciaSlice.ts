
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  listGuiaTransferenciasService,
  listGuiaTransferenciasByTransferenciaIdService,
  addGuiaTransferenciaService,
  updateGuiaTransferenciaService,
  deleteGuiaTransferenciaService,
} from '../services/guiaTransferenciaService';

interface GuiaTransferencia {
  id: string;
  transferencia_id: string;
  cod_guia: string;
  usuario_id: string;
  tipo: string;
  observacion?: string;
  fecha: Date;
}

interface GuiaTransferenciaState {
  guiaTransferencias: GuiaTransferencia[];
  loading: boolean;
  error: string | null;
}

const initialState: GuiaTransferenciaState = {
  guiaTransferencias: [],
  loading: false,
  error: null,
};

export const fetchGuiaTransferencias = createAsyncThunk(
  'guiaTransferencia/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      return await listGuiaTransferenciasService();
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const fetchGuiaTransferenciasByTransferenciaId = createAsyncThunk(
  'guiaTransferencia/fetchByTransferenciaId',
  async (transferenciaId: string, { rejectWithValue }) => {
    try {
      return await listGuiaTransferenciasByTransferenciaIdService(transferenciaId);
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const addGuiaTransferencia = createAsyncThunk(
  'guiaTransferencia/add',
  async (guiaData: {
    transferenciaId: string;
    codGuia: string;
    usuarioId: string;
    tipo: string;
    fecha: Date;
    observacion?: string;
  }, { rejectWithValue }) => {
    try {
      return await addGuiaTransferenciaService(guiaData);
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const updateGuiaTransferencia = createAsyncThunk(
  'guiaTransferencia/update',
  async (guiaData: {
    id: string;
    fecha?: Date;
    observacion?: string;
    tipo?: string;
    usuarioId?: string;
    codGuia?: string;
    transferenciaId?: string;
  }, { rejectWithValue }) => {
    try {
      return await updateGuiaTransferenciaService(guiaData);
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const deleteGuiaTransferencia = createAsyncThunk(
  'guiaTransferencia/delete',
  async (id: string, { rejectWithValue }) => {
    try {
      await deleteGuiaTransferenciaService(id);
      return id;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

const guiaTransferenciaSlice = createSlice({
  name: 'guiaTransferencia',
  initialState,
  reducers: {
    clearErrors: (state) => {
      state.error = null;
    },
    clearGuiaTransferencias: (state) => {
      state.guiaTransferencias = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all
      .addCase(fetchGuiaTransferencias.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchGuiaTransferencias.fulfilled, (state, action) => {
        state.loading = false;
        state.guiaTransferencias = action.payload;
        state.error = null;
      })
      .addCase(fetchGuiaTransferencias.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Fetch by transferencia ID
      .addCase(fetchGuiaTransferenciasByTransferenciaId.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchGuiaTransferenciasByTransferenciaId.fulfilled, (state, action) => {
        state.loading = false;
        state.guiaTransferencias = action.payload;
        state.error = null;
      })
      .addCase(fetchGuiaTransferenciasByTransferenciaId.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Add
      .addCase(addGuiaTransferencia.pending, (state) => {
        state.loading = true;
      })
      .addCase(addGuiaTransferencia.fulfilled, (state, action) => {
        state.loading = false;
        state.guiaTransferencias.push(action.payload);
        state.error = null;
      })
      .addCase(addGuiaTransferencia.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Update
      .addCase(updateGuiaTransferencia.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateGuiaTransferencia.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.guiaTransferencias.findIndex(
          (guia) => guia.id === action.payload.id
        );
        if (index !== -1) {
          state.guiaTransferencias[index] = action.payload;
        }
        state.error = null;
      })
      .addCase(updateGuiaTransferencia.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Delete
      .addCase(deleteGuiaTransferencia.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteGuiaTransferencia.fulfilled, (state, action) => {
        state.loading = false;
        state.guiaTransferencias = state.guiaTransferencias.filter(
          (guia) => guia.id !== action.payload
        );
        state.error = null;
      })
      .addCase(deleteGuiaTransferencia.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearErrors, clearGuiaTransferencias } = guiaTransferenciaSlice.actions;
export const guiaTransferenciaReducer = guiaTransferenciaSlice.reducer;