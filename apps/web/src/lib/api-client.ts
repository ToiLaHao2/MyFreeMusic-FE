import axios from 'axios';

// Types
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

export interface Genre {
    id: string;
    name: string;
    description?: string;
}

export interface Song {
    artist: any;
    artist_names: string;
    id: string;
    title: string;
    slug: string;
    fileUrl: string;
    coverUrl: string;
    duration_seconds: number;
    artist_id?: string;
    genre_id?: string;
    uploaded_by?: string;
}

export interface Playlist {
    id: string;
    playlist_name: string;
    playlist_description?: string;
    playlist_cover_url?: string;
    playlist_is_private: boolean;
    user_id: string;
    Songs?: Song[]; // Songs in playlist
}

// Create axios instance
const api = axios.create({
    baseURL: 'http://localhost:3000/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor: Attach token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('accessToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor: Handle refresh token
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            const refreshToken = localStorage.getItem('refreshToken');

            if (refreshToken) {
                try {
                    const { data } = await axios.post('http://localhost:3000/api/auth/refresh', {
                        refreshToken,
                        device_type: 'web'
                    });

                    const newAccessToken = data.data.accessToken;
                    localStorage.setItem('accessToken', newAccessToken);

                    // Update header for this request
                    originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
                    api.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`;

                    return api(originalRequest);
                } catch (refreshError) {
                    // Logout if refresh fails
                    localStorage.removeItem('accessToken');
                    localStorage.removeItem('refreshToken');
                    window.location.href = '/login';
                }
            }
        }
        return Promise.reject(error);
    }
);

// API Methods
export const authApi = {
    login: (credentials: any) => api.post('/auth/login', { ...credentials, device_type: 'web' }),
    register: (data: any) => api.post('/auth/register', data),
    logout: (refreshToken: string) => api.post('/auth/logout', { refreshToken, device_type: 'web' }),
    getProfile: () => api.get('/auth/me'),
    updateProfile: (data: FormData) => api.put('/auth/me', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
    }),
};

export const songApi = {
    getAll: () => api.get('/songs'),
    getById: (id: string) => api.get(`/songs/${id}`),
    uploadDevice: (formData: FormData) => api.post('/songs/addNewSongFromDevice', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    }),
    uploadYoutube: (data: { ytbURL: string, skipDuplicateCheck?: boolean }) => api.post('/songs/addNewSongFromYtUrl', data),
    search: (name: string) => api.get(`/songs/filter/name?name=${name}`),
    getStreamUrl: (id: string) => api.get(`/songs/stream/${id}`),

    // New Methods for dynamic data
    getGenres: () => api.get('/genres'),
    getSongsByGenre: (genreId: string) => api.get(`/songs/filter/genre?genreId=${genreId}`),
    getArtists: () => api.get('/artists'),
};

export const playlistApi = {
    getMyPlaylists: () => api.get('/playlists'),
    create: (data: { name: string, description?: string, isPrivate?: boolean, coverUrl?: string }) => api.post('/playlists', data),
    getById: (id: string) => api.get(`/playlists/${id}`),
    update: (id: string, data: any) => {
        // Check if data is FormData (has file), otherwise JSON
        if (data instanceof FormData) {
            return api.put(`/playlists/${id}`, data, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
        }
        return api.put(`/playlists/${id}`, data);
    },
    delete: (id: string) => api.delete(`/playlists/${id}`),
    addSong: (playlistId: string, songId: string) => api.post(`/playlists/${playlistId}/songs`, { songId }),
    removeSong: (playlistId: string, songId: string) => api.delete(`/playlists/${playlistId}/songs/${songId}`),
    reorder: (playlistId: string, songIds: string[]) => api.put(`/playlists/${playlistId}/songs/reorder`, { songIds }),
    share: (id: string, email: string, permission: 'VIEW' | 'EDIT' = 'VIEW') => api.post(`/playlists/${id}/share`, { email, permission }),
    unshare: (id: string, userId: string) => api.delete(`/playlists/${id}/share/${userId}`),
    getShared: () => api.get('/playlists/shared'),
    getCommunity: () => api.get('/playlists/community'),
    toggleLike: (id: string) => api.post(`/playlists/${id}/like`),
};

export const adminApi = {
    getUsers: () => api.get('/admin/users'),
    createUser: (data: any) => api.post('/admin/users', data),
    getUserById: (id: string) => api.get(`/admin/users/${id}`),
    updateUserStatus: (id: string, isActive: boolean) => api.patch(`/admin/users/${id}/status`, { isActive }),
    updateUserRole: (id: string, role: string) => api.patch(`/admin/users/${id}/role`, { role }),
    deleteUser: (id: string) => api.delete(`/admin/users/${id}`),
    getStats: () => api.get('/admin/stats'),
    getLogs: (page = 1, limit = 20, action?: string) => api.get('/admin/logs', { params: { page, limit, action } }),
    clearLogs: (days = 30) => api.delete('/admin/logs', { params: { days } }),
};

export const analyticsApi = {
    getAnalytics: () => api.get('/analytics'),
    getUserLogs: (userId: string) => api.get(`/analytics/users/${userId}/logs`),
};

export const storageApi = {
    getStats: () => api.get('/storage'),
    getDatabaseStats: () => api.get('/storage/database'),
    refresh: () => api.post('/storage/refresh'),
};

export const favoritesApi = {
    getAll: () => api.get('/favorites'),
    check: (ids: string[]) => api.get(`/favorites/check?ids=${ids.join(',')}`),
    add: (songId: string) => api.post(`/favorites/${songId}`),
    remove: (songId: string) => api.delete(`/favorites/${songId}`),
};

export default api;

