import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import { songApi, type Song } from '../../lib/api-client';

// Response type for upload actions
interface UploadResponse {
    isDuplicate: boolean;
    song?: Song;
    existingSong?: Song;
    message?: string;
    reason?: string;
}

interface SongState {
    songs: Song[];
    currentSong: Song | null;
    isPlaying: boolean;
    loading: boolean;
    error: string | null;
    uploadStatus: 'idle' | 'uploading' | 'succeeded' | 'failed' | 'duplicate';
    duplicateInfo: {
        message: string;
        existingSong: Song | null;
    } | null;
}

const initialState: SongState = {
    songs: [],
    currentSong: null,
    isPlaying: false,
    loading: false,
    error: null,
    uploadStatus: 'idle',
    duplicateInfo: null,
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

export const uploadSongDevice = createAsyncThunk<UploadResponse, FormData>(
    'songs/uploadDevice',
    async (formData: FormData, { rejectWithValue }) => {
        try {
            const response = await songApi.uploadDevice(formData);
            const data = response.data.data;
            return {
                isDuplicate: data.isDuplicate || false,
                song: data.song,
                existingSong: data.existingSong,
                message: data.message,
                reason: data.reason,
            };
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.message || 'Upload failed');
        }
    }
);

export const uploadSongYoutube = createAsyncThunk<UploadResponse, { ytbURL: string, skipDuplicateCheck?: boolean }>(
    'songs/uploadYoutube',
    async (data, { rejectWithValue }) => {
        try {
            const response = await songApi.uploadYoutube(data);
            const responseData = response.data.data;
            return {
                isDuplicate: responseData.isDuplicate || false,
                song: responseData.song,
                existingSong: responseData.existingSong,
                message: responseData.message,
                reason: responseData.reason,
            };
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
            state.duplicateInfo = null;
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
                state.duplicateInfo = null;
            })
            .addCase(uploadSongDevice.fulfilled, (state, action) => {
                if (action.payload.isDuplicate) {
                    state.uploadStatus = 'duplicate';
                    state.duplicateInfo = {
                        message: action.payload.message || 'Bài hát này đã tồn tại',
                        existingSong: action.payload.existingSong || null,
                    };
                } else {
                    state.uploadStatus = 'succeeded';
                    if (action.payload.song) {
                        state.songs.unshift(action.payload.song);
                    }
                }
            })
            .addCase(uploadSongDevice.rejected, (state, action) => {
                state.uploadStatus = 'failed';
                state.error = action.payload as string;
            })
            // Upload Youtube
            .addCase(uploadSongYoutube.pending, (state) => {
                state.uploadStatus = 'uploading';
                state.error = null;
                state.duplicateInfo = null;
            })
            .addCase(uploadSongYoutube.fulfilled, (state, action) => {
                if (action.payload.isDuplicate) {
                    state.uploadStatus = 'duplicate';
                    state.duplicateInfo = {
                        message: action.payload.message || 'Bài hát này đã tồn tại',
                        existingSong: action.payload.existingSong || null,
                    };
                } else {
                    state.uploadStatus = 'succeeded';
                    if (action.payload.song) {
                        state.songs.unshift(action.payload.song);
                    }
                }
            })
            .addCase(uploadSongYoutube.rejected, (state, action) => {
                state.uploadStatus = 'failed';
                state.error = action.payload as string;
            });
    },
});

export const { setCurrentSong, togglePlay, setPlaying, clearUploadStatus } = songSlice.actions;
export default songSlice.reducer;
