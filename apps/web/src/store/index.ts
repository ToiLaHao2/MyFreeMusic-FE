import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist';
import authReducer from './slices/authSlice';
import songReducer from './slices/songSlice';
import playlistReducer from './slices/playlistSlice';

// Custom storage object to avoid "storage.getItem is not a function" error
// caused by potential bundler issues with redux-persist/lib/storage
const storage = {
    getItem: (key: string) => {
        return Promise.resolve(localStorage.getItem(key));
    },
    setItem: (key: string, item: string) => {
        return Promise.resolve(localStorage.setItem(key, item));
    },
    removeItem: (key: string) => {
        return Promise.resolve(localStorage.removeItem(key));
    },
};

const songPersistConfig = {
    key: 'music_player',
    storage,
    whitelist: ['currentSong', 'queue', 'currentIndex', 'volume', 'shuffle', 'repeat']
};

const persistedSongReducer = persistReducer(songPersistConfig, songReducer);

export const store = configureStore({
    reducer: {
        auth: authReducer,
        songs: persistedSongReducer,
        playlists: playlistReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
            },
        }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
