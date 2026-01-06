import { create } from 'zustand';

// Types
export interface Song {
    id: string;
    title: string;
    artist: string;
    album?: string;
    duration: number; // seconds
    coverUrl?: string;
    audioUrl?: string;
    localUri?: string; // For local files
    source: 'server' | 'local';
}

interface PlayerState {
    currentSong: Song | null;
    isPlaying: boolean;
    progress: number; // 0-100
    duration: number;
    queue: Song[];
    queueIndex: number;

    // Actions
    playSong: (song: Song) => void;
    togglePlay: () => void;
    pause: () => void;
    play: () => void;
    setProgress: (progress: number) => void;
    nextSong: () => void;
    previousSong: () => void;
    setQueue: (songs: Song[], startIndex?: number) => void;
    clearQueue: () => void;
}

export const usePlayerStore = create<PlayerState>((set, get) => ({
    currentSong: null,
    isPlaying: false,
    progress: 0,
    duration: 0,
    queue: [],
    queueIndex: 0,

    playSong: (song: Song) => {
        set({ currentSong: song, isPlaying: true, progress: 0, duration: song.duration });
    },

    togglePlay: () => {
        set((state) => ({ isPlaying: !state.isPlaying }));
    },

    pause: () => {
        set({ isPlaying: false });
    },

    play: () => {
        set({ isPlaying: true });
    },

    setProgress: (progress: number) => {
        set({ progress });
    },

    nextSong: () => {
        const { queue, queueIndex } = get();
        if (queueIndex < queue.length - 1) {
            const nextIndex = queueIndex + 1;
            set({
                queueIndex: nextIndex,
                currentSong: queue[nextIndex],
                progress: 0,
                isPlaying: true,
            });
        }
    },

    previousSong: () => {
        const { queue, queueIndex, progress } = get();
        // If more than 3 seconds in, restart current song
        if (progress > 3) {
            set({ progress: 0 });
            return;
        }
        // Otherwise go to previous song
        if (queueIndex > 0) {
            const prevIndex = queueIndex - 1;
            set({
                queueIndex: prevIndex,
                currentSong: queue[prevIndex],
                progress: 0,
                isPlaying: true,
            });
        }
    },

    setQueue: (songs: Song[], startIndex = 0) => {
        set({
            queue: songs,
            queueIndex: startIndex,
            currentSong: songs[startIndex] || null,
            progress: 0,
            isPlaying: true,
        });
    },

    clearQueue: () => {
        set({ queue: [], queueIndex: 0, currentSong: null, isPlaying: false, progress: 0 });
    },
}));
