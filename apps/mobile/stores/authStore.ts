import { create } from 'zustand';
import * as SecureStore from 'expo-secure-store';
import { API_URL } from '../constants/config';

interface User {
    id: string;
    email: string;
    name: string;
    role: 'ADMIN' | 'USER';
    avatar?: string;
}

interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (email: string, password: string) => Promise<boolean>;
    logout: () => Promise<void>;
    restoreSession: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
    user: null,
    isAuthenticated: false,
    isLoading: true,

    restoreSession: async () => {
        try {
            const userStr = await SecureStore.getItemAsync('user');
            const token = await SecureStore.getItemAsync('accessToken');

            if (userStr && token) {
                set({ user: JSON.parse(userStr), isAuthenticated: true, isLoading: false });
            } else {
                set({ isLoading: false });
            }
        } catch (e) {
            set({ isLoading: false });
        }
    },

    login: async (email, password) => {
        set({ isLoading: true });
        try {
            const response = await fetch(`${API_URL}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    user_email: email,
                    user_password: password,
                    device_type: 'app',
                    remember_me: true
                }),
            });

            const data = await response.json();

            if (data.status === 'success') {
                const { accessToken, refreshToken, user } = data.data;

                await SecureStore.setItemAsync('accessToken', accessToken);
                await SecureStore.setItemAsync('refreshToken', refreshToken);
                await SecureStore.setItemAsync('user', JSON.stringify(user));

                set({ user, isAuthenticated: true, isLoading: false });
                return true;
            } else {
                set({ isLoading: false });
                alert(data.message || 'Login failed');
                return false;
            }
        } catch (error) {
            set({ isLoading: false });
            alert('Network error. Check API URL.');
            return false;
        }
    },

    logout: async () => {
        try {
            const refreshToken = await SecureStore.getItemAsync('refreshToken');
            const accessToken = await SecureStore.getItemAsync('accessToken');

            if (refreshToken && accessToken) {
                await fetch(`${API_URL}/auth/logout`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${accessToken}`
                    },
                    body: JSON.stringify({ refreshToken }),
                });
            }
        } finally {
            await SecureStore.deleteItemAsync('accessToken');
            await SecureStore.deleteItemAsync('refreshToken');
            await SecureStore.deleteItemAsync('user');
            set({ user: null, isAuthenticated: false });
        }
    },
}));
