import type { Song } from '../stores/playerStore';

// Mock Songs Data
export const MOCK_SONGS: Song[] = [
    {
        id: '1',
        title: 'Blinding Lights',
        artist: 'The Weeknd',
        album: 'After Hours',
        duration: 200,
        coverUrl: 'https://upload.wikimedia.org/wikipedia/en/e/e6/The_Weeknd_-_Blinding_Lights.png',
        audioUrl: 'https://example.com/blinding-lights.mp3',
        source: 'server',
    },
    {
        id: '2',
        title: 'Shape of You',
        artist: 'Ed Sheeran',
        album: '÷',
        duration: 233,
        coverUrl: 'https://upload.wikimedia.org/wikipedia/en/b/b4/Shape_Of_You_%28Official_Single_Cover%29_by_Ed_Sheeran.png',
        audioUrl: 'https://example.com/shape-of-you.mp3',
        source: 'server',
    },
    {
        id: '3',
        title: 'Havana',
        artist: 'Camila Cabello',
        album: 'Camila',
        duration: 217,
        coverUrl: 'https://upload.wikimedia.org/wikipedia/en/4/42/Camila_Cabello_-_Havana_%28Official_Single_Cover%29.png',
        audioUrl: 'https://example.com/havana.mp3',
        source: 'server',
    },
    {
        id: '4',
        title: 'Levitating',
        artist: 'Dua Lipa',
        album: 'Future Nostalgia',
        duration: 203,
        coverUrl: 'https://upload.wikimedia.org/wikipedia/en/7/70/Dua_Lipa_-_Levitating.png',
        audioUrl: 'https://example.com/levitating.mp3',
        source: 'server',
    },
    {
        id: '5',
        title: 'Peaches',
        artist: 'Justin Bieber',
        album: 'Justice',
        duration: 198,
        coverUrl: 'https://upload.wikimedia.org/wikipedia/en/d/dd/Justin_Bieber_-_Peaches.png',
        audioUrl: 'https://example.com/peaches.mp3',
        source: 'server',
    },
];

// Mock Playlists Data
export interface Playlist {
    id: string;
    name: string;
    description?: string;
    coverUrl?: string;
    songIds: string[];
    isPublic: boolean;
    ownerId: string;
}

export const MOCK_PLAYLISTS: Playlist[] = [
    {
        id: '1',
        name: 'My Favorites',
        description: 'Best songs collection',
        coverUrl: 'https://images.unsplash.com/photo-1493225255756-d9584f8606e9?w=400',
        songIds: ['1', '2', '3'],
        isPublic: false,
        ownerId: '1',
    },
    {
        id: '2',
        name: 'Workout Mix',
        description: 'High energy tracks',
        coverUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400',
        songIds: ['2', '4', '5'],
        isPublic: true,
        ownerId: '1',
    },
    {
        id: '3',
        name: 'Chill Vibes',
        description: 'Relaxing music',
        coverUrl: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=400',
        songIds: ['1', '3'],
        isPublic: true,
        ownerId: '2',
    },
];

// Helper to get songs by playlist
export const getSongsByPlaylist = (playlistId: string): Song[] => {
    const playlist = MOCK_PLAYLISTS.find(p => p.id === playlistId);
    if (!playlist) return [];
    return MOCK_SONGS.filter(s => playlist.songIds.includes(s.id));
};

// Format duration helper
export const formatDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
};
