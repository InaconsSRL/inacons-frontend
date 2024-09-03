import { createAsyncThunk } from '@reduxjs/toolkit';
import { loginUserService } from '../services/userService'; 

/*acción asíncrona para iniciar sesión
 *
 */
export const loginUser = createAsyncThunk(
    'user/login',
    async ({ username, password }: { username: string; password: string }) => {
        const loginData = await loginUserService(username, password);
        return loginData;
    }
);
