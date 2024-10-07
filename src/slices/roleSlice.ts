import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { listRolesAndMenusService, addRoleService, updateRoleService } from '../services/roleService';

// Interfaces
interface Menu {
  id: string;
  nombre: string;
  slug: string;
  posicion: number;
}

interface MenuPermission {
  menuID: Menu;
  permissions: {
    ver: boolean;
    crear: boolean;
    editar: boolean;
    eliminar: boolean;
  };
}

interface Role {
  id: string;
  nombre: string;
  descripcion: string;
  menusPermissions: MenuPermission[];
  createdAt: string;
  updatedAt: string;
  deleted: boolean;
}

interface RoleState {
  roles: Role[];
  menus: Menu[];
  loading: boolean;
  error: string | null;
}

// Estado inicial
const initialState: RoleState = {
  roles: [],
  menus: [],
  loading: false,
  error: null,
};

// Función auxiliar para manejar errores
const handleError = (error: unknown): string => {
  if (error instanceof Error) return error.message;
  return String(error);
};

// Thunks
export const fetchRolesAndMenus = createAsyncThunk(
  'role/fetchRolesAndMenus',
  async (_, { rejectWithValue }) => {
    try {
      return await listRolesAndMenusService();
    } catch (error) {
      return rejectWithValue(handleError(error));
    }
  }
);

export const addRole = createAsyncThunk(
  'role/addRole',
  async (roleData: { nombre: string; descripcion: string; menusPermissions: MenuPermission[] }, { rejectWithValue }) => {
    try {
      return await addRoleService(roleData);
    } catch (error) {
      return rejectWithValue(handleError(error));
    }
  }
);

export const updateRole = createAsyncThunk(
  'role/updateRole',
  async (role: Role, { rejectWithValue }) => {
    try {
      return await updateRoleService(role);
    } catch (error) {
      return rejectWithValue(handleError(error));
    }
  }
);

// Slice
const roleSlice = createSlice({
  name: 'role',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchRolesAndMenus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRolesAndMenus.fulfilled, (state, action: PayloadAction<{ listRoles: Role[], listMenus: Menu[] }>) => {
        state.loading = false;
        state.roles = action.payload.listRoles;
        state.menus = action.payload.listMenus;
      })
      .addCase(fetchRolesAndMenus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(addRole.fulfilled, (state, action: PayloadAction<Role>) => {
        state.roles.push(action.payload);
      })
      .addCase(updateRole.fulfilled, (state, action: PayloadAction<Role>) => {
        const index = state.roles.findIndex(role => role.id === action.payload.id);
        if (index !== -1) {
          state.roles[index] = action.payload;
        }
      });
  },
});

export const roleReducer = roleSlice.reducer;