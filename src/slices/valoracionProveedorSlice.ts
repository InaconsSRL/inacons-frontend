import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import {
  listValoracionProveedoresService,
  listValoracionByProveedorService,
  addValoracionProveedorService,
  updateValoracionProveedorService,
  deleteValoracionProveedorService,
} from '../services/valoracionProveedorService';

interface ValoracionProveedor {
  id: string;
  proveedor_id: {
    id: string;
  };
  puntuacion: number;
  fecha_inicio: Date;
  fecha_fin: Date;
  notas?: string;
  usuario_id: {
    id: string;
    nombres: string;
    apellidos: string;
  };
}

interface ValoracionProveedorState {
  valoraciones: ValoracionProveedor[];
  loading: boolean;
  error: string | null;
}

const initialState: ValoracionProveedorState = {
  valoraciones: [],
  loading: false,
  error: null,
};

export const fetchValoraciones = createAsyncThunk(
  'valoracionProveedor/fetchValoraciones',
  async () => {
    return await listValoracionProveedoresService();
  }
);

export const fetchValoracionesByProveedor = createAsyncThunk(
  'valoracionProveedor/fetchValoracionesByProveedor',
  async (proveedorId: string) => {
    return await listValoracionByProveedorService(proveedorId);
  }
);

export const addValoracionProveedor = createAsyncThunk(
  'valoracionProveedor/addValoracion',
  async (valoracionData: {
    proveedor_id: string;
    puntuacion: number;
    fecha_inicio: Date;
    fecha_fin: Date;
    usuario_id: string;
    notas?: string;
  }) => {
    return await addValoracionProveedorService(valoracionData);
  }
);

export const updateValoracionProveedor = createAsyncThunk(
  'valoracionProveedor/updateValoracion',
  async (valoracionData: {
    id: string;
    usuario_id: string;
    proveedor_id?: string;
    puntuacion?: number;
    fecha_inicio?: Date;
    fecha_fin?: Date;
    notas?: string;
  }) => {
    return await updateValoracionProveedorService(valoracionData);
  }
);

export const deleteValoracionProveedor = createAsyncThunk(
  'valoracionProveedor/deleteValoracion',
  async (id: string) => {
    await deleteValoracionProveedorService(id);
    return id;
  }
);

const valoracionProveedorSlice = createSlice({
  name: 'valoracionProveedor',
  initialState,
  reducers: {
    clearErrors: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch todos los casos
      .addCase(fetchValoraciones.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchValoraciones.fulfilled, (state, action: PayloadAction<ValoracionProveedor[]>) => {
        state.loading = false;
        state.valoraciones = action.payload;
      })
      .addCase(fetchValoraciones.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || null;
      })
      // Fetch by proveedor casos
      .addCase(fetchValoracionesByProveedor.fulfilled, (state, action: PayloadAction<ValoracionProveedor[]>) => {
        state.valoraciones = action.payload;
      })
      // Add casos
      .addCase(addValoracionProveedor.fulfilled, (state, action: PayloadAction<ValoracionProveedor>) => {
        state.valoraciones.push(action.payload);
      })
      // Update casos
      .addCase(updateValoracionProveedor.fulfilled, (state, action: PayloadAction<ValoracionProveedor>) => {
        const index = state.valoraciones.findIndex(val => val.id === action.payload.id);
        if (index !== -1) {
          state.valoraciones[index] = action.payload;
        }
      })
      // Delete casos
      .addCase(deleteValoracionProveedor.fulfilled, (state, action: PayloadAction<string>) => {
        state.valoraciones = state.valoraciones.filter(val => val.id !== action.payload);
      });
  },
});

export const { clearErrors } = valoracionProveedorSlice.actions;
export const valoracionProveedorReducer = valoracionProveedorSlice.reducer;