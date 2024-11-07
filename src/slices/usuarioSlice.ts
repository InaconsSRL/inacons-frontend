import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { getAllUsuariosAndCargosService, createUsuarioService, updateUsuarioService } from '../services/usuarioService';

interface Usuario {
  id: string;
  nombres: string;
  apellidos: string;
  dni: number;
  usuario: string;
  contrasenna: string;
  cargo_id: string;
  rol_id: string;
}

interface Cargo {
  id: string;
  nombre: string;
  descripcion: string;
}

interface CargoDetallado {
  nombre: string;
  gerarquia: string;
  descripcion: string;
  id: string;
}

interface UsuarioCargo {
  id: string;
  nombres: string;
  apellidos: string;
  cargo_id: CargoDetallado;
}

interface UsuarioState {
  usuarios: Usuario[];
  cargos: Cargo[];
  usuariosCargo: UsuarioCargo[];
  loading: boolean;
  error: string | null;
}

const initialState: UsuarioState = {
  usuarios: [],
  cargos: [],
  usuariosCargo: [],
  loading: false,
  error: null,
};

// Función auxiliar para manejar errores
const handleError = (error: unknown): string => {
  if (error instanceof Error) return error.message;
  return String(error);
};

export const fetchUsuariosAndCargos = createAsyncThunk(
  'usuario/fetchUsuariosAndCargos',
  async (_, { rejectWithValue }) => {
    try {
      return await getAllUsuariosAndCargosService();
    } catch (error) {
      return rejectWithValue(handleError(error));
    }
  }
);

export const addUsuario = createAsyncThunk(
  'usuario/addUsuario',
  async (usuarioData: Omit<Usuario, 'id'>, { rejectWithValue }) => {
    try {
      return await createUsuarioService(usuarioData);
    } catch (error) {
      return rejectWithValue(handleError(error));
    }
  }
);

export const updateUsuario = createAsyncThunk(
  'usuario/updateUsuario',
  async (usuario: Usuario, { rejectWithValue }) => {
    try {
      return await updateUsuarioService(usuario);
    } catch (error) {
      return rejectWithValue(handleError(error));
    }
  }
);

const usuarioSlice = createSlice({
  name: 'usuario',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsuariosAndCargos.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsuariosAndCargos.fulfilled, (state, action: PayloadAction<{getAllUsuarios: Usuario[], listCargo: Cargo[], usuariosCargo: UsuarioCargo[]}>) => {
        state.loading = false;
        state.usuarios = action.payload.getAllUsuarios;
        state.cargos = action.payload.listCargo;
        state.usuariosCargo = action.payload.usuariosCargo;
      })
      .addCase(fetchUsuariosAndCargos.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(addUsuario.fulfilled, (state, action: PayloadAction<Usuario>) => {
        state.usuarios.push(action.payload);
      })
      .addCase(updateUsuario.fulfilled, (state, action: PayloadAction<Usuario>) => {
        const index = state.usuarios.findIndex(usuario => usuario.id === action.payload.id);
        if (index !== -1) {
          state.usuarios[index] = action.payload;
        }
      });
  },
});

export const usuarioReducer = usuarioSlice.reducer;