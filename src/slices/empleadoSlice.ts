import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchEmpleados } from '../services/empleadoService';

interface Cargo {
  nombre: string;
  id: string;
  gerarquia: number;
  descripcion: string;
}

interface Empleado {
  id: string;
  nombres: string;
  apellidos: string;
  telefono: string;
  telefono_secundario?: string;
  cargo: Cargo;
}

interface EmpleadoState {
  empleados: Empleado[];
  loading: boolean;
  error: string | null;
}

const initialState: EmpleadoState = {
  empleados: [],
  loading: false,
  error: null,
};

// Async thunk to fetch empleados
export const loadEmpleados = createAsyncThunk('empleados/load', async () => {
  const empleados = await fetchEmpleados();
  return empleados;
});

const empleadoSlice = createSlice({
  name: 'empleados',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loadEmpleados.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loadEmpleados.fulfilled, (state, action) => {
        state.loading = false;
        state.empleados = action.payload;
      })
      .addCase(loadEmpleados.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to load empleados';
      });
  },
});

export default empleadoSlice.reducer;
