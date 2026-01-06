import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import { playlistApi, type Playlist } from '../../lib/api-client';

interface PlaylistState {
    playlists: Playlist[];
    currentPlaylist: Playlist | null;
    loading: boolean;
    error: string | null;
}

const initialState: PlaylistState = {
    playlists: [],
    currentPlaylist: null,
    loading: false,
    error: null,
};

// Async Thunks
export const fetchMyPlaylists = createAsyncThunk(
    'playlists/fetchMyPlaylists',
    async (_, { rejectWithValue }) => {
        try {
            const response = await playlistApi.getMyPlaylists();
            return response.data.data.playlists;
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.message || 'Failed to load playlists');
        }
    }
);

export const createPlaylist = createAsyncThunk(
    'playlists/create',
    async (data: { name: string, description?: string, isPrivate?: boolean }, { rejectWithValue }) => {
        try {
            const response = await playlistApi.create(data);
            return response.data.data.playlist;
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.message || 'Failed to create playlist');
        }
    }
);

const playlistSlice = createSlice({
    name: 'playlists',
    initialState,
    reducers: {
        setCurrentPlaylist: (state, action: PayloadAction<Playlist>) => {
            state.currentPlaylist = action.payload;
        },
        clearError: (state) => {
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // Fetch Playlists
            .addCase(fetchMyPlaylists.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchMyPlaylists.fulfilled, (state, action) => {
                state.loading = false;
                state.playlists = action.payload;
            })
            .addCase(fetchMyPlaylists.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            // Create Playlist
            .addCase(createPlaylist.fulfilled, (state, action) => {
                state.playlists.push(action.payload);
            });
    },
});

export const { setCurrentPlaylist, clearError } = playlistSlice.actions;
export default playlistSlice.reducer;
