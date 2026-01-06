import axios from 'axios';

// Create axios instance
const api = axios.create({
    baseURL: 'http://localhost:3000/api', // Mobile map to 10.0.2.2 or distinct
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

                    localStorage.setItem('accessToken', data.data.accessToken);
                    api.defaults.headers.common['Authorization'] = `Bearer ${data.data.accessToken}`;

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

export default api;
