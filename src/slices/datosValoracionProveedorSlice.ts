import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  listDatosValoracionProveedoresService,
  listDatosValoracionByProveedorService,
  addDatosValoracionProveedorService,
  updateDatosValoracionProveedorService,
  deleteDatosValoracionProveedorService,
} from '../services/datosValoracionProveedorService';

interface Cuestionario {
  id: string;
  denominacion: string;
}

interface Proveedor {
  id: string;
}

interface DatosValoracionProveedor {
  id: string;
  cuestionario_id: Cuestionario;
  id_proveedor: Proveedor;
  respuesta: string;
}

interface DatosValoracionProveedorState {
  datosValoraciones: DatosValoracionProveedor[];
  loading: boolean;
  error: string | null;
}

const initialState: DatosValoracionProveedorState = {
  datosValoraciones: [],
  loading: false,
  error: null,
};

export const fetchDatosValoracionProveedores = createAsyncThunk(
  'datosValoracionProveedor/fetchAll',
  async () => {
    return await listDatosValoracionProveedoresService();
  }
);

export const fetchDatosValoracionByProveedor = createAsyncThunk(
  'datosValoracionProveedor/fetchByProveedor',
  async (id_proveedor: string) => {
    return await listDatosValoracionByProveedorService(id_proveedor);
  }
);

export const addDatosValoracionProveedor = createAsyncThunk(
  'datosValoracionProveedor/add',
  async (datos: { cuestionario_id: string; id_proveedor: string; respuesta: string }) => {
    return await addDatosValoracionProveedorService(datos);
  }
);

export const updateDatosValoracionProveedor = createAsyncThunk(
  'datosValoracionProveedor/update',
  async (datos: { id: string; cuestionario_id?: string; id_proveedor?: string; respuesta?: string }) => {
    return await updateDatosValoracionProveedorService(datos);
  }
);

export const deleteDatosValoracionProveedor = createAsyncThunk(
  'datosValoracionProveedor/delete',
  async (id: string) => {
    await deleteDatosValoracionProveedorService(id);
    return id;
  }
);

const datosValoracionProveedorSlice = createSlice({
  name: 'datosValoracionProveedor',
  initialState,
  reducers: {
    clearErrors: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDatosValoracionProveedores.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchDatosValoracionProveedores.fulfilled, (state, action) => {
        state.loading = false;
        state.datosValoraciones = action.payload;
        state.error = null;
      })
      .addCase(fetchDatosValoracionProveedores.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || null;
      })
      .addCase(fetchDatosValoracionByProveedor.fulfilled, (state, action) => {
        state.datosValoraciones = action.payload;
        state.error = null;
      })
      .addCase(addDatosValoracionProveedor.fulfilled, (state, action) => {
        state.datosValoraciones.push(action.payload);
        state.error = null;
      })
      .addCase(updateDatosValoracionProveedor.fulfilled, (state, action) => {
        const index = state.datosValoraciones.findIndex(
          (dato) => dato.id === action.payload.id
        );
        if (index !== -1) {
          state.datosValoraciones[index] = action.payload;
        }
      })
      .addCase(deleteDatosValoracionProveedor.fulfilled, (state, action) => {
        state.datosValoraciones = state.datosValoraciones.filter(
          (dato) => dato.id !== action.payload
        );
      });
  },
});

export const { clearErrors } = datosValoracionProveedorSlice.actions;
export const datosValoracionProveedorReducer = datosValoracionProveedorSlice.reducer;