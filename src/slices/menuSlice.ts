import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { listMenusService, addMenuService, updateMenuService } from '../services/menuService';

// Interfaces
interface Menu {
  id: string;
  nombre: string;
  slug: string;
  posicion: number;
}

interface MenuState {
  menus: Menu[];
  loading: boolean;
  error: string | null;
}

// Estado inicial
const initialState: MenuState = {
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
export const fetchMenus = createAsyncThunk(
  'menu/fetchMenus',
  async (_, { rejectWithValue }) => {
    try {
      return await listMenusService();
    } catch (error) {
      return rejectWithValue(handleError(error));
    }
  }
);

export const addMenu = createAsyncThunk(
  'menu/addMenu',
  async (menuData: { nombre: string; slug: string; posicion: number }, { rejectWithValue }) => {
    try {
      return await addMenuService(menuData);
    } catch (error) {
      return rejectWithValue(handleError(error));
    }
  }
);

export const updateMenu = createAsyncThunk(
  'menu/updateMenu',
  async (menu: Menu, { rejectWithValue }) => {
    try {
      return await updateMenuService(menu);
    } catch (error) {
      return rejectWithValue(handleError(error));
    }
  }
);

// Slice
const menuSlice = createSlice({
  name: 'menu',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMenus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMenus.fulfilled, (state, action: PayloadAction<Menu[]>) => {
        state.loading = false;
        state.menus = action.payload;
      })
      .addCase(fetchMenus.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string;
          })
          .addCase(addMenu.fulfilled, (state, action: PayloadAction<Menu>) => {
            state.menus.push(action.payload);
          })
          .addCase(updateMenu.fulfilled, (state, action: PayloadAction<Menu>) => {
            const index = state.menus.findIndex(menu => menu.id === action.payload.id);
            if (index !== -1) {
              state.menus[index] = action.payload;
            }
          });
      },
    });
    
    export const menuReducer = menuSlice.reducer;