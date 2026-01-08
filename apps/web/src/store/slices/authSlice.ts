import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import api from '../../lib/api-client';

export interface User {
    id: string;
    email: string;
    name: string;
    role: 'ADMIN' | 'USER';
    avatar?: string;
    bio?: string;
    theme?: string;
    customAllSongsCover?: string;
    customLikedSongsCover?: string;
}

interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;
}

// Initialize auth state from localStorage to persist login across page reloads
const storedUser = localStorage.getItem('user');
const storedToken = localStorage.getItem('accessToken');

const initialState: AuthState = {
    user: storedUser ? JSON.parse(storedUser) : null,
    isAuthenticated: !!(storedToken && storedUser),
    isLoading: false,
    error: null,
};

// Async Thunks
export const login = createAsyncThunk(
    'auth/login',
    async (credentials: { email: string; password: string; rememberMe: boolean }, { rejectWithValue }) => {
        try {
            const response = await api.post('/auth/login', {
                user_email: credentials.email,
                user_password: credentials.password,
                device_type: 'web',
                remember_me: credentials.rememberMe
            });

            const { accessToken, refreshToken, user } = response.data.data;

            // Store tokens
            localStorage.setItem('accessToken', accessToken);
            localStorage.setItem('refreshToken', refreshToken);
            localStorage.setItem('user', JSON.stringify(user));

            return user;

        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Login failed');
        }
    }
);

export const logout = createAsyncThunk(
    'auth/logout',
    async () => { // Removed unused rejectWithValue
        try {
            const refreshToken = localStorage.getItem('refreshToken');
            await api.post('/auth/logout', { refreshToken });
        } catch (error) {
            // Ignore logout errors
        } finally {
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            localStorage.removeItem('user');
        }
    }
);

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        // Reducer to restore session from local storage on app load
        restoreSession: (state) => {
            const userStr = localStorage.getItem('user');
            const token = localStorage.getItem('accessToken');
            if (userStr && token) {
                state.isAuthenticated = true;
                state.user = JSON.parse(userStr);
            }
        },
        setCredentials: (state, action: PayloadAction<{ user: User; accessToken?: string; refreshToken?: string }>) => {
            state.user = action.payload.user;
            state.isAuthenticated = true;
            localStorage.setItem('user', JSON.stringify(action.payload.user));
            if (action.payload.accessToken) {
                localStorage.setItem('accessToken', action.payload.accessToken);
            }
            if (action.payload.refreshToken) {
                localStorage.setItem('refreshToken', action.payload.refreshToken);
            }
        }
    },
    extraReducers: (builder) => {
        builder
            // Login
            .addCase(login.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(login.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isAuthenticated = true;
                state.user = action.payload;
            })
            .addCase(login.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            })
            // Logout
            .addCase(logout.fulfilled, (state) => {
                state.user = null;
                state.isAuthenticated = false;
            });
    },
});

export const { restoreSession, setCredentials } = authSlice.actions;
export default authSlice.reducer;
