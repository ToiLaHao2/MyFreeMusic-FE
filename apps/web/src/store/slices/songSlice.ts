import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import { songApi, favoritesApi, type Song } from '../../lib/api-client';

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
    // Queue State
    queue: Song[];
    originalQueue: Song[]; // Keep track of original order for un-shuffle
    currentIndex: number;
    shuffle: boolean;
    repeat: 'off' | 'all' | 'one';
    // Playback State
    isPlaying: boolean;
    loading: boolean;
    error: string | null;
    uploadStatus: 'idle' | 'uploading' | 'succeeded' | 'failed' | 'duplicate';
    duplicateInfo: {
        message: string;
        existingSong: Song | null;
    } | null;
    likedSongIds: string[];
}

const initialState: SongState = {
    songs: [],
    currentSong: null,
    queue: [],
    originalQueue: [],
    currentIndex: -1,
    shuffle: false,
    repeat: 'off',
    isPlaying: false,
    loading: false,
    error: null,
    uploadStatus: 'idle',
    duplicateInfo: null,
    likedSongIds: [],
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

export const toggleLike = createAsyncThunk(
    'songs/toggleLike',
    async (song: Song, { getState, rejectWithValue }) => {
        try {
            const state = getState() as { songs: SongState };
            const isLiked = state.songs.likedSongIds.includes(song.id);

            if (isLiked) {
                await favoritesApi.remove(song.id);
                return { songId: song.id, isLiked: false };
            } else {
                await favoritesApi.add(song.id);
                return { songId: song.id, isLiked: true };
            }
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.message || 'Failed to toggle like');
        }
    }
);

export const fetchLikedSongs = createAsyncThunk(
    'songs/fetchLiked',
    async (_, { rejectWithValue }) => {
        try {
            const response = await favoritesApi.getAll();
            // We assume the API returns the full song objects, but for the 'likedSongIds' state, we just need IDs
            // However, looking at the backend, getFavorites returns the SONG objects. 
            // So we can extract IDs easily.
            const songs = response.data.data.songs;
            return songs.map((s: any) => s.id);
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.message || 'Failed to fetch favorites');
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
            // If song is not in queue, play it individually (or add to queue?)
            const index = state.queue.findIndex(s => s.id === action.payload.id);
            if (index !== -1) {
                state.currentIndex = index;
            } else {
                state.queue = [action.payload];
                state.originalQueue = [action.payload];
                state.currentIndex = 0;
            }
        },
        playPlaylist: (state, action: PayloadAction<{ songs: Song[], startIndex?: number }>) => {
            state.originalQueue = [...action.payload.songs];
            if (state.shuffle) {
                // Shuffle right away if shuffle is on
                const shuffled = [...action.payload.songs];
                // Fisher-Yates
                for (let i = shuffled.length - 1; i > 0; i--) {
                    const j = Math.floor(Math.random() * (i + 1));
                    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
                }
                // If there's a start index, we might want that specific song to be first or current
                // For simplicity, let's just accept the random order, OR try to find the start song.
                // Detailed implementation: put start song as current, rest shuffled.
                // Simplification: Just shuffle.
                state.queue = shuffled;
                state.currentIndex = 0; // Start at beginning of shuffled
            } else {
                state.queue = action.payload.songs;
                state.currentIndex = action.payload.startIndex || 0;
            }
            state.currentSong = state.queue[state.currentIndex] || null;
            state.isPlaying = true;
        },
        addToQueue: (state, action: PayloadAction<Song>) => {
            state.queue.push(action.payload);
            state.originalQueue.push(action.payload); // Add to original too
        },
        nextSong: (state) => {
            if (state.queue.length === 0) return;

            let nextIndex = state.currentIndex + 1;

            if (state.repeat === 'one') {
                // Keep index same, just re-trigger (handled by component usually, but state-wise same)
                nextIndex = state.currentIndex;
            } else if (state.repeat === 'all' && nextIndex >= state.queue.length) {
                nextIndex = 0;
            }

            if (nextIndex < state.queue.length) {
                state.currentIndex = nextIndex;
                state.currentSong = state.queue[nextIndex];
                state.isPlaying = true;
            } else {
                state.isPlaying = false; // End of queue
            }
        },
        prevSong: (state) => {
            if (state.queue.length === 0) return;

            let prevIndex = state.currentIndex - 1;
            if (prevIndex < 0) {
                prevIndex = state.repeat === 'all' ? state.queue.length - 1 : 0;
            }

            state.currentIndex = prevIndex;
            state.currentSong = state.queue[state.currentIndex];
            state.isPlaying = true;
        },
        togglePlay: (state) => {
            state.isPlaying = !state.isPlaying;
        },
        setPlaying: (state, action: PayloadAction<boolean>) => {
            state.isPlaying = action.payload;
        },
        toggleShuffle: (state) => {
            state.shuffle = !state.shuffle;

            if (state.shuffle) {
                // Turn ON: Shuffle queue
                // Keep current song running if possible
                const currentSong = state.queue[state.currentIndex];
                state.originalQueue = [...state.queue]; // Backup

                // Shuffle logic (Fisher-Yates) - excluding current song to avoid interruption?
                // Common pattern: Keep current song at index, shuffle the rest? 
                // Or: Shuffle everything, but put current song at new currentIndex?

                const songsToShuffle = state.queue.filter(s => s.id !== currentSong?.id);
                for (let i = songsToShuffle.length - 1; i > 0; i--) {
                    const j = Math.floor(Math.random() * (i + 1));
                    [songsToShuffle[i], songsToShuffle[j]] = [songsToShuffle[j], songsToShuffle[i]];
                }

                // Reconstruct: [current, ...shuffled]
                if (currentSong) {
                    state.queue = [currentSong, ...songsToShuffle];
                    state.currentIndex = 0;
                } else {
                    state.queue = songsToShuffle;
                    state.currentIndex = -1;
                }

            } else {
                // Turn OFF: Restore original order
                // We need to find where the current song is in the original queue to keep playing it
                const currentSong = state.queue[state.currentIndex];
                state.queue = [...state.originalQueue];

                if (currentSong) {
                    const newIndex = state.queue.findIndex(s => s.id === currentSong.id);
                    state.currentIndex = newIndex !== -1 ? newIndex : 0;
                }
            }
        },
        toggleRepeat: (state) => {
            const modes: ('off' | 'all' | 'one')[] = ['off', 'all', 'one'];
            const nextIdx = (modes.indexOf(state.repeat) + 1) % modes.length;
            state.repeat = modes[nextIdx];
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
            })
            // Toggle Like
            .addCase(toggleLike.fulfilled, (state, action) => {
                if (action.payload.isLiked) {
                    state.likedSongIds.push(action.payload.songId);
                } else {
                    state.likedSongIds = state.likedSongIds.filter(id => id !== action.payload.songId);
                }
            })
            // Fetch Liked
            .addCase(fetchLikedSongs.fulfilled, (state, action) => {
                state.likedSongIds = action.payload;
            });
    },
});

export const {
    setCurrentSong,
    playPlaylist,
    addToQueue,
    nextSong,
    prevSong,
    togglePlay,
    setPlaying,
    toggleShuffle,
    toggleRepeat,
    clearUploadStatus
} = songSlice.actions;
export default songSlice.reducer;
