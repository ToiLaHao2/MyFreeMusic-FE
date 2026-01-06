import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import { songApi, type Song } from '../../lib/api-client';

interface SongState {
    songs: Song[];
    currentSong: Song | null;
    isPlaying: boolean;
    loading: boolean;
    error: string | null;
    uploadStatus: 'idle' | 'uploading' | 'succeeded' | 'failed';
}

const initialState: SongState = {
    songs: [],
    currentSong: null,
    isPlaying: false,
    loading: false,
    error: null,
    uploadStatus: 'idle',
};

// Async Thunks
export const fetchSongs = createAsyncThunk(
    'songs/fetchAll',
    async (_, { rejectWithValue }) => {
        try {
            const response = await songApi.getAll();
            return response.data.data.songs;
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.message || 'Failed to load songs');
        }
    }
);

export const uploadSongDevice = createAsyncThunk(
    'songs/uploadDevice',
    async (formData: FormData, { rejectWithValue }) => {
        try {
            const response = await songApi.uploadDevice(formData);
            return response.data.data.song;
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.message || 'Upload failed');
        }
    }
);

export const uploadSongYoutube = createAsyncThunk(
    'songs/uploadYoutube',
    async (data: { ytbURL: string, skipDuplicateCheck?: boolean }, { rejectWithValue }) => {
        try {
            const response = await songApi.uploadYoutube(data);
            return response.data.data.song;
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.message || 'Download failed');
        }
    }
);

const songSlice = createSlice({
    name: 'songs',
    initialState,
    reducers: {
        setCurrentSong: (state, action: PayloadAction<Song>) => {
            state.currentSong = action.payload;
            state.isPlaying = true;
        },
        togglePlay: (state) => {
            state.isPlaying = !state.isPlaying;
        },
        setPlaying: (state, action: PayloadAction<boolean>) => {
            state.isPlaying = action.payload;
        },
        clearUploadStatus: (state) => {
            state.uploadStatus = 'idle';
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // Fetch Songs
            .addCase(fetchSongs.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchSongs.fulfilled, (state, action) => {
                state.loading = false;
                state.songs = action.payload;
            })
            .addCase(fetchSongs.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            // Upload Device
            .addCase(uploadSongDevice.pending, (state) => {
                state.uploadStatus = 'uploading';
                state.error = null;
            })
            .addCase(uploadSongDevice.fulfilled, (state, action) => {
                state.uploadStatus = 'succeeded';
                state.songs.unshift(action.payload); // Add new song to top
            })
            .addCase(uploadSongDevice.rejected, (state, action) => {
                state.uploadStatus = 'failed';
                state.error = action.payload as string;
            })
            // Upload Youtube
            .addCase(uploadSongYoutube.pending, (state) => {
                state.uploadStatus = 'uploading';
                state.error = null;
            })
            .addCase(uploadSongYoutube.fulfilled, (state, action) => {
                state.uploadStatus = 'succeeded';
                state.songs.unshift(action.payload);
            })
            .addCase(uploadSongYoutube.rejected, (state, action) => {
                state.uploadStatus = 'failed';
                state.error = action.payload as string;
            });
    },
});

export const { setCurrentSong, togglePlay, setPlaying, clearUploadStatus } = songSlice.actions;
export default songSlice.reducer;
