import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  listTransferenciaDetallesService,
  addTransferenciaDetalleService,
  updateTransferenciaDetalleService,
  deleteTransferenciaDetalleService,
  getObraOrigenYDestinoByTransferenciaId,
} from '../services/transferenciaDetalleService';

interface Usuario {
  id: string;
  nombres: string;
  apellidos: string;
}

interface Movimiento {
  id: string;
  nombre: string;
  descripcion: string;
  tipo: string;
}

interface Movilidad {
  id: string;
  denominacion: string;
  descripcion: string;
}

interface Transferencia {
  id: string;
  usuario_id: Usuario;
  fecha: string;
  movimiento_id: Movimiento;
  movilidad_id: Movilidad;
}

interface Obra {
  nombre: string;
  _id: string;
}

interface ReferenciaObras {
  obra_destino_id: Obra;
  obra_origen_id: Obra;
}

interface TransferenciaDetalleObras {
  referencia_id: ReferenciaObras;
}

interface TransferenciaDetalle {
  id: string;
  transferencia_id: Transferencia;
  referencia_id: string;
  fecha: string;
  tipo: string;
  referencia: string;
}

interface TransferenciaDetalleState {
  transferenciaDetalles: TransferenciaDetalle[];
  obrasOrigenDestino: TransferenciaDetalleObras[];
  loading: boolean;
  error: string | null;
}

const initialState: TransferenciaDetalleState = {
  transferenciaDetalles: [],
  obrasOrigenDestino: [],
  loading: false,
  error: null,
};

export const fetchTransferenciaDetalles = createAsyncThunk(
  'transferenciaDetalle/fetchAll',
  async () => {
    return await listTransferenciaDetallesService();
  }
);

export interface TransferenciaDetalleData {
  transferencia_id: string;
  referencia_id: string;
  fecha?: Date;
  tipo: string;
  referencia: string;
  estado?: string;
}

export const addTransferenciaDetalle = createAsyncThunk(
  'transferenciaDetalle/add',
  async (data: TransferenciaDetalleData) => {
    return await addTransferenciaDetalleService(data);
  }
);

export const updateTransferenciaDetalle = createAsyncThunk(
  'transferenciaDetalle/update',
  async (data: {
    id: string;
    transferencia_id?: string;
    referencia_id?: string;
    fecha?: Date;
    tipo?: string;
    referencia?: string;
  }) => {
    return await updateTransferenciaDetalleService(data);
  }
);

export const deleteTransferenciaDetalle = createAsyncThunk(
  'transferenciaDetalle/delete',
  async (id: string) => {
    await deleteTransferenciaDetalleService(id);
    return id;
  }
);

export const fetchObraOrigenYDestino = createAsyncThunk(
  'transferenciaDetalle/fetchObraOrigenYDestino',
  async (transferenciaId: string) => {
    return await getObraOrigenYDestinoByTransferenciaId(transferenciaId);
  }
);

const transferenciaDetalleSlice = createSlice({
  name: 'transferenciaDetalle',
  initialState,
  reducers: {
    clearTransferenciaDetalles: (state) => {
      state.transferenciaDetalles = [];
      state.obrasOrigenDestino = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTransferenciaDetalles.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchTransferenciaDetalles.fulfilled, (state, action) => {
        state.loading = false;
        state.transferenciaDetalles = action.payload;
        state.error = null;
      })
      .addCase(fetchTransferenciaDetalles.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || null;
      })
      .addCase(addTransferenciaDetalle.fulfilled, (state, action) => {
        state.transferenciaDetalles.push(action.payload);
      })
      .addCase(updateTransferenciaDetalle.fulfilled, (state, action) => {
        const index = state.transferenciaDetalles.findIndex(
          (item) => item.id === action.payload.id
        );
        if (index !== -1) {
          state.transferenciaDetalles[index] = action.payload;
        }
      })
      .addCase(deleteTransferenciaDetalle.fulfilled, (state, action) => {
        state.transferenciaDetalles = state.transferenciaDetalles.filter(
          (item) => item.id !== action.payload
        );
      })
      .addCase(fetchObraOrigenYDestino.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchObraOrigenYDestino.fulfilled, (state, action) => {
        state.loading = false;
        state.obrasOrigenDestino = action.payload;
        state.error = null;
      })
      .addCase(fetchObraOrigenYDestino.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || null;
      });
  },
});

export const { clearTransferenciaDetalles } = transferenciaDetalleSlice.actions;
export const transferenciaDetalleReducer = transferenciaDetalleSlice.reducer;
