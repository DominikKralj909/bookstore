import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

interface AuthState {
    token: string | null;
    role: string | null;
    loading: boolean;
    error: string | null;
}

const initialState: AuthState = {
    token: null,
    role: null,
    loading: false,
    error: null,
};

export const loginUser = createAsyncThunk(
    'auth/loginUser',
    async ({ username, password }: { username: string; password: string }, { rejectWithValue }) => {
        try {
            const response = await axios.get('http://localhost:5000/users', {
                params: {
                    username,
                    password,
                },
            });

            const user = response.data[0];

            if (user) {
                return { token: user.token, role: user.role };
            } else {
                return rejectWithValue('Invalid username or password');
            }
        } catch (error) {
            return rejectWithValue('Error logging in');
        }
    }
);

export const authenticationSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        logout: (state) => {
            state.token = null;
            state.role = null;
            localStorage.removeItem('token');
            localStorage.removeItem('role');
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(loginUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.token = action.payload.token;
                state.role = action.payload.role;
                state.loading = false;
                localStorage.setItem('token', action.payload.token);
                localStorage.setItem('role', action.payload.role);
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});

export const { logout } = authenticationSlice.actions;
export default authenticationSlice.reducer;
