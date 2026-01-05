// API Client for MyFreeMusic
// Shared between Web and Mobile apps

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:3000/api";
const STREAMING_URL = process.env.REACT_APP_STREAMING_URL || "http://localhost:4000";

/**
 * Base fetch wrapper with error handling
 */
async function fetchAPI(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const response = await fetch(url, {
        ...options,
        headers: {
            "Content-Type": "application/json",
            ...options.headers,
        },
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "API request failed");
    }

    return response.json();
}

// ============ AUTH API ============
const authAPI = {
    login: (email, password) =>
        fetchAPI("/auth/login", {
            method: "POST",
            body: JSON.stringify({ user_email: email, user_password: password }),
        }),

    logout: (userId) =>
        fetchAPI("/auth/logout", {
            method: "POST",
            body: JSON.stringify({ user_id: userId }),
        }),

    refreshToken: (refreshToken) =>
        fetchAPI("/auth/refresh", {
            method: "POST",
            body: JSON.stringify({ refreshToken }),
        }),

    changePassword: (userId, oldPassword, newPassword) =>
        fetchAPI("/auth/change-password", {
            method: "POST",
            body: JSON.stringify({
                user_id: userId,
                old_password: oldPassword,
                new_password: newPassword,
            }),
        }),
};

// ============ SONG API ============
const songAPI = {
    getAll: () => fetchAPI("/song"),

    getById: (id) => fetchAPI(`/song/${id}`),

    search: (query) => fetchAPI(`/song/search?q=${encodeURIComponent(query)}`),

    filterByArtist: (artistId) => fetchAPI(`/song/artist/${artistId}`),

    filterByGenre: (genreId) => fetchAPI(`/song/genre/${genreId}`),
};

// ============ USER API ============
const userAPI = {
    getProfile: (userId) => fetchAPI(`/user/${userId}`),

    updateProfile: (userId, data) =>
        fetchAPI(`/user/${userId}`, {
            method: "PUT",
            body: JSON.stringify(data),
        }),
};

// ============ STREAMING ============
const streamingAPI = {
    getHLSUrl: (songSlug) => `${STREAMING_URL}/hls/${songSlug}/master.m3u8`,
};

module.exports = {
    API_BASE_URL,
    STREAMING_URL,
    fetchAPI,
    authAPI,
    songAPI,
    userAPI,
    streamingAPI,
};
