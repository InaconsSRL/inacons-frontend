import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { getAllUsuariosAndCargosService, createUsuarioService, updateUsuarioService } from '../services/usuarioService';

interface Usuario {
  id: string;
  nombres: string;
  apellidos: string;
  dni: number;
  usuario: string;
  contrasenna: string;
  cargo_id: string | CargoDetallado;
  rol_id: string;
}

interface Cargo {
  id: string;
  nombre: string;
  descripcion: string;
  gerarquia: number;
}

interface CargoDetallado {
  id: string;
  nombre: string;
  descripcion: string;
  gerarquia: number;
}

interface UsuarioCargo {
  id: string;
  nombres: string;
  apellidos: string;
  dni: number;
  usuario: string;
  rol_id: string;
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

interface FetchUsuariosAndCargosResponse {
  getAllUsuarios: Usuario[];
  listCargo: Cargo[];
  usuariosCargo?: UsuarioCargo[];
}

export const fetchUsuariosAndCargos = createAsyncThunk<FetchUsuariosAndCargosResponse>(
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
      const formattedData = {
        ...usuarioData,
        cargo_id: typeof usuarioData.cargo_id === 'string' ? usuarioData.cargo_id : usuarioData.cargo_id.id,
      };
      return await createUsuarioService(formattedData);
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
      .addCase(
        fetchUsuariosAndCargos.fulfilled,
        (state, action: PayloadAction<FetchUsuariosAndCargosResponse>) => {
          state.loading = false;
          state.usuarios = action.payload.getAllUsuarios;
          state.cargos = action.payload.listCargo;
          state.usuariosCargo = action.payload.usuariosCargo ?? [];
        }
      )
      .addCase(fetchUsuariosAndCargos.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(addUsuario.fulfilled, (state, action: PayloadAction<Usuario>) => {
        state.usuarios.push(action.payload);
      })
      .addCase(updateUsuario.fulfilled, (state, action: PayloadAction<Usuario>) => {
        const index = state.usuarios.findIndex((usuario) => usuario.id === action.payload.id);
        if (index !== -1) {
          state.usuarios[index] = action.payload;
        }
      });
  },
});

export const usuarioReducer = usuarioSlice.reducer;