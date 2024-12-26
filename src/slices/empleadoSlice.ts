import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { listEmpleadosService, addEmpleadoService, updateEmpleadoService, deleteEmpleadoService, getEmpleadoByDniService } from '../services/empleadoService';

interface Cargo {
  id: string;
  nombre: string;
  descripcion: string;
  gerarquia: number;
}

export interface Empleado {
  id: string;
  dni: string;
  nombres: string;
  apellidos: string;
  telefono: string;
  telefono_secundario?: string;
  cargo_id: Cargo;  // Cambiado de cargo_id a cargo
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

export const fetchEmpleados = createAsyncThunk(
  'empleado/fetchEmpleados',
  async (_, { rejectWithValue }) => {
    try {
      return await listEmpleadosService();
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const addEmpleado = createAsyncThunk(
  'empleado/addEmpleado',
  async (empleado: { 
    dni: string; 
    nombres: string; 
    apellidos: string; 
    telefono: string; 
    cargo_id: string;
    telefono_secundario?: string;
  }, { rejectWithValue }) => {
    try {
      return await addEmpleadoService(empleado);
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const updateEmpleado = createAsyncThunk(
  'empleado/updateEmpleado',
  async (empleado: { 
    id: string; 
    nombres?: string; 
    apellidos?: string; 
    telefono?: string; 
    telefono_secundario?: string;
    dni?: string;
    cargo_id?: string;
  }, { rejectWithValue }) => {
    try {
      return await updateEmpleadoService(empleado);
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const deleteEmpleado = createAsyncThunk(
  'empleado/deleteEmpleado',
  async (id: string, { rejectWithValue }) => {
    try {
      await deleteEmpleadoService(id);
      return { id };
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const getEmpleadoByDni = createAsyncThunk(
  'empleado/getEmpleadoByDni',
  async (id: string, { rejectWithValue }) => {
    try {
      return await getEmpleadoByDniService(id);
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

const empleadoSlice = createSlice({
  name: 'empleado',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchEmpleados.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEmpleados.fulfilled, (state, action: PayloadAction<Empleado[]>) => {
        state.loading = false;
        state.empleados = action.payload;
      })
      .addCase(fetchEmpleados.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(addEmpleado.fulfilled, (state, action: PayloadAction<Empleado>) => {
        state.empleados.push(action.payload);
      })
      .addCase(updateEmpleado.fulfilled, (state, action: PayloadAction<Empleado>) => {
        const index = state.empleados.findIndex(emp => emp.id === action.payload.id);
        if (index !== -1) {
          state.empleados[index] = action.payload;
        }
      })
      .addCase(deleteEmpleado.fulfilled, (state, action: PayloadAction<{ id: string }>) => {
        state.empleados = state.empleados.filter(emp => emp.id !== action.payload.id);
      })
      .addCase(getEmpleadoByDni.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getEmpleadoByDni.fulfilled, (state, action: PayloadAction<Empleado>) => {
        state.loading = false;
        const index = state.empleados.findIndex(emp => emp.id === action.payload.id);
        if (index !== -1) {
          state.empleados[index] = action.payload;
        } else {
          state.empleados.push(action.payload);
        }
      })
      .addCase(getEmpleadoByDni.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const empleadoReducer = empleadoSlice.reducer;
